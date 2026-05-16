import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import supabase from '../db/supabase.js';
import generateMemberId from '../utils/memberIdGenerator.js';
import generateHouseId from '../utils/houseIdGenerator.js';
import generateQrBase64 from '../utils/qrGenerator.js';

const router = express.Router();

// 1. Get stats for production houses
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    let totalHouses = 0;
    let activeItems = 0;
    let totalRevenue = 0;

    try {
      const housesCount = await supabase.from('production_houses').select('id', { count: 'exact', head: true });
      totalHouses = housesCount.count || 0;

      // Try fetching rentals with user info. If column/join fails, we catch it.
      const { data: houseRentals, error: statsError } = await supabase
        .from('rentals')
        .select('total_amount, products, status, users!inner(is_house_owner)')
        .eq('users.is_house_owner', true);

      if (!statsError && houseRentals) {
        houseRentals.forEach((r: any) => {
          totalRevenue += Number(r.total_amount || 0);
          if (r.status === 'released') {
            activeItems += (r.products || []).reduce((sum: number, p: any) => sum + (p.qty || 1), 0);
          }
        });
      }
    } catch (err) {
      console.error('Stats fetch failed (possibly missing columns):', err);
    }

    return res.json({
      totalHouses,
      activeItems,
      totalRevenue
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch stats.' });
  }
});

// 2. Get all production houses
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data: houses, error } = await supabase
      .from('production_houses')
      .select('*, users(member_id, email, full_name, id)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch all rentals for these houses to calculate stats
    const userIds = houses.map(h => h.user_id).filter(Boolean);
    const { data: rentals } = await supabase
      .from('rentals')
      .select('total_amount, created_at, user_id, status')
      .in('user_id', userIds);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const housesWithStats = houses.map(house => {
      const houseRentals = rentals?.filter(r => r.user_id === house.user_id) || [];
      
      const thisMonthTotal = houseRentals
        .filter(r => {
          const d = new Date(r.created_at);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear && r.status !== 'cancelled';
        })
        .reduce((sum, r) => sum + Number(r.total_amount || 0), 0);

      // Simple due amount logic: all non-cancelled rentals (placeholder for actual payment tracking)
      const totalDue = houseRentals
        .filter(r => r.status !== 'cancelled')
        .reduce((sum, r) => sum + Number(r.total_amount || 0), 0);

      const hasActiveRental = houseRentals.some(r => r.status === 'confirmed' || r.status === 'released');

      return {
        ...house,
        thisMonthBusiness: `₹${thisMonthTotal.toLocaleString()}`,
        dueAmount: `₹${totalDue.toLocaleString()}`,
        hasActiveRental
      };
    });

    return res.json(housesWithStats);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch houses.' });
  }
});

// 2. Create new production house
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, ownerName, phone, email, address } = req.body;

    if (!name || !ownerName || !phone) {
      return res.status(400).json({ message: 'Name, Owner Name, and Phone are required.' });
    }

    // 1. Generate IDs and QR
    const userId = crypto.randomUUID();
    const houseId = await generateHouseId();
    const userQrBase64 = await generateQrBase64({ memberId: houseId });

    // Generate a placeholder password hash (unloggable until credentials are set via /credentials)
    const placeholderHash = await bcrypt.hash(crypto.randomUUID(), 12);

    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        member_id: houseId,
        full_name: ownerName,
        phone: phone.replace(/\D/g, ''),
        email: email ? email.toLowerCase() : null,
        password_hash: placeholderHash,
        is_house_owner: true,
        user_qr_base64: userQrBase64,
        is_verified: true,
      })
      .select()
      .single();

    if (userError) throw userError;

    // 2. Create the Production House linked to this User
    const { data: house, error: houseError } = await supabase
      .from('production_houses')
      .insert({
        name,
        house_id: houseId,
        owner_name: ownerName,
        phone: phone.replace(/\D/g, ''),
        address,
        user_id: userId,
        status: 'Active'
      })
      .select()
      .single();

    if (houseError) throw houseError;

    return res.status(201).json({ ...house, user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to create house.' });
  }
});

// 3. Get single house detail by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data: house, error } = await supabase
      .from('production_houses')
      .select('*, users(*)')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    // Fetch rentals for stats
    const { data: rentals } = await supabase
      .from('rentals')
      .select('total_amount, created_at, status')
      .eq('user_id', house.user_id);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const houseRentals = rentals || [];
    const thisMonthTotal = houseRentals
      .filter(r => {
        const d = new Date(r.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && r.status !== 'cancelled';
      })
      .reduce((sum, r) => sum + Number(r.total_amount || 0), 0);

    const totalDue = houseRentals
      .filter(r => r.status !== 'cancelled')
      .reduce((sum, r) => sum + Number(r.total_amount || 0), 0);

    return res.json({
      ...house,
      thisMonthBusiness: `₹${thisMonthTotal.toLocaleString()}`,
      dueAmount: `₹${totalDue.toLocaleString()}`
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch house detail.' });
  }
});

// 3.5 Get single house detail by Slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const name = slug.replace(/-/g, ' ');

    const { data: house, error } = await supabase
      .from('production_houses')
      .select('*, users(*)')
      .ilike('name', name)
      .single();

    if (error || !house) return res.status(404).json({ message: 'House not found.' });

    // Fetch rentals for stats
    const { data: rentals } = await supabase
      .from('rentals')
      .select('total_amount, created_at, status')
      .eq('user_id', house.user_id);

    const houseRentals = rentals || [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthTotal = houseRentals
      .filter(r => {
        const d = new Date(r.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && r.status !== 'cancelled';
      })
      .reduce((sum, r) => sum + Number(r.total_amount || 0), 0);

    const totalDue = houseRentals
      .filter(r => r.status !== 'cancelled')
      .reduce((sum, r) => sum + Number(r.total_amount || 0), 0);

    return res.json({
      ...house,
      thisMonthBusiness: `₹${thisMonthTotal.toLocaleString()}`,
      dueAmount: `₹${totalDue.toLocaleString()}`
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch house detail.' });
  }
});

// 4. Update House Owner Credentials
router.post('/:id/credentials', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body; // username will be mapped to email or a specific identifier
    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    // Fetch the house to get linked user_id
    const { data: house, error: fetchError } = await supabase
      .from('production_houses')
      .select('user_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !house?.user_id) throw fetchError || new Error('House not linked to a user.');

    const passwordHash = await bcrypt.hash(password, 12);
    const updates: any = { password_hash: passwordHash };
    
    // If username provided, update email (used as login identifier)
    if (username) {
      updates.email = username.toLowerCase();
    }

    const { error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', house.user_id);

    if (updateError) throw updateError;

    return res.json({ message: 'Credentials updated successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to update credentials.' });
  }
});

export default router;

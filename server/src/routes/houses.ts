import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import supabase from '../db/supabase.js';
import generateMemberId from '../utils/memberIdGenerator.js';
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
    // Attempt join first
    const { data, error } = await supabase
      .from('production_houses')
      .select('*, users(member_id, email, full_name)')
      .order('created_at', { ascending: false });

    if (!error) {
      return res.json(data || []);
    }

    // Fallback: If join fails (missing column/relation), fetch houses only
    console.warn('House join failed, falling back to simple fetch:', error.message);
    const { data: simpleData, error: simpleError } = await supabase
      .from('production_houses')
      .select('*')
      .order('created_at', { ascending: false });

    if (simpleError) throw simpleError;
    return res.json(simpleData || []);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch houses.' });
  }
});

// 2. Create new production house
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, ownerName, phone } = req.body;

    if (!name || !ownerName || !phone) {
      return res.status(400).json({ message: 'Name, Owner Name, and Phone are required.' });
    }

    // 1. Create a User record for this house (generates a linked User ID)
    const userId = crypto.randomUUID();
    const memberId = await generateMemberId();
    const userQrBase64 = await generateQrBase64({ memberId });

    // Placeholder password hash (unusable until set via /credentials)
    const placeholderHash = await bcrypt.hash(crypto.randomUUID(), 12);

    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        member_id: memberId,
        full_name: ownerName,
        phone: phone.replace(/\D/g, ''),
        email: null,
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
        owner_name: ownerName,
        phone: phone.replace(/\D/g, ''),
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

// 3. Get single house detail
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('production_houses')
      .select('*, users(*)')
      .eq('id', req.params.id)
      .single();

    if (!error) return res.json(data);

    // Fallback
    const { data: simpleData, error: simpleError } = await supabase
      .from('production_houses')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (simpleError) throw simpleError;
    return res.json(simpleData);
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

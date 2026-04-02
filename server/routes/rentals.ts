import crypto from 'crypto';
import express, { Request, Response } from 'express';
import supabase from '../db/supabase.js';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { pickupDate, eventDate, items = [] } = req.body;

    if (!pickupDate || !eventDate || !Array.isArray(items) || !items.length) {
      return res.status(400).json({
        message: 'Pickup date, event date, and cart items are required.',
      });
    }

    if (new Date(pickupDate) > new Date(eventDate)) {
      return res.status(400).json({
        message: 'Pickup date must be on or before the event date.',
      });
    }

    const rentalId = crypto.randomUUID();
    const { data: rental, error: rentalError } = await supabase
      .from('rentals')
      .insert({
        id: rentalId,
        user_id: req.user.id,
        pickup_date: pickupDate,
        event_date: eventDate,
        status: 'confirmed',
      })
      .select('*')
      .single();

    if (rentalError) {
      throw rentalError;
    }

    const { data: rentalItems, error: itemsError } = await supabase
      .from('rental_items')
      .insert(
        items.map((item: any) => ({
          rental_id: rentalId,
          product_id: item.productId,
          quantity: item.quantity || 1,
          status: 'pending_pickup',
        })),
      )
      .select('*, products(*)');

    if (itemsError) {
      throw itemsError;
    }

    return res.status(201).json({
      ...rental,
      items: rentalItems || [],
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to create rental.' });
  }
});

router.get('/my', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('rentals')
      .select('*, rental_items(*, products(*, product_images(*)))')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.json(data || []);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch rentals.' });
  }
});

export default router;

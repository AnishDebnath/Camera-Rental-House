import crypto from 'crypto';
import express, { Request, Response } from 'express';
import supabase from '../db/supabase.js';

import generateRentalId from '../utils/rentalIdGenerator.js';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('RENTAL REQUEST BODY:', req.body);
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
    const rentalNo = await generateRentalId();

    // Calculate total amount
    const productIds = items.map((item: any) => item.productId);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, price_per_day')
      .in('id', productIds);

    if (productsError) throw productsError;

    const days = Math.round((new Date(eventDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalAmount = (items || []).reduce((sum: number, item: any) => {
      const product = products?.find(p => p.id === item.productId);
      return sum + (product?.price_per_day || 0) * (item.quantity || 1) * days;
    }, 0);
    
    const { data: rental, error: rentalError } = await supabase
      .from('rentals')
      .insert({
        id: rentalId,
        rental_no: rentalNo,
        user_id: req.user.id,
        pickup_date: pickupDate,
        event_date: eventDate,
        status: 'confirmed',
        total_amount: totalAmount,
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

    console.log('Rental created successfully:', rentalId);
    return res.status(201).json({
      ...rental,
      items: rentalItems || [],
    });
  } catch (error: any) {
    console.error('RENTAL CREATION ERROR:', error);
    return res.status(500).json({ message: error.message || 'Unable to create rental.' });
  }
});

router.get('/my', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('rentals')
      .select('*, rental_items(*, products(*))')
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

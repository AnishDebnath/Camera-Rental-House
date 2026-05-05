import express, { Request, Response } from 'express';
import supabase from '../db/supabase.js';

const router = express.Router();

interface FindItemProps {
  uniqueCode?: string;
  productId?: string;
  expectedStatuses: string[];
}

const findItemByProduct = async ({ uniqueCode, productId, expectedStatuses }: FindItemProps) => {
  let productQuery = supabase.from('products').select('id, name, unique_code').limit(1);

  if (productId) {
    productQuery = productQuery.eq('id', productId);
  } else if (uniqueCode) {
    productQuery = productQuery.eq('unique_code', uniqueCode);
  }

  const { data: product, error: productError } = await productQuery.maybeSingle();

  if (productError) {
    throw productError;
  }

  if (!product) {
    return null;
  }

  const { data: item, error: itemError } = await supabase
    .from('rental_items')
    .select('*, rentals(*, users(*)), products(*)')
    .eq('product_id', product.id)
    .in('status', expectedStatuses)
    .limit(1)
    .maybeSingle();

  if (itemError) {
    throw itemError;
  }

  return item as any;
};

router.post('/release', async (req: Request, res: Response) => {
  try {
    const item = await findItemByProduct({
      uniqueCode: req.body.uniqueCode,
      productId: req.body.productId,
      expectedStatuses: ['pending_pickup'],
    });

    if (!item) {
      return res.status(404).json({
        message: 'No pending pickup record was found for this product.',
      });
    }

    const staffId = (req.user as any)?.id || null;
    const staffName = (req.user as any)?.fullName || (req.user as any)?.username || null;

    const { data, error } = await supabase
      .from('rental_items')
      .update({
        status: 'released',
        released_by_staff_id: staffId,
        released_by_staff_name: staffName,
        released_at: new Date().toISOString(),
      })
      .eq('id', item.id)
      .select('*, rentals(*, users(*)), products(*)')
      .single();

    if (error) {
      throw error;
    }

    const rentalItem = data as any;
    return res.json({
      message: 'Product released successfully.',
      rentalItem,
      user: rentalItem.rentals.users,
      releasedBy: staffName,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to release product.' });
  }
});

router.post('/return', async (req: Request, res: Response) => {
  try {
    const item = await findItemByProduct({
      uniqueCode: req.body.uniqueCode,
      productId: req.body.productId,
      expectedStatuses: ['released'],
    });

    if (!item) {
      return res.status(404).json({
        message: 'No released item was found for this product.',
      });
    }

    const { data, error } = await supabase
      .from('rental_items')
      .update({ status: 'returned' })
      .eq('id', item.id)
      .select('*, rentals(*, users(*)), products(*)')
      .single();

    if (error) {
      throw error;
    }

    return res.json({
      message: 'Product returned successfully.',
      rentalItem: data,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to return product.' });
  }
});

router.post('/bulk-release', async (req: Request, res: Response) => {
  try {
    const { rentalId, productIds } = req.body;
    if (!rentalId || !productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ message: 'Rental ID and array of Product IDs are required.' });
    }

    const staffId = (req.user as any)?.id || null;
    const staffName = (req.user as any)?.fullName || (req.user as any)?.username || null;

    const { data, error } = await supabase
      .from('rental_items')
      .update({
        status: 'released',
        released_by_staff_id: staffId,
        released_by_staff_name: staffName,
        released_at: new Date().toISOString(),
      })
      .eq('rental_id', rentalId)
      .in('product_id', productIds)
      .select('*, products(*)');

    if (error) throw error;

    return res.json({
      message: `${data.length} items released successfully.`,
      items: data,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to release items.' });
  }
});

router.post('/bulk-return', async (req: Request, res: Response) => {
  try {
    const { rentalId, productIds } = req.body;
    if (!rentalId || !productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ message: 'Rental ID and array of Product IDs are required.' });
    }

    const { data, error } = await supabase
      .from('rental_items')
      .update({ status: 'returned' })
      .eq('rental_id', rentalId)
      .in('product_id', productIds)
      .select('*, products(*)');

    if (error) throw error;

    return res.json({
      message: `${data.length} items returned successfully.`,
      items: data,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to return items.' });
  }
});

router.get('/counts', async (_req: Request, res: Response) => {
  try {
    const [productsCount, activeRentalsCount] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('rental_items').select('id', { count: 'exact', head: true }).eq('status', 'released'),
    ]);

    return res.json({
      totalProducts: productsCount.count || 0,
      totalActiveRentals: activeRentalsCount.count || 0,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch counts.' });
  }
});

export default router;

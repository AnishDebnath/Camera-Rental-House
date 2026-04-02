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

    const { data, error } = await supabase
      .from('rental_items')
      .update({ status: 'released' })
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

export default router;

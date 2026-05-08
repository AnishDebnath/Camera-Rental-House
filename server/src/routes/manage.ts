import express, { Request, Response } from 'express';
import supabase from '../db/supabase.js';
import { uploadFile } from '../storage/cloudinary.js';
import { processImage } from '../utils/imageProcessor.js';

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
    const { rentalId, productIds, proofPhoto } = req.body;
    console.log('[Bulk Release] Request received:', { rentalId, productIdsCount: productIds?.length, hasProof: !!proofPhoto });

    if (!rentalId || !productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ message: 'Rental ID and array of Product IDs are required.' });
    }

    const staffId = (req.user as any)?.id || null;
    const staffName = (req.user as any)?.fullName || (req.user as any)?.username || null;

    // Attempt update for rental_items
    const itemUpdate: any = { status: 'released' };
    
    // Check if extra columns exist or just try-catch them
    // For now, we try to include them but handle the specific "column not found" error
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

    if (error) {
      if (error.message?.includes('column') && error.message?.includes('not found')) {
        console.warn('[Bulk Release] Extra columns missing, falling back to status-only update.');
        const fallback = await supabase
          .from('rental_items')
          .update({ status: 'released' })
          .eq('rental_id', rentalId)
          .in('product_id', productIds)
          .select('*, products(*)');
        if (fallback.error) throw fallback.error;
        // Proceed with fallback data
      } else {
        console.error('[Bulk Release] rental_items update error:', error);
        throw error;
      }
    }

    // Handle Proof Photo
    let proofUrl = null;
    if (proofPhoto) {
      try {
        const base64Data = proofPhoto.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        
        const processed = await processImage(buffer, {
          maxWidth: 1200,
          quality: 80
        });

        proofUrl = await uploadFile({
          buffer: processed.buffer,
          key: `proof-${rentalId}-${Date.now()}.jpg`,
          mimetype: processed.mimetype,
          folder: 'Handover Proof'
        });
      } catch (uploadErr) {
        console.error('Proof upload failed:', uploadErr);
      }
    }

    // Update parent rental status to released
    try {
      const updateData: any = { status: 'released' };
      if (proofUrl) {
        updateData.handover_proof_url = proofUrl;
      }

      console.log('[Bulk Release] Updating rental table:', { rentalId, updateData });
      const { error: rentalError } = await supabase
        .from('rentals')
        .update(updateData)
        .eq('id', rentalId);

      if (rentalError) {
        if (rentalError.message?.includes('column') && rentalError.message?.includes('not found')) {
          console.warn('[Bulk Release] handover_proof_url missing, falling back to status-only.');
          await supabase.from('rentals').update({ status: 'released' }).eq('id', rentalId);
        } else {
          throw rentalError;
        }
      }
    } catch (rentalUpdateErr) {
      console.error('[Bulk Release] Parent rental update failed:', rentalUpdateErr);
    }

    return res.json({
      message: 'Items released successfully.',
      items: data || [],
      proofUrl
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

    // Try update with received_at
    let { data, error } = await supabase
      .from('rental_items')
      .update({ 
        status: 'returned',
        received_at: new Date().toISOString()
      })
      .eq('rental_id', rentalId)
      .in('product_id', productIds)
      .select('*, products(*)');

    if (error && error.message?.includes('column') && error.message?.includes('not found')) {
      console.warn('[Bulk Return] received_at missing, falling back to status-only.');
      const fallback = await supabase
        .from('rental_items')
        .update({ status: 'returned' })
        .eq('rental_id', rentalId)
        .in('product_id', productIds)
        .select('*, products(*)');
      data = fallback.data;
      error = fallback.error;
    }

    if (error) throw error;

    // Check if all items for this rental are now returned
    const { data: allItems } = await supabase
      .from('rental_items')
      .select('status')
      .eq('rental_id', rentalId);

    const allReturned = (allItems || []).every(item => item.status === 'returned');
    if (allReturned) {
      const { error: rentalError } = await supabase
        .from('rentals')
        .update({ 
          status: 'returned',
          received_at: new Date().toISOString()
        })
        .eq('id', rentalId);
      
      if (rentalError && rentalError.message?.includes('column')) {
         await supabase.from('rentals').update({ status: 'returned' }).eq('id', rentalId);
      }
    }

    return res.json({
      message: `${data?.length || 0} items returned successfully.`,
      items: data || [],
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to return items.' });
  }
});

router.get('/counts', async (req: Request, res: Response) => {
  try {
    const filterDate = req.query.date as string;
    
    let upcomingQuery = supabase.from('rentals').select('id', { count: 'exact', head: true }).eq('status', 'confirmed');
    let returningQuery = supabase.from('rentals').select('id', { count: 'exact', head: true }).eq('status', 'released');
    
    if (filterDate) {
      upcomingQuery = upcomingQuery.eq('pickup_date', filterDate);
      returningQuery = returningQuery.eq('event_date', filterDate);
    }

    const [productsCount, activeRentalsCount, activeItemsCount, upcomingCount, returningCount] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('rentals').select('id', { count: 'exact', head: true }).eq('status', 'released'),
      supabase.from('rental_items').select('id', { count: 'exact', head: true }).eq('status', 'released'),
      upcomingQuery,
      returningQuery,
    ]);

    return res.json({
      totalProducts: productsCount.count || 0,
      totalActiveRentals: activeRentalsCount.count || 0,
      totalActiveItems: activeItemsCount.count || 0,
      upcoming: upcomingCount.count || 0,
      active: activeRentalsCount.count || 0,
      returning: returningCount.count || 0,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch counts.' });
  }
});

export default router;

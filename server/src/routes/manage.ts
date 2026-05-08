import express, { Request, Response } from 'express';
import supabase from '../db/supabase.js';
import { uploadFile, deleteFile } from '../storage/cloudinary.js';
import { processImage } from '../utils/imageProcessor.js';

const extractPublicId = (url: string | null): string | null => {
  if (!url) return null;
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const path = parts[1].replace(/^v\d+\//, '');
  return decodeURIComponent(path.split('.')[0]);
};

const router = express.Router();



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
    // Fetch current rental to update products array
    const { data: rental, error: fetchError } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', rentalId)
      .single();

    if (fetchError || !rental) throw fetchError || new Error('Rental not found');

    // Handle Proof Photo
    let proofUrl = null;
    if (proofPhoto) {
      try {
        const base64Data = proofPhoto.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const processed = await processImage(buffer, { maxWidth: 1200, quality: 80 });
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

    const now = new Date().toISOString();
    const updatedProducts = (rental.products || []).map((p: any) => {
      if (productIds.includes(p.id)) {
        return { ...p, status: 'released' };
      }
      return p;
    });

    const allReleased = updatedProducts.every((p: any) => p.status === 'released');

    const { error: updateError } = await supabase
      .from('rentals')
      .update({
        products: updatedProducts,
        status: allReleased ? 'active' : rental.status,
        released_at: now,
        released_by_staff_name: staffName,
        handover_proof_url: proofUrl || rental.handover_proof_url
      })
      .eq('id', rentalId);

    if (updateError) throw updateError;

    return res.json({
      message: 'Items released successfully.',
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

    const staffId = (req.user as any)?.id || null;
    const staffName = (req.user as any)?.fullName || (req.user as any)?.username || null;

    // Fetch current rental to update products array
    const { data: rental, error: fetchError } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', rentalId)
      .single();

    if (fetchError || !rental) throw fetchError || new Error('Rental not found');

    const now = new Date().toISOString();
    const updatedProducts = (rental.products || []).map((p: any) => {
      if (productIds.includes(p.id)) {
        return { ...p, status: 'returned' };
      }
      return p;
    });

    const allReturned = updatedProducts.every((p: any) => p.status === 'returned');

    // Handle Proof Photo Deletion if all returned
    if (allReturned && rental.handover_proof_url) {
      const publicId = extractPublicId(rental.handover_proof_url);
      if (publicId) {
        console.log(`[Bulk Return] Deleting handover proof: ${publicId}`);
        await deleteFile({ key: publicId }).catch(err => console.error('Cloudinary delete fail:', err));
      }
    }

    const { error: updateError } = await supabase
      .from('rentals')
      .update({
        products: updatedProducts,
        status: allReturned ? 'returned' : rental.status,
        received_at: now,
        received_by_staff_name: staffName,
        handover_proof_url: allReturned ? null : rental.handover_proof_url
      })
      .eq('id', rentalId);

    if (updateError) throw updateError;

    return res.json({
      message: `${productIds.length} items returned successfully.`
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

    const [productsCount, activeRentalsCount, activeRentalsData, upcomingCount, returningCount] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('rentals').select('id', { count: 'exact', head: true }).eq('status', 'released'),
      supabase.from('rentals').select('products').eq('status', 'released'),
      upcomingQuery,
      returningQuery,
    ]);

    const activeItemsCount = (activeRentalsData.data || []).reduce((sum: number, r: any) => {
      return sum + (r.products || []).reduce((itemSum: number, p: any) => itemSum + (p.qty || 1), 0);
    }, 0);

    return res.json({
      totalProducts: productsCount.count || 0,
      totalActiveRentals: activeRentalsCount.count || 0,
      totalActiveItems: activeItemsCount,
      upcoming: upcomingCount.count || 0,
      active: activeRentalsCount.count || 0,
      returning: returningCount.count || 0,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch counts.' });
  }
});

export default router;

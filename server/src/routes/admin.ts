import crypto from 'crypto';
import express, { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import supabase from '../db/supabase.js';
import { deleteFile, getSignedUrl, uploadFile } from '../storage/cloudinary.js';
import generateUniqueCode from '../utils/codeGenerator.js';
import generateQrBase64 from '../utils/qrGenerator.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

const extractPublicId = (url: string | null): string | null => {
  if (!url) return null;
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const path = parts[1].replace(/^v\d+\//, '');
  return path.split('.')[0];
};

router.get('/dashboard', roleMiddleware(['admin']), async (_req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const monthStart = new Date();
    monthStart.setDate(1);

    const [productsCount, usersCount, activeTodayCount, recentRentals, revenueItems] =
      await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase
          .from('rentals')
          .select('id', { count: 'exact', head: true })
          .eq('pickup_date', today),
        supabase
          .from('rentals')
          .select('*, users(full_name), rental_items(*, products(name, price_per_day))')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('rentals')
          .select('created_at, rental_items(quantity, products(price_per_day))')
          .gte('created_at', monthStart.toISOString()),
      ]);

    const revenueThisMonth = (revenueItems.data || []).reduce((sum: number, rental: any) => {
      return (
        sum +
        (rental.rental_items || []).reduce((itemSum: number, item: any) => {
          return itemSum + Number(item.quantity || 1) * Number(item.products?.price_per_day || 0);
        }, 0)
      );
    }, 0);

    return res.json({
      totalProducts: productsCount.count || 0,
      activeRentalsToday: activeTodayCount.count || 0,
      totalUsers: usersCount.count || 0,
      revenueThisMonth,
      recentRentals: recentRentals.data || [],
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to load dashboard.' });
  }
});

router.get('/users', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const search = String(req.query.search || '').trim();
    let query: any = supabase
      .from('users')
      .select('*, rentals(id, rental_items(quantity, products(price_per_day)))')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`,
      );
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const users = (data || []).map((user: any) => {
      const totalSpent = (user.rentals || []).reduce((sum: number, rental: any) => {
        return (
          sum +
          (rental.rental_items || []).reduce((itemSum: number, item: any) => {
            return itemSum + Number(item.quantity || 1) * Number(item.products?.price_per_day || 0);
          }, 0)
        );
      }, 0);

      return {
        ...user,
        totalRentals: user.rentals?.length || 0,
        totalSpent,
      };
    });

    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch users.' });
  }
});

router.get('/users/:id', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*, rentals(*, rental_items(*, products(*)))')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const [aadhaarSignedUrl, voterSignedUrl] = await Promise.all([
      data.aadhaar_doc_url
        ? getSignedUrl({
          key: extractPublicId(data.aadhaar_doc_url) as string,
        })
        : null,
      data.voter_doc_url
        ? getSignedUrl({
          key: extractPublicId(data.voter_doc_url) as string,
        })
        : null,
    ]);

    return res.json({
      ...data,
      aadhaar_signed_url: aadhaarSignedUrl,
      voter_signed_url: voterSignedUrl,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch user details.' });
  }
});

router.put('/users/:id/block', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { data: existing, error: existingError } = await supabase
      .from('users')
      .select('id, is_blocked')
      .eq('id', req.params.id)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (!existing) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ is_blocked: !existing.is_blocked })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to update user.' });
  }
});

router.delete('/users/:id', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { data: rentals, error: rentalFetchError } = await supabase
      .from('rentals')
      .select('id')
      .eq('user_id', req.params.id);

    if (rentalFetchError) {
      throw rentalFetchError;
    }

    const rentalIds = (rentals || []).map((item: any) => item.id);

    if (rentalIds.length) {
      const { error: deleteItemsError } = await supabase
        .from('rental_items')
        .delete()
        .in('rental_id', rentalIds);

      if (deleteItemsError) {
        throw deleteItemsError;
      }

      const { error: deleteRentalsError } = await supabase
        .from('rentals')
        .delete()
        .in('id', rentalIds);

      if (deleteRentalsError) {
        throw deleteRentalsError;
      }
    }

    const { error } = await supabase.from('users').delete().eq('id', req.params.id);

    if (error) {
      throw error;
    }

    return res.json({ message: 'User deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to delete user.' });
  }
});

router.post('/products', roleMiddleware(['admin']), upload.array('images', 8), async (req: Request, res: Response) => {
  try {
    const { name, brand, category, description, pricePerDay } = req.body;

    if (!name || !category || !pricePerDay || isNaN(Number(pricePerDay))) {
      return res.status(400).json({
        message: 'Name, category, and a valid numeric price are required.',
      });
    }

    const productId = crypto.randomUUID();
    const uniqueCode = await generateUniqueCode(category);
    const qrBase64 = await generateQrBase64({ productId, uniqueCode });

    const productImages = [];
    const files = (req.files as Express.Multer.File[]) || [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const buffer = await sharp(file.buffer)
          .resize({ width: 1800, withoutEnlargement: true })
          .jpeg({ quality: 82 })
          .toBuffer();

        const key = `${productId}/${Date.now()}-${i}.jpg`;
        const imageUrl = await uploadFile({
          buffer,
          key,
          mimetype: 'image/jpeg',
          folder: 'Camera Rental House/Products',
        });
        
        productImages.push(imageUrl);
      } catch (imgError) {
        console.error(`Error processing image ${i}:`, imgError);
        // Continue with other images if one fails
      }
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        id: productId,
        name,
        brand,
        category,
        description,
        price_per_day: Number(pricePerDay),
        unique_code: uniqueCode,
        qr_base64: qrBase64,
        images: productImages, // Single table storage
      })
      .select('*')
      .single();

    if (productError) {
      console.error('Supabase Insert Error:', productError);
      return res.status(500).json({ 
        message: 'Database error: ' + (productError.message || 'Unknown error'),
        details: productError.details
      });
    }

    return res.status(201).json(product);
  } catch (error: any) {
    console.error('Create Product Exception:', error);
    return res.status(500).json({ 
      message: error.message || 'Unable to create product.',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

router.put('/products/:id', roleMiddleware(['admin']), upload.array('images', 8), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, brand, category, description, pricePerDay, removeImageUrls } = req.body;
    
    const removedUrls = removeImageUrls ? JSON.parse(removeImageUrls) : [];

    // Fetch current product to get existing images array
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentProduct) {
      throw fetchError || new Error('Product not found.');
    }

    // Deletions from Cloudinary
    if (removedUrls.length) {
      await Promise.all(
        removedUrls.map((url: string) =>
          deleteFile({ key: extractPublicId(url) as string }),
        ),
      );
    }

    // Upload new images
    const newImageUrls = [];
    const files = (req.files as Express.Multer.File[]) || [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const buffer = await sharp(file.buffer)
          .resize({ width: 1800, withoutEnlargement: true })
          .jpeg({ quality: 82 })
          .toBuffer();

        const key = `${id}/${Date.now()}-${i}.jpg`;
        const imageUrl = await uploadFile({
          buffer,
          key,
          mimetype: 'image/jpeg',
          folder: 'Camera Rental House/Products',
        });
        
        newImageUrls.push(imageUrl);
      } catch (imgError) {
        console.error(`Error processing new image ${i}:`, imgError);
      }
    }

    // Merge image lists
    const updatedImages = [
      ...(currentProduct.images || []).filter((url: string) => !removedUrls.includes(url)),
      ...newImageUrls,
    ];

    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({
        name,
        brand,
        category,
        description,
        price_per_day: Number(pricePerDay),
        images: updatedImages,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    return res.json(updatedProduct);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to update product.' });
  }
});

router.delete('/products/:id', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('images')
      .eq('id', req.params.id)
      .single();

    if (currentProduct?.images?.length) {
      await Promise.all(
        currentProduct.images.map((url: string) => deleteFile({ key: extractPublicId(url) as string })),
      );
    }

    const { error } = await supabase.from('products').delete().eq('id', req.params.id);

    if (error) {
      throw error;
    }

    return res.json({ message: 'Product deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to delete product.' });
  }
});

router.get('/rentals/upcoming', roleMiddleware(['admin', 'manager']), async (_req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('rentals')
      .select(
        '*, users(full_name, phone), rental_items(*, products(name, unique_code, images))',
      )
      .gte('pickup_date', today)
      .order('pickup_date', { ascending: true });

    if (error) {
      throw error;
    }

    return res.json(data || []);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch upcoming rentals.' });
  }
});

router.get('/rentals/active', roleMiddleware(['admin', 'manager']), async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('rental_items')
      .select('*, rentals(*, users(full_name, phone)), products(*)')
      .eq('status', 'released')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.json(data || []);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch active rentals.' });
  }
});

router.get('/rentals/past', roleMiddleware(['admin', 'manager']), async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit || 20);
    const offset = Number(req.query.offset || 0);

    const { data, count, error } = await supabase
      .from('rental_items')
      .select('*, rentals(*, users(full_name, phone)), products(*)', {
        count: 'exact',
      })
      .eq('status', 'returned')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return res.json({
      items: data || [],
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: offset + limit < (count || 0),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch past rentals.' });
  }
});

export default router;

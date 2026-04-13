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
const upload = multer({ storage: multer.memoryStorage() });

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
    const { name, category, description, pricePerDay, quantity } = req.body;

    if (!name || !category || !pricePerDay) {
      return res.status(400).json({
        message: 'Name, category, and price per day are required.',
      });
    }

    const productId = crypto.randomUUID();
    const uniqueCode = await generateUniqueCode(category);
    const qrBase64 = await generateQrBase64({ productId, uniqueCode });

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        id: productId,
        name,
        category,
        description,
        price_per_day: Number(pricePerDay),
        quantity: Number(quantity || 1),
        unique_code: uniqueCode,
        qr_base64: qrBase64,
      })
      .select('*')
      .single();

    if (productError) {
      throw productError;
    }

    const productImages = await Promise.all(
      ((req.files as Express.Multer.File[]) || []).map(async (file, index) => {
        const buffer = await sharp(file.buffer)
          .resize({ width: 1800, withoutEnlargement: true })
          .jpeg({ quality: 82 })
          .toBuffer();

        const key = `${productId}/${Date.now()}-${index}.jpg`;
        const imageUrl = await uploadFile({
          buffer,
          key,
          mimetype: 'image/jpeg',
          folder: 'Camera Rental House/Products',
        });

        return {
          product_id: productId,
          image_url: imageUrl,
          display_order: index,
        };
      }),
    );

    if (productImages.length) {
      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(productImages);

      if (imagesError) {
        throw imagesError;
      }
    }

    return res.status(201).json({
      ...product,
      product_images: productImages,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to create product.' });
  }
});

router.put('/products/:id', roleMiddleware(['admin']), upload.array('images', 8), async (req: Request, res: Response) => {
  try {
    const removeImageIds = req.body.removeImageIds
      ? JSON.parse(req.body.removeImageIds)
      : [];

    const { data: product, error: updateError } = await supabase
      .from('products')
      .update({
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        price_per_day: Number(req.body.pricePerDay),
        quantity: Number(req.body.quantity),
      })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    if (removeImageIds.length) {
      const { data: imagesToRemove, error: removeFetchError } = await supabase
        .from('product_images')
        .select('*')
        .in('id', removeImageIds);

      if (removeFetchError) {
        throw removeFetchError;
      }

      await Promise.all(
        (imagesToRemove || []).map((image: any) =>
          deleteFile({ key: extractPublicId(image.image_url) as string }),
        ),
      );

      const { error: removeError } = await supabase
        .from('product_images')
        .delete()
        .in('id', removeImageIds);

      if (removeError) {
        throw removeError;
      }
    }

    const newImages = await Promise.all(
      ((req.files as Express.Multer.File[]) || []).map(async (file, index) => {
        const buffer = await sharp(file.buffer)
          .resize({ width: 1800, withoutEnlargement: true })
          .jpeg({ quality: 82 })
          .toBuffer();

        const key = `products/${req.params.id}/${Date.now()}-${index}.jpg`;
        const imageUrl = await uploadFile({
          buffer,
          key,
          mimetype: 'image/jpeg',
        });

        return {
          product_id: req.params.id,
          image_url: imageUrl,
          display_order: index,
        };
      }),
    );

    if (newImages.length) {
      const { error: newImagesError } = await supabase
        .from('product_images')
        .insert(newImages);

      if (newImagesError) {
        throw newImagesError;
      }
    }

    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', req.params.id)
      .order('display_order', { ascending: true });

    if (imagesError) {
      throw imagesError;
    }

    return res.json({
      ...product,
      product_images: images || [],
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to update product.' });
  }
});

router.delete('/products/:id', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('product_id', req.params.id);

    if (imagesError) {
      throw imagesError;
    }

    await Promise.all(
      (images || []).map((image: any) => deleteFile({ key: extractPublicId(image.image_url) as string })),
    );

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
        '*, users(full_name, phone), rental_items(*, products(name, unique_code, product_images(image_url)))',
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
      .select('*, rentals(*, users(full_name, phone)), products(*, product_images(*))')
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
      .select('*, rentals(*, users(full_name, phone)), products(*, product_images(*))', {
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

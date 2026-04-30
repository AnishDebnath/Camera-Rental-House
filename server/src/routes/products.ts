import express, { Request, Response } from 'express';
import supabase from '../db/supabase.js';

const router = express.Router();

const enrichProduct = async (product: any) => {
  try {
    const { data, error } = await supabase
      .from('rental_items')
      .select('quantity')
      .eq('product_id', product.id)
      .in('status', ['pending_pickup', 'released']);

    if (error) {
      console.warn('Error fetching rental items for enrichment:', error);
      return { ...product, available_quantity: 1 };
    }

    const reservedQuantity = (data || []).reduce(
      (sum: number, item: any) => sum + Number(item.quantity || 0),
      0,
    );

    // In the "unique identity" model, each product row is 1 physical unit.
    // So availability is 1 (if not reserved) or 0 (if reserved).
    return {
      ...product,
      available_quantity: reservedQuantity > 0 ? 0 : 1,
    };
  } catch (err) {
    console.error('Enrichment exception:', err);
    return { ...product, available_quantity: 1 };
  }
};

router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit || 12);
    const offset = Number(req.query.offset || 0);
    const search = String(req.query.search || '').trim();
    const category = String(req.query.category || '').trim();
    const brand = String(req.query.brand || '').trim();
    const status = String(req.query.status || 'all').toLowerCase();

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category.toLowerCase() !== 'all') {
      query = query.ilike('category', category);
    }

    if (brand && brand.toLowerCase() !== 'all') {
      query = query.ilike('brand', brand);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,unique_code.ilike.%${search}%`);
    }

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    const items = await Promise.all((data || []).map(enrichProduct));
    
    let filteredItems = items;
    if (status === 'in_stock') {
      filteredItems = items.filter((item) => item.available_quantity > 0);
    } else if (status === 'on_rent') {
      filteredItems = items.filter((item) => item.available_quantity === 0);
    }

    return res.json({
      items: filteredItems,
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: offset + limit < (count || 0),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch products.' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json(await enrichProduct(data));
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to fetch product.' });
  }
});

router.get('/:id/label', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('name, unique_code, qr_base64')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).send('Product not found.');
    }

    return res.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.name} Label</title>
    <style>
      body { font-family: Inter, Arial, sans-serif; background: #fff; color: #111; padding: 32px; }
      .wrap { max-width: 480px; margin: 0 auto; text-align: center; }
      .code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 40px; font-weight: 700; color: #0EA5E9; margin: 16px 0; }
      .print { border: none; background: #0EA5E9; color: #fff; border-radius: 999px; padding: 14px 24px; cursor: pointer; }
      img { width: 260px; height: 260px; object-fit: contain; }
      @media print { .print { display: none; } body { padding: 0; } }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>${data.name}</h1>
      <div class="code">${data.unique_code}</div>
      <img src="${data.qr_base64}" alt="${data.name} QR Code" />
      <div style="margin-top: 24px;">
        <button class="print" onclick="window.print()">Print</button>
      </div>
    </div>
  </body>
</html>`);
  } catch (error: any) {
    return res.status(500).send(error.message || 'Unable to generate label.');
  }
});

export default router;

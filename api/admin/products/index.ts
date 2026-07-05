import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminToken } from '../../_lib/auth';
import { getSupabaseAdmin } from '../../_lib/supabaseAdmin';

const PAGE_SIZE = 20;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // All routes require admin auth
  const admin = verifyAdminToken(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });

  const db = getSupabaseAdmin();

  if (req.method === 'GET') {
    const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10));
    const offset = (page - 1) * PAGE_SIZE;

    const { data, error, count } = await db
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) return res.status(500).json({ error: 'Database error' });

    return res.status(200).json({
      products: data ?? [],
      total: count ?? 0,
      page,
      pageSize: PAGE_SIZE,
    });
  }

  if (req.method === 'POST') {
    const { image_url, label, price, description, category } = req.body ?? {};

    if (!image_url || typeof image_url !== 'string') {
      return res.status(400).json({ error: 'image_url is required' });
    }

    const row = {
      image_url: image_url.trim(),
      label: typeof label === 'string' && label.trim() ? label.trim() : null,
      price: price != null && !isNaN(Number(price)) ? Number(price) : null,
      description: typeof description === 'string' && description.trim() ? description.trim() : null,
      category: typeof category === 'string' && category.trim() ? category.trim() : null,
    };

    const { data, error } = await db.from('products').insert(row).select().single();
    if (error) return res.status(500).json({ error: 'Database error' });

    return res.status(201).json({ product: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

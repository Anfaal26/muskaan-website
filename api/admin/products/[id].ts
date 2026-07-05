import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminToken } from '../../_lib/auth.js';
import { getSupabaseAdmin } from '../../_lib/supabaseAdmin.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = verifyAdminToken(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

  const db = getSupabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await db.from('products').select('*').eq('id', id).single();
    if (error || !data) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ product: data });
  }

  if (req.method === 'PUT') {
    const { label, price, description, category, image_url } = req.body ?? {};

    const updates: Record<string, unknown> = {};
    if (typeof image_url === 'string' && image_url.trim()) {
      updates.image_url = image_url.trim();
    }
    // Allow explicit null to clear optional fields
    updates.label = typeof label === 'string' && label.trim() ? label.trim() : null;
    updates.price = price != null && !isNaN(Number(price)) ? Number(price) : null;
    updates.description = typeof description === 'string' && description.trim() ? description.trim() : null;
    updates.category = typeof category === 'string' && category.trim() ? category.trim() : null;

    const { data, error } = await db
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return res.status(500).json({ error: 'Database error' });
    return res.status(200).json({ product: data });
  }

  if (req.method === 'DELETE') {
    // Fetch the product first to get the image URL for storage cleanup
    const { data: product } = await db.from('products').select('image_url').eq('id', id).single();

    const { error } = await db.from('products').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Database error' });

    // Delete the image from Supabase Storage if it's a storage URL
    if (product?.image_url) {
      const url = product.image_url as string;
      const storagePrefix = '/storage/v1/object/public/products/';
      const idx = url.indexOf(storagePrefix);
      if (idx !== -1) {
        const filePath = url.slice(idx + storagePrefix.length);
        await db.storage.from('products').remove([filePath]).catch(() => null);
      }
    }

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

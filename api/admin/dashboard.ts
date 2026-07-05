import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminToken } from '../_lib/auth.js';
import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = verifyAdminToken(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const db = getSupabaseAdmin();

  const [totalRes, noPriceRes, noLabelRes, recentRes] = await Promise.all([
    db.from('products').select('*', { count: 'exact', head: true }),
    db.from('products').select('*', { count: 'exact', head: true }).is('price', null),
    db.from('products').select('*', { count: 'exact', head: true }).is('label', null),
    db.from('products').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  return res.status(200).json({
    total: totalRes.count ?? 0,
    noPrice: noPriceRes.count ?? 0,
    noLabel: noLabelRes.count ?? 0,
    recent: recentRes.data ?? [],
  });
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminToken } from '../../_lib/auth';
import { getSupabaseAdmin } from '../../_lib/supabaseAdmin';

const PAGE_SIZE = 20;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = verifyAdminToken(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const db = getSupabaseAdmin();
  const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10));
  const offset = (page - 1) * PAGE_SIZE;

  const [listRes, unreadRes] = await Promise.all([
    db
      .from('messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1),
    db.from('messages').select('*', { count: 'exact', head: true }).eq('read', false),
  ]);

  if (listRes.error) return res.status(500).json({ error: 'Database error' });

  return res.status(200).json({
    messages: listRes.data ?? [],
    total: listRes.count ?? 0,
    unread: unreadRes.count ?? 0,
    page,
    pageSize: PAGE_SIZE,
  });
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminToken } from '../../_lib/auth';
import { getSupabaseAdmin } from '../../_lib/supabaseAdmin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = verifyAdminToken(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

  const db = getSupabaseAdmin();

  if (req.method === 'PATCH') {
    const { read } = req.body ?? {};
    if (typeof read !== 'boolean') return res.status(400).json({ error: 'read must be a boolean' });

    const { data, error } = await db.from('messages').update({ read }).eq('id', id).select().single();
    if (error || !data) return res.status(500).json({ error: 'Database error' });
    return res.status(200).json({ message: data });
  }

  if (req.method === 'DELETE') {
    const { error } = await db.from('messages').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Database error' });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

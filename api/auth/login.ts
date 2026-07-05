import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { signAdminToken, makeAuthCookie } from '../_lib/auth.js';
import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { checkRateLimit, recordAttempt, clearAttempts } from '../_lib/rateLimit.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
    req.socket?.remoteAddress ??
    'unknown';

  // Rate limiting — check before processing
  const { blocked } = await checkRateLimit(ip).catch(() => ({ blocked: false }));
  if (blocked) {
    return res.status(429).json({ error: 'Unauthorized' });
  }

  // Sanitize inputs — reject anything that isn't a plain string
  const { username, password } = req.body ?? {};
  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    username.length > 100 ||
    password.length > 200
  ) {
    await recordAttempt(ip, false).catch(() => null);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = getSupabaseAdmin();

  // Parameterized query via Supabase client — never string-concatenated SQL
  const { data: admin, error } = await db
    .from('admins')
    .select('id, username, password_hash')
    .eq('username', username.trim())
    .single();

  if (error || !admin) {
    await recordAttempt(ip, false).catch(() => null);
    // Constant-time delay to prevent timing attacks
    await bcrypt.compare(password, '$2b$12$invalidhashpadding000000000000000000000000000000000000');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    await recordAttempt(ip, false).catch(() => null);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Clear failed attempts on success
  await clearAttempts(ip).catch(() => null);
  await recordAttempt(ip, true).catch(() => null);

  const token = signAdminToken({ adminId: admin.id, username: admin.username });

  res.setHeader('Set-Cookie', makeAuthCookie(token));
  return res.status(200).json({ username: admin.username });
}

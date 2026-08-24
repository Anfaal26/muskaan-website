import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from './_lib/supabaseAdmin';
import { checkMessageRateLimit } from './_lib/rateLimit';

const MAX_LEN = { name: 100, email: 200, phone: 30, subject: 100, message: 3000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
    req.socket?.remoteAddress ??
    'unknown';

  const { blocked } = await checkMessageRateLimit(ip).catch(() => ({ blocked: false }));
  if (blocked) {
    return res.status(429).json({ error: 'Too many messages sent. Please try again later.' });
  }

  const { name, email, phone, subject, message } = req.body ?? {};

  const valid =
    typeof name === 'string' && name.trim() && name.length <= MAX_LEN.name &&
    typeof email === 'string' && EMAIL_RE.test(email) && email.length <= MAX_LEN.email &&
    typeof subject === 'string' && subject.trim() && subject.length <= MAX_LEN.subject &&
    typeof message === 'string' && message.trim() && message.length <= MAX_LEN.message &&
    (phone == null || (typeof phone === 'string' && phone.length <= MAX_LEN.phone));

  if (!valid) {
    return res.status(400).json({ error: 'Invalid form submission' });
  }

  const db = getSupabaseAdmin();
  const { error } = await db.from('messages').insert({
    name: name.trim(),
    email: email.trim(),
    phone: typeof phone === 'string' && phone.trim() ? phone.trim() : null,
    subject: subject.trim(),
    message: message.trim(),
    ip,
  });

  if (error) {
    console.error('Contact message insert error:', error.message);
    return res.status(500).json({ error: 'Failed to send message' });
  }

  return res.status(201).json({ ok: true });
}

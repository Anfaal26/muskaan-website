import type { VercelRequest, VercelResponse } from '@vercel/node';
import { makeClearCookie } from '../_lib/auth.js';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Set-Cookie', makeClearCookie());
  return res.status(200).json({ ok: true });
}

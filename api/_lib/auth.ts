import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import type { VercelRequest } from '@vercel/node';

export interface AdminPayload {
  adminId: string;
  username: string;
}

export function verifyAdminToken(req: VercelRequest): AdminPayload | null {
  try {
    const cookies = parse(req.headers.cookie ?? '');
    const token = cookies['admin_token'];
    if (!token) return null;

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');

    const payload = jwt.verify(token, secret) as AdminPayload & { iat: number; exp: number };
    return { adminId: payload.adminId, username: payload.username };
  } catch {
    return null;
  }
}

export function signAdminToken(payload: AdminPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.sign(payload, secret, { expiresIn: '8h' });
}

/** Serialize an httpOnly, SameSite=Strict cookie */
export function makeAuthCookie(token: string): string {
  const maxAge = 8 * 60 * 60; // 8 hours in seconds
  return `admin_token=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${
    process.env.NODE_ENV === 'production' ? '; Secure' : ''
  }`;
}

/** Cookie that clears the auth token */
export function makeClearCookie(): string {
  return 'admin_token=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0';
}

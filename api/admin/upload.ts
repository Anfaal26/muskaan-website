import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminToken } from '../_lib/auth';
import { getSupabaseAdmin } from '../_lib/supabaseAdmin';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const config = {
  api: { bodyParser: { sizeLimit: '6mb' } },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = verifyAdminToken(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { base64, mimeType, fileName } = req.body ?? {};

  if (!base64 || typeof base64 !== 'string') {
    return res.status(400).json({ error: 'base64 image data required' });
  }
  if (!ALLOWED_TYPES.includes(mimeType)) {
    return res.status(400).json({ error: 'Only JPG, PNG, or WebP images allowed' });
  }

  const buffer = Buffer.from(base64, 'base64');
  if (buffer.byteLength > MAX_SIZE_BYTES) {
    return res.status(400).json({ error: 'Image must be under 5 MB' });
  }

  // Generate a unique filename to prevent collisions
  const ext = (mimeType as string).split('/')[1].replace('jpeg', 'jpg');
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const storagePath = `uploads/${safeName}`;

  const db = getSupabaseAdmin();
  const { error } = await db.storage
    .from('products')
    .upload(storagePath, buffer, {
      contentType: mimeType as string,
      upsert: false,
    });

  if (error) {
    console.error('Storage upload error:', error.message);
    return res.status(500).json({ error: 'Upload failed' });
  }

  const { data: urlData } = db.storage.from('products').getPublicUrl(storagePath);

  return res.status(200).json({ url: urlData.publicUrl, path: storagePath });
}

/**
 * Migrate existing product images from /public/products/ to Supabase Storage
 * and insert product records into the database.
 *
 * Run once to bootstrap the DB with existing images:
 *   node scripts/migrate-images.mjs
 *
 * Requires env vars: SUPABASE_URL (or VITE_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(__dirname, '..', 'public', 'products');
const BUCKET = 'products';

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

async function migrate() {
  let files;
  try {
    files = await readdir(IMAGES_DIR);
  } catch {
    console.error(`Cannot read ${IMAGES_DIR} — does the folder exist?`);
    process.exit(1);
  }

  const images = files.filter(f => Object.keys(MIME).includes(extname(f).toLowerCase()));
  console.log(`Found ${images.length} image(s) in ${IMAGES_DIR}`);

  for (const filename of images) {
    const ext = extname(filename).toLowerCase();
    const contentType = MIME[ext];
    const storagePath = `uploads/${filename}`;

    const fileBuffer = await readFile(join(IMAGES_DIR, filename));

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, { contentType, upsert: true });

    if (uploadError) {
      console.error(`✗ Upload failed for ${filename}:`, uploadError.message);
      continue;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    const image_url = urlData.publicUrl;

    // Insert product record
    const { error: dbError } = await supabase.from('products').insert({ image_url });

    if (dbError) {
      console.error(`✗ DB insert failed for ${filename}:`, dbError.message);
    } else {
      console.log(`✓ Migrated: ${filename} → ${image_url}`);
    }
  }

  console.log('Migration complete.');
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});

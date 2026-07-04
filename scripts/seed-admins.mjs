/**
 * Seed admin accounts into Supabase.
 * Run once after setting up the database:
 *   node scripts/seed-admins.mjs
 *
 * Requires env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const ADMINS = [
  { username: 'Budyaa', password: 'Klugger' },
  { username: 'adMin150', password: 'ZoGEmzfE' },
];

const SALT_ROUNDS = 12;

async function seed() {
  for (const admin of ADMINS) {
    const password_hash = await bcrypt.hash(admin.password, SALT_ROUNDS);

    const { error } = await supabase
      .from('admins')
      .upsert({ username: admin.username, password_hash }, { onConflict: 'username' });

    if (error) {
      console.error(`Failed to upsert ${admin.username}:`, error.message);
    } else {
      console.log(`✓ Seeded admin: ${admin.username}`);
    }
  }
  console.log('Done.');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

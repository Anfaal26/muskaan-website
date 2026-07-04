-- ============================================================
-- Muskaan Boutique — Supabase Database Schema
-- Run this in your Supabase SQL editor to set up the database.
-- ============================================================

-- Enable UUID extension (usually already enabled on Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Products table
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url   TEXT NOT NULL,
  label       TEXT,                           -- defaults to "Latest Collection" in app
  price       NUMERIC(10, 2),                 -- null = hide price
  description TEXT,                           -- null = show generic description
  category    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Admins table
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL               -- bcrypt hashed, never plain text
);

-- ============================================================
-- Login attempts table (for rate limiting)
-- ============================================================
CREATE TABLE IF NOT EXISTS login_attempts (
  id           BIGSERIAL PRIMARY KEY,
  ip           TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  success      BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS login_attempts_ip_time
  ON login_attempts (ip, attempted_at DESC);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Products: public read, no direct write (all writes via service role)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read products"
  ON products FOR SELECT
  USING (true);

-- Admins: never exposed via anon key
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- No anon access to admins table (service role bypasses RLS)

-- Login attempts: service role only
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Storage bucket setup (run in Supabase dashboard)
-- ============================================================
-- In Supabase Storage, create a bucket named "products" with:
--   - Public access: ENABLED (so image URLs work without auth)
--   - File size limit: 5 MB
--   - Allowed MIME types: image/jpeg, image/png, image/webp
--
-- Storage policies (set in Supabase dashboard > Storage > Policies):
--   SELECT: allow public (true)
--   INSERT/UPDATE/DELETE: handled via service role key only

-- ============================================================
-- Seed admin accounts
-- Run the seed script: node scripts/seed-admins.mjs
-- This will insert the two admin accounts with bcrypt-hashed passwords.
-- ============================================================

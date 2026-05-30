-- =============================================
-- TATI'S NAILS — Supabase Database Schema
-- =============================================
-- Run this in: Supabase Dashboard → SQL Editor → New Query

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number            TEXT UNIQUE NOT NULL,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),

  -- Customer info
  customer_name           TEXT NOT NULL,
  customer_email          TEXT NOT NULL,
  customer_phone          TEXT NOT NULL,

  -- Nail preferences
  nail_shape              TEXT NOT NULL CHECK (nail_shape IN ('almond','coffin','square','oval','stiletto')),
  nail_length             TEXT NOT NULL CHECK (nail_length IN ('short','medium','long','extra-long')),
  primary_color           TEXT NOT NULL,
  secondary_color         TEXT,
  design_notes            TEXT,

  -- Sizing
  size_measurements       JSONB,   -- { thumb, index, middle, ring, pinky }
  size_photo_url          TEXT,

  -- Inspiration images (array of storage URLs)
  inspiration_image_urls  TEXT[] DEFAULT '{}',

  -- Order info
  desired_completion_date DATE NOT NULL,
  quantity                INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  budget_range            TEXT NOT NULL CHECK (budget_range IN ('under-25','25-50','50-75','75-100','100+')),

  -- Status & admin
  status                  TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','in-progress','ready','completed','cancelled')),
  admin_notes             TEXT
);

-- Auto-update updated_at on every change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- GALLERY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS gallery (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  title       TEXT NOT NULL,
  description TEXT,
  image_url   TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('short','medium','long','special-occasion','seasonal','custom-art')),
  is_featured BOOLEAN DEFAULT false,
  sort_order  INTEGER DEFAULT 0
);

-- =============================================
-- TESTIMONIALS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  customer_name   TEXT NOT NULL,
  rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review          TEXT NOT NULL,
  nail_type       TEXT,
  is_approved     BOOLEAN DEFAULT false
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT an order (public form submission)
CREATE POLICY "Public can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Anyone can view their own order by email (for customer tracking)
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (true);  -- We filter by order_number + email in the app layer

-- Gallery is publicly readable
CREATE POLICY "Gallery is public"
  ON gallery FOR SELECT
  USING (true);

-- Approved testimonials are publicly readable
CREATE POLICY "Approved testimonials are public"
  ON testimonials FOR SELECT
  USING (is_approved = true);

-- =============================================
-- STORAGE BUCKETS
-- =============================================
-- Run these in the Supabase Dashboard → Storage, or via the SQL editor:

-- Inspiration images bucket (public read, authenticated write via API)
INSERT INTO storage.buckets (id, name, public)
VALUES ('inspiration-images', 'inspiration-images', true)
ON CONFLICT DO NOTHING;

-- Gallery images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT DO NOTHING;

-- Size reference photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('size-photos', 'size-photos', false)
ON CONFLICT DO NOTHING;

-- Storage policy: allow public uploads to inspiration-images
CREATE POLICY "Public can upload inspiration images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'inspiration-images');

CREATE POLICY "Public can read inspiration images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'inspiration-images');

CREATE POLICY "Public can upload size photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'size-photos');

-- Gallery images publicly readable
CREATE POLICY "Gallery images are public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery-images');

-- =============================================
-- SEED DATA — Sample Gallery Items
-- =============================================
-- (Replace image_url values with your real Supabase Storage URLs after uploading)

INSERT INTO gallery (title, description, image_url, category, is_featured, sort_order) VALUES
  ('Almond Nudes', 'Soft nude tones with a glossy finish', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800', 'medium', true, 1),
  ('Coffin Glam', 'Champagne glitter with gold accents', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800', 'long', true, 2),
  ('Short & Sweet', 'Natural pink square tips', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800', 'short', false, 3),
  ('Bridal Set', 'White pearl with delicate florals', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800', 'special-occasion', true, 4),
  ('Christmas Edition', 'Red velvet with snowflake art', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800', 'seasonal', false, 5),
  ('Custom Butterfly Art', 'Hand-painted butterfly details', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800', 'custom-art', true, 6)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DATA — Sample Testimonials
-- =============================================
INSERT INTO testimonials (customer_name, rating, review, nail_type, is_approved) VALUES
  ('Aaliyah M.', 5, 'Tati is literally so talented!! My coffin nails looked exactly like my inspiration pic. Everyone keeps asking where I got them 😍', 'Coffin - Long', true),
  ('Sofia R.', 5, 'Best press-ons I''ve ever worn! They lasted 3 weeks without lifting. Already placed my second order 💅', 'Almond - Medium', true),
  ('Destiny J.', 5, 'Got these for prom and I felt like a queen. The custom art she did was INSANE. Worth every penny!', 'Stiletto - Extra Long', true)
ON CONFLICT DO NOTHING;

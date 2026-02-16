-- ============================================================================
-- COMPLETE DATABASE SCHEMA FIX & UPDATE
-- ============================================================================
-- Run this script in your Supabase SQL Editor to fix "[object Object]" errors
-- and ensure the database matches the application's required structure.
-- ============================================================================

-- 1. FIX PRODUCTS TABLE
-- Adding missing JSONB settings and ensuring category matches the Admin Panel structure
ALTER TABLE products ADD COLUMN IF NOT EXISTS design_upload_settings JSONB DEFAULT '{"enabled": true, "description": "Upload your custom sticker design", "maxFileSizeMB": 5, "allowedFormats": {"png": true, "jpg": true, "jpeg": true, "gif": true, "svg": false}}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS condition_logic JSONB DEFAULT '{"type": "all", "description": "All conditions must be met"}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity_settings JSONB DEFAULT '{"showSelectionPanel": false, "fixedQuantity": null}';

-- If category column is missing or is category_id, we add a flexible TEXT category column
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='category') THEN
        ALTER TABLE products ADD COLUMN category TEXT DEFAULT 'stickers';
    END IF;
END $$;

-- 2. ENSURE ALL RELATED PRODUCT TABLES EXIST
CREATE TABLE IF NOT EXISTS price_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('fixed', 'matrix', 'formula')),
    value JSONB NOT NULL,
    applies_when TEXT[],
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_per_sq_in NUMERIC DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quantity_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    min_qty INTEGER NOT NULL,
    max_qty INTEGER,
    price_per_unit NUMERIC NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS size_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    width NUMERIC NOT NULL,
    height NUMERIC NOT NULL,
    price_per_sq_in NUMERIC DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('select', 'radio', 'checkbox', 'dimension')),
    required BOOLEAN DEFAULT FALSE,
    price_behavior TEXT CHECK (price_behavior IN ('add', 'override', 'multiply')),
    display_order INTEGER DEFAULT 0,
    is_rush BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS option_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    option_id UUID REFERENCES product_options(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_modifier NUMERIC DEFAULT 0,
    swatch_image TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS finish_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS finish_price_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    finish_id UUID REFERENCES finish_options(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('fixed', 'matrix', 'formula')),
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FIX ORDERS TABLE (Ensure all columns exist for createOrder function)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS quantity INTEGER;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS selected_size TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS selected_finish TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS selected_border_cut TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS design_file_path TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS design_file_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS design_file_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS price_per_unit NUMERIC;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS setup_fee NUMERIC;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal NUMERIC;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total NUMERIC;

-- 4. FIX PROOFS & ARTWORK_FILES RELATIONSHIPS
-- Rebuilding the foreign keys to ensure CASCADE DELETE works as expected
ALTER TABLE proofs DROP CONSTRAINT IF EXISTS proofs_order_id_fkey;
ALTER TABLE proofs ADD CONSTRAINT proofs_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE artwork_files DROP CONSTRAINT IF EXISTS artwork_files_order_id_fkey;
ALTER TABLE artwork_files ADD CONSTRAINT artwork_files_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

-- 5. ENSURE RLS POLICIES ARE IN PLACE FOR ADMIN
-- This allows you to perform these operations from the app
DROP POLICY IF EXISTS "Allow admin full access on products" ON products;
CREATE POLICY "Allow admin full access on products" ON products FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow admin full access on orders" ON orders;
CREATE POLICY "Allow admin full access on orders" ON orders FOR ALL USING (true);

-- 6. ENSURE TRIGGERS ARE DROPPED BEFORE CREATING (To avoid "already exists" errors)
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================================
-- FIX COMPLETE
-- ============================================================================

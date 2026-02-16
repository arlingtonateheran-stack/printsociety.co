-- PRINT SOCIETY .co - DATABASE SCHEMA
-- This SQL script sets up the necessary tables and relationships for the application.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    sku TEXT,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
    design_upload_settings JSONB DEFAULT '{"enabled": true, "description": "Upload your custom sticker design", "maxFileSizeMB": 5, "allowedFormats": {"png": true, "jpg": true, "jpeg": true, "gif": true, "svg": false}}',
    condition_logic JSONB DEFAULT '{"type": "all", "description": "All conditions must be met"}',
    quantity_settings JSONB DEFAULT '{"showSelectionPanel": false, "fixedQuantity": null}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRICE BLOCKS
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

-- MATERIAL OPTIONS
CREATE TABLE IF NOT EXISTS material_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_per_sq_in NUMERIC DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- QUANTITY TIERS
CREATE TABLE IF NOT EXISTS quantity_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    min_qty INTEGER NOT NULL,
    max_qty INTEGER,
    price_per_unit NUMERIC NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SIZE OPTIONS
CREATE TABLE IF NOT EXISTS size_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    width NUMERIC NOT NULL,
    height NUMERIC NOT NULL,
    price_per_sq_in NUMERIC DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT OPTIONS
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

-- OPTION VALUES
CREATE TABLE IF NOT EXISTS option_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    option_id UUID REFERENCES product_options(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_modifier NUMERIC DEFAULT 0,
    swatch_image TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FINISH OPTIONS
CREATE TABLE IF NOT EXISTS finish_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FINISH PRICE BLOCKS
CREATE TABLE IF NOT EXISTS finish_price_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    finish_id UUID REFERENCES finish_options(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('fixed', 'matrix', 'formula')),
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    customer_email TEXT NOT NULL,
    status TEXT DEFAULT 'awaiting-artwork',
    total_amount NUMERIC DEFAULT 0,
    shipping_address JSONB,
    customer_notes TEXT,
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS (Flat version based on existing code)
-- This table matches the createOrder function in client/lib/supabase.ts
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

-- PROOFS
CREATE TABLE IF NOT EXISTS proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    version INTEGER DEFAULT 1,
    status TEXT DEFAULT 'sent',
    message_to_customer TEXT,
    file_url TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- ARTWORK FILES
CREATE TABLE IF NOT EXISTS artwork_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    file_name TEXT,
    file_url TEXT,
    status TEXT DEFAULT 'pending',
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- GALLERY
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text TEXT,
    sort_order INTEGER DEFAULT 0,
    type TEXT DEFAULT 'image' CHECK (type IN ('image', 'video')),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TRIGGERS FOR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_updated_at ON gallery;
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 4. RLS (Row Level Security) - Basic Setup
-- You might want to refine these based on your auth requirements.
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access on products" ON products;
CREATE POLICY "Allow public read-only access on products" ON products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admin full access on products" ON products;
CREATE POLICY "Allow admin full access on products" ON products FOR ALL USING (true); -- Refine this for production

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- Orders should be private to the customer or visible to admin
-- Refine this after setting up auth correctly.

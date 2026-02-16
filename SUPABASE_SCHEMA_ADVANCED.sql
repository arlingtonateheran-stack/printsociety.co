-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable JSON Web Token support
CREATE EXTENSION IF NOT EXISTS pgjwt;

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS auth_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- PRODUCTS TABLE (Base)
-- ============================================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100),
  sku VARCHAR(100) UNIQUE,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  requires_quote BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- PRICE BLOCKS (Core Pricing Engine)
-- ============================================================================

CREATE TABLE IF NOT EXISTS price_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('fixed', 'matrix', 'formula')),
  value JSONB NOT NULL,
  applies_when JSONB,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_blocks_product ON price_blocks(product_id);

-- ============================================================================
-- MATERIAL OPTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS material_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price_per_sq_in DECIMAL(10, 4),
  pricing_override JSONB,
  active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_material_options_product ON material_options(product_id);

-- ============================================================================
-- SIZE OPTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS size_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  width DECIMAL(10, 2) NOT NULL,
  height DECIMAL(10, 2) NOT NULL,
  price_per_sq_in DECIMAL(10, 4),
  active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_size_options_product ON size_options(product_id);

-- ============================================================================
-- QUANTITY TIERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS quantity_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  min_qty INT NOT NULL,
  max_qty INT,
  price_per_unit DECIMAL(10, 4) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quantity_tiers_product ON quantity_tiers(product_id);

-- ============================================================================
-- FINISH OPTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS finish_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finish_options_product ON finish_options(product_id);

-- ============================================================================
-- FINISH PRICE BLOCKS (Finish-specific pricing)
-- ============================================================================

CREATE TABLE IF NOT EXISTS finish_price_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  finish_id UUID NOT NULL REFERENCES finish_options(id) ON DELETE CASCADE,
  label VARCHAR(255),
  type VARCHAR(50) NOT NULL CHECK (type IN ('fixed', 'matrix', 'formula')),
  value JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finish_price_blocks_finish ON finish_price_blocks(finish_id);

-- ============================================================================
-- PRODUCT OPTIONS (Size, Material, Finish, Rush, Custom)
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('select', 'checkbox', 'dimension', 'custom')),
  required BOOLEAN DEFAULT FALSE,
  price_behavior VARCHAR(50) DEFAULT 'add' CHECK (price_behavior IN ('add', 'override', 'multiply')),
  active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_options_product ON product_options(product_id);

-- ============================================================================
-- RUSH TURNAROUND OPTIONS (Special case of options)
-- ============================================================================

CREATE TABLE IF NOT EXISTS rush_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  days_to_production INT NOT NULL,
  fixed_fee DECIMAL(10, 4),
  locks_other_options JSONB,
  active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rush_options_product ON rush_options(product_id);

-- ============================================================================
-- PRODUCT VARIANTS (Hard overrides for different product types)
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  replaces_pricing_blocks BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);

-- ============================================================================
-- VARIANT PRICE BLOCKS
-- ============================================================================

CREATE TABLE IF NOT EXISTS variant_price_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  label VARCHAR(255),
  type VARCHAR(50) NOT NULL CHECK (type IN ('fixed', 'matrix', 'formula')),
  value JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variant_price_blocks_variant ON variant_price_blocks(variant_id);

-- ============================================================================
-- ORDERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES auth_users(id),
  order_number VARCHAR(50) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending',
  total_price DECIMAL(12, 2),
  requires_proof BOOLEAN DEFAULT TRUE,
  proof_status VARCHAR(50) DEFAULT 'pending',
  tracking_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ============================================================================
-- ORDER ITEMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INT NOT NULL,
  selected_options JSONB,
  price_calculation JSONB,
  unit_price DECIMAL(10, 4),
  total_price DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- ============================================================================
-- PROOFS (Design approvals)
-- ============================================================================

CREATE TABLE IF NOT EXISTS proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  proof_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending',
  requested_changes TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proofs_order ON proofs(order_id);
CREATE INDEX IF NOT EXISTS idx_proofs_status ON proofs(status);

-- ============================================================================
-- CUSTOM QUOTES
-- ============================================================================

CREATE TABLE IF NOT EXISTS custom_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES auth_users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  reason VARCHAR(255),
  specifications TEXT,
  requested_price DECIMAL(12, 2),
  admin_notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_quotes_customer ON custom_quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_custom_quotes_status ON custom_quotes(status);

-- ============================================================================
-- GALLERY (Images and videos for homepage/product pages)
-- ============================================================================

CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  cloudinary_public_id VARCHAR(255),
  display_order INT,
  type VARCHAR(50) DEFAULT 'image' CHECK (type IN ('image', 'video')),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(active);
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery(display_order);

-- ============================================================================
-- TRIGGERS for updated_at timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_auth_users_updated_at ON auth_users;
CREATE TRIGGER update_auth_users_updated_at
  BEFORE UPDATE ON auth_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_proofs_updated_at ON proofs;
CREATE TRIGGER update_proofs_updated_at
  BEFORE UPDATE ON proofs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INDEXES for performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

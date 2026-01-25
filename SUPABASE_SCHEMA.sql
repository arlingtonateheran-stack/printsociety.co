-- ============================================================================
-- SUPABASE SCHEMA FOR PRINT SOCIETY
-- ============================================================================
-- This SQL creates the complete data model for the Print Society application
-- with Supabase/PostgreSQL. Run this in the Supabase SQL Editor.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USERS & AUTHENTICATION
-- ============================================================================

-- Main users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL CHECK (role IN ('customer', 'admin', 'designer', 'shipping', 'support')),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Authentication sessions
CREATE TABLE IF NOT EXISTS auth_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  refresh_token VARCHAR(500),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_name VARCHAR(255),
  device_type VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX idx_auth_sessions_token ON auth_sessions(token);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('signup', 'email-change', 'admin-created')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);

-- Login attempts (for rate limiting)
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  success BOOLEAN DEFAULT FALSE,
  reason VARCHAR(255),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_login_attempts_email_timestamp ON login_attempts(email, timestamp);

-- ============================================================================
-- 2. CUSTOMER PROFILES & ADDRESSES
-- ============================================================================

-- Customer profile extension (for customers)
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255),
  phone VARCHAR(20),
  lifetime_value DECIMAL(12, 2) DEFAULT 0,
  total_orders INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_customer_profiles_user_id ON customer_profiles(user_id);

-- Customer tags
CREATE TABLE IF NOT EXISTS customer_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_customer_tags_customer_id ON customer_tags(customer_id);

-- Addresses (billing & shipping)
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address_type VARCHAR(20) NOT NULL CHECK (address_type IN ('billing', 'shipping')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company VARCHAR(255),
  street VARCHAR(255) NOT NULL,
  street_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100) NOT NULL,
  zip_postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- ============================================================================
-- 3. PRODUCTS & CATEGORIES
-- ============================================================================

-- Product categories
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_on_homepage BOOLEAN DEFAULT FALSE,
  homepage_position INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_categories_slug ON product_categories(slug);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  thumbnail_url TEXT,
  sku VARCHAR(100) UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  display_on_homepage BOOLEAN DEFAULT FALSE,
  homepage_position INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);

-- Product images
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- Product options (materials, finishes, sizes, etc.)
CREATE TABLE IF NOT EXISTS product_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  option_type VARCHAR(50) NOT NULL CHECK (option_type IN ('select', 'checkbox', 'dimension', 'text', 'color')),
  description TEXT,
  affects_price BOOLEAN DEFAULT FALSE,
  required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_options_product_id ON product_options(product_id);

-- Option values
CREATE TABLE IF NOT EXISTS option_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  option_id UUID NOT NULL REFERENCES product_options(id) ON DELETE CASCADE,
  label VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  price_adjustment DECIMAL(10, 2) DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_option_values_option_id ON option_values(option_id);

-- ============================================================================
-- 4. PRICING RULES
-- ============================================================================

CREATE TABLE IF NOT EXISTS pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  trigger VARCHAR(50) NOT NULL CHECK (trigger IN ('quantity', 'material', 'finish', 'size', 'rush-fee')),
  logic VARCHAR(50) NOT NULL CHECK (logic IN ('tiered', 'formula', 'flat')),
  
  -- Triggers
  quantity_min INT,
  quantity_max INT,
  option_id UUID REFERENCES product_options(id) ON DELETE SET NULL,
  size_min DECIMAL(10, 2),
  size_max DECIMAL(10, 2),
  rush_days INT,
  
  -- Calculation
  calculation_type VARCHAR(50) NOT NULL CHECK (calculation_type IN ('value', 'expression', 'percentage')),
  calculation_value DECIMAL(12, 2),
  calculation_expression TEXT,
  percentage_of VARCHAR(50) CHECK (percentage_of IN ('subtotal', 'material-cost')),
  
  priority INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pricing_rules_product_id ON pricing_rules(product_id);

-- ============================================================================
-- 5. ORDERS & ORDER ITEMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE RESTRICT,
  status VARCHAR(50) NOT NULL DEFAULT 'awaiting-artwork' CHECK (status IN 
    ('awaiting-artwork', 'proof-sent', 'awaiting-approval', 'approved', 
     'in-production', 'ready-to-ship', 'shipped', 'delivered', 'cancelled')),
  
  -- Assignees
  assigned_designer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_shipper_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Shipping
  shipping_address_id UUID REFERENCES addresses(id) ON DELETE RESTRICT,
  shipping_method VARCHAR(100),
  tracking_number VARCHAR(100),
  tracking_url TEXT,
  
  -- Notes
  internal_notes TEXT,
  customer_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_assigned_designer_id ON orders(assigned_designer_id);

-- Order line items
CREATE TABLE IF NOT EXISTS order_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL,
  size VARCHAR(100),
  material VARCHAR(100),
  finish VARCHAR(100),
  unit_price DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  custom_specs JSONB, -- Store custom specs as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_line_items_order_id ON order_line_items(order_id);

-- Order timeline
CREATE TABLE IF NOT EXISTS order_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_role VARCHAR(50),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_timeline_order_id ON order_timeline(order_id);

-- ============================================================================
-- 6. ARTWORK & PROOFS
-- ============================================================================

-- Artwork files
CREATE TABLE IF NOT EXISTS artwork_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INT,
  file_type VARCHAR(50),
  uploaded_by_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status VARCHAR(50) NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'approved', 'needs-revision')),
  comments TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_artwork_files_order_id ON artwork_files(order_id);

-- Proofs
CREATE TABLE IF NOT EXISTS proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  artwork_file_id UUID REFERENCES artwork_files(id) ON DELETE SET NULL,
  proof_version INT NOT NULL,
  proof_file_url TEXT NOT NULL,
  message_to_customer TEXT,
  sent_by_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'approved', 'revision-requested', 'rejected')),
  approved_at TIMESTAMP WITH TIME ZONE,
  revision_comments TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_proofs_order_id ON proofs(order_id);

-- Proof comments
CREATE TABLE IF NOT EXISTS proof_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proof_id UUID NOT NULL REFERENCES proofs(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  author_role VARCHAR(50) NOT NULL,
  comment_text TEXT NOT NULL,
  attachment_url TEXT,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_proof_comments_proof_id ON proof_comments(proof_id);

-- ============================================================================
-- 7. GALLERY MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text VARCHAR(500),
  sort_order INT DEFAULT 0,
  type VARCHAR(20) NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'video')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gallery_sort_order ON gallery(sort_order);
CREATE INDEX idx_gallery_is_featured ON gallery(is_featured);

-- Media assets
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('image', 'video', 'document')),
  file_size INT,
  width INT,
  height INT,
  uploaded_by_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  tags TEXT[], -- Array of tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_media_assets_uploaded_by_id ON media_assets(uploaded_by_id);

-- ============================================================================
-- 8. DISCOUNTS & PROMOTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  discount_type VARCHAR(50) NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'freeShipping')),
  discount_value DECIMAL(10, 2) NOT NULL,
  
  -- Rules
  min_order_value DECIMAL(12, 2),
  max_order_value DECIMAL(12, 2),
  applicable_categories UUID[],
  applicable_products UUID[],
  applicable_customer_tags VARCHAR(255)[],
  first_time_customers_only BOOLEAN DEFAULT FALSE,
  exclude_products UUID[],
  
  -- Usage limits
  usage_limit INT,
  usage_per_customer INT,
  usage_count INT DEFAULT 0,
  
  -- Date range
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_discounts_code ON discounts(code);
CREATE INDEX idx_discounts_is_active ON discounts(is_active);

-- ============================================================================
-- 9. SHIPPING & LOGISTICS
-- ============================================================================

-- Shipping carriers & rules
CREATE TABLE IF NOT EXISTS shipping_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  zone VARCHAR(100) NOT NULL,
  carrier VARCHAR(50) NOT NULL CHECK (carrier IN ('usps', 'ups', 'fedex', 'dhl')),
  base_cost DECIMAL(10, 2) NOT NULL,
  quantity_multiplier DECIMAL(10, 4),
  free_shipping_threshold DECIMAL(12, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_shipping_rules_is_active ON shipping_rules(is_active);

-- Shipping labels
CREATE TABLE IF NOT EXISTS shipping_labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  carrier VARCHAR(50) NOT NULL CHECK (carrier IN ('usps', 'ups', 'fedex', 'dhl')),
  label_url TEXT NOT NULL,
  tracking_number VARCHAR(100) UNIQUE,
  weight DECIMAL(10, 2),
  length DECIMAL(10, 2),
  width DECIMAL(10, 2),
  height DECIMAL(10, 2),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_shipping_labels_order_id ON shipping_labels(order_id);
CREATE INDEX idx_shipping_labels_tracking_number ON shipping_labels(tracking_number);

-- ============================================================================
-- 10. SEO & CONTENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS seo_meta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID NOT NULL,
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('product', 'category', 'article', 'collection')),
  
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT[],
  slug VARCHAR(255) UNIQUE NOT NULL,
  
  og_image TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  
  schema_markup JSONB,
  
  canonical_url TEXT,
  noindex BOOLEAN DEFAULT FALSE,
  nofollow BOOLEAN DEFAULT FALSE,
  
  h1_text VARCHAR(255),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_seo_meta_entity ON seo_meta(entity_id, entity_type);
CREATE INDEX idx_seo_meta_slug ON seo_meta(slug);

-- H2 headings for SEO
CREATE TABLE IF NOT EXISTS seo_h2_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seo_meta_id UUID NOT NULL REFERENCES seo_meta(id) ON DELETE CASCADE,
  text VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE INDEX idx_seo_h2_blocks_seo_meta_id ON seo_h2_blocks(seo_meta_id);

-- Internal links for SEO
CREATE TABLE IF NOT EXISTS seo_internal_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seo_meta_id UUID NOT NULL REFERENCES seo_meta(id) ON DELETE CASCADE,
  link_text VARCHAR(255) NOT NULL,
  link_url TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE INDEX idx_seo_internal_links_seo_meta_id ON seo_internal_links(seo_meta_id);

-- ============================================================================
-- 11. SUPPORT TICKETS
-- ============================================================================

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE RESTRICT,
  subject VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'in-progress', 'resolved', 'closed')),
  priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  linked_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX idx_support_tickets_assigned_to_id ON support_tickets(assigned_to_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);

-- Ticket messages
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  author_role VARCHAR(50) NOT NULL CHECK (author_role IN ('customer', 'support', 'admin')),
  message TEXT NOT NULL,
  attachment_urls TEXT[],
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);

-- Ticket internal notes
CREATE TABLE IF NOT EXISTS ticket_internal_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ticket_internal_notes_ticket_id ON ticket_internal_notes(ticket_id);

-- ============================================================================
-- 12. INVENTORY & STOCK
-- ============================================================================

CREATE TABLE IF NOT EXISTS material_stock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL,
  material_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(12, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL, -- rolls, sheets, kg, etc.
  minimum_threshold DECIMAL(12, 2) NOT NULL,
  supplier VARCHAR(255),
  last_restock_date TIMESTAMP WITH TIME ZONE,
  cost_per_unit DECIMAL(12, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_material_stock_material_id ON material_stock(material_id);

-- Stock movements
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES material_stock(material_id) ON DELETE CASCADE,
  movement_type VARCHAR(50) NOT NULL CHECK (movement_type IN ('inbound', 'outbound', 'adjustment')),
  quantity DECIMAL(12, 2) NOT NULL,
  reference VARCHAR(255),
  notes TEXT,
  recorded_by_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_stock_movements_material_id ON stock_movements(material_id);

-- ============================================================================
-- 13. ADMIN ACTIVITY LOGGING
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  changes JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_activity_logs_created_at ON admin_activity_logs(created_at);

-- ============================================================================
-- 14. IMPORT/EXPORT JOBS
-- ============================================================================

CREATE TABLE IF NOT EXISTS import_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type VARCHAR(100) NOT NULL CHECK (job_type IN ('customers', 'products', 'discounts', 'shipping-rules')),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_rows INT,
  success_count INT DEFAULT 0,
  error_count INT DEFAULT 0,
  errors TEXT[],
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_import_jobs_status ON import_jobs(status);

CREATE TABLE IF NOT EXISTS export_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type VARCHAR(100) NOT NULL CHECK (job_type IN ('orders', 'customers', 'artwork', 'analytics')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  file_url TEXT,
  format VARCHAR(50) NOT NULL CHECK (format IN ('csv', 'json', 'xlsx')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_export_jobs_status ON export_jobs(status);

-- ============================================================================
-- 15. ROW LEVEL SECURITY (RLS) - BASIC SETUP
-- ============================================================================

-- Enable RLS on critical tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR auth.role() = 'authenticated');

-- Customers can read their own orders
CREATE POLICY "Customers can read own orders" ON orders
  FOR SELECT USING (customer_id = (SELECT id FROM customer_profiles WHERE user_id = auth.uid()));

-- Allow public read on gallery
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read gallery" ON gallery FOR SELECT USING (true);

-- Allow public read on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);

-- ============================================================================
-- 16. VIEWS FOR ANALYTICS & REPORTS
-- ============================================================================

-- Order summary view
CREATE OR REPLACE VIEW order_summary_view AS
SELECT 
  o.id,
  o.order_number,
  o.status,
  o.created_at,
  cp.user_id as customer_user_id,
  u.email as customer_email,
  u.name as customer_name,
  COUNT(oli.id) as item_count,
  SUM(oli.subtotal) as total_amount
FROM orders o
JOIN customer_profiles cp ON o.customer_id = cp.id
JOIN users u ON cp.user_id = u.id
LEFT JOIN order_line_items oli ON o.id = oli.order_id
GROUP BY o.id, o.order_number, o.status, o.created_at, cp.user_id, u.email, u.name;

-- Customer lifetime value view
CREATE OR REPLACE VIEW customer_ltv_view AS
SELECT 
  cp.id,
  u.email,
  u.name,
  COUNT(DISTINCT o.id) as total_orders,
  COALESCE(SUM(oli.subtotal), 0) as lifetime_value,
  MAX(o.created_at) as last_order_date
FROM customer_profiles cp
JOIN users u ON cp.user_id = u.id
LEFT JOIN orders o ON cp.id = o.customer_id
LEFT JOIN order_line_items oli ON o.id = oli.order_id
GROUP BY cp.id, u.email, u.name;

-- Dashboard metrics view
CREATE OR REPLACE VIEW dashboard_metrics AS
SELECT 
  (SELECT COUNT(*) FROM orders WHERE status = 'awaiting-artwork') as awaiting_artwork,
  (SELECT COUNT(*) FROM orders WHERE status = 'proof-sent') as proof_sent,
  (SELECT COUNT(*) FROM orders WHERE status = 'in-production') as in_production,
  (SELECT COUNT(*) FROM orders WHERE status = 'ready-to-ship') as ready_to_ship,
  (SELECT COALESCE(SUM(subtotal), 0) FROM order_line_items WHERE created_at::date = CURRENT_DATE) as today_revenue,
  (SELECT COUNT(*) FROM proofs WHERE status = 'pending') as pending_proofs,
  (SELECT COUNT(*) FROM support_tickets WHERE status IN ('open', 'in-progress')) as open_tickets;

-- ============================================================================
-- 17. TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER customer_profiles_updated_at BEFORE UPDATE ON customer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER seo_meta_updated_at BEFORE UPDATE ON seo_meta
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 18. COMMENTS & DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE users IS 'Main user table for all user types (customers, admins, etc.)';
COMMENT ON TABLE orders IS 'Customer orders with production workflow status';
COMMENT ON TABLE proofs IS 'Design proofs sent to customers for approval';
COMMENT ON TABLE gallery IS 'Product gallery images managed from admin panel';
COMMENT ON TABLE products IS 'Products catalog with descriptions and pricing';
COMMENT ON TABLE discounts IS 'Promotion codes and discount rules';

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================

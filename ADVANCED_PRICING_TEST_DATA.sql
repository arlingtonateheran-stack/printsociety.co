-- ============================================================================
-- TEST DATA FOR ADVANCED PRICING ENGINE
-- ============================================================================

-- Insert a test user
INSERT INTO auth_users (email, role) VALUES
  ('admin@printsociety.co', 'admin'),
  ('customer@example.com', 'customer');

-- ============================================================================
-- Product 1: Die-Cut Vinyl Stickers (Simple size + quantity pricing)
-- ============================================================================

INSERT INTO products (name, slug, category, sku, description, status) VALUES (
  'Die-Cut Vinyl Stickers',
  'die-cut-vinyl-stickers',
  'Stickers',
  'DCV-001',
  'Custom die-cut vinyl stickers with vibrant colors and durable finish.',
  'active'
) RETURNING id as product_1_id;

-- Get the product ID (adjust this based on your insert)
-- For this example, we'll assume product 1 has ID: a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5g6h7

-- Price block for base material cost
INSERT INTO price_blocks (
  product_id,
  label,
  type,
  value,
  display_order
) VALUES (
  (SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1),
  'Base Material Cost',
  'matrix',
  '{
    "vinyl": {
      "1-100": 0.12,
      "101-500": 0.09,
      "501-1000": 0.06,
      "1001-5000": 0.04
    }
  }'::jsonb,
  1
);

-- Price block for setup fee
INSERT INTO price_blocks (
  product_id,
  label,
  type,
  value,
  display_order
) VALUES (
  (SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1),
  'Setup Fee',
  'fixed',
  35.00,
  2
);

-- Material options
INSERT INTO material_options (
  product_id,
  name,
  price_per_sq_in,
  display_order
) VALUES
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 'Standard Vinyl', 0.12, 1),
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 'Holographic Vinyl', 0.18, 2),
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 'Matte Vinyl', 0.14, 3);

-- Size options
INSERT INTO size_options (
  product_id,
  width,
  height,
  price_per_sq_in,
  display_order
) VALUES
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 2.00, 2.00, 0.12, 1),
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 3.00, 3.00, 0.11, 2),
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 4.00, 4.00, 0.10, 3),
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 5.00, 5.00, 0.09, 4);

-- Quantity tiers
INSERT INTO quantity_tiers (
  product_id,
  min_qty,
  max_qty,
  price_per_unit,
  display_order
) VALUES
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 1, 100, 0.20, 1),
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 101, 250, 0.14, 2),
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 251, 500, 0.10, 3),
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 501, 1000, 0.07, 4);

-- Finish options
INSERT INTO finish_options (
  product_id,
  name,
  description,
  display_order
) VALUES
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 'Matte Laminate', 'Reduces glare, professional look', 1),
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 'Gloss Laminate', 'Vibrant colors, glossy finish', 2);

-- Finish price blocks
INSERT INTO finish_price_blocks (
  finish_id,
  label,
  type,
  value
) VALUES (
  (SELECT id FROM finish_options WHERE name = 'Matte Laminate' AND product_id = (SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1) LIMIT 1),
  'Matte Laminate Cost',
  'matrix',
  '{
    "1-250": 0.02,
    "251-500": 0.015,
    "501-1000": 0.01
  }'::jsonb
);

INSERT INTO finish_price_blocks (
  finish_id,
  label,
  type,
  value
) VALUES (
  (SELECT id FROM finish_options WHERE name = 'Gloss Laminate' AND product_id = (SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1) LIMIT 1),
  'Gloss Laminate Cost',
  'matrix',
  '{
    "1-250": 0.025,
    "251-500": 0.018,
    "501-1000": 0.012
  }'::jsonb
);

-- Rush options
INSERT INTO rush_options (
  product_id,
  name,
  days_to_production,
  fixed_fee,
  display_order
) VALUES
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 'Standard (7-10 days)', 7, NULL, 1),
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 'Express (2-3 days)', 2, 25.00, 2),
  ((SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1), 'Next-Day', 1, 50.00, 3);

-- ============================================================================
-- Product 2: Sticker Sheets (Different pricing model)
-- ============================================================================

INSERT INTO products (name, slug, category, sku, description, status) VALUES (
  'Sticker Sheets',
  'sticker-sheets',
  'Sheets',
  'SS-001',
  'Full-bleed sticker sheets with custom designs.',
  'active'
);

INSERT INTO price_blocks (
  product_id,
  label,
  type,
  value,
  display_order
) VALUES (
  (SELECT id FROM products WHERE slug = 'sticker-sheets' LIMIT 1),
  'Base Material Cost',
  'matrix',
  '{
    "standard": {
      "1-100": 0.35,
      "101-500": 0.25,
      "501-1000": 0.18
    },
    "premium": {
      "1-100": 0.45,
      "101-500": 0.32,
      "501-1000": 0.24
    }
  }'::jsonb,
  1
);

INSERT INTO price_blocks (
  product_id,
  label,
  type,
  value,
  display_order
) VALUES (
  (SELECT id FROM products WHERE slug = 'sticker-sheets' LIMIT 1),
  'Design Fee',
  'fixed',
  50.00,
  2
);

-- Material options for sheets
INSERT INTO material_options (
  product_id,
  name,
  price_per_sq_in,
  display_order
) VALUES
  ((SELECT id FROM products WHERE slug = 'sticker-sheets' LIMIT 1), 'Standard Paper', 0.35, 1),
  ((SELECT id FROM products WHERE slug = 'sticker-sheets' LIMIT 1), 'Premium Coated', 0.45, 2);

-- Size options for sheets
INSERT INTO size_options (
  product_id,
  width,
  height,
  price_per_sq_in,
  display_order
) VALUES
  ((SELECT id FROM products WHERE slug = 'sticker-sheets' LIMIT 1), 8.50, 11.00, 0.35, 1),
  ((SELECT id FROM products WHERE slug = 'sticker-sheets' LIMIT 1), 11.00, 17.00, 0.32, 2);

-- ============================================================================
-- Gallery Test Data
-- ============================================================================

INSERT INTO gallery (title, description, image_url, cloudinary_public_id, display_order, type, active) VALUES
  ('Vinyl Stickers on Water Bottle', 'Beautiful die-cut stickers applied to a water bottle', 'https://res.cloudinary.com/dabgothkm/image/upload/v1234567890/sticker1.jpg', 'sticker1', 1, 'image', TRUE),
  ('Holographic Sticker Sheets', 'Premium holographic vinyl sticker sheets with vibrant colors', 'https://res.cloudinary.com/dabgothkm/image/upload/v1234567890/sticker2.jpg', 'sticker2', 2, 'image', TRUE),
  ('Production Demo Video', 'Watch our sticker production process', 'https://res.cloudinary.com/dabgothkm/video/upload/v1234567890/demo.mp4', 'demo_video', 3, 'video', TRUE),
  ('Custom Die-Cut Examples', 'Various custom die-cut designs from our customers', 'https://res.cloudinary.com/dabgothkm/image/upload/v1234567890/samples.jpg', 'samples', 4, 'image', TRUE);

-- ============================================================================
-- Sample Order
-- ============================================================================

INSERT INTO orders (customer_id, order_number, status, total_price, requires_proof) VALUES
  (
    (SELECT id FROM auth_users WHERE email = 'customer@example.com' LIMIT 1),
    'ORD-2024-001',
    'pending',
    150.00,
    TRUE
  );

-- ============================================================================
-- Sample Order Item
-- ============================================================================

INSERT INTO order_items (
  order_id,
  product_id,
  quantity,
  selected_options,
  price_calculation,
  unit_price,
  total_price
) VALUES (
  (SELECT id FROM orders WHERE order_number = 'ORD-2024-001' LIMIT 1),
  (SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers' LIMIT 1),
  250,
  '{
    "size": "3x3",
    "material": "Standard Vinyl",
    "finish": "Matte Laminate",
    "rush": "Standard"
  }'::jsonb,
  '{
    "material_cost": 2.475,
    "setup_fee": 35.00,
    "finish_cost": 3.75,
    "total": 41.225
  }'::jsonb,
  0.41,
  102.50
);

-- ============================================================================
-- TEST DATA FOR PRINT SOCIETY SUPABASE DATABASE
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor to populate test data
-- ============================================================================

-- ============================================================================
-- 1. TEST USERS
-- ============================================================================

INSERT INTO users (email, name, role, is_verified, is_active) VALUES
  ('admin@example.com', 'Admin User', 'admin', true, true),
  ('designer@example.com', 'Designer User', 'designer', true, true),
  ('shipping@example.com', 'Shipping Staff', 'shipping', true, true),
  ('support@example.com', 'Support Agent', 'support', true, true),
  ('customer1@example.com', 'John Smith', 'customer', true, true),
  ('customer2@example.com', 'Jane Doe', 'customer', true, true),
  ('customer3@example.com', 'Bob Johnson', 'customer', true, true);

-- ============================================================================
-- 2. TEST CUSTOMER PROFILES
-- ============================================================================

INSERT INTO customer_profiles (user_id, business_name, phone, lifetime_value, total_orders)
SELECT id, 'Smith Design Co.', '555-0001', 2500.00, 5
FROM users WHERE email = 'customer1@example.com'
UNION ALL
SELECT id, 'Doe Marketing', '555-0002', 1850.50, 3
FROM users WHERE email = 'customer2@example.com'
UNION ALL
SELECT id, NULL, '555-0003', 450.00, 1
FROM users WHERE email = 'customer3@example.com';

-- ============================================================================
-- 3. TEST PRODUCT CATEGORIES
-- ============================================================================

INSERT INTO product_categories (name, slug, description, display_on_homepage, homepage_position) VALUES
  ('Stickers', 'stickers', 'Custom vinyl and paper stickers', true, 1),
  ('Labels', 'labels', 'Product and shipping labels', true, 2),
  ('Banners', 'banners', 'Custom printed banners', false, NULL),
  ('Decals', 'decals', 'Vinyl decals and window graphics', true, 3);

-- ============================================================================
-- 4. TEST PRODUCTS
-- ============================================================================

INSERT INTO products (category_id, name, slug, description, sku, status, display_on_homepage, homepage_position) VALUES
  ((SELECT id FROM product_categories WHERE slug = 'stickers'), 'Die-Cut Vinyl Stickers', 'die-cut-vinyl-stickers', 'Custom die-cut vinyl stickers in any shape', 'STK-001', 'active', true, 1),
  ((SELECT id FROM product_categories WHERE slug = 'stickers'), 'Sticker Sheets', 'sticker-sheets', 'Full-color printed sticker sheets', 'STK-002', 'active', true, 2),
  ((SELECT id FROM product_categories WHERE slug = 'labels'), 'Shipping Labels', 'shipping-labels', 'Waterproof shipping labels', 'LBL-001', 'active', false, NULL),
  ((SELECT id FROM product_categories WHERE slug = 'banners'), 'Vinyl Banner', 'vinyl-banner', 'Large format vinyl banner printing', 'BAN-001', 'active', true, 3),
  ((SELECT id FROM product_categories WHERE slug = 'decals'), 'Window Decals', 'window-decals', 'Cut vinyl window decals', 'DEC-001', 'active', false, NULL);

-- ============================================================================
-- 5. TEST ADDRESSES
-- ============================================================================

INSERT INTO addresses (user_id, address_type, first_name, last_name, street, city, state_province, zip_postal_code, country, phone) VALUES
  ((SELECT id FROM users WHERE email = 'customer1@example.com'), 'shipping', 'John', 'Smith', '123 Main St', 'New York', 'NY', '10001', 'USA', '555-0001'),
  ((SELECT id FROM users WHERE email = 'customer1@example.com'), 'billing', 'John', 'Smith', '456 Oak Ave', 'New York', 'NY', '10002', 'USA', '555-0001'),
  ((SELECT id FROM users WHERE email = 'customer2@example.com'), 'shipping', 'Jane', 'Doe', '789 Pine Rd', 'Los Angeles', 'CA', '90001', 'USA', '555-0002'),
  ((SELECT id FROM users WHERE email = 'customer3@example.com'), 'shipping', 'Bob', 'Johnson', '321 Elm St', 'Chicago', 'IL', '60601', 'USA', '555-0003');

-- ============================================================================
-- 6. TEST GALLERY IMAGES
-- ============================================================================

INSERT INTO gallery (title, url, thumbnail_url, alt_text, sort_order, type, is_featured) VALUES
  ('Premium Vinyl Stickers', 'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=300&h=300&fit=crop', 'Colorful vinyl stickers on white background', 0, 'image', true),
  ('Custom Printed Labels', 'https://images.unsplash.com/photo-1599081876663-4d3e7dd1e4a8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1599081876663-4d3e7dd1e4a8?w=300&h=300&fit=crop', 'Product labels with branding', 1, 'image', true),
  ('Banner Printing Sample', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=300&fit=crop', 'Large format vinyl banner', 2, 'image', false),
  ('Die-Cut Custom Shapes', 'https://images.unsplash.com/photo-1611296437281-4b75f6741d45?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1611296437281-4b75f6741d45?w=300&h=300&fit=crop', 'Custom shaped die-cut stickers', 3, 'image', false);

-- ============================================================================
-- 7. TEST DISCOUNTS
-- ============================================================================

INSERT INTO discounts (code, name, discount_type, discount_value, is_active, starts_at, expires_at) VALUES
  ('WELCOME10', 'Welcome Discount', 'percentage', 10, true, NOW(), NOW() + INTERVAL '30 days'),
  ('BULK20', 'Bulk Order Discount', 'percentage', 20, true, NOW(), NOW() + INTERVAL '60 days'),
  ('SHIPPING50', 'Free Shipping Order', 'freeShipping', 0, true, NOW(), NOW() + INTERVAL '90 days'),
  ('VIP25', 'VIP Customer Discount', 'percentage', 25, false, NOW(), NOW() + INTERVAL '30 days');

-- ============================================================================
-- 8. TEST SHIPPING RULES
-- ============================================================================

INSERT INTO shipping_rules (name, zone, carrier, base_cost, quantity_multiplier, free_shipping_threshold, is_active) VALUES
  ('USPS Continental US', 'Continental US', 'usps', 5.99, 0.50, 50.00, true),
  ('USPS Hawaii/Alaska', 'Hawaii/Alaska', 'usps', 12.99, 1.00, 100.00, true),
  ('USPS International', 'International', 'usps', 25.00, 2.00, 200.00, true),
  ('UPS Ground', 'Continental US', 'ups', 8.99, 0.75, 75.00, true),
  ('UPS International', 'International', 'ups', 35.00, 2.50, 250.00, true);

-- ============================================================================
-- 9. TEST ORDERS
-- ============================================================================

INSERT INTO orders (order_number, customer_id, status, assigned_designer_id, shipping_address_id, internal_notes, customer_notes)
SELECT 
  'ORD-2025-001',
  (SELECT id FROM customer_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'customer1@example.com')),
  'awaiting-artwork',
  (SELECT id FROM users WHERE email = 'designer@example.com'),
  (SELECT id FROM addresses WHERE user_id = (SELECT id FROM users WHERE email = 'customer1@example.com') AND address_type = 'shipping'),
  'Customer is first time buyer. Mark as priority.',
  'Excited to see the design proofs!'
UNION ALL
SELECT 
  'ORD-2025-002',
  (SELECT id FROM customer_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'customer2@example.com')),
  'proof-sent',
  (SELECT id FROM users WHERE email = 'designer@example.com'),
  (SELECT id FROM addresses WHERE user_id = (SELECT id FROM users WHERE email = 'customer2@example.com') AND address_type = 'shipping'),
  'Waiting for customer approval.',
  'Looking good so far!'
UNION ALL
SELECT 
  'ORD-2025-003',
  (SELECT id FROM customer_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'customer3@example.com')),
  'in-production',
  (SELECT id FROM users WHERE email = 'designer@example.com'),
  (SELECT id FROM addresses WHERE user_id = (SELECT id FROM users WHERE email = 'customer3@example.com') AND address_type = 'shipping'),
  'Currently printing. Expected completion: 2 days.',
  'Thank you!'
UNION ALL
SELECT 
  'ORD-2025-004',
  (SELECT id FROM customer_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'customer1@example.com')),
  'ready-to-ship',
  (SELECT id FROM users WHERE email = 'designer@example.com'),
  (SELECT id FROM addresses WHERE user_id = (SELECT id FROM users WHERE email = 'customer1@example.com') AND address_type = 'shipping'),
  'Ready for shipping coordination.',
  NULL;

-- ============================================================================
-- 10. TEST ORDER LINE ITEMS
-- ============================================================================

INSERT INTO order_line_items (order_id, product_id, quantity, size, material, finish, unit_price, subtotal)
SELECT
  (SELECT id FROM orders WHERE order_number = 'ORD-2025-001'),
  (SELECT id FROM products WHERE slug = 'die-cut-vinyl-stickers'),
  500,
  '2x2"',
  'Vinyl',
  'Glossy',
  0.35,
  175.00
UNION ALL
SELECT
  (SELECT id FROM orders WHERE order_number = 'ORD-2025-002'),
  (SELECT id FROM products WHERE slug = 'sticker-sheets'),
  250,
  '8.5x11"',
  'Paper',
  'Matte',
  1.50,
  375.00
UNION ALL
SELECT
  (SELECT id FROM orders WHERE order_number = 'ORD-2025-003'),
  (SELECT id FROM products WHERE slug = 'shipping-labels'),
  1000,
  '4x6"',
  'Paper',
  'Glossy',
  0.10,
  100.00
UNION ALL
SELECT
  (SELECT id FROM orders WHERE order_number = 'ORD-2025-004'),
  (SELECT id FROM products WHERE slug = 'vinyl-banner'),
  1,
  '10x20ft',
  'Vinyl',
  'Matte',
  250.00,
  250.00;

-- ============================================================================
-- 11. TEST SUPPORT TICKETS
-- ============================================================================

INSERT INTO support_tickets (ticket_number, customer_id, subject, status, priority, assigned_to_id) VALUES
  ('TKT-2025-001', (SELECT id FROM customer_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'customer1@example.com')), 'Question about rush order', 'open', 'medium', (SELECT id FROM users WHERE email = 'support@example.com')),
  ('TKT-2025-002', (SELECT id FROM customer_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'customer2@example.com')), 'Shipping address update', 'resolved', 'low', (SELECT id FROM users WHERE email = 'support@example.com')),
  ('TKT-2025-003', (SELECT id FROM customer_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'customer3@example.com')), 'Damaged package received', 'in-progress', 'high', (SELECT id FROM users WHERE email = 'support@example.com'));

-- ============================================================================
-- TEST DATA COMPLETE
-- ============================================================================

-- Verify data was inserted
SELECT 'Users created' AS status, COUNT(*) AS count FROM users
UNION ALL
SELECT 'Customers created', COUNT(*) FROM customer_profiles
UNION ALL
SELECT 'Products created', COUNT(*) FROM products
UNION ALL
SELECT 'Orders created', COUNT(*) FROM orders
UNION ALL
SELECT 'Gallery images created', COUNT(*) FROM gallery
UNION ALL
SELECT 'Discounts created', COUNT(*) FROM discounts
UNION ALL
SELECT 'Support tickets created', COUNT(*) FROM support_tickets;

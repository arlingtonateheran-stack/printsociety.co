# Supabase Database Schema Guide for Print Society

## Overview

This document explains the complete SQL schema for your Print Society Supabase database. The schema covers all functionality including user management, products, orders, proofs, gallery management, shipping, and admin features.

**Database Type**: PostgreSQL (Supabase)  
**Total Tables**: 40+  
**Primary Use Cases**: E-commerce, Order Management, Proof Workflow, Admin Dashboard

---

## Setup Instructions

### Step 1: Access Supabase SQL Editor

1. Go to https://app.supabase.com
2. Select your project: `ynfcyfiavijqclxqayzr`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy & Paste SQL

1. Open the file `SUPABASE_SCHEMA.sql` (provided in your project root)
2. Copy all the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **Run** button

### Step 3: Verify Creation

All tables should be created without errors. You'll see output showing each table was created.

---

## Schema Sections Explained

### 1. **USERS & AUTHENTICATION** (6 tables)

#### `users`
Main user table for all account types.

**Key Fields:**
- `id` - UUID primary key
- `email` - Unique email address
- `role` - One of: `customer`, `admin`, `designer`, `shipping`, `support`
- `is_verified` - Email verification status
- `is_active` - Account active/inactive
- `created_at`, `updated_at` - Timestamps

**Purpose**: Core user account data for login and role-based access control

#### `auth_sessions`
Active login sessions (tokens).

**Key Fields:**
- `user_id` - Reference to user
- `token` - JWT-like session token
- `expires_at` - When session expires
- `ip_address`, `user_agent` - Device info for security
- `device_type` - Mobile, tablet, or desktop

**Purpose**: Track active sessions, allow logout, session management

#### `password_reset_tokens`
Tokens for password reset emails.

**Key Fields:**
- `token` - Unique reset token
- `expires_at` - Token expiration
- `used_at` - When token was used

**Purpose**: Secure password reset flow via email

#### `email_verification_tokens`
Tokens for email verification during signup.

**Purpose**: Verify new user emails before account activation

#### `login_attempts`
Records of login attempts (successful & failed).

**Purpose**: Rate limiting, security monitoring, brute-force detection

---

### 2. **CUSTOMER PROFILES & ADDRESSES** (3 tables)

#### `customer_profiles`
Extended profile data for customer accounts.

**Key Fields:**
- `user_id` - Reference to users table
- `business_name` - Optional business name
- `lifetime_value` - Total customer spending
- `total_orders` - Count of orders

**Purpose**: Customer-specific data, CRM tracking

#### `customer_tags`
Tags for organizing customers (VIP, wholesale, repeat, etc.).

**Example Tags:**
- `vip` - High-value customers
- `wholesale` - Bulk buyers
- `repeat` - Regular customers
- `new` - Recently joined
- `at-risk` - Haven't ordered recently

**Purpose**: Customer segmentation for marketing/support

#### `addresses`
Billing and shipping addresses.

**Key Fields:**
- `user_id` - Reference to user
- `address_type` - `billing` or `shipping`
- `is_default` - Mark as default address
- `first_name`, `last_name`, `street`, `city`, `state`, `zip_postal_code`, `country`

**Purpose**: Multiple addresses per customer, checkout simplification

---

### 3. **PRODUCTS & CATEGORIES** (5 tables)

#### `product_categories`
Product groupings and categories.

**Key Fields:**
- `name` - Category name
- `slug` - URL-friendly identifier
- `display_on_homepage` - Show on front page
- `homepage_position` - Order on homepage

**Purpose**: Organize products, improve navigation

#### `products`
Main products catalog.

**Key Fields:**
- `name`, `slug`, `description`, `long_description`
- `sku` - Unique stock-keeping unit
- `status` - `active`, `inactive`, or `discontinued`
- `display_on_homepage` - Featured on home
- `thumbnail_url` - Main product image

**Purpose**: Product listing, e-commerce catalog

#### `product_images`
Multiple images per product.

**Purpose**: Product photo gallery for customers

#### `product_options`
Customizable options (materials, sizes, colors, etc.).

**Key Fields:**
- `name` - Option name (e.g., "Material", "Size")
- `option_type` - `select`, `checkbox`, `dimension`, `text`, `color`
- `affects_price` - Whether this changes the price
- `required` - Customer must choose this

**Example Options:**
- Material: vinyl, paper, metal
- Size: 2x2", 3x3", 5x5"
- Color: red, blue, green
- Finish: matte, glossy

#### `option_values`
Individual values for each option.

**Key Fields:**
- `label` - Display name (e.g., "3M Vinyl")
- `value` - Internal value
- `price_adjustment` - Cost difference for this option

**Purpose**: Allow customers to customize products before ordering

---

### 4. **PRICING RULES** (1 table)

#### `pricing_rules`
Dynamic pricing based on quantity, materials, rush orders, etc.

**Key Fields:**
- `trigger` - What causes a price change:
  - `quantity` - Changes based on order quantity
  - `material` - Changes based on material selection
  - `finish` - Changes based on finish selection
  - `size` - Changes based on dimensions
  - `rush-fee` - Premium for expedited orders
  
- `calculation_type`:
  - `value` - Fixed price
  - `expression` - Formula (e.g., "sq_inches * 0.5")
  - `percentage` - % of another price

**Examples:**

```
Trigger: quantity
- 1-10 units: $0.50 each
- 11-50 units: $0.40 each
- 50+ units: $0.30 each

Trigger: material
- Vinyl: +$0.25 per unit
- Paper: +$0.10 per unit

Trigger: rush-fee
- 3-day rush: +$25
- 1-day rush: +$50
```

**Purpose**: Flexible pricing without storing base prices on products

---

### 5. **ORDERS & ORDER ITEMS** (3 tables)

#### `orders`
Customer orders.

**Key Fields:**
- `order_number` - Unique order ID visible to customers
- `customer_id` - Reference to customer
- `status` - Workflow status:
  - `awaiting-artwork` - Customer hasn't uploaded files
  - `proof-sent` - Designer sent proof for approval
  - `awaiting-approval` - Waiting for customer approval
  - `approved` - Ready for production
  - `in-production` - Being manufactured
  - `ready-to-ship` - Awaiting shipment
  - `shipped` - In transit
  - `delivered` - Arrived at customer
  - `cancelled` - Order cancelled

- `assigned_designer_id` - Designer working on order
- `assigned_shipper_id` - Shipping coordinator
- `shipping_address_id` - Where to send order
- `tracking_number` - For shipping notification

**Purpose**: Track orders through entire production workflow

#### `order_line_items`
Individual items within an order.

**Key Fields:**
- `product_id` - What product
- `quantity` - How many
- `size`, `material`, `finish` - Selected options
- `unit_price` - Cost per unit
- `subtotal` - Line item total
- `custom_specs` - JSON for any other specs

**Purpose**: Order can have multiple different products

#### `order_timeline`
Timeline of actions on each order.

**Key Fields:**
- `action` - What happened (e.g., "Proof sent", "Approved")
- `actor_id` - Who did it
- `actor_role` - Their role
- `details` - Extra info (JSON)

**Purpose**: Audit trail, history of order changes

---

### 6. **ARTWORK & PROOFS** (3 tables)

#### `artwork_files`
Files uploaded by customers for orders.

**Key Fields:**
- `order_id` - Which order
- `file_name` - Original filename
- `file_url` - Cloudinary URL
- `file_size` - In bytes
- `uploaded_by_id` - Who uploaded
- `status` - `uploaded`, `approved`, or `needs-revision`

**Purpose**: Store customer-provided design files

#### `proofs`
Design proofs sent to customers for approval.

**Key Fields:**
- `order_id` - Which order
- `artwork_file_id` - Based on which artwork
- `proof_version` - Version number (1, 2, 3...)
- `proof_file_url` - Proof image/PDF
- `message_to_customer` - Message with proof
- `sent_by_id` - Designer who sent it
- `status` - `pending`, `sent`, `approved`, `revision-requested`, `rejected`
- `sent_at`, `approved_at` - Timestamps

**Purpose**: Workflow for design approval before production

#### `proof_comments`
Comments on proofs from customers and designers.

**Key Fields:**
- `proof_id` - Which proof
- `author_id` - Who commented
- `author_role` - Customer, designer, or admin
- `comment_text` - The comment
- `attachment_url` - Any images attached
- `is_internal` - Visible only to admins

**Purpose**: Discussion about design changes needed

---

### 7. **GALLERY MANAGEMENT** (2 tables)

#### `gallery`
Product showcase gallery (your home page carousel).

**Key Fields:**
- `title` - Image title
- `url` - Full-size image URL (Cloudinary)
- `thumbnail_url` - Smaller version for thumbnails
- `alt_text` - For accessibility
- `sort_order` - Display order (0, 1, 2...)
- `type` - `image` or `video`
- `is_featured` - Highlight this image

**Purpose**: Images displayed on home page gallery

**Connected to Admin Panel:**
- `/admin/gallery` page lets you upload/manage these images
- Images come from Cloudinary
- URLs stored here

#### `media_assets`
General media storage (logos, icons, banners, etc.).

**Purpose**: Central media library for website assets

---

### 8. **DISCOUNTS & PROMOTIONS** (1 table)

#### `discounts`
Coupon codes and promotions.

**Key Fields:**
- `code` - Coupon code (e.g., "SAVE20")
- `discount_type` - `percentage`, `fixed`, or `freeShipping`
- `discount_value` - Amount or % off

**Rules:**
- `min_order_value` - Minimum order to use
- `applicable_categories` - Only works on certain categories
- `applicable_products` - Only works on specific products
- `applicable_customer_tags` - Only for tagged customers
- `first_time_customers_only` - New customers only
- `exclude_products` - Don't apply to these

**Usage Limits:**
- `usage_limit` - Max total uses (e.g., 100 uses)
- `usage_per_customer` - Max per person (e.g., 1 use per customer)

**Status:**
- `starts_at`, `expires_at` - Active date range
- `is_active` - Enable/disable

**Examples:**

```
Code: WELCOME10
Type: Percentage
Value: 10
First Time Only: Yes
Result: New customers get 10% off

Code: BULK50
Type: Fixed
Value: $50 off
Min Order: $500
Limit: 1 per customer
Result: Customers spending $500+ get $50 off (once)
```

**Purpose**: Marketing promotions, sales campaigns

---

### 9. **SHIPPING & LOGISTICS** (2 tables)

#### `shipping_rules`
Shipping costs for different regions/carriers.

**Key Fields:**
- `zone` - Region (e.g., "Continental US", "International")
- `carrier` - `usps`, `ups`, `fedex`, or `dhl`
- `base_cost` - Starting shipping cost
- `quantity_multiplier` - Extra cost per unit (optional)
- `free_shipping_threshold` - Free shipping over this amount

**Example:**
```
Zone: Continental US
Carrier: USPS
Base Cost: $5.00
Quantity Multiplier: $0.50
Free Shipping Over: $100

Result: 
- 1 unit: $5.00
- 5 units: $5.00 + (4 × $0.50) = $7.00
- Order over $100: FREE
```

**Purpose**: Calculate shipping costs at checkout

#### `shipping_labels`
Generated shipping labels for orders.

**Key Fields:**
- `order_id` - Which order
- `carrier` - Which carrier
- `label_url` - PDF of label
- `tracking_number` - For customer notification
- `weight`, `length`, `width`, `height` - Dimensions

**Purpose**: Track generated labels, provide tracking info

---

### 10. **SEO & CONTENT** (3 tables)

#### `seo_meta`
SEO metadata for products, categories, pages.

**Key Fields:**
- `entity_id` - Product/category ID
- `entity_type` - `product`, `category`, `article`, `collection`

**Meta Tags:**
- `title` - Page title (50-60 chars)
- `description` - Meta description (155-160 chars)
- `keywords` - Array of keywords
- `slug` - URL slug

**Social Media (Open Graph):**
- `og_image` - Image for sharing
- `og_title` - Title for sharing
- `og_description` - Description for sharing

**Advanced:**
- `canonical_url` - Prevent duplicate content issues
- `noindex`, `nofollow` - Robots directives
- `schema_markup` - JSON-LD for search engines

**Purpose**: Improve search engine rankings, social sharing

#### `seo_h2_blocks` & `seo_internal_links`
Helper tables for SEO metadata.

- H2 blocks: Headings in page content
- Internal links: Links to other pages on your site

**Purpose**: SEO structure and internal linking strategy

---

### 11. **SUPPORT TICKETS** (3 tables)

#### `support_tickets`
Customer support requests.

**Key Fields:**
- `ticket_number` - Public ticket ID
- `customer_id` - Who submitted
- `subject` - Issue summary
- `status` - `open`, `pending`, `in-progress`, `resolved`, `closed`
- `priority` - `low`, `medium`, `high`, `urgent`
- `assigned_to_id` - Support staff assigned
- `linked_order_id` - Related order (if any)

**Purpose**: Track customer support requests

#### `ticket_messages`
Messages in support tickets.

**Key Fields:**
- `ticket_id` - Which ticket
- `author_id` - Who wrote it
- `author_role` - `customer`, `support`, or `admin`
- `message` - The message text
- `attachment_urls` - Images/files attached
- `is_internal` - Only visible to staff

**Purpose**: Conversation thread for support ticket

#### `ticket_internal_notes`
Internal notes for support team.

**Purpose**: Staff notes about how to resolve

---

### 12. **INVENTORY & STOCK** (2 tables)

#### `material_stock`
Tracking materials and supplies inventory.

**Key Fields:**
- `material_name` - e.g., "3M Vinyl Sticker Roll"
- `quantity` - How much in stock
- `unit` - `rolls`, `sheets`, `kg`, `meters`
- `minimum_threshold` - Alert when below this
- `supplier` - Where to reorder from
- `cost_per_unit` - Cost tracking

**Purpose:** Track physical inventory levels

#### `stock_movements`
Log of inventory changes.

**Key Fields:**
- `movement_type` - `inbound` (received), `outbound` (used), `adjustment` (correction)
- `quantity` - Amount changed
- `reference` - What order or PO
- `recorded_by_id` - Who recorded it

**Purpose**: Inventory audit trail

---

### 13. **ADMIN ACTIVITY LOGS** (1 table)

#### `admin_activity_logs`
Audit trail of admin actions.

**Key Fields:**
- `admin_id` - Which admin
- `action` - What they did
- `entity_type` - What type of thing
- `entity_id` - Which specific thing
- `changes` - JSON of what changed
- `ip_address` - Where from

**Purpose**: Security, compliance, accountability

---

### 14. **IMPORT/EXPORT JOBS** (2 tables)

#### `import_jobs` & `export_jobs`
Track bulk data imports and exports.

**Purpose**: Manage CSV uploads and data exports

---

## Key Relationships (Foreign Keys)

```
users
├─ (1) ─→ customer_profiles
├─ (1) ─→ auth_sessions
├─ (1) ─→ password_reset_tokens
└─ (1) ─→ email_verification_tokens

customer_profiles
├─ (1) ─→ customer_tags
└─ (many) ─→ orders

orders
├─ (1) ─→ customer_profiles
├─ (1) ─→ assigned_designer (users)
├─ (1) ─→ shipping_address
├─ (many) ─→ order_line_items
├─ (many) ─→ artwork_files
├─ (many) ─→ proofs
└─ (many) ─→ order_timeline

products
├─ (1) ─→ product_categories
├─ (many) ─→ product_images
├─ (many) ─→ product_options
└─ (many) ─→ pricing_rules

product_options
└─ (many) ─→ option_values

proofs
├─ (1) ─→ orders
├─ (1) ─→ artwork_files
└─ (many) ─→ proof_comments
```

---

## Row Level Security (RLS)

The schema includes basic RLS policies:

```sql
-- Users can only read their own data
SELECT * FROM users 
  -- Only works if user_id matches your auth.uid()

-- Customers can only read their own orders
SELECT * FROM orders
  -- Only works if you own the customer_id

-- Gallery is public (anyone can read)
SELECT * FROM gallery
  -- Works for everyone
```

---

## Views for Analytics

The schema includes pre-built views:

### `order_summary_view`
Quick order overview with customer info and totals.

### `customer_ltv_view`
Customer lifetime value and order history.

### `dashboard_metrics`
Quick stats for admin dashboard.

**Example Query:**
```sql
SELECT * FROM dashboard_metrics;
-- Returns: awaiting_artwork count, proof_sent count, etc.
```

---

## Automatic Timestamps

All main tables have `updated_at` that automatically update on any change via triggers:

```sql
-- These update automatically
users.updated_at
products.updated_at
orders.updated_at
customer_profiles.updated_at
seo_meta.updated_at
```

---

## Using the Schema in Your App

### From React Components

**Example: Load gallery images**
```typescript
const { data, error } = await supabase
  .from('gallery')
  .select('*')
  .order('sort_order', { ascending: true });
```

**Example: Create an order**
```typescript
const { data, error } = await supabase
  .from('orders')
  .insert({
    order_number: 'ORD-2025-001',
    customer_id: customerId,
    status: 'awaiting-artwork'
  });
```

**Example: Update product**
```typescript
const { error } = await supabase
  .from('products')
  .update({ name: 'New Name' })
  .eq('id', productId);
```

### Real-time Subscriptions

```typescript
supabase
  .from('orders')
  .on('*', payload => {
    console.log('Order changed:', payload);
  })
  .subscribe();
```

---

## Performance Optimization

The schema includes indexes on commonly queried fields:

- User email and role
- Order customer ID and status
- Product slug
- Gallery sort order

These are automatically created and speed up queries.

---

## Backup & Disaster Recovery

Supabase automatically backs up your database. You can:

1. Access backups in Project Settings → Backups
2. Export data via the SQL Editor or API
3. Restore from backups if needed

---

## Next Steps

1. ✅ Run the SQL schema in Supabase
2. Add test data:
   ```sql
   INSERT INTO users (email, name, role, is_verified)
   VALUES ('test@example.com', 'Test User', 'customer', true);
   ```
3. Update your app's Supabase queries to use these tables
4. Set up RLS policies for production security
5. Configure backups and monitoring

---

## Troubleshooting

**Error: Extension "uuid-ossp" does not exist**
- This should not happen on Supabase (included by default)
- If it does, the extension is automatically created

**Error: Foreign key constraint**
- Make sure parent records exist before inserting child records
- E.g., create product before creating product images

**RLS preventing queries**
- Check your RLS policies
- Ensure user is authenticated
- Verify the policy conditions match your query

---

## Support

For questions about this schema:
1. Check Supabase documentation: https://supabase.com/docs
2. Review the table comments in SQL file
3. Check the relationship diagram above

---

**Schema Version**: 1.0  
**Last Updated**: January 2025  
**Compatibility**: Supabase (PostgreSQL 14+)

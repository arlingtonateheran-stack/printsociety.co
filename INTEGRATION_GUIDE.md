# Complete Supabase Integration Guide

## Overview

This guide walks you through integrating your React app with the Supabase database you just created.

---

## ✅ Step 1: Add Test Data to Your Database

### Option A: Use the SQL File (Recommended)

1. Go to **https://app.supabase.com**
2. Select your project: **ynfcyfiavijqclxqayzr**
3. Click **SQL Editor** → **New Query**
4. Open the `TEST_DATA.sql` file from your project root
5. Copy **ALL** of the SQL code
6. Paste into Supabase SQL Editor
7. Click **Run**

**What this does:**
- Creates 7 test users (admin, designer, shipping, support, 3 customers)
- Creates 4 product categories
- Creates 5 sample products
- Creates customer profiles and addresses
- Creates 4 gallery images (already visible on home page!)
- Creates 4 discount codes
- Creates 5 shipping rules
- Creates 4 sample orders
- Creates 3 support tickets

### Verify the Data

Run this query in SQL Editor:
```sql
SELECT 'Users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Gallery', COUNT(*) FROM gallery;
```

---

## ✅ Step 2: Files Created for You

### Client Files (React)

**`client/lib/supabase.ts`** - Main Supabase client with CRUD functions
- `getGalleryImages()` - Fetch gallery
- `getProducts()` - Fetch products
- `getOrders()` - Fetch orders
- `getCustomers()` - Fetch customers
- `getDiscountByCode()` - Fetch discount

**`client/components/ImageUploadWidget.tsx`** - Already connected to Cloudinary ✅

### Server Files (Express)

**`server/supabase.ts`** - Server-side Supabase client

**`server/routes/products.ts`** - Product API endpoints
- `GET /api/products` - List products
- `GET /api/products/:id` - Get single product

**`server/routes/orders.ts`** - Order API endpoints
- `GET /api/orders` - List orders
- `GET /api/orders/metrics` - Dashboard metrics

**`server/routes/customers.ts`** - Customer API endpoints
- `GET /api/customers` - List customers
- `GET /api/customers/:id` - Get customer
- `GET /api/customers/:id/orders` - Get customer orders

### Data Files

**`TEST_DATA.sql`** - Test data (209 lines)
**`SUPABASE_SCHEMA.sql`** - Your database schema (774 lines)

---

## ✅ Step 3: Update Server Routes

You need to register these new routes in your **`server/index.ts`**

Find this section in `server/index.ts`:
```typescript
// Add these routes
```

Add these routes:

```typescript
import { getProducts, getProductById } from './routes/products';
import { getOrders, getOrderMetrics, updateOrderStatus } from './routes/orders';
import { getCustomers, getCustomerById, getCustomerOrders } from './routes/customers';

// In your app.get/app.post handlers:

// Product routes
app.get('/api/products', getProducts);
app.get('/api/products/:id', getProductById);

// Order routes
app.get('/api/orders', getOrders);
app.get('/api/orders/metrics', getOrderMetrics);
app.post('/api/orders/:id/status', updateOrderStatus);

// Customer routes
app.get('/api/customers', getCustomers);
app.get('/api/customers/:id', getCustomerById);
app.get('/api/customers/:id/orders', getCustomerOrders);
```

---

## ✅ Step 4: Update Admin Dashboard

The admin dashboard should now fetch from Supabase instead of using hardcoded data.

### Update AdminDashboard.tsx

Replace the hardcoded metrics with this:

```typescript
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    fetchOrders();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/orders/metrics');
      const data = await response.json();
      setMetrics(data.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  // Now use metrics and orders data instead of hardcoded values
  return (
    // Your dashboard JSX
  );
}
```

---

## ✅ Step 5: Gallery is Already Connected ✅

Your gallery is **already connected** to Supabase!

The `ProductGallerySection.tsx` component already:
- Fetches images from the `gallery` table
- Displays them in the home page carousel
- Updates when you add/remove images in admin panel

Test it:
1. Go to **`/admin/gallery`**
2. The gallery images from test data should appear
3. Upload a new image using the "Upload Image" button
4. Watch it appear on the home page gallery in real-time

---

## ✅ Step 6: Update Admin Pages to Show Real Data

### AdminProducts.tsx

Replace the `sampleProducts` array with database call:

```typescript
import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/supabase';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(200);
        setProducts(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    // Your JSX using products state instead of sampleProducts
  );
}
```

### AdminOrders.tsx

Similar pattern - fetch orders from API:

```typescript
import { useEffect, useState } from 'react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/orders');
      const { data } = await response.json();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  // Use orders state instead of hardcoded data
}
```

---

## ✅ Step 7: Verify Everything Works

### Test the Gallery
1. Go to home page → scroll to gallery
2. Should see 4 test images
3. Upload a new image in `/admin/gallery`
4. Refresh home page → new image appears

### Test the Products
1. Go to `/admin/products`
2. Should see 5 test products
3. Click Edit to modify products

### Test the Orders
1. Go to `/admin/orders`
2. Should see 4 test orders
3. Click to view order details

---

## 📚 Available Supabase Functions

In `client/lib/supabase.ts`, you have these functions:

### Gallery
- `getGalleryImages()` - Get all gallery images
- `createGalleryImage(image)` - Add new image
- `updateGalleryImage(id, updates)` - Update image
- `deleteGalleryImage(id)` - Delete image

### Products
- `getProducts(limit)` - Get all active products
- `getProductById(id)` - Get single product
- `createProduct(product)` - Create new product
- `updateProduct(id, updates)` - Update product
- `deleteProduct(id)` - Delete product

### Orders
- `getOrders(limit)` - Get all orders
- `getOrdersByStatus(status)` - Filter by status
- `getOrderById(id)` - Get single order
- `updateOrderStatus(id, status)` - Change status

### Customers
- `getCustomers(limit)` - Get all customers
- `getCustomerById(id)` - Get single customer

### Discounts
- `getActiveDiscounts()` - Get active coupons
- `getDiscountByCode(code)` - Check coupon validity

---

## 🛠️ Usage Examples

### Fetch and Display Products

```typescript
import { getProducts } from '@/lib/supabase';

const products = await getProducts(50);
console.log(products); // Array of products
```

### Fetch Orders by Status

```typescript
import { getOrdersByStatus } from '@/lib/supabase';

const inProgress = await getOrdersByStatus('in-production');
console.log(inProgress); // Orders in production
```

### Check Discount Code

```typescript
import { getDiscountByCode } from '@/lib/supabase';

try {
  const discount = await getDiscountByCode('WELCOME10');
  console.log(discount.discount_value); // 10
} catch (error) {
  console.log('Invalid code');
}
```

---

## 🐛 Troubleshooting

### "Cannot find module '@/lib/supabase'"
Make sure the file exists at `client/lib/supabase.ts`

### "No data appearing in admin panels"
1. Check that test data was inserted (run verification query)
2. Check browser console for errors
3. Verify Supabase URL and key are correct in `client/lib/supabase.ts`

### "Uploads not working"
Make sure:
1. Cloudinary preset is set to unsigned uploads
2. Images uploaded to correct folder
3. URL is being saved to gallery table

### Gallery images not showing on home page
1. Check `/admin/gallery` - should show uploaded images
2. Refresh browser (hard refresh: Ctrl+Shift+R)
3. Check browser console for errors

---

## 📋 Database Tables Reference

You now have these tables set up:

**Core:**
- `users` - All users (customers, admins, staff)
- `auth_sessions` - Login sessions
- `customer_profiles` - Customer extra data
- `addresses` - Billing/shipping addresses

**Products:**
- `products` - Product catalog
- `product_categories` - Product groupings
- `product_options` - Material, size, color options
- `option_values` - Values for options

**Orders:**
- `orders` - Customer orders
- `order_line_items` - Items in orders
- `order_timeline` - Order status history

**Content:**
- `gallery` - Home page gallery images
- `media_assets` - All uploaded files
- `seo_meta` - SEO metadata

**Business:**
- `discounts` - Coupon codes
- `shipping_rules` - Shipping costs
- `support_tickets` - Customer tickets
- `admin_activity_logs` - Admin actions

---

## ✨ Next Steps

1. **Run Test Data SQL** in Supabase (TestData.sql)
2. **Update server/index.ts** with new routes
3. **Update AdminDashboard.tsx** to use `/api/orders/metrics`
4. **Update AdminOrders.tsx** to use `/api/orders`
5. **Test the gallery** - upload an image
6. **Verify** everything works in the admin panel

---

## Need Help?

**The gallery is already working!** It auto-syncs with Supabase.

For other features, follow the pattern:
1. Create fetch function in `client/lib/supabase.ts`
2. Create API route in `server/routes/`
3. Register route in `server/index.ts`
4. Call from React component with `useEffect` + `useState`

---

**Setup Complete! 🎉**

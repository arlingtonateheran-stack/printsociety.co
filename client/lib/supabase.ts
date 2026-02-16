import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ynfcyfiavijqclxqayzr.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fD6rh3Ffi5x7hqk6XOsX5w_8B_uZx6a';

export const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// TYPES
// ============================================================================

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  thumbnail_url: string;
  alt_text: string;
  sort_order: number;
  type: 'image' | 'video';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  thumbnail_url: string | null;
  sku: string | null;
  status: 'active' | 'inactive' | 'discontinued';
  display_on_homepage: boolean;
  homepage_position: number | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: 'customer' | 'admin' | 'designer' | 'shipping' | 'support';
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: 'awaiting-artwork' | 'proof-sent' | 'awaiting-approval' | 'approved' | 'in-production' | 'ready-to-ship' | 'shipped' | 'delivered' | 'cancelled';
  assigned_designer_id: string | null;
  assigned_shipper_id: string | null;
  shipping_address_id: string | null;
  shipping_method: string | null;
  tracking_number: string | null;
  internal_notes: string | null;
  customer_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  id: string;
  user_id: string;
  business_name: string | null;
  phone: string | null;
  lifetime_value: number;
  total_orders: number;
  created_at: string;
  updated_at: string;
}

export interface Discount {
  id: string;
  code: string;
  name: string;
  discount_type: 'percentage' | 'fixed' | 'freeShipping';
  discount_value: number;
  is_active: boolean;
  starts_at: string;
  expires_at: string;
  created_at: string;
}

// ============================================================================
// STORAGE OPERATIONS
// ============================================================================

const DESIGN_BUCKET = 'customer-designs';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function uploadDesignFile(file: File): Promise<{ path: string; url: string }> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds 50MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 9);
  const ext = file.name.split('.').pop();
  const fileName = `${timestamp}-${randomId}.${ext}`;

  // Upload to storage
  const { data, error } = await supabase.storage
    .from(DESIGN_BUCKET)
    .upload(`uploads/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // Get public URL
  const { data: publicData } = supabase.storage
    .from(DESIGN_BUCKET)
    .getPublicUrl(`uploads/${fileName}`);

  return {
    path: data.path,
    url: publicData.publicUrl
  };
}

export async function deleteDesignFile(filePath: string) {
  const { error } = await supabase.storage
    .from(DESIGN_BUCKET)
    .remove([filePath]);

  if (error) throw error;
}

// ============================================================================
// GALLERY OPERATIONS
// ============================================================================

export async function getGalleryImages() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data as GalleryImage[];
}

export async function createGalleryImage(image: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('gallery')
    .insert([image])
    .select();

  if (error) throw error;
  return data?.[0] as GalleryImage;
}

export async function updateGalleryImage(id: string, updates: Partial<GalleryImage>) {
  const { data, error } = await supabase
    .from('gallery')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data?.[0] as GalleryImage;
}

export async function deleteGalleryImage(id: string) {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================================================
// PRODUCT OPERATIONS
// ============================================================================

export async function getProducts(limit: number = 100) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .limit(limit);

  if (error) throw error;
  return data as Product[];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();

  if (error) throw error;
  return data?.[0] as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data?.[0] as Product;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================================================
// ORDER OPERATIONS
// ============================================================================

export async function getOrders(limit: number = 50) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Order[];
}

export async function getOrdersByStatus(status: Order['status']) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Order[];
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Order;
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data?.[0] as Order;
}

export interface OrderData {
  customerEmail: string;
  customerName: string;
  productId: string;
  productName: string;
  quantity: number;
  selectedSize: string;
  selectedFinish: string;
  selectedBorderCut: string;
  designFilePath?: string;
  designFileUrl?: string;
  designFileName?: string;
  pricePerUnit: number;
  setupFee: number;
  subtotal: number;
  total: number;
  customerNotes?: string;
}

export async function createOrder(orderData: OrderData) {
  // Generate order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        order_number: orderNumber,
        customer_email: orderData.customerEmail,
        customer_name: orderData.customerName,
        product_id: orderData.productId,
        product_name: orderData.productName,
        quantity: orderData.quantity,
        selected_size: orderData.selectedSize,
        selected_finish: orderData.selectedFinish,
        selected_border_cut: orderData.selectedBorderCut,
        design_file_path: orderData.designFilePath,
        design_file_url: orderData.designFileUrl,
        design_file_name: orderData.designFileName,
        price_per_unit: orderData.pricePerUnit,
        setup_fee: orderData.setupFee,
        subtotal: orderData.subtotal,
        total: orderData.total,
        customer_notes: orderData.customerNotes
      }
    ])
    .select();

  if (error) throw error;
  return data?.[0];
}

// ============================================================================
// CUSTOMER OPERATIONS
// ============================================================================

export async function getCustomers(limit: number = 100) {
  const { data, error } = await supabase
    .from('customer_profiles')
    .select('*, user:users(*)')
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getCustomerById(id: string) {
  const { data, error } = await supabase
    .from('customer_profiles')
    .select('*, user:users(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// DISCOUNT OPERATIONS
// ============================================================================

export async function getActiveDiscounts() {
  const { data, error } = await supabase
    .from('discounts')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Discount[];
}

export async function getDiscountByCode(code: string) {
  const { data, error } = await supabase
    .from('discounts')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();

  if (error) throw error;
  return data as Discount;
}

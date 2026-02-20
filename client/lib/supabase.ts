import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ynfcyfiavijqclxqayzr.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fD6rh3Ffi5x7hqk6XOsX5w_8B_uZx6a';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Extracts a human-readable error message from various error object formats
 */
export function extractErrorMessage(error: any, defaultMessage: string = "An unknown error occurred"): string {
  if (!error) return defaultMessage;

  if (typeof error === 'string') return error;

  if (error && typeof error === 'object') {
    // Handle Supabase error object
    const message = error.message || error.details || error.hint;
    if (message && message !== "[object Object]" && message !== "{}") {
      return message;
    }

    // Handle other object formats or stringification
    try {
      const stringified = JSON.stringify(error);
      if (stringified !== "{}" && stringified !== "[object Object]") {
        return stringified;
      }
    } catch (e) {
      // Fall through to default
    }
  }

  return defaultMessage;
}

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

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author_name: string | null;
  category: string | null;
  image_url: string | null;
  status: 'draft' | 'published';
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface PressItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: string | null;
  category: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface HelpCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface HelpArticle {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  author: string | null;
  views: number;
  helpful_yes: number;
  helpful_no: number;
  tags: string[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  category_id: string | null;
  question: string;
  answer: string;
  sort_order: number;
  views: number;
  helpful_yes: number;
  helpful_no: number;
  created_at: string;
  updated_at: string;
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

// ============================================================================
// BLOG OPERATIONS
// ============================================================================

export async function getBlogPosts(publishedOnly: boolean = true) {
  let query = supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
  if (publishedOnly) {
    query = query.eq('status', 'published');
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as BlogPost[];
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data as BlogPost;
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select();
  if (error) throw error;
  return data?.[0] as BlogPost;
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0] as BlogPost;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================================================
// PRESS OPERATIONS
// ============================================================================

export async function getPressItems() {
  const { data, error } = await supabase
    .from('press_items')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data as PressItem[];
}

export async function createPressItem(item: Omit<PressItem, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('press_items')
    .insert([item])
    .select();
  if (error) throw error;
  return data?.[0] as PressItem;
}

export async function updatePressItem(id: string, updates: Partial<PressItem>) {
  const { data, error } = await supabase
    .from('press_items')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0] as PressItem;
}

export async function deletePressItem(id: string) {
  const { error } = await supabase
    .from('press_items')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================================================
// HELP OPERATIONS
// ============================================================================

export async function getHelpCategories() {
  const { data, error } = await supabase
    .from('help_categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data as HelpCategory[];
}

export async function createHelpCategory(category: Omit<HelpCategory, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('help_categories')
    .insert([category])
    .select();
  if (error) throw error;
  return data?.[0] as HelpCategory;
}

export async function updateHelpCategory(id: string, updates: Partial<HelpCategory>) {
  const { data, error } = await supabase
    .from('help_categories')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0] as HelpCategory;
}

export async function deleteHelpCategory(id: string) {
  const { error } = await supabase
    .from('help_categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getHelpArticles(publishedOnly: boolean = true) {
  let query = supabase.from('help_articles').select('*, category:help_categories(*)').order('created_at', { ascending: false });
  if (publishedOnly) {
    query = query.eq('status', 'published');
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as (HelpArticle & { category: HelpCategory })[];
}

export async function getHelpArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('help_articles')
    .select('*, category:help_categories(*)')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data as (HelpArticle & { category: HelpCategory });
}

export async function createHelpArticle(article: Omit<HelpArticle, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('help_articles')
    .insert([article])
    .select();
  if (error) throw error;
  return data?.[0] as HelpArticle;
}

export async function updateHelpArticle(id: string, updates: Partial<HelpArticle>) {
  const { data, error } = await supabase
    .from('help_articles')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0] as HelpArticle;
}

export async function deleteHelpArticle(id: string) {
  const { error } = await supabase
    .from('help_articles')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getFAQs() {
  const { data, error } = await supabase
    .from('help_faqs')
    .select('*, category:help_categories(*)')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data as (FAQ & { category: HelpCategory })[];
}

export async function createFAQ(faq: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('help_faqs')
    .insert([faq])
    .select();
  if (error) throw error;
  return data?.[0] as FAQ;
}

export async function updateFAQ(id: string, updates: Partial<FAQ>) {
  const { data, error } = await supabase
    .from('help_faqs')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0] as FAQ;
}

export async function deleteFAQ(id: string) {
  const { error } = await supabase
    .from('help_faqs')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

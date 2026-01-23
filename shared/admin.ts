// Admin Work Area - Comprehensive Type Definitions

// ============================================================================
// 1. ADMIN ROLES & PERMISSIONS
// ============================================================================

export type AdminPermission =
  | 'manage_orders'
  | 'manage_proofs'
  | 'manage_products'
  | 'manage_pricing'
  | 'manage_shipping'
  | 'manage_customers'
  | 'manage_discounts'
  | 'manage_seo'
  | 'manage_staff'
  | 'view_analytics'
  | 'export_data'
  | 'manage_tickets';

export interface AdminRole {
  id: string;
  name: 'owner' | 'designer' | 'shipping' | 'support' | 'custom';
  label: string;
  description: string;
  permissions: AdminPermission[];
  createdAt: Date;
}

export const DEFAULT_ADMIN_ROLES: AdminRole[] = [
  {
    id: 'role-owner',
    name: 'owner',
    label: 'Owner',
    description: 'Full access to all features',
    permissions: [
      'manage_orders',
      'manage_proofs',
      'manage_products',
      'manage_pricing',
      'manage_shipping',
      'manage_customers',
      'manage_discounts',
      'manage_seo',
      'manage_staff',
      'view_analytics',
      'export_data',
      'manage_tickets',
    ],
    createdAt: new Date(),
  },
  {
    id: 'role-designer',
    name: 'designer',
    label: 'Designer',
    description: 'Can send proofs and manage artwork approval',
    permissions: ['manage_proofs', 'manage_orders', 'view_analytics'],
    createdAt: new Date(),
  },
  {
    id: 'role-shipping',
    name: 'shipping',
    label: 'Shipping',
    description: 'Can generate labels and track shipments',
    permissions: ['manage_shipping', 'view_analytics', 'export_data'],
    createdAt: new Date(),
  },
  {
    id: 'role-support',
    name: 'support',
    label: 'Support',
    description: 'Can manage support tickets and customer issues',
    permissions: ['manage_tickets', 'view_analytics', 'manage_orders'],
    createdAt: new Date(),
  },
];

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

// ============================================================================
// 2. ORDER PRODUCTION WORKFLOW
// ============================================================================

export type OrderStatus =
  | 'awaiting-artwork'
  | 'proof-sent'
  | 'awaiting-approval'
  | 'approved'
  | 'in-production'
  | 'ready-to-ship'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type ProofStatus = 'pending' | 'sent' | 'approved' | 'revision-requested' | 'rejected';

export interface AdminOrderView {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  
  // Artwork & Proofs
  artworkFiles: ArtworkFile[];
  proofs: ProofSnapshot[];
  
  // Production Details
  assignedDesignerId?: string;
  assignedShipperId?: string;
  lineItems: OrderLineItem[];
  
  // Shipping
  shippingMethod: string;
  shippingAddress: ShippingAddressInfo;
  trackingNumber?: string;
  trackingUrl?: string;
  
  // Timeline
  timeline: OrderTimelineEvent[];
  
  // Notes
  internalNotes: string;
  customerNotes: string;
}

export interface ArtworkFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: Date;
  uploadedBy: string;
  status: 'uploaded' | 'approved' | 'needs-revision';
  comments?: string;
}

export interface ProofSnapshot {
  id: string;
  proofVersion: number;
  artworkId: string;
  proofFileUrl: string;
  messageToCustomer: string;
  sentAt: Date;
  sentBy: string;
  status: ProofStatus;
  approvedAt?: Date;
  revisionComments?: string;
}

export interface OrderLineItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  size: string;
  material: string;
  finish: string;
  unitPrice: number;
  subtotal: number;
  specs: Record<string, string>; // Custom specs as key-value
}

export interface ShippingAddressInfo {
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface OrderTimelineEvent {
  id: string;
  timestamp: Date;
  action: string;
  actor: string;
  actorRole: string;
  details?: Record<string, any>;
}

// ============================================================================
// 3. MODULAR PRICING ENGINE (NO BASE PRICE)
// ============================================================================

export type PricingTrigger = 'quantity' | 'material' | 'finish' | 'size' | 'rush-fee';
export type PricingLogic = 'tiered' | 'formula' | 'flat';

export interface PricingRule {
  id: string;
  productId: string;
  trigger: PricingTrigger;
  logic: PricingLogic;
  
  // For 'quantity' trigger
  quantityMin?: number;
  quantityMax?: number;
  
  // For 'material' or 'finish' trigger
  optionId?: string;
  
  // For 'size' trigger
  sizeMin?: number;
  sizeMax?: number;
  
  // For 'rush-fee' trigger
  rushDays?: number;
  
  // Price calculation
  // For formula: uses expression like "sq_inches * material_cost * quantity_multiplier"
  // For tiered/flat: uses fixed value
  calculation: {
    type: 'value' | 'expression' | 'percentage';
    value?: number;
    expression?: string; // e.g., "0.5 * sq_inches * 1.2"
    percentageOf?: 'subtotal' | 'material-cost';
  };
  
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingCalculationInput {
  productId: string;
  quantity: number;
  materialId: string;
  finishId: string;
  sizeId: string;
  isRush: boolean;
  rushDays?: number;
}

export interface PricingCalculationOutput {
  basePrice: number; // From first matching rule
  materialCost: number;
  finishAdj: number;
  rushFee: number;
  subtotal: number;
  breakdown: Record<string, number>;
}

// ============================================================================
// 4. SHIPPING STATION & BATCH MANAGEMENT
// ============================================================================

export type ShippingCarrier = 'usps' | 'ups' | 'fedex' | 'dhl';

export interface ShippingLabel {
  id: string;
  orderId: string;
  carrier: ShippingCarrier;
  labelUrl: string;
  trackingNumber: string;
  weight: number; // in lbs
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  generatedAt: Date;
}

export interface ShippingBatch {
  id: string;
  batchNumber: string;
  createdAt: Date;
  orders: AdminOrderView[];
  carrier: ShippingCarrier;
  labels: ShippingLabel[];
  trackingNumbers: string[];
  notifiedCustomers: boolean;
}

export interface ShippingRule {
  id: string;
  name: string;
  zone: string; // e.g., "Continental US", "International"
  carrier: ShippingCarrier;
  baseCost: number;
  quantityMultiplier?: number;
  freeShippingThreshold?: number;
  isActive: boolean;
}

// ============================================================================
// 5. PRODUCT & PRICING CONFIGURATION
// ============================================================================

export type OptionType = 'select' | 'checkbox' | 'dimension' | 'text' | 'color';

export interface ProductOption {
  id: string;
  productId: string;
  name: string;
  type: OptionType;
  description?: string;
  affectsPrice: boolean;
  required: boolean;
  options?: OptionValue[];
  createdAt: Date;
}

export interface OptionValue {
  id: string;
  label: string;
  value: string;
  priceAdjustment?: number;
}

export interface ProductGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  products: string[]; // product IDs
  discountLogic: {
    type: 'percentage' | 'fixed' | 'tiered';
    value?: number;
    tiers?: { minItems: number; discount: number }[];
  };
  displayOnHomepage: boolean;
  homepagePosition?: number;
}

// ============================================================================
// 6. SEO & CONTENT MANAGEMENT
// ============================================================================

export interface SeoMeta {
  id: string;
  entityId: string; // product ID, category ID, etc.
  entityType: 'product' | 'category' | 'article' | 'collection';
  
  title: string;
  description: string;
  keywords: string[];
  slug: string;
  
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  
  schemaMarkup: {
    type: string; // "Product", "FAQPage", "Article"
    content: Record<string, any>;
  };
  
  canonicalUrl?: string;
  noindex: boolean;
  nofollow: boolean;
  
  h1: string;
  h2Blocks: H2Block[];
  internalLinks: InternalLink[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface H2Block {
  id: string;
  text: string;
  order: number;
}

export interface InternalLink {
  id: string;
  text: string;
  url: string;
  order: number;
}

// ============================================================================
// 7. CUSTOMER MANAGEMENT (CRM LITE)
// ============================================================================

export type CustomerTag = 'wholesale' | 'repeat' | 'vip' | 'new' | 'at-risk' | 'custom';

export interface AdminCustomer {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  billingAddress?: ShippingAddressInfo;
  shippingAddresses: ShippingAddressInfo[];
  
  // CRM Data
  tags: CustomerTag[];
  customTags: string[];
  lifetimeValue: number;
  totalOrders: number;
  lastOrderDate?: Date;
  notes: string;
  
  // Artwork Library (from orders)
  artworkLibrary: CustomerArtworkFile[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerArtworkFile {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  usedInOrders: string[]; // order IDs
}

export interface CustomerImport {
  email: string;
  name: string;
  company?: string;
  phone?: string;
  tags?: string[];
  notes?: string;
}

// ============================================================================
// 8. DISCOUNTS & PROMOTIONS
// ============================================================================

export type DiscountType = 'percentage' | 'fixed' | 'freeShipping';

export interface Discount {
  id: string;
  code: string;
  name: string;
  type: DiscountType;
  value: number; // percentage or fixed amount
  
  // Rules & Restrictions
  rules: DiscountRule;
  
  // Usage Limits
  usageLimit?: number; // max total uses
  usagePerCustomer?: number; // max per customer
  usageCount: number;
  
  // Date Range
  startsAt: Date;
  expiresAt: Date;
  
  isActive: boolean;
  createdAt: Date;
}

export interface DiscountRule {
  minOrderValue?: number;
  maxOrderValue?: number;
  applicableCategories?: string[]; // product category IDs
  applicableProducts?: string[]; // specific product IDs
  applicableCustomerTags?: CustomerTag[]; // only for tagged customers
  firstTimeCustomersOnly?: boolean;
  excludeProducts?: string[];
}

// ============================================================================
// 9. MEDIA & GALLERY MANAGEMENT
// ============================================================================

export interface GalleryImage {
  id: string;
  imageUrl: string;
  altText: string;
  linkedProduct?: string; // product ID
  linkedCategory?: string; // category ID
  homepagePosition?: number;
  isActive: boolean;
  uploadedAt: Date;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document';
  fileSize: number;
  dimensions?: { width: number; height: number };
  uploadedAt: Date;
  uploadedBy: string;
  tags: string[];
}

// ============================================================================
// 10. DASHBOARD ANALYTICS & HEALTH WIDGETS
// ============================================================================

export interface DashboardWidget {
  id: string;
  type:
    | 'order-status'
    | 'revenue'
    | 'proof-queue'
    | 'shipping-queue'
    | 'stock-alerts'
    | 'active-discounts'
    | 'traffic-snapshot'
    | 'top-products';
  title: string;
  refreshInterval: number; // ms
}

export interface OrderStatusMetrics {
  awaitingArtwork: number;
  proofSent: number;
  awaitingApproval: number;
  inProduction: number;
  readyToShip: number;
}

export interface RevenueMetrics {
  today: number;
  thisWeek: number;
  thisMonth: number;
  comparison: {
    weekVsWeek: number; // percentage change
    monthVsMonth: number;
  };
}

export interface ProofQueueMetrics {
  pending: number;
  overdue: number;
  avgApprovalTime: number; // hours
}

export interface ShippingQueueMetrics {
  readyToShip: number;
  pendingLabels: number;
  avgProcessingTime: number; // hours
}

export interface StockAlert {
  id: string;
  materialId: string;
  materialName: string;
  currentStock: number;
  minimumThreshold: number;
  unit: string;
  alertLevel: 'warning' | 'critical';
}

export interface TrafficSnapshot {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  topPages: { path: string; views: number }[];
  topProducts: { productId: string; productName: string; views: number }[];
}

// ============================================================================
// 11. IMPORT / EXPORT SYSTEM
// ============================================================================

export interface ImportJob {
  id: string;
  type: 'customers' | 'products' | 'discounts' | 'shipping-rules';
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: string[];
  startedAt: Date;
  completedAt?: Date;
}

export interface ExportJob {
  id: string;
  type: 'orders' | 'customers' | 'artwork' | 'analytics';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  format: 'csv' | 'json' | 'xlsx';
  createdAt: Date;
  completedAt?: Date;
}

// ============================================================================
// 12. SUPPORT & COMMUNICATION (Admin View)
// ============================================================================

export interface AdminTicketView {
  id: string;
  ticketNumber: string;
  customer: AdminCustomer;
  subject: string;
  status: 'open' | 'pending' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string; // admin user ID
  linkedOrder?: string;
  messages: TicketMessage[];
  internalNotes: InternalNote[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'customer' | 'support' | 'admin';
  message: string;
  attachments?: string[];
  isInternal: boolean;
  createdAt: Date;
}

export interface InternalNote {
  id: string;
  authorId: string;
  authorName: string;
  note: string;
  createdAt: Date;
}

// ============================================================================
// 13. INVENTORY & STOCK MANAGEMENT
// ============================================================================

export interface MaterialStock {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string; // rolls, sheets, kg, etc.
  minimumThreshold: number;
  supplier?: string;
  lastRestockDate?: Date;
  costPerUnit?: number;
}

export interface StockMovement {
  id: string;
  materialId: string;
  type: 'inbound' | 'outbound' | 'adjustment';
  quantity: number;
  reference?: string; // order ID, purchase ID, etc.
  notes?: string;
  timestamp: Date;
  recordedBy: string;
}

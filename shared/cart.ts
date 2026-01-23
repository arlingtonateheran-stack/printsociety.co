// Cart Types and Data Structure

export interface CartLineItem {
  id: string; // Unique ID for this cart item
  productId: string;
  productName: string;
  productSlug: string;
  quantity: number;
  size: string;
  material: string;
  finish: string;
  unitPrice: number;
  subtotal: number; // quantity * unitPrice
  artworkUrl?: string;
  artworkStatus: 'pending' | 'uploaded' | 'approved'; // Track artwork upload status
}

export interface ShippingOption {
  id: string;
  name: string;
  type: 'standard' | 'rush';
  description: string;
  daysToDeliver: number;
  basePrice: number;
  pricePerItem?: number; // For bulk shipping adjustments
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  applicableCategories?: string[];
  expiresAt: Date;
  isActive: boolean;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ShippingAddress extends BillingAddress {}

export interface Cart {
  id: string;
  userId?: string;
  lineItems: CartLineItem[];
  shippingOption?: ShippingOption;
  shippingAddress?: ShippingAddress;
  billingAddress?: BillingAddress;
  promoCode?: PromoCode;
  promoCodeApplied?: string; // The actual code string
  subtotal: number; // Sum of line items
  shippingCost: number;
  discountAmount: number;
  total: number;
  termsAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Shipping options data
export const shippingOptions: ShippingOption[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    type: 'standard',
    description: 'Delivery in 5-7 business days',
    daysToDeliver: 6,
    basePrice: 0,
  },
  {
    id: 'rush',
    name: 'Rush Shipping',
    type: 'rush',
    description: 'Delivery in 2-3 business days',
    daysToDeliver: 2,
    basePrice: 25,
  },
];

// Sample promo codes
export const promoCodes: PromoCode[] = [
  {
    code: 'STICKY10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 50,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    isActive: true,
  },
  {
    code: 'SUMMER20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 100,
    maxDiscount: 100,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    isActive: true,
  },
  {
    code: 'WELCOME5',
    discountType: 'fixed',
    discountValue: 5,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    isActive: true,
  },
];

// Wholesale customer tier system and related types
// Extends the base auth system with wholesale-specific features

import { User, CustomerUser } from './auth';

export type CustomerTier = 'retail' | 'wholesale' | 'enterprise';

export interface WholesaleProfile {
  tierId: string;
  businessName: string;
  businessType: 'manufacturer' | 'distributor' | 'retailer' | 'other';
  taxId?: string;
  resaleLicense?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDate?: Date;
  verificationDocuments?: string[]; // document file IDs
  approvedBy?: string; // admin user ID
  
  // Business details
  businessWebsite?: string;
  yearEstablished?: number;
  employeeCount?: number;
  averageMonthlySpend?: number;
  
  // Billing
  poNumber?: string;
  netTerms: 'net-0' | 'net-15' | 'net-30' | 'net-60';
  creditLimit?: number;
  availableCredit?: number;
  
  // Contact
  accountManager?: string; // user ID
  primaryContactEmail?: string;
  primaryContactPhone?: string;
  alternateContact?: {
    name: string;
    email: string;
    phone: string;
  };
  
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TierBenefits {
  name: string;
  tier: CustomerTier;
  description: string;
  
  // Pricing
  discountPercentage: number; // 0-100
  volumeDiscounts: VolumeDiscount[];
  customPricing?: boolean;
  
  // Order features
  minOrderQuantity: number;
  bulkOrderDiscount: number;
  reorderFrequency?: 'weekly' | 'monthly' | 'quarterly';
  
  // Payment terms
  netTerms: string[];
  creditTermsAvailable: boolean;
  creditLimit?: number;
  invoicingSupport: boolean;
  
  // Account features
  accountManager: boolean;
  prioritySupport: boolean;
  customProofFeedback: boolean;
  advancedAnalytics: boolean;
  apiAccess: boolean;
  dedicatedWarehouse?: boolean;
  
  // Customization
  customBranding?: boolean;
  privateLabel?: boolean;
  designConsultation?: boolean;
  
  // Shipping
  freeShippingThreshold?: number;
  shippingDiscount?: number;
  expeditedShippingAvailable: boolean;
  dropShippingSupport: boolean;
  
  metadata?: Record<string, any>;
}

export interface VolumeDiscount {
  minQuantity: number;
  maxQuantity?: number; // null = unlimited
  discountPercentage: number;
  discountType: 'percentage' | 'fixed';
  appliesTo: 'all-products' | 'specific-products';
  specificProductIds?: string[];
}

export interface WholesaleOrder {
  orderId: string;
  customerId: string;
  poNumber?: string;
  netTerms: 'net-0' | 'net-15' | 'net-30' | 'net-60';
  
  // Pricing
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  
  // Timeline
  createdAt: Date;
  quotedAt?: Date;
  approvedAt?: Date;
  paidAt?: Date;
  dueDateForPayment?: Date;
  
  // Status
  status: 'draft' | 'quoted' | 'approved' | 'production' | 'shipped' | 'delivered' | 'cancelled';
  
  // Delivery
  shipmentId?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  
  // Notes
  specialInstructions?: string;
  internalNotes?: string;
}

export interface WholesaleCustomer extends CustomerUser {
  tier: CustomerTier;
  wholesaleProfile?: WholesaleProfile;
}

// Tier configurations
export const TIER_BENEFITS: Record<CustomerTier, TierBenefits> = {
  retail: {
    name: 'Retail',
    tier: 'retail',
    description: 'Standard pricing for individual customers and small orders',
    
    discountPercentage: 0,
    volumeDiscounts: [
      { minQuantity: 100, maxQuantity: 499, discountPercentage: 5, discountType: 'percentage', appliesTo: 'all-products' },
      { minQuantity: 500, maxQuantity: 999, discountPercentage: 10, discountType: 'percentage', appliesTo: 'all-products' },
      { minQuantity: 1000, maxQuantity: null, discountPercentage: 15, discountType: 'percentage', appliesTo: 'all-products' },
    ],
    customPricing: false,
    
    minOrderQuantity: 1,
    bulkOrderDiscount: 0,
    
    netTerms: ['net-0'],
    creditTermsAvailable: false,
    invoicingSupport: false,
    
    accountManager: false,
    prioritySupport: false,
    customProofFeedback: false,
    advancedAnalytics: false,
    apiAccess: false,
    
    freeShippingThreshold: 500,
    shippingDiscount: 0,
    expeditedShippingAvailable: false,
    dropShippingSupport: false,
  },
  
  wholesale: {
    name: 'Wholesale',
    tier: 'wholesale',
    description: 'Discounted pricing for businesses and resellers',
    
    discountPercentage: 15,
    volumeDiscounts: [
      { minQuantity: 500, maxQuantity: 1999, discountPercentage: 18, discountType: 'percentage', appliesTo: 'all-products' },
      { minQuantity: 2000, maxQuantity: 4999, discountPercentage: 22, discountType: 'percentage', appliesTo: 'all-products' },
      { minQuantity: 5000, maxQuantity: null, discountPercentage: 25, discountType: 'percentage', appliesTo: 'all-products' },
    ],
    customPricing: true,
    
    minOrderQuantity: 500,
    bulkOrderDiscount: 8,
    
    netTerms: ['net-0', 'net-15', 'net-30'],
    creditTermsAvailable: true,
    creditLimit: 25000,
    invoicingSupport: true,
    
    accountManager: true,
    prioritySupport: true,
    customProofFeedback: true,
    advancedAnalytics: true,
    apiAccess: true,
    
    freeShippingThreshold: 0,
    shippingDiscount: 20,
    expeditedShippingAvailable: true,
    dropShippingSupport: true,
  },
  
  enterprise: {
    name: 'Enterprise',
    tier: 'enterprise',
    description: 'Custom solutions for large organizations and distributors',
    
    discountPercentage: 30,
    volumeDiscounts: [
      { minQuantity: 5000, maxQuantity: 19999, discountPercentage: 32, discountType: 'percentage', appliesTo: 'all-products' },
      { minQuantity: 20000, maxQuantity: 49999, discountPercentage: 35, discountType: 'percentage', appliesTo: 'all-products' },
      { minQuantity: 50000, maxQuantity: null, discountPercentage: 40, discountType: 'percentage', appliesTo: 'all-products' },
    ],
    customPricing: true,
    
    minOrderQuantity: 5000,
    bulkOrderDiscount: 12,
    
    netTerms: ['net-0', 'net-15', 'net-30', 'net-60'],
    creditTermsAvailable: true,
    creditLimit: 250000,
    invoicingSupport: true,
    
    accountManager: true,
    prioritySupport: true,
    customProofFeedback: true,
    advancedAnalytics: true,
    apiAccess: true,
    dedicatedWarehouse: true,
    
    customBranding: true,
    privateLabel: true,
    designConsultation: true,
    
    freeShippingThreshold: 0,
    shippingDiscount: 35,
    expeditedShippingAvailable: true,
    dropShippingSupport: true,
  },
};

// Helper functions
export function getCustomerTier(user: CustomerUser | WholesaleCustomer): CustomerTier {
  if ('tier' in user) {
    return user.tier;
  }
  // Check tags for backward compatibility
  if (user.tags && user.tags.includes('wholesale')) {
    return 'wholesale';
  }
  return 'retail';
}

export function getTierBenefits(tier: CustomerTier): TierBenefits {
  return TIER_BENEFITS[tier];
}

export function calculateDiscount(
  quantity: number,
  tier: CustomerTier,
  productIds?: string[]
): { discountPercentage: number; discountDescription: string } {
  const benefits = getTierBenefits(tier);
  
  // Find applicable volume discount
  const volumeDiscount = benefits.volumeDiscounts.find((vd) => {
    const matchesQuantity = quantity >= vd.minQuantity && 
                           (vd.maxQuantity === null || quantity <= vd.maxQuantity);
    const matchesProducts = vd.appliesTo === 'all-products' ||
                           (vd.appliesTo === 'specific-products' && 
                            productIds?.every(pid => vd.specificProductIds?.includes(pid)));
    return matchesQuantity && matchesProducts;
  });

  if (volumeDiscount) {
    return {
      discountPercentage: volumeDiscount.discountPercentage,
      discountDescription: `Volume discount: ${volumeDiscount.discountPercentage}% off for ${volumeDiscount.minQuantity}+ units`,
    };
  }

  return {
    discountPercentage: benefits.discountPercentage,
    discountDescription: `${tier.charAt(0).toUpperCase() + tier.slice(1)} pricing: ${benefits.discountPercentage}% off`,
  };
}

export function isWholesaleEligible(user: User): boolean {
  // Check if user is a customer
  if (user.role !== 'customer') return false;
  
  // Customers with 'wholesale' tag or sufficient order history could be eligible
  const tags = (user as any).tags || [];
  if (tags.includes('wholesale')) return true;
  
  const lifetimeValue = (user as any).lifetimeValue || 0;
  const totalOrders = (user as any).totalOrders || 0;
  
  // Automatically eligible if spent $5k+ or placed 10+ orders
  return lifetimeValue >= 5000 || totalOrders >= 10;
}

export function validateWholesaleProfile(profile: Partial<WholesaleProfile>): string[] {
  const errors: string[] = [];
  
  if (!profile.businessName?.trim()) {
    errors.push('Business name is required');
  }
  
  if (!profile.businessType) {
    errors.push('Business type is required');
  }
  
  if (!profile.netTerms) {
    errors.push('Net terms selection is required');
  }
  
  if (!profile.primaryContactEmail?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Valid primary contact email is required');
  }
  
  if (!profile.primaryContactPhone?.match(/^\+?1?\d{10,}$/)) {
    errors.push('Valid primary contact phone is required');
  }
  
  return errors;
}

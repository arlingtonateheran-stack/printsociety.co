// Tiered pricing engine for wholesale and retail customers
// Calculates prices based on customer tier, quantity, and promotional discounts

import { CustomerTier, calculateDiscount, TIER_BENEFITS } from './wholesale';

export interface Product {
  id: string;
  name: string;
  basePrice: number; // Base retail price
  sku: string;
  category: string;
  metadata?: Record<string, any>;
}

export interface PriceCalculation {
  productId: string;
  basePrice: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  finalPrice: number;
  tier: CustomerTier;
  volumeDiscount?: {
    minQuantity: number;
    maxQuantity?: number;
    percentage: number;
    appliesTo: string;
  };
  promotionalDiscount?: {
    code: string;
    percentage: number;
    description: string;
  };
  breakdown: {
    retailPrice: number;
    tierDiscount: number;
    volumeDiscount: number;
    promotionalDiscount: number;
    finalUnitPrice: number;
  };
}

export interface CartItemPricing {
  items: PriceCalculation[];
  subtotal: number;
  totalDiscount: number;
  estimatedTax: number;
  estimatedShipping: number;
  total: number;
  savings: {
    amount: number;
    percentage: number;
    description: string;
  };
}

export interface PricingContext {
  customerTier: CustomerTier;
  quantity: number;
  promotionalCode?: string;
  shippingMethod?: 'standard' | 'expedited' | 'priority';
  taxRate?: number; // 0.08 for 8%
  shippingAddress?: {
    state?: string;
    country?: string;
  };
}

// Base product prices (in a real system, these would come from a database)
export const PRODUCT_PRICES: Record<string, number> = {
  'sticker-round-2in': 0.15,
  'sticker-round-3in': 0.25,
  'sticker-square-3in': 0.20,
  'sticker-square-4in': 0.30,
  'label-3x2in': 0.08,
  'label-4x3in': 0.12,
  'custom-shape': 0.50,
};

// Promotional codes (in production, these would be validated against a database)
export const PROMO_CODES: Record<
  string,
  { percentage: number; minQuantity: number; expiresAt?: Date; description: string }
> = {
  WELCOME10: { percentage: 10, minQuantity: 1, description: 'Welcome discount' },
  BULK20: { percentage: 20, minQuantity: 500, description: 'Bulk order discount' },
  NEWYEAR2025: {
    percentage: 15,
    minQuantity: 1,
    expiresAt: new Date('2025-01-31'),
    description: 'New Year celebration',
  },
};

export function getBasePrice(productId: string): number {
  return PRODUCT_PRICES[productId] || 0;
}

export function validatePromoCode(
  code: string,
  quantity: number
): { valid: boolean; discount?: number; message: string } {
  const promo = PROMO_CODES[code.toUpperCase()];

  if (!promo) {
    return { valid: false, message: 'Promotional code not found' };
  }

  if (promo.expiresAt && new Date() > promo.expiresAt) {
    return { valid: false, message: 'Promotional code has expired' };
  }

  if (quantity < promo.minQuantity) {
    return {
      valid: false,
      message: `Minimum order of ${promo.minQuantity} units required for this code`,
    };
  }

  return { valid: true, discount: promo.percentage, message: 'Code applied' };
}

export function calculateProductPrice(
  productId: string,
  context: PricingContext
): PriceCalculation {
  const basePrice = getBasePrice(productId);
  const { customerTier, quantity, promotionalCode, shippingAddress } = context;

  // Get tier benefits
  const tierBenefits = TIER_BENEFITS[customerTier];
  const tierDiscount = tierBenefits.discountPercentage;

  // Calculate volume discount
  const volumeDiscountInfo = tierBenefits.volumeDiscounts.find((vd) => {
    const matchesQuantity =
      quantity >= vd.minQuantity && (vd.maxQuantity === null || quantity <= vd.maxQuantity);
    const matchesProducts =
      vd.appliesTo === 'all-products' ||
      (vd.appliesTo === 'specific-products' && vd.specificProductIds?.includes(productId));
    return matchesQuantity && matchesProducts;
  });

  const volumeDiscount = volumeDiscountInfo?.discountPercentage || 0;

  // Calculate promotional discount
  let promotionalDiscount = 0;
  let promoDescription = '';
  if (promotionalCode) {
    const validation = validatePromoCode(promotionalCode, quantity);
    if (validation.valid && validation.discount) {
      promotionalDiscount = validation.discount;
      promoDescription = PROMO_CODES[promotionalCode.toUpperCase()].description;
    }
  }

  // Calculate final price
  const tierDiscountAmount = basePrice * (tierDiscount / 100);
  const afterTierPrice = basePrice - tierDiscountAmount;

  const volumeDiscountAmount = afterTierPrice * (volumeDiscount / 100);
  const afterVolumePrice = afterTierPrice - volumeDiscountAmount;

  const promoDiscountAmount = afterVolumePrice * (promotionalDiscount / 100);
  const finalUnitPrice = afterVolumePrice - promoDiscountAmount;

  const totalDiscount = tierDiscount + volumeDiscount + promotionalDiscount;
  const subtotal = finalUnitPrice * quantity;
  const discountAmount = basePrice * quantity - subtotal;

  return {
    productId,
    basePrice,
    quantity,
    unitPrice: basePrice,
    subtotal,
    discountPercentage: totalDiscount,
    discountAmount,
    finalPrice: subtotal,
    tier: customerTier,
    volumeDiscount: volumeDiscountInfo
      ? {
          minQuantity: volumeDiscountInfo.minQuantity,
          maxQuantity: volumeDiscountInfo.maxQuantity,
          percentage: volumeDiscountInfo.discountPercentage,
          appliesTo: volumeDiscountInfo.appliesTo,
        }
      : undefined,
    promotionalDiscount: promotionalCode
      ? {
          code: promotionalCode,
          percentage: promotionalDiscount,
          description: promoDescription,
        }
      : undefined,
    breakdown: {
      retailPrice: basePrice,
      tierDiscount: tierDiscountAmount,
      volumeDiscount: volumeDiscountAmount,
      promotionalDiscount: promoDiscountAmount,
      finalUnitPrice,
    },
  };
}

export function calculateCartPricing(
  items: { productId: string; quantity: number }[],
  context: PricingContext
): CartItemPricing {
  const calculations = items.map((item) =>
    calculateProductPrice(item.productId, {
      ...context,
      quantity: item.quantity,
    })
  );

  const subtotal = calculations.reduce((sum, calc) => sum + calc.finalPrice, 0);
  const totalDiscount = calculations.reduce((sum, calc) => sum + calc.discountAmount, 0);

  // Calculate tax (if applicable based on state/country)
  const taxRate = context.taxRate || 0;
  const estimatedTax = subtotal * taxRate;

  // Calculate shipping
  const estimatedShipping = calculateShipping(subtotal, context);

  const total = subtotal + estimatedTax + estimatedShipping;

  // Calculate savings
  const savingsPercentage = subtotal > 0 ? (totalDiscount / (subtotal + totalDiscount)) * 100 : 0;

  let savingsDescription = '';
  if (context.customerTier === 'wholesale') {
    savingsDescription = `You're saving ${savingsPercentage.toFixed(0)}% as a wholesale customer`;
  } else if (context.customerTier === 'enterprise') {
    savingsDescription = `Enterprise pricing: save ${savingsPercentage.toFixed(0)}%`;
  } else {
    savingsDescription =
      savingsPercentage > 0
        ? `Volume discounts applied: save ${savingsPercentage.toFixed(0)}%`
        : 'Standard pricing';
  }

  return {
    items: calculations,
    subtotal,
    totalDiscount,
    estimatedTax,
    estimatedShipping,
    total,
    savings: {
      amount: totalDiscount,
      percentage: savingsPercentage,
      description: savingsDescription,
    },
  };
}

export function calculateShipping(
  subtotal: number,
  context: PricingContext
): number {
  const { customerTier, shippingMethod } = context;
  const tierBenefits = TIER_BENEFITS[customerTier];

  // Free shipping threshold
  if (
    tierBenefits.freeShippingThreshold &&
    subtotal >= tierBenefits.freeShippingThreshold
  ) {
    return 0;
  }

  // Base shipping cost
  let baseCost = 9.99;

  // Adjust based on method
  switch (shippingMethod) {
    case 'expedited':
      baseCost = 19.99;
      break;
    case 'priority':
      baseCost = 39.99;
      break;
  }

  // Apply shipping discount
  if (tierBenefits.shippingDiscount > 0) {
    baseCost = baseCost * (1 - tierBenefits.shippingDiscount / 100);
  }

  return baseCost;
}

export function estimateNetTermsDueDate(
  netTerms: 'net-0' | 'net-15' | 'net-30' | 'net-60',
  invoiceDate: Date = new Date()
): Date {
  const days =
    {
      'net-0': 0,
      'net-15': 15,
      'net-30': 30,
      'net-60': 60,
    }[netTerms] || 0;

  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + days);
  return dueDate;
}

export function calculateEarlyPaymentDiscount(
  amount: number,
  daysEarlyPayment: number,
  discountPercentage: number = 2
): number {
  // Early payment discount (2/10 Net 30 style)
  // 2% discount if paid within 10 days
  if (daysEarlyPayment <= 10) {
    return (amount * discountPercentage) / 100;
  }
  return 0;
}

export function getPricingTierInfo(tier: CustomerTier): string {
  const info = {
    retail: 'Standard retail pricing with volume discounts on orders over 100 units',
    wholesale:
      'Wholesale pricing with 15% base discount, volume discounts, and flexible payment terms',
    enterprise:
      'Custom enterprise pricing, dedicated account manager, and exclusive benefits',
  };
  return info[tier];
}

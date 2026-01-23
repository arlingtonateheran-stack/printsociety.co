// Minimum Order Quantity (MOQ) enforcement system
// Validates orders against MOQ requirements based on tier, product, and conditions

import { CustomerTier } from './wholesale';

export interface MOQRule {
  id: string;
  productId?: string; // null = applies to all products
  category?: string; // null = applies to all categories
  tier: CustomerTier | 'all';
  minimumQuantity: number;
  incrementQuantity?: number; // Must order in multiples (e.g., 10, 20, 30)
  notes?: string;
  active: boolean;
  effectiveFrom?: Date;
  effectiveUntil?: Date;
}

export interface MOQValidation {
  valid: boolean;
  moq: number;
  currentQuantity: number;
  quantityNeeded?: number;
  message: string;
  suggestion?: string;
  isIncrement?: boolean;
  nextValidQuantity?: number;
}

export interface MOQBreakdown {
  productId: string;
  moq: number;
  currentQuantity: number;
  valid: boolean;
  message: string;
}

// MOQ rules database (in production, this would be in a database)
export const MOQ_RULES: MOQRule[] = [
  // Retail MOQ rules
  {
    id: 'moq-retail-standard',
    tier: 'retail',
    minimumQuantity: 1,
    active: true,
    notes: 'Retail customers can order as little as 1 unit',
  },
  {
    id: 'moq-retail-bulk',
    tier: 'retail',
    minimumQuantity: 50,
    category: 'bulk-products',
    active: true,
    notes: 'Bulk products require minimum 50 units for retail',
  },

  // Wholesale MOQ rules
  {
    id: 'moq-wholesale-standard',
    tier: 'wholesale',
    minimumQuantity: 500,
    active: true,
    notes: 'Standard wholesale minimum order quantity',
  },
  {
    id: 'moq-wholesale-increment',
    tier: 'wholesale',
    minimumQuantity: 500,
    incrementQuantity: 100,
    active: true,
    notes: 'Wholesale orders must be in increments of 100',
  },
  {
    id: 'moq-wholesale-custom',
    productId: 'custom-shape',
    tier: 'wholesale',
    minimumQuantity: 2000,
    active: true,
    notes: 'Custom shapes have higher MOQ',
  },

  // Enterprise MOQ rules
  {
    id: 'moq-enterprise-standard',
    tier: 'enterprise',
    minimumQuantity: 5000,
    incrementQuantity: 500,
    active: true,
    notes: 'Enterprise orders must be 5000+ in increments of 500',
  },
  {
    id: 'moq-enterprise-negotiable',
    productId: 'custom-shape',
    tier: 'enterprise',
    minimumQuantity: 10000,
    active: true,
    notes: 'Custom shapes for enterprise - pricing available upon request',
  },
];

export function getApplicableMOQRules(
  productId: string,
  tier: CustomerTier,
  category?: string
): MOQRule[] {
  return MOQ_RULES.filter((rule) => {
    if (!rule.active) return false;

    // Check effective dates
    const now = new Date();
    if (rule.effectiveFrom && now < rule.effectiveFrom) return false;
    if (rule.effectiveUntil && now > rule.effectiveUntil) return false;

    // Check tier
    if (rule.tier !== 'all' && rule.tier !== tier) return false;

    // Check product ID
    if (rule.productId && rule.productId !== productId) return false;

    // Check category
    if (rule.category && rule.category !== category) return false;

    return true;
  });
}

export function getEffectiveMOQ(
  productId: string,
  tier: CustomerTier,
  category?: string
): number {
  const rules = getApplicableMOQRules(productId, tier, category);

  if (rules.length === 0) {
    return 1; // Default: no minimum
  }

  // Return the highest MOQ from applicable rules
  return Math.max(...rules.map((r) => r.minimumQuantity));
}

export function getIncrementQuantity(
  productId: string,
  tier: CustomerTier,
  category?: string
): number | undefined {
  const rules = getApplicableMOQRules(productId, tier, category);

  // Return increment from the most specific rule
  for (const rule of rules) {
    if (rule.incrementQuantity) {
      return rule.incrementQuantity;
    }
  }

  return undefined;
}

export function validateMOQ(
  quantity: number,
  productId: string,
  tier: CustomerTier,
  category?: string
): MOQValidation {
  const moq = getEffectiveMOQ(productId, tier, category);
  const increment = getIncrementQuantity(productId, tier, category);

  // Check if quantity meets MOQ
  if (quantity < moq) {
    return {
      valid: false,
      moq,
      currentQuantity: quantity,
      quantityNeeded: moq - quantity,
      message: `Minimum order quantity for this product is ${moq} units`,
      suggestion: `Please increase your order to at least ${moq} units`,
    };
  }

  // Check if quantity is valid increment
  if (increment && quantity % increment !== 0) {
    const nextValidQuantity = Math.ceil(quantity / increment) * increment;
    return {
      valid: false,
      moq,
      currentQuantity: quantity,
      isIncrement: true,
      nextValidQuantity,
      message: `Orders must be in increments of ${increment}. Current: ${quantity}, Next valid: ${nextValidQuantity}`,
      suggestion: `Please adjust your order quantity to ${nextValidQuantity} units`,
    };
  }

  return {
    valid: true,
    moq,
    currentQuantity: quantity,
    message: `Order quantity meets MOQ requirements`,
  };
}

export function validateCartMOQ(
  cartItems: { productId: string; quantity: number; category?: string }[],
  tier: CustomerTier
): {
  valid: boolean;
  breakdowns: MOQBreakdown[];
  errors: string[];
} {
  const breakdowns: MOQBreakdown[] = [];
  const errors: string[] = [];

  for (const item of cartItems) {
    const validation = validateMOQ(item.quantity, item.productId, tier, item.category);

    breakdowns.push({
      productId: item.productId,
      moq: validation.moq,
      currentQuantity: validation.currentQuantity,
      valid: validation.valid,
      message: validation.message,
    });

    if (!validation.valid) {
      errors.push(`${item.productId}: ${validation.suggestion || validation.message}`);
    }
  }

  return {
    valid: errors.length === 0,
    breakdowns,
    errors,
  };
}

export function calculateMinimumOrderValue(
  basePrice: number,
  tier: CustomerTier,
  productId: string,
  category?: string
): {
  moq: number;
  minimumValue: number;
  afterDiscount?: number;
  tierDiscount?: number;
} {
  const moq = getEffectiveMOQ(productId, tier, category);
  const minimumValue = basePrice * moq;

  // Calculate discount based on tier
  const tierDiscounts: Record<CustomerTier, number> = {
    retail: 0,
    wholesale: 0.15,
    enterprise: 0.30,
  };

  const discount = tierDiscounts[tier];
  const afterDiscount = minimumValue * (1 - discount);

  return {
    moq,
    minimumValue,
    afterDiscount: discount > 0 ? afterDiscount : undefined,
    tierDiscount: discount > 0 ? discount : undefined,
  };
}

export function getMOQRecommendation(
  productId: string,
  currentQuantity: number,
  tier: CustomerTier,
  category?: string
): {
  current: number;
  recommended: number;
  savings?: number;
} {
  const moq = getEffectiveMOQ(productId, tier, category);
  const increment = getIncrementQuantity(productId, tier, category);

  let recommended = Math.max(currentQuantity, moq);

  // Adjust to next increment
  if (increment && recommended % increment !== 0) {
    recommended = Math.ceil(recommended / increment) * increment;
  }

  // Suggest next volume discount tier
  const tierDiscounts = [1000, 5000, 10000];
  if (tier !== 'retail') {
    for (const threshold of tierDiscounts) {
      if (recommended < threshold && currentQuantity < threshold) {
        recommended = threshold;
        break;
      }
    }
  }

  return {
    current: currentQuantity,
    recommended,
    savings: recommended > currentQuantity ? (recommended - currentQuantity) * 0.05 : undefined, // Estimated savings
  };
}

export function getMOQMessage(validation: MOQValidation): string {
  if (validation.valid) {
    return '✓ Order quantity is valid';
  }

  if (validation.isIncrement) {
    return `Order must be in increments of ${validation.nextValidQuantity}. Consider ordering ${validation.nextValidQuantity} units for better pricing.`;
  }

  return `Minimum ${validation.moq} units required. You need ${validation.quantityNeeded} more units.`;
}

export function shouldShowMOQWarning(
  quantity: number,
  moq: number
): boolean {
  if (quantity >= moq) return false;
  // Show warning if less than 80% of MOQ
  return quantity >= moq * 0.8;
}

export function getMOQProgressPercentage(
  quantity: number,
  moq: number
): number {
  return Math.min(100, Math.round((quantity / moq) * 100));
}

export interface MOQTierComparison {
  tier: CustomerTier;
  moq: number;
  increment?: number;
  minimumOrderValue: number;
  note?: string;
}

export function compareMOQAcrossTiers(
  productId: string,
  basePrice: number,
  category?: string
): MOQTierComparison[] {
  const tiers: CustomerTier[] = ['retail', 'wholesale', 'enterprise'];

  return tiers.map((tier) => {
    const calculation = calculateMinimumOrderValue(
      basePrice,
      tier,
      productId,
      category
    );
    const increment = getIncrementQuantity(productId, tier, category);

    return {
      tier,
      moq: calculation.moq,
      increment,
      minimumOrderValue: calculation.minimumValue,
      note: 
        tier === 'wholesale' 
          ? `Save ${Math.round(calculation.tierDiscount! * 100)}%` 
          : tier === 'enterprise'
            ? `Save ${Math.round(calculation.tierDiscount! * 100)}% + Volume Discounts`
            : undefined,
    };
  });
}

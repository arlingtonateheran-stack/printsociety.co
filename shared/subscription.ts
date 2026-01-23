// Subscription and auto-reorder management system
// Handles recurring orders and automated reorder subscriptions

export type SubscriptionFrequency = 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'pending';
export type SubscriptionInterval = 7 | 14 | 30 | 60 | 90 | 180 | 365; // days

export interface SubscriptionProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  sku: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  name: string;
  description?: string;
  
  // Products and items
  products: SubscriptionProduct[];
  totalPrice: number;
  
  // Frequency
  frequency: SubscriptionFrequency;
  interval: SubscriptionInterval;
  
  // Status and dates
  status: SubscriptionStatus;
  createdAt: Date;
  startDate: Date;
  nextOrderDate: Date;
  lastOrderDate?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  
  // Billing
  billingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethodId: string;
  
  // Discounts
  discountPercentage?: number;
  discountAmount?: number;
  
  // Customization
  autoApproveProofs: boolean;
  preserveArtwork: boolean;
  autoShip: boolean;
  allowQuantityAdjustments: boolean;
  
  // Notifications
  notifyBeforeOrder: boolean;
  notificationDaysBefore?: number;
  
  // Limits
  maxOrders?: number;
  ordersPlaced: number;
  
  metadata?: Record<string, any>;
}

export interface SubscriptionOrder {
  id: string;
  subscriptionId: string;
  orderNumber: string;
  orderDate: Date;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'failed';
  total: number;
  trackingNumber?: string;
  deliveryDate?: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  frequency: SubscriptionFrequency;
  discountPercentage: number;
  savingsPercentage: number;
  features: string[];
  populari ty: number; // 1-5 stars
  recommended: boolean;
}

// Predefined subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly-save-5',
    name: 'Monthly',
    description: 'Get new supplies every month',
    frequency: 'monthly',
    discountPercentage: 5,
    savingsPercentage: 5,
    features: [
      'Regular supply refresh',
      'Flexible quantity adjustments',
      'Cancel anytime',
      'Free standard shipping'
    ],
    popularity: 4.5,
    recommended: false,
  },
  {
    id: 'quarterly-save-10',
    name: 'Quarterly',
    description: 'Reorder every 3 months for better savings',
    frequency: 'quarterly',
    discountPercentage: 10,
    savingsPercentage: 10,
    features: [
      '10% discount on every order',
      'Automatic shipments',
      'Flexible pause/resume',
      'Priority customer support'
    ],
    popularity: 4.8,
    recommended: true,
  },
  {
    id: 'semi-annual-save-15',
    name: 'Semi-Annual',
    description: 'Commit to bi-annual orders for maximum savings',
    frequency: 'semi-annual',
    discountPercentage: 15,
    savingsPercentage: 15,
    features: [
      '15% discount on every order',
      'Reserved production slots',
      'Priority artwork approval',
      'Dedicated account manager'
    ],
    popularity: 4.2,
    recommended: false,
  },
];

export const FREQUENCY_DAYS: Record<SubscriptionFrequency, SubscriptionInterval> = {
  'weekly': 7,
  'bi-weekly': 14,
  'monthly': 30,
  'quarterly': 90,
  'semi-annual': 180,
  'annual': 365,
};

export function createSubscription(
  customerId: string,
  products: SubscriptionProduct[],
  frequency: SubscriptionFrequency,
  startDate: Date = new Date(),
  options?: Partial<Subscription>
): Subscription {
  const interval = FREQUENCY_DAYS[frequency];
  const totalPrice = products.reduce((sum, p) => sum + p.lineTotal, 0);
  const nextOrderDate = new Date(startDate);
  nextOrderDate.setDate(nextOrderDate.getDate() + interval);

  return {
    id: `SUB-${Date.now()}`,
    customerId,
    name: options?.name || `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Subscription`,
    description: options?.description,
    products,
    totalPrice,
    frequency,
    interval,
    status: 'pending',
    createdAt: new Date(),
    startDate,
    nextOrderDate,
    billingAddress: options?.billingAddress || {
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    paymentMethodId: options?.paymentMethodId || '',
    autoApproveProofs: options?.autoApproveProofs ?? false,
    preserveArtwork: options?.preserveArtwork ?? true,
    autoShip: options?.autoShip ?? true,
    allowQuantityAdjustments: options?.allowQuantityAdjustments ?? true,
    notifyBeforeOrder: options?.notifyBeforeOrder ?? true,
    notificationDaysBefore: options?.notificationDaysBefore ?? 3,
    ordersPlaced: 0,
    ...options,
  };
}

export function calculateNextOrderDate(
  lastOrderDate: Date,
  frequency: SubscriptionFrequency
): Date {
  const interval = FREQUENCY_DAYS[frequency];
  const nextDate = new Date(lastOrderDate);
  nextDate.setDate(nextDate.getDate() + interval);
  return nextDate;
}

export function pauseSubscription(
  subscription: Subscription,
  reason?: string
): Subscription {
  return {
    ...subscription,
    status: 'paused',
    metadata: {
      ...subscription.metadata,
      pausedAt: new Date(),
      pauseReason: reason,
    },
  };
}

export function resumeSubscription(subscription: Subscription): Subscription {
  const interval = FREQUENCY_DAYS[subscription.frequency];
  const nextOrderDate = new Date();
  nextOrderDate.setDate(nextOrderDate.getDate() + interval);

  return {
    ...subscription,
    status: 'active',
    nextOrderDate,
    metadata: {
      ...subscription.metadata,
      resumedAt: new Date(),
    },
  };
}

export function cancelSubscription(
  subscription: Subscription,
  reason?: string
): Subscription {
  return {
    ...subscription,
    status: 'cancelled',
    cancelledAt: new Date(),
    cancelReason: reason,
  };
}

export function updateSubscriptionFrequency(
  subscription: Subscription,
  newFrequency: SubscriptionFrequency
): Subscription {
  const interval = FREQUENCY_DAYS[newFrequency];
  const nextOrderDate = calculateNextOrderDate(subscription.lastOrderDate || subscription.startDate, newFrequency);

  return {
    ...subscription,
    frequency: newFrequency,
    interval,
    nextOrderDate,
  };
}

export function updateSubscriptionQuantity(
  subscription: Subscription,
  productId: string,
  newQuantity: number
): Subscription {
  if (!subscription.allowQuantityAdjustments) {
    throw new Error('Quantity adjustments are not allowed for this subscription');
  }

  const updatedProducts = subscription.products.map((product) => {
    if (product.productId === productId) {
      return {
        ...product,
        quantity: newQuantity,
        lineTotal: product.unitPrice * newQuantity,
      };
    }
    return product;
  });

  const totalPrice = updatedProducts.reduce((sum, p) => sum + p.lineTotal, 0);

  return {
    ...subscription,
    products: updatedProducts,
    totalPrice,
  };
}

export function shouldProcessSubscriptionOrder(subscription: Subscription): boolean {
  if (subscription.status !== 'active') return false;
  if (subscription.maxOrders && subscription.ordersPlaced >= subscription.maxOrders) return false;

  const now = new Date();
  return now >= subscription.nextOrderDate;
}

export function processSubscriptionOrder(
  subscription: Subscription
): {
  subscription: Subscription;
  order: SubscriptionOrder;
} {
  const order: SubscriptionOrder = {
    id: `ORD-${Date.now()}`,
    subscriptionId: subscription.id,
    orderNumber: `SUB-${subscription.id}-${subscription.ordersPlaced + 1}`,
    orderDate: new Date(),
    status: 'pending',
    total: subscription.totalPrice,
  };

  const updatedSubscription: Subscription = {
    ...subscription,
    lastOrderDate: new Date(),
    ordersPlaced: subscription.ordersPlaced + 1,
    nextOrderDate: calculateNextOrderDate(new Date(), subscription.frequency),
  };

  // Check if subscription should be auto-cancelled
  if (updatedSubscription.maxOrders && updatedSubscription.ordersPlaced >= updatedSubscription.maxOrders) {
    updatedSubscription.status = 'cancelled';
    updatedSubscription.cancelledAt = new Date();
    updatedSubscription.cancelReason = 'Maximum orders reached';
  }

  return { subscription: updatedSubscription, order };
}

export function calculateSubscriptionSavings(
  basePrice: number,
  frequency: SubscriptionFrequency,
  yearsCommitted: number = 1
): {
  regularCost: number;
  subscriptionCost: number;
  totalSavings: number;
  savingsPercentage: number;
  ordersPerYear: number;
} {
  const ordersPerYear = 365 / FREQUENCY_DAYS[frequency];
  const totalOrders = ordersPerYear * yearsCommitted;
  
  // Find discount from plans
  const plan = SUBSCRIPTION_PLANS.find(p => p.frequency === frequency);
  const discountPercentage = plan?.discountPercentage || 5;

  const regularCost = basePrice * totalOrders;
  const subscriptionCost = basePrice * totalOrders * (1 - discountPercentage / 100);
  const totalSavings = regularCost - subscriptionCost;

  return {
    regularCost,
    subscriptionCost,
    totalSavings,
    savingsPercentage: (totalSavings / regularCost) * 100,
    ordersPerYear: Math.round(ordersPerYear * 10) / 10,
  };
}

export function getSubscriptionRecommendation(
  orderHistory: Array<{ date: Date; amount: number }>
): SubscriptionFrequency | null {
  if (orderHistory.length < 2) return null;

  // Calculate average days between orders
  const intervals: number[] = [];
  for (let i = 0; i < orderHistory.length - 1; i++) {
    const daysBetween = Math.round(
      (new Date(orderHistory[i].date).getTime() - new Date(orderHistory[i + 1].date).getTime()) /
      (1000 * 60 * 60 * 24)
    );
    intervals.push(daysBetween);
  }

  const avgDays = intervals.reduce((a, b) => a + b, 0) / intervals.length;

  // Recommend frequency
  if (avgDays <= 10) return 'weekly';
  if (avgDays <= 20) return 'bi-weekly';
  if (avgDays <= 45) return 'monthly';
  if (avgDays <= 75) return 'quarterly';
  if (avgDays <= 200) return 'semi-annual';
  return 'annual';
}

export function getSubscriptionNotificationText(subscription: Subscription): string {
  const daysUntil = Math.round(
    (subscription.nextOrderDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntil === 0) {
    return `Your ${subscription.frequency} order is ready to ship!`;
  } else if (daysUntil < 0) {
    return `Your order is overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) > 1 ? 's' : ''}`;
  } else if (daysUntil <= (subscription.notificationDaysBefore || 3)) {
    return `Reminder: Your next order ships in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`;
  }

  return '';
}
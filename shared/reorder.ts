// One-click reorder system for dashboard
// Allows customers to quickly reorder previous purchases

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  sku: string;
  metadata?: Record<string, any>;
}

export interface PreviousOrder {
  id: string;
  orderNumber: string;
  orderDate: Date;
  items: OrderItem[];
  total: number;
  status: 'completed' | 'cancelled' | 'returned';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  metadata?: {
    artworkId?: string;
    proofApprovedDate?: Date;
    specialInstructions?: string;
  };
}

export interface ReorderSummary {
  originalOrder: PreviousOrder;
  newOrderDate: Date;
  itemCount: number;
  estimatedTotal: number;
  estimatedDeliveryDate?: Date;
}

export interface QuickReorderOption {
  id: string;
  label: string;
  quantity: number;
  description: string;
  savingPercentage?: number;
}

// Suggested reorder quantities based on order frequency
export const QUICK_REORDER_OPTIONS: QuickReorderOption[] = [
  {
    id: 'same-quantity',
    label: 'Same Quantity',
    quantity: 0, // Use original quantity
    description: 'Reorder exact same amount as original order',
  },
  {
    id: '150-percent',
    label: '50% More',
    quantity: 1.5,
    description: 'Increase order by 50%',
    savingPercentage: 5,
  },
  {
    id: 'double-quantity',
    label: 'Double',
    quantity: 2,
    description: 'Order double the original amount',
    savingPercentage: 8,
  },
  {
    id: 'custom',
    label: 'Custom Amount',
    quantity: 0,
    description: 'Enter your own quantity',
  },
];

export function createReorderFromPreviousOrder(
  previousOrder: PreviousOrder,
  quantityMultiplier: number = 1
): {
  items: OrderItem[];
  estimatedTotal: number;
} {
  const items = previousOrder.items.map((item) => ({
    ...item,
    quantity: Math.max(1, Math.round(item.quantity * quantityMultiplier)),
    lineTotal: item.unitPrice * Math.max(1, Math.round(item.quantity * quantityMultiplier)),
  }));

  const estimatedTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    items,
    estimatedTotal,
  };
}

export function getReorderRecommendation(
  previousOrders: PreviousOrder[]
): {
  recommended: PreviousOrder | null;
  frequency: number; // days between orders
  confidence: number; // 0-100
} {
  if (previousOrders.length === 0) {
    return { recommended: null, frequency: 0, confidence: 0 };
  }

  // Sort by date descending
  const sorted = [...previousOrders].sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );

  // Use most recent order
  const recommended = sorted[0];

  // Calculate ordering frequency
  let frequency = 0;
  if (sorted.length >= 2) {
    const timeDiff =
      new Date(sorted[0].orderDate).getTime() - new Date(sorted[1].orderDate).getTime();
    frequency = Math.round(timeDiff / (1000 * 60 * 60 * 24));
  }

  // Calculate confidence (how regularly they order)
  let confidence = 50;
  if (sorted.length >= 3) {
    const intervals = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const timeDiff =
        new Date(sorted[i].orderDate).getTime() - new Date(sorted[i + 1].orderDate).getTime();
      intervals.push(timeDiff);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => {
      return sum + Math.pow(interval - avgInterval, 2);
    }, 0) / intervals.length;

    // Lower variance = higher confidence
    const stdDev = Math.sqrt(variance);
    const coefficient = stdDev / avgInterval;

    // Convert coefficient to confidence (0 = no variance = 100% confidence)
    confidence = Math.max(50, Math.min(100, 100 - coefficient * 100));
  }

  return {
    recommended,
    frequency: Math.max(7, frequency), // Minimum 7 days
    confidence: Math.round(confidence),
  };
}

export function suggestReorderDate(
  lastOrderDate: Date,
  orderFrequency: number
): {
  suggestedDate: Date;
  daysUntil: number;
  isOverdue: boolean;
} {
  const nextOrder = new Date(lastOrderDate);
  nextOrder.setDate(nextOrder.getDate() + orderFrequency);

  const now = new Date();
  const daysUntil = Math.round((nextOrder.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    suggestedDate: nextOrder,
    daysUntil,
    isOverdue: daysUntil < 0,
  };
}

export function getReorderSavings(
  originalOrder: PreviousOrder,
  newQuantityMultiplier: number
): {
  originalTotal: number;
  estimatedNewTotal: number;
  savings: number;
  savingsPercentage: number;
} {
  const estimatedNewTotal = originalOrder.total * newQuantityMultiplier;
  
  // Estimate volume discount savings (this would be calculated based on tier pricing)
  let savings = 0;
  if (newQuantityMultiplier > 1.5) {
    savings = estimatedNewTotal * 0.08; // 8% savings for larger orders
  } else if (newQuantityMultiplier > 1) {
    savings = estimatedNewTotal * 0.05; // 5% savings for moderate increases
  }

  return {
    originalTotal: originalOrder.total,
    estimatedNewTotal,
    savings,
    savingsPercentage: (savings / estimatedNewTotal) * 100,
  };
}

export interface ReorderHistory {
  orderId: string;
  reorderedDate: Date;
  quantityMultiplier: number;
  items: OrderItem[];
  total: number;
  newOrderId?: string;
}

export function trackReorder(
  originalOrder: PreviousOrder,
  quantityMultiplier: number,
  items: OrderItem[],
  total: number
): ReorderHistory {
  return {
    orderId: originalOrder.id,
    reorderedDate: new Date(),
    quantityMultiplier,
    items,
    total,
  };
}

export function getRecentOrders(
  orders: PreviousOrder[],
  monthsBack: number = 6
): PreviousOrder[] {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);

  return orders.filter(
    (order) =>
      new Date(order.orderDate) > cutoffDate && order.status === 'completed'
  );
}

export function groupOrdersByProduct(
  orders: PreviousOrder[]
): Map<string, { product: string; totalOrdered: number; lastOrderedDate: Date }> {
  const grouped = new Map();

  for (const order of orders) {
    for (const item of order.items) {
      if (grouped.has(item.productId)) {
        const existing = grouped.get(item.productId);
        existing.totalOrdered += item.quantity;
        if (new Date(order.orderDate) > existing.lastOrderedDate) {
          existing.lastOrderedDate = new Date(order.orderDate);
        }
      } else {
        grouped.set(item.productId, {
          product: item.productName,
          totalOrdered: item.quantity,
          lastOrderedDate: new Date(order.orderDate),
        });
      }
    }
  }

  return grouped;
}

export function getMostFrequentProducts(
  orders: PreviousOrder[],
  limit: number = 5
): Array<{ productId: string; productName: string; orderCount: number }> {
  const grouped = new Map<string, { productName: string; count: number }>();

  for (const order of orders) {
    for (const item of order.items) {
      if (grouped.has(item.productId)) {
        const existing = grouped.get(item.productId)!;
        existing.count++;
      } else {
        grouped.set(item.productId, { productName: item.productName, count: 1 });
      }
    }
  }

  return Array.from(grouped.entries())
    .map(([productId, data]) => ({
      productId,
      productName: data.productName,
      orderCount: data.count,
    }))
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, limit);
}

export function calculateReorderReminder(
  lastOrderDate: Date,
  averageOrderFrequency: number
): {
  shouldRemind: boolean;
  daysOverdue: number;
  reminderMessage: string;
} {
  const nextExpectedOrder = new Date(lastOrderDate);
  nextExpectedOrder.setDate(
    nextExpectedOrder.getDate() + Math.round(averageOrderFrequency)
  );

  const now = new Date();
  const daysOverdue = Math.round(
    (now.getTime() - nextExpectedOrder.getTime()) / (1000 * 60 * 60 * 24)
  );

  const shouldRemind = daysOverdue >= 0;

  let reminderMessage = '';
  if (daysOverdue === 0) {
    reminderMessage = "It's time to reorder! Based on your ordering pattern, your next order is due today.";
  } else if (daysOverdue > 0 && daysOverdue <= 7) {
    reminderMessage = `It looks like you're ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue for reorder. Click to place your order now.`;
  } else if (daysOverdue > 7) {
    reminderMessage = `You're ${daysOverdue} days overdue for your regular reorder. Don't miss out - order now!`;
  }

  return {
    shouldRemind,
    daysOverdue,
    reminderMessage,
  };
}

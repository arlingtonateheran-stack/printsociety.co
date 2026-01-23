// Account and Dashboard Types

export type OrderStatus = 'pending-proof' | 'proof-approved' | 'in-production' | 'shipped' | 'delivered' | 'cancelled';
export type ArtworkType = 'design' | 'photo' | 'illustration' | 'logo';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  size: string;
  material: string;
  finish: string;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: Date;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
  proofId?: string;
  notes?: string;
}

export interface ArtworkFile {
  id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  type: ArtworkType;
  uploadedAt: Date;
  dimensions?: {
    width: number;
    height: number;
    unit: 'px' | 'in' | 'cm';
  };
  fileSize: number; // in bytes
  dpi?: number;
  tags: string[];
  timesUsed: number;
  lastUsedAt?: Date;
}

export interface SavedProduct {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  savedAt: Date;
  specifications: {
    size: string;
    material: string;
    finish: string;
    quantity?: number;
  };
  notes?: string;
  isFavorite: boolean;
}

export interface UserAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  createdAt: Date;
  lastLogin: Date;
  
  // Shipping addresses
  shippingAddresses: Array<{
    id: string;
    label: string;
    street: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
  
  // Preferences
  preferences: {
    emailNotifications: boolean;
    proofApprovalReminders: boolean;
    orderUpdates: boolean;
    marketingEmails: boolean;
  };
}

export interface DashboardData {
  user: UserAccount;
  orders: Order[];
  artworkLibrary: ArtworkFile[];
  savedProducts: SavedProduct[];
  pendingProofs: any[]; // References to Proof type from proofs.ts
}

// Sample Data
export const sampleUserAccount: UserAccount = {
  id: 'user-001',
  email: 'alex@example.com',
  firstName: 'Alex',
  lastName: 'Johnson',
  phone: '(555) 123-4567',
  company: 'Creative Agency',
  createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
  lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
  shippingAddresses: [
    {
      id: 'addr-001',
      label: 'Office',
      street: '123 Creative St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
      isDefault: true,
    },
    {
      id: 'addr-002',
      label: 'Home',
      street: '456 Home Ave',
      city: 'Oakland',
      state: 'CA',
      zipCode: '94612',
      country: 'USA',
      isDefault: false,
    },
  ],
  preferences: {
    emailNotifications: true,
    proofApprovalReminders: true,
    orderUpdates: true,
    marketingEmails: false,
  },
};

export const sampleOrders: Order[] = [
  {
    id: 'order-001',
    orderNumber: 'ORD-2025-001',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    status: 'shipped',
    items: [
      {
        id: 'item-1',
        productId: 'die-cut-stickers-vinyl',
        productName: 'Die-Cut Vinyl Stickers',
        quantity: 100,
        size: '3" - 4"',
        material: 'vinyl',
        finish: 'glossy',
        unitPrice: 0.28,
        subtotal: 28,
      },
    ],
    total: 53,
    shippingAddress: {
      name: 'Alex Johnson',
      street: '123 Creative St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
    },
    trackingNumber: 'FEDEX123456789',
    trackingUrl: 'https://tracking.fedex.com/FEDEX123456789',
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    proofId: 'proof-001',
  },
  {
    id: 'order-002',
    orderNumber: 'ORD-2025-002',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'in-production',
    items: [
      {
        id: 'item-2',
        productId: 'sticker-sheets',
        productName: 'Sticker Sheets',
        quantity: 50,
        size: 'A4 (8.5" x 11")',
        material: 'vinyl',
        finish: 'matte',
        unitPrice: 1.25,
        subtotal: 62.5,
      },
    ],
    total: 87.5,
    shippingAddress: {
      name: 'Alex Johnson',
      street: '123 Creative St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
    },
    proofId: 'proof-002',
  },
  {
    id: 'order-003',
    orderNumber: 'ORD-2025-003',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'proof-approved',
    items: [
      {
        id: 'item-3',
        productId: 'roll-labels',
        productName: 'Roll Labels',
        quantity: 500,
        size: '2" x 3"',
        material: 'paper',
        finish: 'matte',
        unitPrice: 0.1,
        subtotal: 50,
      },
    ],
    total: 75,
    shippingAddress: {
      name: 'Alex Johnson',
      street: '456 Home Ave',
      city: 'Oakland',
      state: 'CA',
      zipCode: '94612',
    },
    proofId: 'proof-003',
  },
];

export const sampleArtworkLibrary: ArtworkFile[] = [
  {
    id: 'art-001',
    name: 'Brand Logo',
    fileName: 'brand-logo.png',
    fileUrl: 'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=400&h=400&fit=crop',
    type: 'logo',
    uploadedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    dimensions: { width: 1200, height: 1200, unit: 'px' },
    fileSize: 2400000,
    dpi: 300,
    tags: ['logo', 'brand', 'primary'],
    timesUsed: 5,
    lastUsedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'art-002',
    name: 'Summer Campaign',
    fileName: 'summer-campaign.pdf',
    fileUrl: 'https://images.unsplash.com/photo-1599081876663-4d3e7dd1e4a8?w=400&h=400&fit=crop',
    type: 'design',
    uploadedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    dimensions: { width: 3000, height: 2000, unit: 'px' },
    fileSize: 5000000,
    dpi: 300,
    tags: ['design', 'campaign', 'summer'],
    timesUsed: 3,
    lastUsedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'art-003',
    name: 'Product Photo',
    fileName: 'product-photo.jpg',
    fileUrl: 'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=400&h=400&fit=crop',
    type: 'photo',
    uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dimensions: { width: 4000, height: 3000, unit: 'px' },
    fileSize: 8000000,
    dpi: 300,
    tags: ['photo', 'product'],
    timesUsed: 2,
    lastUsedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
  },
];

export const sampleSavedProducts: SavedProduct[] = [
  {
    id: 'saved-001',
    productId: 'die-cut-stickers-vinyl',
    productName: 'Die-Cut Vinyl Stickers',
    productSlug: 'die-cut-vinyl-stickers',
    savedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    specifications: {
      size: '3" - 4"',
      material: 'vinyl',
      finish: 'holographic',
      quantity: 100,
    },
    notes: 'Great for outdoor use',
    isFavorite: true,
  },
  {
    id: 'saved-002',
    productId: 'roll-labels',
    productName: 'Roll Labels',
    productSlug: 'roll-labels',
    savedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    specifications: {
      size: '2" x 3"',
      material: 'kraft',
      finish: 'matte',
      quantity: 500,
    },
    notes: 'For product packaging',
    isFavorite: false,
  },
];

export const orderStatusColors: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  'pending-proof': { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Pending Proof' },
  'proof-approved': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Proof Approved' },
  'in-production': { bg: 'bg-purple-50', text: 'text-purple-700', label: 'In Production' },
  'shipped': { bg: 'bg-green-50', text: 'text-green-700', label: 'Shipped' },
  'delivered': { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Delivered' },
  'cancelled': { bg: 'bg-red-50', text: 'text-red-700', label: 'Cancelled' },
};

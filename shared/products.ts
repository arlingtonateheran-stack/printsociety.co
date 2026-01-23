// Product Types and Data Structure

export type ProductCategory = 'stickers' | 'labels' | 'sticker-sheets' | 'banners';
export type FinishType = 'matte' | 'glossy' | 'holographic' | 'metallic';
export type MaterialType = 'vinyl' | 'paper' | 'polyester' | 'kraft';
export type CutType = 'die-cut' | 'kiss-cut' | 'sheet' | 'roll';

export interface MaterialOption {
  id: string;
  name: string;
  type: MaterialType;
  description: string;
  priceMultiplier: number; // 1.0 = base price
}

export interface FinishOption {
  id: string;
  name: string;
  type: FinishType;
  description: string;
  priceMultiplier: number;
}

export interface SizeOption {
  id: string;
  label: string;
  width: number; // in inches
  height: number;
  unit: 'in' | 'cm';
}

export interface PricingTier {
  quantityMin: number;
  quantityMax: number;
  pricePerUnit: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  cutType: CutType;
  slug: string;
  description: string;
  fullDescription: string;
  basePrice: number;
  images: string[];
  features: string[];
  specifications: {
    materialOptions: MaterialOption[];
    finishOptions: FinishOption[];
    sizeOptions: SizeOption[];
    defaultSize: string; // size option id
    defaultMaterial: string; // material option id
    defaultFinish: string; // finish option id
  };
  pricingTiers: PricingTier[];
  turnaroundDays: number;
  minQuantity: number;
  maxQuantity: number;
  tags: string[];
}

// Sample Products Data
export const products: Product[] = [
  {
    id: 'die-cut-stickers-vinyl',
    name: 'Die-Cut Vinyl Stickers',
    category: 'stickers',
    cutType: 'die-cut',
    slug: 'die-cut-vinyl-stickers',
    description: 'Custom shaped stickers with perfect die-cut edges',
    fullDescription: 'Professional-grade die-cut vinyl stickers that follow your exact design shape. Perfect for laptops, water bottles, cars, and outdoor use. 3-5 year durability guarantee.',
    basePrice: 0.35,
    images: [
      'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599081876663-4d3e7dd1e4a8?w=800&h=800&fit=crop',
    ],
    features: [
      'Perfect die-cut to any shape',
      'Waterproof & weatherproof',
      '3-5 year outdoor durability',
      'Free online proof included',
      'Rush production available',
    ],
    specifications: {
      materialOptions: [
        { id: 'vinyl', name: 'Premium Vinyl', type: 'vinyl', description: 'Durable outdoor vinyl', priceMultiplier: 1.0 },
      ],
      finishOptions: [
        { id: 'glossy', name: 'Glossy', type: 'glossy', description: 'Shiny finish', priceMultiplier: 1.0 },
        { id: 'matte', name: 'Matte', type: 'matte', description: 'Non-reflective finish', priceMultiplier: 1.1 },
        { id: 'holographic', name: 'Holographic', type: 'holographic', description: 'Rainbow reflective', priceMultiplier: 1.5 },
      ],
      sizeOptions: [
        { id: 'small', label: '2" - 3"', width: 2.5, height: 2.5, unit: 'in' },
        { id: 'medium', label: '3" - 4"', width: 3.5, height: 3.5, unit: 'in' },
        { id: 'large', label: '4" - 5"', width: 4.5, height: 4.5, unit: 'in' },
        { id: 'xlarge', label: '6" +', width: 6, height: 6, unit: 'in' },
      ],
      defaultSize: 'medium',
      defaultMaterial: 'vinyl',
      defaultFinish: 'glossy',
    },
    pricingTiers: [
      { quantityMin: 50, quantityMax: 99, pricePerUnit: 0.35 },
      { quantityMin: 100, quantityMax: 249, pricePerUnit: 0.28 },
      { quantityMin: 250, quantityMax: 499, pricePerUnit: 0.22 },
      { quantityMin: 500, quantityMax: 999, pricePerUnit: 0.18 },
      { quantityMin: 1000, quantityMax: 999999, pricePerUnit: 0.15 },
    ],
    turnaroundDays: 3,
    minQuantity: 50,
    maxQuantity: 10000,
    tags: ['popular', 'vinyl', 'waterproof', 'outdoor'],
  },
  {
    id: 'sticker-sheets',
    name: 'Sticker Sheets',
    category: 'sticker-sheets',
    cutType: 'sheet',
    slug: 'sticker-sheets',
    description: 'Multiple stickers or designs on a single sheet',
    fullDescription: 'Perfect for variety or resale. Combine multiple designs on one sheet. Custom layout design included. Great for retailers and creative businesses.',
    basePrice: 1.50,
    images: [
      'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=800&h=800&fit=crop',
    ],
    features: [
      'Multiple designs per sheet',
      'Custom layout design',
      'Various sheet sizes available',
      'Great for resale/bundles',
      'Kiss-cut or die-cut available',
    ],
    specifications: {
      materialOptions: [
        { id: 'vinyl', name: 'Vinyl Sheet', type: 'vinyl', description: 'Durable vinyl', priceMultiplier: 1.0 },
        { id: 'paper', name: 'Paper Sheet', type: 'paper', description: 'Eco-friendly paper', priceMultiplier: 0.75 },
      ],
      finishOptions: [
        { id: 'glossy', name: 'Glossy', type: 'glossy', description: 'Shiny finish', priceMultiplier: 1.0 },
        { id: 'matte', name: 'Matte', type: 'matte', description: 'Non-reflective', priceMultiplier: 1.1 },
      ],
      sizeOptions: [
        { id: 'a4', label: 'A4 (8.5" x 11")', width: 8.5, height: 11, unit: 'in' },
        { id: 'a3', label: 'A3 (11" x 17")', width: 11, height: 17, unit: 'in' },
        { id: 'custom', label: 'Custom Size', width: 8.5, height: 11, unit: 'in' },
      ],
      defaultSize: 'a4',
      defaultMaterial: 'vinyl',
      defaultFinish: 'glossy',
    },
    pricingTiers: [
      { quantityMin: 25, quantityMax: 49, pricePerUnit: 1.50 },
      { quantityMin: 50, quantityMax: 99, pricePerUnit: 1.25 },
      { quantityMin: 100, quantityMax: 249, pricePerUnit: 1.00 },
      { quantityMin: 250, quantityMax: 999999, pricePerUnit: 0.80 },
    ],
    turnaroundDays: 5,
    minQuantity: 25,
    maxQuantity: 5000,
    tags: ['variety', 'resale', 'bulk'],
  },
  {
    id: 'roll-labels',
    name: 'Roll Labels',
    category: 'labels',
    cutType: 'roll',
    slug: 'roll-labels',
    description: 'Die-cut labels on convenient rolls',
    fullDescription: 'Professional roll labels perfect for product labeling, shipping, branding. Available in multiple sizes with various finish options.',
    basePrice: 0.12,
    images: [
      'https://images.unsplash.com/photo-1599081876663-4d3e7dd1e4a8?w=800&h=800&fit=crop',
    ],
    features: [
      'Convenient roll format',
      'Die-cut to your shape',
      'Strong adhesive',
      'Waterproof options',
      'Custom perforation',
    ],
    specifications: {
      materialOptions: [
        { id: 'paper', name: 'Paper Labels', type: 'paper', description: 'Standard paper', priceMultiplier: 1.0 },
        { id: 'kraft', name: 'Kraft Paper', type: 'kraft', description: 'Eco-friendly kraft', priceMultiplier: 1.2 },
        { id: 'vinyl', name: 'Vinyl Labels', type: 'vinyl', description: 'Weather-resistant', priceMultiplier: 1.5 },
      ],
      finishOptions: [
        { id: 'matte', name: 'Matte', type: 'matte', description: 'Natural finish', priceMultiplier: 1.0 },
        { id: 'glossy', name: 'Glossy', type: 'glossy', description: 'Shiny finish', priceMultiplier: 1.1 },
      ],
      sizeOptions: [
        { id: 'small', label: '1\" x 1\"', width: 1, height: 1, unit: 'in' },
        { id: 'medium', label: '2\" x 3\"', width: 2, height: 3, unit: 'in' },
        { id: 'large', label: '3\" x 4\"', width: 3, height: 4, unit: 'in' },
      ],
      defaultSize: 'medium',
      defaultMaterial: 'paper',
      defaultFinish: 'matte',
    },
    pricingTiers: [
      { quantityMin: 100, quantityMax: 249, pricePerUnit: 0.12 },
      { quantityMin: 250, quantityMax: 499, pricePerUnit: 0.10 },
      { quantityMin: 500, quantityMax: 999, pricePerUnit: 0.08 },
      { quantityMin: 1000, quantityMax: 999999, pricePerUnit: 0.06 },
    ],
    turnaroundDays: 4,
    minQuantity: 100,
    maxQuantity: 50000,
    tags: ['labels', 'rolls', 'professional'],
  },
  {
    id: 'vinyl-banners',
    name: 'Vinyl Banners',
    category: 'banners',
    cutType: 'sheet',
    slug: 'vinyl-banners',
    description: 'Large format vinyl banners for events and signage',
    fullDescription: 'Heavy-duty vinyl banners perfect for outdoor events, store signage, and promotions. Custom sizing and grommets available.',
    basePrice: 2.00,
    images: [
      'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=800&h=800&fit=crop',
    ],
    features: [
      'Heavy-duty 13oz vinyl',
      'Outdoor rated materials',
      'Grommets included',
      'Custom sizing',
      'UV resistant inks',
    ],
    specifications: {
      materialOptions: [
        { id: 'vinyl-13oz', name: 'Premium 13oz Vinyl', type: 'vinyl', description: 'Heavy-duty outdoor vinyl', priceMultiplier: 1.0 },
        { id: 'vinyl-18oz', name: 'Reinforced 18oz Vinyl', type: 'vinyl', description: 'Extra durable', priceMultiplier: 1.3 },
      ],
      finishOptions: [
        { id: 'matte', name: 'Matte', type: 'matte', description: 'Non-glare finish', priceMultiplier: 1.0 },
        { id: 'glossy', name: 'Glossy', type: 'glossy', description: 'High-impact colors', priceMultiplier: 1.1 },
      ],
      sizeOptions: [
        { id: '2x4', label: '2\' x 4\'', width: 24, height: 48, unit: 'in' },
        { id: '3x6', label: '3\' x 6\'', width: 36, height: 72, unit: 'in' },
        { id: '4x8', label: '4\' x 8\'', width: 48, height: 96, unit: 'in' },
        { id: 'custom', label: 'Custom Size', width: 24, height: 48, unit: 'in' },
      ],
      defaultSize: '2x4',
      defaultMaterial: 'vinyl-13oz',
      defaultFinish: 'matte',
    },
    pricingTiers: [
      { quantityMin: 1, quantityMax: 9, pricePerUnit: 2.00 },
      { quantityMin: 10, quantityMax: 24, pricePerUnit: 1.75 },
      { quantityMin: 25, quantityMax: 49, pricePerUnit: 1.50 },
      { quantityMin: 50, quantityMax: 999999, pricePerUnit: 1.25 },
    ],
    turnaroundDays: 4,
    minQuantity: 1,
    maxQuantity: 1000,
    tags: ['banners', 'large-format', 'outdoor'],
  },
  {
    id: 'kiss-cut-labels',
    name: 'Kiss-Cut Label Sheets',
    category: 'labels',
    cutType: 'kiss-cut',
    slug: 'kiss-cut-labels',
    description: 'Pre-cut labels still attached to backing for easy peeling',
    fullDescription: 'Labels are cut but remain attached to the backing sheet. Perfect for customers who want easy application without bulk rolls.',
    basePrice: 0.80,
    images: [
      'https://images.unsplash.com/photo-1599081876663-4d3e7dd1e4a8?w=800&h=800&fit=crop',
    ],
    features: [
      'Kiss-cut (easy peel)',
      'Stays on backing sheet',
      'Clean, professional look',
      'Great for self-application',
      'Custom shapes available',
    ],
    specifications: {
      materialOptions: [
        { id: 'paper', name: 'Paper', type: 'paper', description: 'Standard paper labels', priceMultiplier: 1.0 },
        { id: 'polyester', name: 'Polyester', type: 'polyester', description: 'Durable polyester', priceMultiplier: 1.4 },
      ],
      finishOptions: [
        { id: 'matte', name: 'Matte', type: 'matte', description: 'Matte finish', priceMultiplier: 1.0 },
        { id: 'glossy', name: 'Glossy', type: 'glossy', description: 'Glossy finish', priceMultiplier: 1.1 },
      ],
      sizeOptions: [
        { id: '1x1', label: '1\" x 1\"', width: 1, height: 1, unit: 'in' },
        { id: '2x2', label: '2\" x 2\"', width: 2, height: 2, unit: 'in' },
        { id: '3x3', label: '3\" x 3\"', width: 3, height: 3, unit: 'in' },
        { id: '4x6', label: '4\" x 6\"', width: 4, height: 6, unit: 'in' },
      ],
      defaultSize: '2x2',
      defaultMaterial: 'paper',
      defaultFinish: 'glossy',
    },
    pricingTiers: [
      { quantityMin: 10, quantityMax: 24, pricePerUnit: 0.80 },
      { quantityMin: 25, quantityMax: 49, pricePerUnit: 0.65 },
      { quantityMin: 50, quantityMax: 99, pricePerUnit: 0.50 },
      { quantityMin: 100, quantityMax: 999999, pricePerUnit: 0.40 },
    ],
    turnaroundDays: 3,
    minQuantity: 10,
    maxQuantity: 5000,
    tags: ['kiss-cut', 'labels', 'easy-peel'],
  },
];

export const categories = [
  { id: 'stickers', label: 'Custom Stickers', slug: 'stickers', icon: '🎨' },
  { id: 'labels', label: 'Labels', slug: 'labels', icon: '🏷️' },
  { id: 'sticker-sheets', label: 'Sticker Sheets', slug: 'sticker-sheets', icon: '📋' },
  { id: 'banners', label: 'Vinyl Banners', slug: 'banners', icon: '🚩' },
];

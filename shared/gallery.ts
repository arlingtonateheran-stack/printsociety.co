// Smart gallery system with intelligent CTAs
// Displays customer work and encourages action with contextual calls-to-action

export type GalleryItemType = 'customer-work' | 'showcase' | 'inspiration' | 'portfolio';
export type CTAType = 'order-similar' | 'customize' | 'view-product' | 'get-quote' | 'contact';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  type: GalleryItemType;
  
  // Attribution
  creatorName?: string;
  creatorTier?: string;
  businessName?: string;
  industry?: string;
  
  // Product info
  productId?: string;
  material?: string;
  dimensions?: string;
  quantity?: number;
  
  // Engagement
  views: number;
  likes: number;
  ctas: GalleryItem CTA[];
  
  // Metadata
  tags: string[];
  uploadedAt: Date;
  featured: boolean;
  featuredUntil?: Date;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface GalleryCTA {
  id: string;
  type: CTAType;
  label: string;
  description: string;
  actionUrl: string;
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'warning';
  position: 'overlay' | 'below' | 'side';
  visibility: 'always' | 'hover' | 'authenticated';
  priority: number; // 1 = highest
  conversionRate?: number;
}

export interface GalleryCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  itemCount: number;
  relatedProductIds: string[];
  tags: string[];
}

export interface SmartGalleryDisplay {
  items: GalleryItem[];
  totalItems: number;
  categories: GalleryCategory[];
  recommendations: GalleryItem[];
}

export interface PersonalizedGalleryContext {
  userId?: string;
  previouslyViewed?: string[];
  customerTier?: string;
  interests?: string[];
  purchaseHistory?: string[];
}

export interface GalleryAnalytics {
  itemId: string;
  views: number;
  ctaClicks: Map<string, number>;
  conversionRate: number;
  timeSpentSeconds: number;
  shareCount: number;
}

// Default gallery items
export const DEFAULT_GALLERY_CATEGORIES: GalleryCategory[] = [
  {
    id: 'customer-work',
    name: 'Customer Creations',
    description: 'Beautiful work from our customers',
    icon: '👥',
    itemCount: 0,
    relatedProductIds: [],
    tags: ['customer-work', 'real-world'],
  },
  {
    id: 'brand-portfolios',
    name: 'Brand Portfolios',
    description: 'Professional brand applications',
    icon: '🏢',
    itemCount: 0,
    relatedProductIds: [],
    tags: ['portfolio', 'business'],
  },
  {
    id: 'design-inspiration',
    name: 'Design Inspiration',
    description: 'Get inspired by trending designs',
    icon: '💡',
    itemCount: 0,
    relatedProductIds: [],
    tags: ['inspiration', 'trends'],
  },
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    description: 'Our best-selling products in action',
    icon: '⭐',
    itemCount: 0,
    relatedProductIds: [],
    tags: ['showcase', 'popular'],
  },
];

// CTA Templates
export const CTA_TEMPLATES: Record<CTAType, Partial<GalleryCTA>> = {
  'order-similar': {
    label: 'Order Similar',
    description: 'Create an order based on this design',
    icon: '🛒',
    color: 'primary',
    position: 'overlay',
  },
  'customize': {
    label: 'Customize',
    description: 'Customize this design for your brand',
    icon: '✏️',
    color: 'primary',
    position: 'overlay',
  },
  'view-product': {
    label: 'View Product',
    description: 'See more details about this product',
    icon: '👀',
    color: 'secondary',
    position: 'below',
  },
  'get-quote': {
    label: 'Get Quote',
    description: 'Request a custom quote for bulk orders',
    icon: '💬',
    color: 'success',
    position: 'side',
  },
  'contact': {
    label: 'Contact Us',
    description: 'Reach out for custom options',
    icon: '📧',
    color: 'secondary',
    position: 'below',
  },
};

// Functions
export function createGalleryItem(
  title: string,
  image: string,
  type: GalleryItemType,
  options?: Partial<GalleryItem>
): GalleryItem {
  return {
    id: `gallery-${Date.now()}`,
    title,
    image,
    type,
    description: options?.description || '',
    creatorName: options?.creatorName,
    creatorTier: options?.creatorTier,
    businessName: options?.businessName,
    industry: options?.industry,
    productId: options?.productId,
    material: options?.material,
    dimensions: options?.dimensions,
    quantity: options?.quantity,
    views: 0,
    likes: 0,
    ctas: options?.ctas || [],
    tags: options?.tags || [],
    uploadedAt: new Date(),
    featured: options?.featured || false,
    featuredUntil: options?.featuredUntil,
    seoTitle: options?.seoTitle,
    seoDescription: options?.seoDescription,
    seoKeywords: options?.seoKeywords,
  };
}

export function addCTA(
  item: GalleryItem,
  ctaType: CTAType,
  actionUrl: string,
  customLabel?: string
): GalleryItem {
  const template = CTA_TEMPLATES[ctaType];
  const newCTA: GalleryCTA = {
    id: `cta-${Date.now()}`,
    type: ctaType,
    label: customLabel || template.label || '',
    description: template.description || '',
    actionUrl,
    icon: template.icon || '',
    color: template.color || 'primary',
    position: template.position || 'overlay',
    visibility: 'always',
    priority: item.ctas.length + 1,
  };

  return {
    ...item,
    ctas: [...item.ctas, newCTA],
  };
}

export function getPersonalizedGalleryRecommendations(
  allItems: GalleryItem[],
  context: PersonalizedGalleryContext,
  limit: number = 6
): GalleryItem[] {
  let recommendations = [...allItems];

  // Boost featured items
  recommendations.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.likes !== b.likes) return b.likes - a.likes;
    return b.views - a.views;
  });

  // Filter based on interests
  if (context.interests && context.interests.length > 0) {
    recommendations = recommendations.filter((item) =>
      item.tags.some((tag) => context.interests!.includes(tag))
    );
  }

  // Filter out previously viewed for fresh content
  if (context.previouslyViewed && context.previouslyViewed.length > 0) {
    const unseenItems = recommendations.filter((item) =>
      !context.previouslyViewed!.includes(item.id)
    );
    recommendations = unseenItems.length > 0 ? unseenItems : recommendations;
  }

  // Tier-based recommendations
  if (context.customerTier === 'wholesale') {
    recommendations = recommendations.filter((item) =>
      item.type === 'brand-portfolios' || item.type === 'showcase'
    );
  }

  return recommendations.slice(0, limit);
}

export function optimizeCTAsForConversion(
  item: GalleryItem,
  analyticsHistory: GalleryAnalytics[]
): GalleryItem {
  // Sort CTAs by performance
  const ctaPerformance = new Map<string, number>();

  for (const analytics of analyticsHistory) {
    for (const [ctaId, clicks] of analytics.ctaClicks) {
      const current = ctaPerformance.get(ctaId) || 0;
      ctaPerformance.set(ctaId, current + clicks);
    }
  }

  const optimizedCTAs = item.ctas.sort(
    (a, b) =>
      (ctaPerformance.get(b.id) || 0) - (ctaPerformance.get(a.id) || 0)
  );

  // Update priorities
  const updatedCTAs = optimizedCTAs.map((cta, index) => ({
    ...cta,
    priority: index + 1,
  }));

  return {
    ...item,
    ctas: updatedCTAs,
  };
}

export function generateAutoPromptCTAs(item: GalleryItem): GalleryCTA[] {
  const ctas: GalleryCTA[] = [];

  // If it's customer work, suggest customization
  if (item.type === 'customer-work') {
    ctas.push({
      id: `auto-cta-customize-${item.id}`,
      type: 'customize',
      label: 'Customize This Design',
      description: 'Create your own version of this design',
      actionUrl: `/customize?templateId=${item.id}`,
      icon: '✏️',
      color: 'primary',
      position: 'overlay',
      visibility: 'authenticated',
      priority: 1,
    });
  }

  // If it's a product showcase, suggest viewing the product
  if (item.type === 'showcase' && item.productId) {
    ctas.push({
      id: `auto-cta-product-${item.id}`,
      type: 'view-product',
      label: 'View This Product',
      description: 'See details and order options',
      actionUrl: `/products/${item.productId}`,
      icon: '👀',
      color: 'secondary',
      position: 'below',
      visibility: 'always',
      priority: 2,
    });
  }

  // Add generic quote CTA for wholesale-applicable items
  if (item.quantity && item.quantity >= 500) {
    ctas.push({
      id: `auto-cta-quote-${item.id}`,
      type: 'get-quote',
      label: 'Bulk Order Quote',
      description: 'Get pricing for your bulk order',
      actionUrl: `/quote?items=${item.productId}&qty=${item.quantity}`,
      icon: '💬',
      color: 'success',
      position: 'side',
      visibility: 'always',
      priority: 3,
    });
  }

  return ctas;
}

export function getGalleryItemSEOData(item: GalleryItem): {
  title: string;
  description: string;
  keywords: string[];
  slug: string;
} {
  const slug = item.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    title: item.seoTitle || `${item.title} - Sticky Slap Gallery`,
    description:
      item.seoDescription ||
      `${item.description} Check out this amazing custom work on Sticky Slap.`,
    keywords: item.seoKeywords || item.tags,
    slug,
  };
}

export function trackGalleryEngagement(
  itemId: string,
  action: 'view' | 'like' | 'cta-click' | 'share',
  ctaId?: string
): GalleryAnalytics {
  const analytics: GalleryAnalytics = {
    itemId,
    views: action === 'view' ? 1 : 0,
    ctaClicks: new Map(),
    conversionRate: 0,
    timeSpentSeconds: 0,
    shareCount: action === 'share' ? 1 : 0,
  };

  if (action === 'cta-click' && ctaId) {
    analytics.ctaClicks.set(ctaId, 1);
  }

  return analytics;
}

export function calculateGalleryPerformanceScore(
  item: GalleryItem,
  analyticsData: GalleryAnalytics[]
): number {
  let score = 50; // Base score

  // Views
  score += Math.min(item.views / 100, 15); // Max +15 for high views

  // Engagement
  score += Math.min(item.likes / 10, 15); // Max +15 for likes

  // CTAs
  const totalCTAClicks = analyticsData.reduce(
    (sum, a) => sum + Array.from(a.ctaClicks.values()).reduce((s, c) => s + c, 0),
    0
  );
  score += Math.min(totalCTAClicks / 5, 20); // Max +20 for CTA clicks

  return Math.min(100, Math.round(score));
}
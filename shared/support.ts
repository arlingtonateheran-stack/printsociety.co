// Support System Types

export type TicketStatus = 'open' | 'pending' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'artwork' | 'order' | 'proof' | 'shipping' | 'billing' | 'product' | 'other';
export type ArticleCategory = 'getting-started' | 'artwork-setup' | 'proofing' | 'production' | 'shipping' | 'faq';

export interface HelpArticle {
  id: string;
  title: string;
  slug: string;
  category: ArticleCategory;
  content: string;
  excerpt: string;
  imageUrl?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  helpful: {
    yes: number;
    no: number;
  };
  relatedArticles: string[]; // article IDs
  tags: string[];
}

export interface TicketMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'customer' | 'support';
  message: string;
  attachments?: string[];
  createdAt: Date;
  isInternal: boolean; // Only visible to support team
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  messages: TicketMessage[];
  attachments?: string[];
  assignedTo?: string;
  relatedOrderId?: string;
  relatedProofId?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  responseTime?: number; // in minutes
  resolutionTime?: number; // in minutes
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: ArticleCategory;
  order: number;
  views: number;
  helpful: {
    yes: number;
    no: number;
  };
}

// Sample Help Articles
export const helpArticles: HelpArticle[] = [
  {
    id: 'article-001',
    title: 'How to Prepare Your Artwork for Printing',
    slug: 'prepare-artwork',
    category: 'artwork-setup',
    content: `
# Preparing Your Artwork for Professional Printing

## File Requirements
- **Resolution**: Minimum 300 DPI (dots per inch) for best quality
- **Color Mode**: CMYK for print (not RGB)
- **File Format**: PDF, PNG, AI, or EPS
- **Size**: Include 0.25" bleed on all sides

## Step-by-Step Guide

### 1. Resolution
Your artwork should be at least 300 DPI. This ensures crisp, clear printing.
- 72 DPI = Screen quality (NOT acceptable)
- 150 DPI = Acceptable for larger prints
- 300 DPI = Professional standard (RECOMMENDED)

### 2. Color Mode
Use CMYK color mode, not RGB. RGB is for screens, CMYK is for print.
- Go to Image → Mode → CMYK in Photoshop
- Most design software has this option

### 3. Bleed
Add 0.25" (6mm) of extra space around your design. This ensures color extends to the edge if trimmed slightly.

### 4. Fonts
Convert all text to outlines/paths to avoid font issues. This embeds the font in your file.

### 5. Save Your File
- Save as PDF for best results
- Or use PNG/AI for other options
- Test files locally before uploading

## Common Mistakes to Avoid
- ❌ Using RGB instead of CMYK
- ❌ 72 DPI instead of 300 DPI
- ❌ Text not converted to outlines
- ❌ Missing bleed area
- ❌ Transparent backgrounds (use white instead)

## Need Help?
Use our contact form or upload a file and our team will review it before production.
    `,
    excerpt: 'Learn how to prepare your artwork for professional printing with the correct DPI, color mode, and file format.',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    author: 'Support Team',
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    views: 342,
    helpful: { yes: 89, no: 5 },
    relatedArticles: ['article-002', 'article-003'],
    tags: ['artwork', 'dpi', 'setup', 'colors'],
  },
  {
    id: 'article-002',
    title: 'Understanding Color Modes: RGB vs CMYK',
    slug: 'rgb-vs-cmyk',
    category: 'artwork-setup',
    content: `
# RGB vs CMYK: Which Should You Use?

## Quick Answer
Use **CMYK** for print. Use **RGB** for screens.

## RGB (Red, Green, Blue)
- **Used for**: Screens, digital displays, websites, social media
- **Why**: Screens emit light, mixing red, green, and blue light creates all colors
- **Problem for print**: Printers can't reproduce these light-based colors accurately

## CMYK (Cyan, Magenta, Yellow, Key/Black)
- **Used for**: Print, physical products, stickers, labels
- **Why**: Printers use ink, which reflects light. CMYK inks are standard in printing
- **Advantage**: Perfect color matching and predictable results

## How to Convert

### In Photoshop
1. Go to Image → Mode → CMYK Color
2. Check "Don't flatten" if asked
3. Export as PDF

### In Illustrator
1. Go to File → Document Color Mode → CMYK

### In Other Software
Look for "Color Mode" or "Color Space" in the Image or File menu.

## Why Colors Look Different
When you switch from RGB to CMYK, colors may appear less vibrant. This is normal! CMYK has a smaller color gamut than RGB. Your printed colors will match the CMYK preview.

## Pro Tip
Always design with CMYK from the start if possible. This ensures you see accurate colors throughout your design process.
    `,
    excerpt: 'Understand the difference between RGB and CMYK color modes and when to use each one.',
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=400&fit=crop',
    author: 'Support Team',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    views: 267,
    helpful: { yes: 72, no: 3 },
    relatedArticles: ['article-001'],
    tags: ['colors', 'cmyk', 'rgb', 'artwork'],
  },
  {
    id: 'article-003',
    title: 'Getting Started with Your First Order',
    slug: 'first-order',
    category: 'getting-started',
    content: `
# Your First Order: Step-by-Step Guide

## Step 1: Browse Products
Visit our Shop and explore the product categories:
- **Die-Cut Stickers**: Custom shaped stickers for any purpose
- **Sticker Sheets**: Multiple designs on one sheet
- **Roll Labels**: Perfect for product labeling
- **Vinyl Banners**: Large format outdoor signage

## Step 2: Choose Your Specifications
Select your preferred:
- **Size**: Various options available per product
- **Material**: Different materials for different uses
- **Finish**: Glossy, matte, holographic, metallic
- **Quantity**: Bulk pricing available

## Step 3: Upload Your Artwork
- Click "Add Artwork"
- Upload your high-resolution file (300 DPI recommended)
- Our team will review for print-readiness
- Supported formats: PDF, PNG, AI, EPS

## Step 4: Review Your Proof
- You'll receive a digital proof within 24 hours
- Review for colors, sizing, and quality
- Request revisions if needed (up to 3 included)
- Approve to move to production

## Step 5: Production & Shipping
- After approval, production begins (3-5 business days for standard)
- You'll receive a tracking number
- Track your shipment in real-time
- Receive your order and enjoy!

## Need Help?
Each step has support available. Use the help icons or contact us at support@printsociety.co
    `,
    excerpt: 'Complete walkthrough of placing your first order from product selection to delivery.',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    author: 'Support Team',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    views: 521,
    helpful: { yes: 156, no: 8 },
    relatedArticles: ['article-001'],
    tags: ['getting-started', 'guide', 'order'],
  },
];

export const faqs: FAQ[] = [
  {
    id: 'faq-001',
    question: 'How long does production take?',
    answer: 'Standard production takes 3-5 business days from proof approval. Rush production (2-3 days) is available for an additional $25 fee. Shipping time is not included in production time.',
    category: 'production',
    order: 1,
    views: 234,
    helpful: { yes: 198, no: 12 },
  },
  {
    id: 'faq-002',
    question: 'What file formats do you accept?',
    answer: 'We accept PDF, PNG, AI (Adobe Illustrator), and EPS file formats. PDF is recommended for best results. All files should be 300 DPI for print quality.',
    category: 'artwork-setup',
    order: 2,
    views: 156,
    helpful: { yes: 132, no: 4 },
  },
  {
    id: 'faq-003',
    question: 'Can I request changes to my proof?',
    answer: 'Yes! Each order includes up to 3 revision requests at no additional cost. Common changes include color adjustments, sizing tweaks, and layout modifications. Revisions typically take 24 hours.',
    category: 'proofing',
    order: 3,
    views: 189,
    helpful: { yes: 167, no: 6 },
  },
  {
    id: 'faq-004',
    question: 'Do you offer bulk discounts?',
    answer: 'Yes! The more you order, the better your price. Pricing tiers start at 50 units and go up to 1000+. Check the product page for detailed pricing at different quantities.',
    category: 'faq',
    order: 4,
    views: 267,
    helpful: { yes: 203, no: 15 },
  },
  {
    id: 'faq-005',
    question: 'What shipping options are available?',
    answer: 'We offer Standard Shipping (free, 5-7 days) and Rush Shipping ($25, 2-3 days). All orders include tracking. International shipping is available for select countries.',
    category: 'shipping',
    order: 5,
    views: 341,
    helpful: { yes: 287, no: 22 },
  },
  {
    id: 'faq-006',
    question: 'What if I\'m not satisfied with my order?',
    answer: 'We guarantee quality on all orders. If you receive damaged or defective products, contact us within 7 days with photos. We\'ll replace your order or provide a full refund.',
    category: 'faq',
    order: 6,
    views: 178,
    helpful: { yes: 151, no: 8 },
  },
];

export const sampleTickets: SupportTicket[] = [
  {
    id: 'ticket-001',
    ticketNumber: 'TK-2025-001',
    customerId: 'user-001',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@example.com',
    subject: 'File format question for my sticker order',
    category: 'artwork',
    priority: 'medium',
    status: 'open',
    description:
      'I have a design in Photoshop that I want to use for my sticker order. Should I save it as PNG or PDF? The file is 8000x6000 pixels at 300 DPI.',
    messages: [
      {
        id: 'msg-001',
        authorId: 'user-001',
        authorName: 'Alex Johnson',
        authorRole: 'customer',
        message:
          'I have a design in Photoshop that I want to use for my sticker order. Should I save it as PNG or PDF? The file is 8000x6000 pixels at 300 DPI.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isInternal: false,
      },
      {
        id: 'msg-002',
        authorId: 'support-001',
        authorName: 'Sarah Support',
        authorRole: 'support',
        message:
          'Hi Alex! Great question. For stickers, we recommend PDF format as it preserves quality and prevents any color shift issues. However, PNG works great too if you prefer. Both are perfect for your specs. PDF is just slightly preferred for best results.',
        createdAt: new Date(Date.now() - 90 * 60 * 1000),
        isInternal: false,
      },
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 90 * 60 * 1000),
    responseTime: 90,
  },
  {
    id: 'ticket-002',
    ticketNumber: 'TK-2025-002',
    customerId: 'user-002',
    customerName: 'Jordan Martinez',
    customerEmail: 'jordan@example.com',
    subject: 'Tracking information for order ORD-2025-002',
    category: 'shipping',
    priority: 'high',
    status: 'pending',
    description:
      'My sticker order shows "shipped" but I don\'t have a tracking number yet. I need to know when it will arrive.',
    messages: [
      {
        id: 'msg-003',
        authorId: 'user-002',
        authorName: 'Jordan Martinez',
        authorRole: 'customer',
        message:
          'My sticker order shows "shipped" but I don\'t have a tracking number yet. I need to know when it will arrive.',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isInternal: false,
      },
      {
        id: 'msg-004',
        authorId: 'support-001',
        authorName: 'Sarah Support',
        authorRole: 'support',
        message:
          'Hi Jordan, let me look into this for you. I\'m checking the carrier system now.',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isInternal: false,
      },
    ],
    relatedOrderId: 'order-002',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    responseTime: 60,
  },
  {
    id: 'ticket-003',
    ticketNumber: 'TK-2025-003',
    customerId: 'user-003',
    customerName: 'Casey Williams',
    customerEmail: 'casey@example.com',
    subject: 'Proof approved and ready for production',
    category: 'proof',
    priority: 'low',
    status: 'resolved',
    description: 'Just wanted to confirm that I\'ve approved my proof and the order is ready for production.',
    messages: [
      {
        id: 'msg-005',
        authorId: 'user-003',
        authorName: 'Casey Williams',
        authorRole: 'customer',
        message: 'Just wanted to confirm that I\'ve approved my proof and the order is ready for production.',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isInternal: false,
      },
      {
        id: 'msg-006',
        authorId: 'support-002',
        authorName: 'Mike Helper',
        authorRole: 'support',
        message:
          'Perfect! Your proof has been marked as approved. Production starts immediately. You\'ll receive an update when your order ships. Thank you!',
        createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
        isInternal: false,
      },
    ],
    relatedProofId: 'proof-003',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
    responseTime: 60,
    resolutionTime: 1440,
  },
];

export const ticketStatusColors: Record<TicketStatus, { bg: string; text: string; label: string }> = {
  'open': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Open' },
  'pending': { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Pending' },
  'in-progress': { bg: 'bg-purple-50', text: 'text-purple-700', label: 'In Progress' },
  'resolved': { bg: 'bg-green-50', text: 'text-green-700', label: 'Resolved' },
  'closed': { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Closed' },
};

export const ticketPriorityColors: Record<TicketPriority, { bg: string; text: string; label: string }> = {
  'low': { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Low' },
  'medium': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Medium' },
  'high': { bg: 'bg-orange-50', text: 'text-orange-700', label: 'High' },
  'urgent': { bg: 'bg-red-50', text: 'text-red-700', label: 'Urgent' },
};

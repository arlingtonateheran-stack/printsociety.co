// Proof Types and Data Structure

export type ProofStatus = 'pending-review' | 'ready-for-approval' | 'approved' | 'revision-requested' | 'approved-final' | 'in-production' | 'completed';
export type CommentType = 'general' | 'revision-request' | 'approval';

export interface ProofComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'customer' | 'designer' | 'admin';
  content: string;
  type: CommentType;
  createdAt: Date;
  attachments?: string[]; // URLs to images/files
}

export interface ProofVersion {
  id: string;
  versionNumber: number;
  previewUrl: string; // High-res image or PDF
  generatedAt: Date;
  generatedBy: string;
  changes?: string; // Description of what changed from previous version
  status: ProofStatus;
}

export interface Proof {
  id: string;
  proofNumber: string;
  orderId: string;
  orderName: string;
  productName: string;
  productCategory: string;
  
  // Customer info
  customerId: string;
  customerName: string;
  customerEmail: string;
  
  // Proof content
  currentVersion: ProofVersion;
  versions: ProofVersion[];
  currentStatus: ProofStatus;
  
  // Specifications
  specifications: {
    quantity: number;
    size: string;
    material: string;
    finish: string;
    color?: string;
  };
  
  // Artwork
  artworkUrl: string;
  artworkNotes?: string;
  
  // Timeline
  createdAt: Date;
  firstSentAt?: Date;
  approvedAt?: Date;
  revisionRequestedAt?: Date;
  productionStartAt?: Date;
  completedAt?: Date;
  
  // Communication
  comments: ProofComment[];
  totalRevisions: number;
  maxRevisionsAllowed: number;
  
  // Approval tracking
  approvalDeadline: Date;
  approvalStatus: 'pending' | 'approved' | 'revision-pending' | 'expired';
  approvedBy?: string;
  revisionNotes?: string;
  
  // Additional info
  tags: string[];
  notes: string;
}

export interface ProofNotification {
  id: string;
  proofId: string;
  recipientId: string;
  recipientEmail: string;
  type: 'proof-ready' | 'revision-requested' | 'approved' | 'revision-submitted' | 'reminder';
  title: string;
  message: string;
  isRead: boolean;
  sentAt: Date;
  actionUrl?: string;
}

// Sample Proofs Data
export const sampleProofs: Proof[] = [
  {
    id: 'proof-001',
    proofNumber: 'PROOF-2025-001',
    orderId: 'order-001',
    orderName: 'Custom Sticker Pack',
    productName: 'Die-Cut Vinyl Stickers',
    productCategory: 'stickers',
    customerId: 'cust-001',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@example.com',
    currentVersion: {
      id: 'version-001-v2',
      versionNumber: 2,
      previewUrl: 'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=1200&h=1200&fit=crop',
      generatedAt: new Date(Date.now() - 86400000), // 1 day ago
      generatedBy: 'Designer: Sarah Chen',
      changes: 'Adjusted color saturation per customer feedback',
      status: 'ready-for-approval',
    },
    versions: [
      {
        id: 'version-001-v1',
        versionNumber: 1,
        previewUrl: 'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=1200&h=1200&fit=crop',
        generatedAt: new Date(Date.now() - 172800000), // 2 days ago
        generatedBy: 'Designer: Sarah Chen',
        changes: 'Initial proof generated',
        status: 'revision-requested',
      },
      {
        id: 'version-001-v2',
        versionNumber: 2,
        previewUrl: 'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=1200&h=1200&fit=crop',
        generatedAt: new Date(Date.now() - 86400000),
        generatedBy: 'Designer: Sarah Chen',
        changes: 'Adjusted color saturation per customer feedback',
        status: 'ready-for-approval',
      },
    ],
    currentStatus: 'ready-for-approval',
    specifications: {
      quantity: 500,
      size: '3" - 4"',
      material: 'vinyl',
      finish: 'glossy',
      color: 'full-color',
    },
    artworkUrl: 'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=1200&h=1200&fit=crop',
    artworkNotes: 'Customer uploaded high-res PNG file',
    createdAt: new Date(Date.now() - 172800000),
    firstSentAt: new Date(Date.now() - 172800000),
    revisionRequestedAt: new Date(Date.now() - 86400000),
    approvalDeadline: new Date(Date.now() + 604800000), // 7 days from now
    approvalStatus: 'pending',
    comments: [
      {
        id: 'comment-001',
        authorId: 'cust-001',
        authorName: 'Alex Johnson',
        authorRole: 'customer',
        content: 'The colors are a bit too dull. Can you make them more vibrant?',
        type: 'revision-request',
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: 'comment-002',
        authorId: 'designer-001',
        authorName: 'Sarah Chen',
        authorRole: 'designer',
        content: 'Adjusted the color saturation. Please take a look at the new version!',
        type: 'general',
        createdAt: new Date(Date.now() - 86400000),
      },
    ],
    totalRevisions: 1,
    maxRevisionsAllowed: 3,
    tags: ['urgent', 'high-value'],
    notes: 'VIP customer - expedite if possible',
  },
  {
    id: 'proof-002',
    proofNumber: 'PROOF-2025-002',
    orderId: 'order-002',
    orderName: 'Sticker Sheet Bundle',
    productName: 'Sticker Sheets',
    productCategory: 'sticker-sheets',
    customerId: 'cust-002',
    customerName: 'Jordan Martinez',
    customerEmail: 'jordan@example.com',
    currentVersion: {
      id: 'version-002-v1',
      versionNumber: 1,
      previewUrl: 'https://images.unsplash.com/photo-1599081876663-4d3e7dd1e4a8?w=1200&h=1200&fit=crop',
      generatedAt: new Date(Date.now() - 345600000), // 4 days ago
      generatedBy: 'Designer: Mike Johnson',
      changes: 'Initial proof generated',
      status: 'approved',
    },
    versions: [
      {
        id: 'version-002-v1',
        versionNumber: 1,
        previewUrl: 'https://images.unsplash.com/photo-1599081876663-4d3e7dd1e4a8?w=1200&h=1200&fit=crop',
        generatedAt: new Date(Date.now() - 345600000),
        generatedBy: 'Designer: Mike Johnson',
        changes: 'Initial proof generated',
        status: 'approved',
      },
    ],
    currentStatus: 'in-production',
    specifications: {
      quantity: 250,
      size: 'A4 (8.5" x 11")',
      material: 'vinyl',
      finish: 'matte',
    },
    artworkUrl: 'https://images.unsplash.com/photo-1599081876663-4d3e7dd1e4a8?w=1200&h=1200&fit=crop',
    createdAt: new Date(Date.now() - 345600000),
    firstSentAt: new Date(Date.now() - 345600000),
    approvedAt: new Date(Date.now() - 259200000), // 3 days ago
    productionStartAt: new Date(Date.now() - 172800000),
    approvalDeadline: new Date(Date.now() - 259200000),
    approvalStatus: 'approved',
    approvedBy: 'Jordan Martinez',
    comments: [
      {
        id: 'comment-003',
        authorId: 'cust-002',
        authorName: 'Jordan Martinez',
        authorRole: 'customer',
        content: 'Looks perfect! Ready to print.',
        type: 'approval',
        createdAt: new Date(Date.now() - 259200000),
      },
    ],
    totalRevisions: 0,
    maxRevisionsAllowed: 3,
    tags: ['approved', 'in-production'],
    notes: '',
  },
  {
    id: 'proof-003',
    proofNumber: 'PROOF-2025-003',
    orderId: 'order-003',
    orderName: 'Vinyl Banner Project',
    productName: 'Vinyl Banners',
    productCategory: 'banners',
    customerId: 'cust-003',
    customerName: 'Casey Williams',
    customerEmail: 'casey@example.com',
    currentVersion: {
      id: 'version-003-v1',
      versionNumber: 1,
      previewUrl: 'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=1200&h=1200&fit=crop',
      generatedAt: new Date(Date.now() - 3600000), // 1 hour ago
      generatedBy: 'Designer: Emma Lee',
      changes: 'Initial proof generated',
      status: 'ready-for-approval',
    },
    versions: [
      {
        id: 'version-003-v1',
        versionNumber: 1,
        previewUrl: 'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=1200&h=1200&fit=crop',
        generatedAt: new Date(Date.now() - 3600000),
        generatedBy: 'Designer: Emma Lee',
        changes: 'Initial proof generated',
        status: 'ready-for-approval',
      },
    ],
    currentStatus: 'ready-for-approval',
    specifications: {
      quantity: 5,
      size: '3\' x 6\'',
      material: 'vinyl-13oz',
      finish: 'glossy',
    },
    artworkUrl: 'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=1200&h=1200&fit=crop',
    createdAt: new Date(Date.now() - 3600000),
    firstSentAt: new Date(Date.now() - 3600000),
    approvalDeadline: new Date(Date.now() + 691200000), // 8 days from now
    approvalStatus: 'pending',
    comments: [],
    totalRevisions: 0,
    maxRevisionsAllowed: 3,
    tags: ['new', 'banner'],
    notes: 'Rush order - approval needed within 24 hours',
  },
];

export const proofStatusColors: Record<ProofStatus, { bg: string; text: string; label: string }> = {
  'pending-review': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Pending Review' },
  'ready-for-approval': { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Ready for Approval' },
  'revision-requested': { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Revision Requested' },
  'approved': { bg: 'bg-green-50', text: 'text-green-700', label: 'Approved' },
  'approved-final': { bg: 'bg-green-50', text: 'text-green-700', label: 'Approved (Final)' },
  'in-production': { bg: 'bg-purple-50', text: 'text-purple-700', label: 'In Production' },
  'completed': { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Completed' },
};

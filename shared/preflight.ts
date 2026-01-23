// Pre-Flight Validation System
// Automated checks for artwork files before proofing

// ============================================================================
// 1. FILE SPECIFICATIONS
// ============================================================================

export interface FileSpecs {
  filename: string;
  filesize: number; // in bytes
  dimensions?: {
    width: number;
    height: number;
    unit: 'px' | 'in' | 'mm';
  };
  resolution?: number; // DPI
  colorMode?: 'RGB' | 'CMYK' | 'Grayscale' | 'Indexed';
  hasTransparency?: boolean;
  hasBleed?: boolean;
  hasGuidelines?: boolean;
  fonts?: string[];
  fileFormat: 'PDF' | 'PNG' | 'JPG' | 'AI' | 'PSD' | 'EPS' | 'SVG' | 'TIFF';
}

// ============================================================================
// 2. PRE-FLIGHT CHECKS
// ============================================================================

export type CheckSeverity = 'pass' | 'warning' | 'error';

export interface PreFlightCheck {
  id: string;
  name: string;
  category: 'resolution' | 'color' | 'format' | 'content' | 'fonts' | 'safety';
  severity: CheckSeverity;
  message: string;
  suggestion?: string;
  isBlocking: boolean; // prevents approval if true
}

export interface PreFlightResult {
  fileId: string;
  filename: string;
  timestamp: Date;
  checks: PreFlightCheck[];
  printReadyScore: number; // 0-100
  overallStatus: 'pass' | 'warning' | 'error';
  canProceedToProof: boolean;
  estimatedIssues: string[];
}

// ============================================================================
// 3. VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  // Resolution checks
  minDPI: 300,
  minDPIWarning: 250, // warning threshold
  
  // File size
  maxFileSize: 100 * 1024 * 1024, // 100MB
  recommendedMaxSize: 50 * 1024 * 1024, // 50MB
  
  // Color modes
  acceptableColorModes: ['RGB', 'CMYK', 'Grayscale'],
  preferredColorMode: 'RGB', // will convert
  
  // File formats
  acceptableFormats: ['PDF', 'PNG', 'JPG', 'AI', 'PSD', 'EPS', 'SVG', 'TIFF'],
  preferredFormats: ['PDF', 'PNG', 'AI'],
  
  // Bleed requirements
  minBleedPixels: 12, // for 300 DPI
  recommendedBleedInches: 0.125, // 1/8 inch
  
  // Safe zones (avoid content here)
  minSafeZonePixels: 24, // for 300 DPI
  
  // Transparency warnings
  transparencyAllowed: true,
  transparencyWarningIfSmall: true, // warn if using transparency for small details
};

// ============================================================================
// 4. CHECK CATEGORIES
// ============================================================================

export const CHECK_CATEGORIES = {
  resolution: {
    label: 'Resolution',
    icon: '📐',
    description: 'DPI and image quality checks',
  },
  color: {
    label: 'Color Mode',
    icon: '🎨',
    description: 'RGB/CMYK and color space checks',
  },
  format: {
    label: 'File Format',
    icon: '📄',
    description: 'File type and compatibility checks',
  },
  content: {
    label: 'Content',
    icon: '📍',
    description: 'Layout, bleed, and safe zone checks',
  },
  fonts: {
    label: 'Fonts',
    icon: '🔤',
    description: 'Font embedding and outlining checks',
  },
  safety: {
    label: 'Safety',
    icon: '🛡️',
    description: 'File integrity and corruption checks',
  },
};

// ============================================================================
// 5. PRINT-READY SCORE CALCULATION
// ============================================================================

export interface ScoreBreakdown {
  resolution: number; // 0-20
  colorMode: number; // 0-20
  fileFormat: number; // 0-15
  bleedAndSafeZone: number; // 0-20
  fonts: number; // 0-15
  transparency: number; // 0-10
  total: number; // 0-100
}

// Scoring thresholds
export const SCORE_THRESHOLDS = {
  excellent: 90, // 90-100: Ready to print
  good: 75, // 75-89: Minor issues
  fair: 50, // 50-74: Needs review
  poor: 0, // 0-49: Major issues
};

export const SCORE_LABELS = {
  excellent: '✅ Print-Ready',
  good: '⚠️ Review Needed',
  fair: '🔧 Needs Work',
  poor: '❌ Not Ready',
};

// ============================================================================
// 6. COMMON ISSUES (Pre-defined messages)
// ============================================================================

export const COMMON_ISSUES = {
  // Resolution
  lowResolution: {
    name: 'Low Resolution',
    message: 'Image resolution is below 300 DPI',
    suggestion: 'Use high-resolution artwork (300 DPI minimum)',
    severity: 'error' as CheckSeverity,
    category: 'resolution' as const,
  },
  lowResolutionWarning: {
    name: 'Resolution Below Optimal',
    message: 'Image resolution is below 300 DPI but acceptable',
    suggestion: 'Ideally use 300+ DPI for best results',
    severity: 'warning' as CheckSeverity,
    category: 'resolution' as const,
  },
  
  // Color
  rgbMode: {
    name: 'RGB Color Mode',
    message: 'File is in RGB mode (will be converted to CMYK for printing)',
    suggestion: 'Consider converting to CMYK for accurate color matching',
    severity: 'warning' as CheckSeverity,
    category: 'color' as const,
  },
  
  // Format
  unsupportedFormat: {
    name: 'Unsupported Format',
    message: 'File format is not supported',
    suggestion: 'Use PDF, PNG, JPG, AI, PSD, EPS, SVG, or TIFF',
    severity: 'error' as CheckSeverity,
    category: 'format' as const,
  },
  jpgFormat: {
    name: 'JPG Format',
    message: 'JPG files may lose quality. PNG or PDF preferred',
    suggestion: 'Use PNG or PDF for better quality',
    severity: 'warning' as CheckSeverity,
    category: 'format' as const,
  },
  
  // Bleed
  missingBleed: {
    name: 'No Bleed',
    message: 'File does not have bleed area (content extends to edge)',
    suggestion: 'Add 1/8" (0.125") bleed on all edges',
    severity: 'error' as CheckSeverity,
    category: 'content' as const,
  },
  insufficientBleed: {
    name: 'Insufficient Bleed',
    message: 'Bleed is less than recommended',
    suggestion: 'Add at least 1/8" (0.125") bleed on all edges',
    severity: 'warning' as CheckSeverity,
    category: 'content' as const,
  },
  
  // Safe zone
  contentInSafeZone: {
    name: 'Content Too Close to Edge',
    message: 'Important content is too close to cut line',
    suggestion: 'Keep content at least 1/4" away from edge',
    severity: 'warning' as CheckSeverity,
    category: 'content' as const,
  },
  
  // Fonts
  unembeddedFonts: {
    name: 'Fonts Not Embedded',
    message: 'Some fonts are not embedded in the file',
    suggestion: 'Outline all fonts or embed them in the PDF',
    severity: 'error' as CheckSeverity,
    category: 'fonts' as const,
  },
  rasterizedText: {
    name: 'Text is Rasterized',
    message: 'Text has been converted to pixels and cannot be edited',
    suggestion: 'This is OK for printing, but ensure spelling is correct',
    severity: 'warning' as CheckSeverity,
    category: 'fonts' as const,
  },
  
  // Transparency
  transparencyIssues: {
    name: 'Transparency Detected',
    message: 'File contains transparency/alpha channels',
    suggestion: 'Ensure transparency is intentional and not accidental',
    severity: 'warning' as CheckSeverity,
    category: 'safety' as const,
  },
  
  // File issues
  corruptedFile: {
    name: 'File May Be Corrupted',
    message: 'Unable to fully read file structure',
    suggestion: 'Try re-exporting or re-saving the file',
    severity: 'error' as CheckSeverity,
    category: 'safety' as const,
  },
  fileTooLarge: {
    name: 'File Size Too Large',
    message: 'File is larger than recommended maximum',
    suggestion: 'Compress images or split into multiple files',
    severity: 'warning' as CheckSeverity,
    category: 'safety' as const,
  },
};

// ============================================================================
// 7. VALIDATION WORKFLOW
// ============================================================================

export interface ValidationWorkflow {
  fileId: string;
  uploadedAt: Date;
  results: PreFlightResult[];
  customerNotified: boolean;
  customerReadyToProceed: boolean;
  adminApproved?: boolean;
  adminNotes?: string;
  retries: number; // number of re-uploads
  status: 'pending' | 'pass' | 'warning' | 'fail';
}

// ============================================================================
// 8. CUSTOMER FEEDBACK
// ============================================================================

export interface PrintReadyFeedback {
  score: number;
  scoreLabel: string;
  status: 'ready' | 'review' | 'needs_work' | 'not_ready';
  summary: string;
  issues: {
    errors: string[];
    warnings: string[];
    tips: string[];
  };
  nextSteps: string[];
  estimatedTimeToFix?: string;
}

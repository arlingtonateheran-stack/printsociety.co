import {
  FileSpecs,
  PreFlightCheck,
  PreFlightResult,
  ScoreBreakdown,
  VALIDATION_RULES,
  CHECK_CATEGORIES,
  COMMON_ISSUES,
  PrintReadyFeedback,
  SCORE_THRESHOLDS,
  SCORE_LABELS,
} from './preflight';

/**
 * Calculate print-ready score based on file specifications
 * Scoring breakdown: max 100 points
 * - Resolution: 20 points
 * - Color Mode: 20 points
 * - File Format: 15 points
 * - Bleed & Safe Zone: 20 points
 * - Fonts: 15 points
 * - Transparency: 10 points
 */
export function calculatePrintReadyScore(specs: FileSpecs): ScoreBreakdown {
  let resolutionScore = 0;
  let colorModeScore = 0;
  let fileFormatScore = 0;
  let bleedAndSafeZoneScore = 0;
  let fontsScore = 0;
  let transparencyScore = 0;

  // ============================================================================
  // RESOLUTION SCORING (0-20 points)
  // ============================================================================
  if (specs.resolution) {
    if (specs.resolution >= VALIDATION_RULES.minDPI) {
      resolutionScore = 20; // Perfect
    } else if (specs.resolution >= VALIDATION_RULES.minDPIWarning) {
      resolutionScore = 15; // Acceptable but not ideal
    } else if (specs.resolution >= 150) {
      resolutionScore = 8; // Below minimum
    } else {
      resolutionScore = 0; // Way too low
    }
  } else {
    resolutionScore = 5; // Unknown resolution = risky
  }

  // ============================================================================
  // COLOR MODE SCORING (0-20 points)
  // ============================================================================
  if (specs.colorMode === 'CMYK') {
    colorModeScore = 20; // Perfect for printing
  } else if (specs.colorMode === 'RGB') {
    colorModeScore = 18; // Will be converted, minor loss
  } else if (specs.colorMode === 'Grayscale') {
    colorModeScore = 15; // OK for some products
  } else if (specs.colorMode === 'Indexed') {
    colorModeScore = 8; // Limited colors
  } else {
    colorModeScore = 0; // Unknown/problematic
  }

  // ============================================================================
  // FILE FORMAT SCORING (0-15 points)
  // ============================================================================
  const preferredFormats = ['PDF', 'AI', 'PNG'];
  const acceptableFormats = ['PSD', 'EPS', 'SVG', 'TIFF'];
  const problematicFormats = ['JPG'];

  if (preferredFormats.includes(specs.fileFormat)) {
    fileFormatScore = 15; // Ideal format
  } else if (acceptableFormats.includes(specs.fileFormat)) {
    fileFormatScore = 12; // Works fine
  } else if (problematicFormats.includes(specs.fileFormat)) {
    fileFormatScore = 8; // JPG quality loss
  } else {
    fileFormatScore = 0; // Unsupported
  }

  // ============================================================================
  // BLEED & SAFE ZONE SCORING (0-20 points)
  // ============================================================================
  let bleedScore = 10; // Neutral starting point
  let safeZoneScore = 10; // Neutral starting point

  if (specs.hasBleed) {
    bleedScore = 15; // Has bleed
  } else {
    bleedScore = 5; // No bleed detected
  }

  if (specs.hasGuidelines) {
    safeZoneScore = 15; // Has safe zone markers
  } else if (specs.hasBleed) {
    safeZoneScore = 10; // Bleed present, assume safe zone
  } else {
    safeZoneScore = 5; // No markers detected
  }

  bleedAndSafeZoneScore = Math.round((bleedScore + safeZoneScore) / 2);

  // ============================================================================
  // FONTS SCORING (0-15 points)
  // ============================================================================
  if (!specs.fonts || specs.fonts.length === 0) {
    // No text or text is already outlined
    fontsScore = 15; // No font issues possible
  } else {
    // If format supports font embedding/outlining
    if (['PDF', 'AI', 'PSD', 'EPS'].includes(specs.fileFormat)) {
      fontsScore = 12; // Likely embedded/outlined
    } else if (['PNG', 'JPG', 'TIFF'].includes(specs.fileFormat)) {
      fontsScore = 8; // Rasterized, fonts converted to pixels
    } else {
      fontsScore = 10; // Unknown
    }
  }

  // ============================================================================
  // TRANSPARENCY SCORING (0-10 points)
  // ============================================================================
  if (!specs.hasTransparency) {
    transparencyScore = 10; // No issues
  } else if (['PNG', 'PDF', 'SVG'].includes(specs.fileFormat)) {
    transparencyScore = 9; // Formats support transparency
  } else {
    transparencyScore = 6; // Transparency may not work properly
  }

  const total = Math.round(
    resolutionScore + colorModeScore + fileFormatScore + bleedAndSafeZoneScore + fontsScore + transparencyScore
  );

  return {
    resolution: resolutionScore,
    colorMode: colorModeScore,
    fileFormat: fileFormatScore,
    bleedAndSafeZone: bleedAndSafeZoneScore,
    fonts: fontsScore,
    transparency: transparencyScore,
    total: Math.min(100, total),
  };
}

/**
 * Generate pre-flight checks based on file specs
 */
export function generatePreFlightChecks(specs: FileSpecs): PreFlightCheck[] {
  const checks: PreFlightCheck[] = [];
  let checkId = 1;

  // ============================================================================
  // RESOLUTION CHECKS
  // ============================================================================
  if (specs.resolution) {
    if (specs.resolution < VALIDATION_RULES.minDPI) {
      if (specs.resolution < VALIDATION_RULES.minDPIWarning) {
        checks.push({
          id: `check-${checkId++}`,
          name: COMMON_ISSUES.lowResolution.name,
          category: 'resolution',
          severity: 'error',
          message: `Resolution is ${specs.resolution} DPI (minimum required: ${VALIDATION_RULES.minDPI} DPI)`,
          suggestion: COMMON_ISSUES.lowResolution.suggestion,
          isBlocking: true,
        });
      } else {
        checks.push({
          id: `check-${checkId++}`,
          name: COMMON_ISSUES.lowResolutionWarning.name,
          category: 'resolution',
          severity: 'warning',
          message: `Resolution is ${specs.resolution} DPI (recommended: ${VALIDATION_RULES.minDPI} DPI)`,
          suggestion: COMMON_ISSUES.lowResolutionWarning.suggestion,
          isBlocking: false,
        });
      }
    } else {
      checks.push({
        id: `check-${checkId++}`,
        name: 'Resolution OK',
        category: 'resolution',
        severity: 'pass',
        message: `Resolution is ${specs.resolution} DPI - excellent for printing`,
        isBlocking: false,
      });
    }
  } else {
    checks.push({
      id: `check-${checkId++}`,
      name: 'Resolution Unknown',
      category: 'resolution',
      severity: 'warning',
      message: 'Unable to determine image resolution',
      suggestion: 'Ensure your artwork is at least 300 DPI',
      isBlocking: false,
    });
  }

  // ============================================================================
  // COLOR MODE CHECKS
  // ============================================================================
  if (specs.colorMode === 'RGB') {
    checks.push({
      id: `check-${checkId++}`,
      name: COMMON_ISSUES.rgbMode.name,
      category: 'color',
      severity: 'warning',
      message: COMMON_ISSUES.rgbMode.message,
      suggestion: COMMON_ISSUES.rgbMode.suggestion,
      isBlocking: false,
    });
  } else if (specs.colorMode === 'CMYK') {
    checks.push({
      id: `check-${checkId++}`,
      name: 'Color Mode OK',
      category: 'color',
      severity: 'pass',
      message: 'File is in CMYK - perfect for printing',
      isBlocking: false,
    });
  } else if (!specs.colorMode) {
    checks.push({
      id: `check-${checkId++}`,
      name: 'Color Mode Unknown',
      category: 'color',
      severity: 'warning',
      message: 'Unable to determine color mode',
      suggestion: 'Ensure colors will print accurately',
      isBlocking: false,
    });
  }

  // ============================================================================
  // FILE FORMAT CHECKS
  // ============================================================================
  if (!VALIDATION_RULES.acceptableFormats.includes(specs.fileFormat)) {
    checks.push({
      id: `check-${checkId++}`,
      name: COMMON_ISSUES.unsupportedFormat.name,
      category: 'format',
      severity: 'error',
      message: `Format .${specs.fileFormat.toLowerCase()} is not supported`,
      suggestion: COMMON_ISSUES.unsupportedFormat.suggestion,
      isBlocking: true,
    });
  } else if (specs.fileFormat === 'JPG') {
    checks.push({
      id: `check-${checkId++}`,
      name: COMMON_ISSUES.jpgFormat.name,
      category: 'format',
      severity: 'warning',
      message: COMMON_ISSUES.jpgFormat.message,
      suggestion: COMMON_ISSUES.jpgFormat.suggestion,
      isBlocking: false,
    });
  } else {
    checks.push({
      id: `check-${checkId++}`,
      name: 'Format OK',
      category: 'format',
      severity: 'pass',
      message: `${specs.fileFormat} format is suitable for printing`,
      isBlocking: false,
    });
  }

  // ============================================================================
  // BLEED & SAFE ZONE CHECKS
  // ============================================================================
  if (!specs.hasBleed) {
    checks.push({
      id: `check-${checkId++}`,
      name: COMMON_ISSUES.missingBleed.name,
      category: 'content',
      severity: 'error',
      message: COMMON_ISSUES.missingBleed.message,
      suggestion: COMMON_ISSUES.missingBleed.suggestion,
      isBlocking: true,
    });
  } else {
    checks.push({
      id: `check-${checkId++}`,
      name: 'Bleed OK',
      category: 'content',
      severity: 'pass',
      message: 'File has proper bleed area',
      isBlocking: false,
    });
  }

  if (!specs.hasGuidelines) {
    checks.push({
      id: `check-${checkId++}`,
      name: 'No Safe Zone Markers',
      category: 'content',
      severity: 'warning',
      message: 'File does not have visible safe zone guidelines',
      suggestion: 'Keep important content 1/4" away from edges',
      isBlocking: false,
    });
  } else {
    checks.push({
      id: `check-${checkId++}`,
      name: 'Safe Zone OK',
      category: 'content',
      severity: 'pass',
      message: 'File has safe zone guidelines',
      isBlocking: false,
    });
  }

  // ============================================================================
  // FONT CHECKS
  // ============================================================================
  if (specs.fonts && specs.fonts.length > 0) {
    if (['PNG', 'JPG', 'TIFF'].includes(specs.fileFormat)) {
      checks.push({
        id: `check-${checkId++}`,
        name: COMMON_ISSUES.rasterizedText.name,
        category: 'fonts',
        severity: 'warning',
        message: COMMON_ISSUES.rasterizedText.message,
        suggestion: COMMON_ISSUES.rasterizedText.suggestion,
        isBlocking: false,
      });
    } else if (['PDF', 'AI', 'PSD', 'EPS'].includes(specs.fileFormat)) {
      checks.push({
        id: `check-${checkId++}`,
        name: 'Fonts OK',
        category: 'fonts',
        severity: 'pass',
        message: `${specs.fonts.length} font(s) detected - ensure they are embedded or outlined`,
        isBlocking: false,
      });
    }
  } else {
    checks.push({
      id: `check-${checkId++}`,
      name: 'No Fonts Detected',
      category: 'fonts',
      severity: 'pass',
      message: 'No fonts detected - all text is vectorized or rasterized',
      isBlocking: false,
    });
  }

  // ============================================================================
  // TRANSPARENCY CHECKS
  // ============================================================================
  if (specs.hasTransparency) {
    if (['PNG', 'PDF', 'SVG'].includes(specs.fileFormat)) {
      checks.push({
        id: `check-${checkId++}`,
        name: 'Transparency Detected',
        category: 'safety',
        severity: 'warning',
        message: 'File contains transparency - this is supported for this product',
        suggestion: 'Ensure transparency is intentional',
        isBlocking: false,
      });
    } else {
      checks.push({
        id: `check-${checkId++}`,
        name: 'Transparency Issue',
        category: 'safety',
        severity: 'error',
        message: `${specs.fileFormat} format does not properly support transparency`,
        suggestion: 'Remove transparency or convert to PNG/PDF',
        isBlocking: true,
      });
    }
  }

  // ============================================================================
  // FILE SIZE CHECK
  // ============================================================================
  if (specs.filesize > VALIDATION_RULES.maxFileSize) {
    checks.push({
      id: `check-${checkId++}`,
      name: COMMON_ISSUES.fileTooLarge.name,
      category: 'safety',
      severity: 'error',
      message: `File size is ${(specs.filesize / 1024 / 1024).toFixed(1)} MB (maximum: 100 MB)`,
      suggestion: COMMON_ISSUES.fileTooLarge.suggestion,
      isBlocking: true,
    });
  } else if (specs.filesize > VALIDATION_RULES.recommendedMaxSize) {
    checks.push({
      id: `check-${checkId++}`,
      name: 'Large File Size',
      category: 'safety',
      severity: 'warning',
      message: `File size is ${(specs.filesize / 1024 / 1024).toFixed(1)} MB (recommended max: 50 MB)`,
      suggestion: 'Consider compressing images to reduce file size',
      isBlocking: false,
    });
  }

  return checks;
}

/**
 * Generate comprehensive pre-flight result
 */
export function generatePreFlightResult(specs: FileSpecs): PreFlightResult {
  const scoreBreakdown = calculatePrintReadyScore(specs);
  const checks = generatePreFlightChecks(specs);
  
  const blockingErrors = checks.filter((c) => c.isBlocking && c.severity === 'error');
  const warnings = checks.filter((c) => c.severity === 'warning');
  const overallStatus =
    blockingErrors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'pass';

  return {
    fileId: `file-${Date.now()}`,
    filename: specs.filename,
    timestamp: new Date(),
    checks,
    printReadyScore: scoreBreakdown.total,
    overallStatus,
    canProceedToProof: blockingErrors.length === 0,
    estimatedIssues: [
      ...blockingErrors.map((c) => c.message),
      ...warnings.map((c) => c.message),
    ],
  };
}

/**
 * Generate customer-friendly feedback
 */
export function generatePrintReadyFeedback(result: PreFlightResult): PrintReadyFeedback {
  const score = result.printReadyScore;
  let status: 'ready' | 'review' | 'needs_work' | 'not_ready';
  let summary: string;

  if (score >= SCORE_THRESHOLDS.excellent) {
    status = 'ready';
    summary = 'Your artwork is ready for proofing!';
  } else if (score >= SCORE_THRESHOLDS.good) {
    status = 'review';
    summary = 'Your artwork is mostly ready, but has a few minor issues to review.';
  } else if (score >= SCORE_THRESHOLDS.fair) {
    status = 'needs_work';
    summary = 'Your artwork needs some adjustments before we can proceed.';
  } else {
    status = 'not_ready';
    summary = 'Your artwork has issues that must be fixed before proofing.';
  }

  const errors = result.checks.filter((c) => c.severity === 'error');
  const warnings = result.checks.filter((c) => c.severity === 'warning');
  const passes = result.checks.filter((c) => c.severity === 'pass');

  return {
    score,
    scoreLabel: SCORE_LABELS[status as keyof typeof SCORE_LABELS],
    status,
    summary,
    issues: {
      errors: errors.map((e) => `${e.name}: ${e.message}`),
      warnings: warnings.map((w) => `${w.name}: ${w.message}`),
      tips: passes.map((p) => `✓ ${p.message}`),
    },
    nextSteps: result.canProceedToProof
      ? ['Review the recommendations above', 'Click "Proceed to Proof" when ready']
      : ['Fix the errors listed above', 'Upload a corrected version', 'We will validate it automatically'],
  };
}

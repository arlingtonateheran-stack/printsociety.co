// Print-ready score calculator with weighted factors
// Provides detailed scoring breakdown for artwork quality assessment

import { PreflightResult, ArtworkMetadata, PrintSpecifications } from "./preflight";

export interface ScoreFactor {
  name: string;
  weight: number; // 0-1, total should equal 1.0
  score: number; // 0-100
  impact: number; // Calculated: weight * score / 100
}

export interface DetailedScore {
  overallScore: number; // 0-100
  factors: ScoreFactor[];
  factorBreakdown: {
    resolution: number;
    colorSpace: number;
    dimensions: number;
    bleed: number;
    format: number;
    transparency: number;
  };
  recommendation: string;
  readyToPrint: boolean;
  criticalIssues: number;
  warnings: number;
  estimatedCorrectionTime: number; // minutes
}

// Weights for different factors (total = 1.0)
const SCORE_WEIGHTS = {
  resolution: 0.25,
  colorSpace: 0.15,
  dimensions: 0.2,
  bleed: 0.15,
  format: 0.15,
  transparency: 0.1,
};

export function calculateResolutionScore(
  dpi: number,
  specs: PrintSpecifications
): number {
  const { minDPI, recommendedDPI, maxDPI } = specs;

  if (dpi >= recommendedDPI) {
    return Math.min(100, 100 - (dpi - recommendedDPI) * 0.01);
  } else if (dpi >= minDPI) {
    return ((dpi - minDPI) / (recommendedDPI - minDPI)) * 100;
  } else {
    return (dpi / minDPI) * 50; // Below min: 0-50
  }
}

export function calculateColorSpaceScore(
  colorSpace: string,
  specs: PrintSpecifications,
  hasErrors: boolean
): number {
  if (hasErrors) {
    return 0; // Critical error
  }

  if (colorSpace === specs.preferredColorSpace) {
    return 100;
  }

  if (colorSpace === "rgb" && specs.preferredColorSpace === "cmyk") {
    return 70; // Acceptable but not ideal
  }

  if (colorSpace === "grayscale") {
    return 50; // Limited but acceptable for certain products
  }

  return 30; // Unknown or problematic
}

export function calculateDimensionScore(
  width: number,
  height: number,
  specs: PrintSpecifications
): number {
  // Convert pixels to inches
  const widthInches = width / 72;
  const heightInches = height / 72;

  const targetWidth = specs.width;
  const targetHeight = specs.height;

  // Calculate how close dimensions are to target
  const widthRatio = Math.abs(widthInches - targetWidth) / targetWidth;
  const heightRatio = Math.abs(heightInches - targetHeight) / targetHeight;
  const avgRatio = (widthRatio + heightRatio) / 2;

  if (avgRatio < 0.05) {
    return 100; // Within 5%
  } else if (avgRatio < 0.1) {
    return 90;
  } else if (avgRatio < 0.2) {
    return 70;
  } else if (avgRatio < 0.5) {
    return 40;
  } else {
    return Math.max(0, 50 - avgRatio * 50);
  }
}

export function calculateBleedScore(metadata: ArtworkMetadata): number {
  if (metadata.bleedPresent) {
    return 100;
  }
  return 50; // Warning, but not critical for all products
}

export function calculateFormatScore(
  format: string,
  allowedFormats: string[]
): number {
  if (!allowedFormats.includes(format)) {
    return 0; // Not allowed
  }

  // Preferred formats for print
  const preferredFormats = ["pdf", "ai", "psd"];
  if (preferredFormats.includes(format)) {
    return 100;
  }

  // Acceptable formats
  if (["png", "jpg"].includes(format)) {
    return 80;
  }

  if (format === "svg") {
    return 60; // Vector but not all printers support well
  }

  return 40; // Other formats
}

export function calculateTransparencyScore(
  hasAlpha: boolean,
  format: string
): number {
  if (!hasAlpha) {
    return 100; // No transparency - best
  }

  if (format === "png") {
    return 90; // PNG supports transparency well
  }

  if (format === "pdf") {
    return 70; // PDF can have transparency but may cause issues
  }

  if (format === "jpg") {
    return 0; // JPG doesn't support transparency - critical error
  }

  if (["ai", "psd"].includes(format)) {
    return 85; // Native format, will be flattened during print prep
  }

  return 50; // Other formats
}

export function calculateDetailedScore(
  preflightResult: PreflightResult,
  specs: PrintSpecifications
): DetailedScore {
  const { metadata, errors, warnings } = preflightResult;

  // Calculate individual factor scores
  const resolutionScore = calculateResolutionScore(metadata.dpi, specs);
  const colorSpaceError = errors.some((e) => e.field === "colorSpace");
  const colorSpaceScore = calculateColorSpaceScore(
    metadata.colorSpace,
    specs,
    colorSpaceError
  );
  const dimensionScore = calculateDimensionScore(
    metadata.width,
    metadata.height,
    specs
  );
  const bleedScore = calculateBleedScore(metadata);
  const formatScore = calculateFormatScore(
    metadata.fileFormat,
    specs.allowedFormats
  );
  const transparencyScore = calculateTransparencyScore(
    metadata.hasAlpha,
    metadata.fileFormat
  );

  // Create factor array
  const factors: ScoreFactor[] = [
    {
      name: "Resolution (DPI)",
      weight: SCORE_WEIGHTS.resolution,
      score: resolutionScore,
      impact: (SCORE_WEIGHTS.resolution * resolutionScore) / 100,
    },
    {
      name: "Color Space",
      weight: SCORE_WEIGHTS.colorSpace,
      score: colorSpaceScore,
      impact: (SCORE_WEIGHTS.colorSpace * colorSpaceScore) / 100,
    },
    {
      name: "Dimensions",
      weight: SCORE_WEIGHTS.dimensions,
      score: dimensionScore,
      impact: (SCORE_WEIGHTS.dimensions * dimensionScore) / 100,
    },
    {
      name: "Bleed",
      weight: SCORE_WEIGHTS.bleed,
      score: bleedScore,
      impact: (SCORE_WEIGHTS.bleed * bleedScore) / 100,
    },
    {
      name: "File Format",
      weight: SCORE_WEIGHTS.format,
      score: formatScore,
      impact: (SCORE_WEIGHTS.format * formatScore) / 100,
    },
    {
      name: "Transparency",
      weight: SCORE_WEIGHTS.transparency,
      score: transparencyScore,
      impact: (SCORE_WEIGHTS.transparency * transparencyScore) / 100,
    },
  ];

  // Calculate overall score
  const overallScore = Math.round(
    factors.reduce((sum, factor) => sum + factor.impact, 0) * 100
  );

  // Adjust for critical errors
  const adjustedScore = errors.length > 0 ? Math.min(overallScore, 40) : overallScore;

  // Generate recommendation
  let recommendation = "";
  let readyToPrint = false;
  let estimatedCorrectionTime = 0;

  if (errors.length > 0) {
    recommendation = `Fix ${errors.length} critical issue(s) before printing`;
    readyToPrint = false;
    estimatedCorrectionTime = errors.length * 30; // 30 min per critical error
  } else if (adjustedScore >= 90) {
    recommendation = "Ready to print with minimal adjustments needed";
    readyToPrint = true;
    estimatedCorrectionTime = 0;
  } else if (adjustedScore >= 75) {
    recommendation = "Good quality, but addressing warnings will improve results";
    readyToPrint = true;
    estimatedCorrectionTime = warnings.length * 15;
  } else if (adjustedScore >= 60) {
    recommendation = "Acceptable for print, but significant improvements recommended";
    readyToPrint = true;
    estimatedCorrectionTime = warnings.length * 15 + 60;
  } else {
    recommendation = "Multiple issues should be corrected before printing";
    readyToPrint = false;
    estimatedCorrectionTime = (errors.length + warnings.length) * 20;
  }

  return {
    overallScore: adjustedScore,
    factors,
    factorBreakdown: {
      resolution: resolutionScore,
      colorSpace: colorSpaceScore,
      dimensions: dimensionScore,
      bleed: bleedScore,
      format: formatScore,
      transparency: transparencyScore,
    },
    recommendation,
    readyToPrint,
    criticalIssues: errors.length,
    warnings: warnings.length,
    estimatedCorrectionTime,
  };
}

export function getScoreGrade(score: number): {
  grade: string;
  label: string;
  color: string;
} {
  if (score >= 95) {
    return { grade: "A+", label: "Excellent", color: "emerald" };
  } else if (score >= 90) {
    return { grade: "A", label: "Very Good", color: "green" };
  } else if (score >= 80) {
    return { grade: "B", label: "Good", color: "blue" };
  } else if (score >= 70) {
    return { grade: "C", label: "Fair", color: "yellow" };
  } else if (score >= 60) {
    return { grade: "D", label: "Poor", color: "orange" };
  } else {
    return { grade: "F", label: "Unacceptable", color: "red" };
  }
}

export function getScoreTips(score: number): string[] {
  const tips: string[] = [];

  if (score < 60) {
    tips.push("Consider starting over with a new file at proper specifications");
  }

  if (score < 75) {
    tips.push("Use design software to make corrections rather than online tools");
  }

  if (score < 85) {
    tips.push("Double-check your file against the print requirements checklist");
  }

  if (score < 90) {
    tips.push("Review the warnings and implement suggestions");
  }

  if (score >= 90) {
    tips.push("Your file is excellent! Ready for print production");
  }

  return tips;
}

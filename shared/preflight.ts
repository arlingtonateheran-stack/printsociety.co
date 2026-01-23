// Pre-flight validation types and logic for artwork submission
// Checks file format, dimensions, color space, resolution, and bleed requirements

export type ValidationLevel = "critical" | "warning" | "info";
export type FileFormat = "pdf" | "png" | "jpg" | "svg" | "ai" | "psd";

export interface ValidationError {
  id: string;
  level: ValidationLevel;
  message: string;
  field: string;
  suggestion?: string;
}

export interface PreflightResult {
  isValid: boolean;
  printReadyScore: number; // 0-100
  errors: ValidationError[];
  warnings: ValidationError[];
  metadata: ArtworkMetadata;
}

export interface ArtworkMetadata {
  filename: string;
  fileFormat: FileFormat;
  fileSize: number; // in bytes
  width: number; // in pixels
  height: number; // in pixels
  dpi: number;
  colorSpace: ColorSpace;
  hasAlpha: boolean;
  bleedPresent: boolean;
}

export type ColorSpace = "rgb" | "cmyk" | "grayscale" | "lab" | "unknown";

export interface BleedRequirements {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PrintSpecifications {
  width: number; // in inches
  height: number; // in inches
  minDPI: number;
  maxDPI: number;
  recommendedDPI: number;
  bleedRequirements: BleedRequirements;
  allowedFormats: FileFormat[];
  preferredColorSpace: ColorSpace;
  requiresCMYK: boolean;
}

// Standard print specifications for different product types
export const PRINT_SPECS: Record<string, PrintSpecifications> = {
  sticker: {
    width: 4,
    height: 4,
    minDPI: 150,
    maxDPI: 600,
    recommendedDPI: 300,
    bleedRequirements: { top: 0.125, right: 0.125, bottom: 0.125, left: 0.125 },
    allowedFormats: ["pdf", "png", "jpg", "ai", "psd"],
    preferredColorSpace: "cmyk",
    requiresCMYK: false, // Can accept RGB but CMYK is preferred
  },
  label: {
    width: 3,
    height: 2,
    minDPI: 200,
    maxDPI: 600,
    recommendedDPI: 300,
    bleedRequirements: { top: 0.125, right: 0.125, bottom: 0.125, left: 0.125 },
    allowedFormats: ["pdf", "png", "jpg", "ai", "psd"],
    preferredColorSpace: "cmyk",
    requiresCMYK: true,
  },
  custom: {
    width: 12,
    height: 12,
    minDPI: 150,
    maxDPI: 600,
    recommendedDPI: 300,
    bleedRequirements: { top: 0.125, right: 0.125, bottom: 0.125, left: 0.125 },
    allowedFormats: ["pdf", "png", "jpg", "ai", "psd", "svg"],
    preferredColorSpace: "cmyk",
    requiresCMYK: false,
  },
};

// Validation functions
export function validateFileFormat(
  filename: string,
  allowedFormats: FileFormat[]
): ValidationError | null {
  const ext = filename.split(".").pop()?.toLowerCase() as FileFormat;
  if (!allowedFormats.includes(ext)) {
    return {
      id: "invalid-format",
      level: "critical",
      message: `File format .${ext} is not supported. Allowed formats: ${allowedFormats.join(
        ", "
      )}`,
      field: "file",
      suggestion: `Please convert your file to one of these formats: ${allowedFormats.join(
        ", "
      )}`,
    };
  }
  return null;
}

export function validateResolution(
  dpi: number,
  specs: PrintSpecifications
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (dpi < specs.minDPI) {
    errors.push({
      id: "low-resolution",
      level: "critical",
      message: `Resolution is ${dpi} DPI, but minimum required is ${specs.minDPI} DPI`,
      field: "dpi",
      suggestion: `Increase image resolution to at least ${specs.minDPI} DPI for print quality`,
    });
  }

  if (dpi < specs.recommendedDPI) {
    errors.push({
      id: "suboptimal-resolution",
      level: "warning",
      message: `Resolution is ${dpi} DPI. Recommended is ${specs.recommendedDPI} DPI for best quality`,
      field: "dpi",
      suggestion: `For best results, use ${specs.recommendedDPI} DPI`,
    });
  }

  if (dpi > specs.maxDPI) {
    errors.push({
      id: "excessive-resolution",
      level: "info",
      message: `Resolution is ${dpi} DPI, which exceeds maximum of ${specs.maxDPI} DPI`,
      field: "dpi",
      suggestion: `You can reduce to ${specs.recommendedDPI} DPI to reduce file size without quality loss`,
    });
  }

  return errors;
}

export function validateColorSpace(
  colorSpace: ColorSpace,
  specs: PrintSpecifications
): ValidationError | null {
  if (specs.requiresCMYK && colorSpace !== "cmyk") {
    return {
      id: "wrong-color-space",
      level: "critical",
      message: `Color space is ${colorSpace}, but CMYK is required for this product`,
      field: "colorSpace",
      suggestion: "Convert your file to CMYK color space using design software",
    };
  }

  if (colorSpace === "rgb" && specs.preferredColorSpace === "cmyk") {
    return {
      id: "non-optimal-color-space",
      level: "warning",
      message: "File is in RGB. CMYK is preferred for print accuracy",
      field: "colorSpace",
      suggestion: "Convert to CMYK for more accurate color reproduction",
    };
  }

  return null;
}

export function validateDimensions(
  width: number,
  height: number,
  specs: PrintSpecifications
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Convert pixels to inches (assuming 72 DPI for web dimensions)
  const widthInches = width / 72;
  const heightInches = height / 72;

  if (widthInches < specs.width * 0.9 || heightInches < specs.height * 0.9) {
    errors.push({
      id: "undersized",
      level: "critical",
      message: `Image dimensions (${widthInches.toFixed(
        1
      )}" × ${heightInches.toFixed(1)}")are smaller than specified size (${
        specs.width
      }" × ${specs.height}")`,
      field: "dimensions",
      suggestion: `Ensure your file is at least ${specs.width}" × ${specs.height}" at the desired DPI`,
    });
  }

  if (widthInches > specs.width * 1.1 || heightInches > specs.height * 1.1) {
    errors.push({
      id: "oversized",
      level: "warning",
      message: `Image is larger than specified size. Aspect ratio mismatch may cause cropping`,
      field: "dimensions",
    });
  }

  return errors;
}

export function validateBleed(
  metadata: ArtworkMetadata,
  requirements: BleedRequirements
): ValidationError | null {
  // This is a simplified check - actual bleed detection would require image analysis
  if (!metadata.bleedPresent) {
    return {
      id: "missing-bleed",
      level: "warning",
      message: `No bleed detected. Ensure your design extends ${requirements.top}" beyond cut lines`,
      field: "bleed",
      suggestion: `Add ${requirements.top}" of bleed on all sides to prevent white edges`,
    };
  }
  return null;
}

export function validateTransparency(
  hasAlpha: boolean,
  format: FileFormat
): ValidationError | null {
  if (hasAlpha && format === "jpg") {
    return {
      id: "transparency-with-jpg",
      level: "critical",
      message: "JPG files don't support transparency. Use PNG instead",
      field: "transparency",
      suggestion: "Export as PNG if your design uses transparency",
    };
  }

  if (hasAlpha && format === "pdf") {
    return {
      id: "transparency-in-pdf",
      level: "warning",
      message: "PDF contains transparent elements that may not render correctly",
      field: "transparency",
      suggestion: "Flatten transparency or use opaque backgrounds",
    };
  }

  return null;
}

export async function runPreflightValidation(
  metadata: ArtworkMetadata,
  productType: string = "sticker"
): Promise<PreflightResult> {
  const specs = PRINT_SPECS[productType] || PRINT_SPECS.custom;
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // 1. Validate file format
  const formatError = validateFileFormat(metadata.filename, specs.allowedFormats);
  if (formatError) {
    if (formatError.level === "critical") errors.push(formatError);
    else if (formatError.level === "warning") warnings.push(formatError);
  }

  // 2. Validate resolution
  const resolutionErrors = validateResolution(metadata.dpi, specs);
  resolutionErrors.forEach((err) => {
    if (err.level === "critical") errors.push(err);
    else warnings.push(err);
  });

  // 3. Validate color space
  const colorSpaceError = validateColorSpace(metadata.colorSpace, specs);
  if (colorSpaceError) {
    if (colorSpaceError.level === "critical") errors.push(colorSpaceError);
    else warnings.push(colorSpaceError);
  }

  // 4. Validate dimensions
  const dimensionErrors = validateDimensions(metadata.width, metadata.height, specs);
  dimensionErrors.forEach((err) => {
    if (err.level === "critical") errors.push(err);
    else warnings.push(err);
  });

  // 5. Validate bleed
  const bleedError = validateBleed(metadata, specs.bleedRequirements);
  if (bleedError) {
    if (bleedError.level === "critical") errors.push(bleedError);
    else warnings.push(bleedError);
  }

  // 6. Validate transparency
  const transparencyError = validateTransparency(metadata.hasAlpha, metadata.fileFormat);
  if (transparencyError) {
    if (transparencyError.level === "critical") errors.push(transparencyError);
    else warnings.push(transparencyError);
  }

  // Calculate print-ready score (0-100)
  // Start with 100, deduct points for issues
  let score = 100;
  score -= errors.length * 20;
  score -= warnings.length * 10;
  score = Math.max(0, Math.min(100, score));

  const isValid = errors.length === 0;

  return {
    isValid,
    printReadyScore: score,
    errors,
    warnings,
    metadata,
  };
}

export function getPrintReadyScoreLabel(score: number): {
  label: string;
  color: string;
  icon: string;
} {
  if (score >= 90) {
    return { label: "Print Ready", color: "green", icon: "✓" };
  } else if (score >= 70) {
    return { label: "Good", color: "blue", icon: "→" };
  } else if (score >= 50) {
    return { label: "Needs Improvement", color: "yellow", icon: "!" };
  } else {
    return { label: "Not Ready", color: "red", icon: "✕" };
  }
}

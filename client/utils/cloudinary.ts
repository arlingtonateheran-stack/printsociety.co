/**
 * Cloudinary utility functions for image transformation and delivery
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';

/**
 * Generate optimized Cloudinary image URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'thumb' | 'scale' | 'crop' | 'pad';
    quality?: 'auto' | 'low' | 'good' | 'best';
    format?: 'auto' | 'webp' | 'jpg' | 'png' | 'gif';
    gravity?: 'center' | 'face' | 'faces' | 'auto';
    dpr?: 'auto' | '1.0' | '2.0' | '3.0';
  }
): string {
  const transformations: string[] = [];

  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.crop) transformations.push(`c_${options.crop}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);
  if (options?.gravity) transformations.push(`g_${options.gravity}`);
  if (options?.dpr) transformations.push(`dpr_${options.dpr}`);

  const transformationString = transformations.length > 0 ? transformations.join(',') : '';
  const urlPath = transformationString ? `${transformationString}/` : '';

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${urlPath}${publicId}`;
}

/**
 * Generate srcSet for responsive images
 */
export function getCloudinarySrcSet(
  publicId: string,
  baseOptions?: {
    crop?: string;
    quality?: string;
    format?: string;
  }
): string {
  const widths = [100, 200, 400, 600, 800, 1200, 1600, 2000];
  
  const srcSetParts = widths.map(width => {
    const url = getCloudinaryUrl(publicId, {
      width,
      ...baseOptions,
    });
    return `${url} ${width}w`;
  });

  return srcSetParts.join(', ');
}

/**
 * Get thumbnail URL (small, optimized version)
 */
export function getCloudinaryThumbnail(
  publicId: string,
  size: number = 150
): string {
  return getCloudinaryUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    format: 'webp',
  });
}

/**
 * Get gallery image URL (optimized for display)
 */
export function getCloudinaryGalleryImage(
  publicId: string,
  width: number = 600
): string {
  return getCloudinaryUrl(publicId, {
    width,
    quality: 'good',
    format: 'auto',
  });
}

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicId(url: string): string {
  // If it's already a public ID, return it
  if (!url.includes('/')) return url;
  
  // Extract from Cloudinary URL
  const match = url.match(/upload\/(?:v\d+\/)?(.+?)(?:\?|$)/);
  return match ? match[1] : url;
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  created_at: string;
};

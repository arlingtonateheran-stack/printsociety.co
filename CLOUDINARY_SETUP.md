# Cloudinary Integration Setup Guide

This guide will help you set up Cloudinary for image management in your Print Society CO application.

## Step 1: Create a Cloudinary Account

1. Visit [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account
3. Confirm your email
4. Complete the setup wizard

## Step 2: Get Your Credentials

1. Go to your [Cloudinary Dashboard](https://cloudinary.com/console)
2. Note your **Cloud Name** (displayed at the top)
3. Create an **Upload Preset**:
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Name it: `ml_default`
   - Mode: Unsigned
   - Save

## Step 3: Configure Environment Variables

Add these to your `.env` file in the project root:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=ml_default
```

**Note:** Replace `your_cloud_name_here` with your actual Cloud Name from the dashboard.

## Step 4: Usage Examples

### Using the Utility Functions

```typescript
import { 
  getCloudinaryUrl, 
  getCloudinarySrcSet,
  getCloudinaryThumbnail,
  getCloudinaryGalleryImage 
} from '@/utils/cloudinary';

// Simple image URL
const imageUrl = getCloudinaryUrl('products/sticker-1');

// Responsive srcSet
const srcSet = getCloudinarySrcSet('products/sticker-1', {
  quality: 'auto',
  format: 'auto'
});

// Thumbnail (150x150, optimized)
const thumb = getCloudinaryThumbnail('products/sticker-1');

// Gallery image (600px wide, good quality)
const galleryImg = getCloudinaryGalleryImage('products/sticker-1');
```

### Using in Components

```typescript
import { getCloudinaryUrl, getCloudinarySrcSet } from '@/utils/cloudinary';

export function ProductImage() {
  const publicId = 'products/my-sticker';
  
  return (
    <img
      src={getCloudinaryUrl(publicId, { width: 600 })}
      srcSet={getCloudinarySrcSet(publicId)}
      alt="Product"
    />
  );
}
```

### Using the Upload Component

```typescript
import CloudinaryUpload from '@/components/CloudinaryUpload';

export function ProductUploadPage() {
  const handleUploadSuccess = (result: any) => {
    console.log('Upload successful:', result);
    // {
    //   public_id: 'sticky-slap/abc123',
    //   secure_url: 'https://res.cloudinary.com/...',
    //   width: 1920,
    //   height: 1080,
    //   bytes: 102400,
    //   format: 'jpg',
    //   created_at: '2024-01-01T00:00:00Z'
    // }
  };

  return (
    <CloudinaryUpload
      onUploadSuccess={handleUploadSuccess}
      folder="products"
      maxFileSize={10}
      multiple={false}
    />
  );
}
```

## Step 5: Update Gallery Images

### ProductGallerySection.tsx Example

Replace the sample image arrays with Cloudinary public IDs:

```typescript
const galleryImages = [
  'sticky-slap/product-1', // Just the public ID
  'sticky-slap/product-2',
  'sticky-slap/product-3',
];

const thumbnails = [
  'sticky-slap/product-1',
  'sticky-slap/product-2',
  'sticky-slap/product-3',
];

// In the render:
<img
  src={getCloudinaryGalleryImage(galleryImages[currentSlide])}
  alt={`Product ${currentSlide + 1}`}
  className="w-full h-full object-cover"
/>

// For thumbnails:
<img
  src={getCloudinaryThumbnail(thumbnails[idx])}
  alt={`Thumbnail ${idx + 1}`}
  className="w-full h-full object-cover"
/>
```

## Available Transformation Options

```typescript
getCloudinaryUrl(publicId, {
  width: 600,              // Image width in pixels
  height: 400,             // Image height in pixels
  crop: 'fill',            // 'fill', 'fit', 'thumb', 'scale', 'crop', 'pad'
  quality: 'auto',         // 'auto', 'low', 'good', 'best'
  format: 'auto',          // 'auto', 'webp', 'jpg', 'png', 'gif'
  gravity: 'auto',         // 'center', 'face', 'faces', 'auto'
  dpr: 'auto',             // Device pixel ratio: 'auto', '1.0', '2.0', '3.0'
});
```

## Organizing Your Assets

Recommended folder structure in Cloudinary:

```
sticky-slap/
├── products/
│   ├── sticker-1
│   ├── sticker-2
│   └── ...
├── gallery/
│   ├── image-1
│   └── ...
├── backgrounds/
└── logos/
```

When uploading, set the folder to `sticky-slap/products` for product images.

## Free Plan Limits

- **10GB storage** (sufficient for most projects)
- **20M transformations/month**
- **Unlimited bandwidth** for served images
- No watermarks
- Basic image editing and optimization

## Troubleshooting

### "Cloudinary widget not loaded"
- Ensure VITE_CLOUDINARY_CLOUD_NAME is set in .env
- Restart the dev server after adding .env variables

### Images not displaying
- Check that the Cloud Name matches your Cloudinary account
- Verify public IDs exist in your Cloudinary media library
- Test URLs in the Cloudinary dashboard

### Upload preset errors
- Go to Settings → Upload and verify the preset name
- Ensure the preset mode is set to "Unsigned"

## Next Steps

1. Upload your product images to Cloudinary
2. Update component image arrays with public IDs
3. Use the transformation utilities for different image sizes
4. Implement image optimization for performance

For more details, visit [Cloudinary Documentation](https://cloudinary.com/documentation)

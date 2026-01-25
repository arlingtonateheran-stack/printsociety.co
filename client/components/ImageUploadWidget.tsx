import { useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadWidgetProps {
  onUploadSuccess: (url: string, thumbnailUrl: string) => void;
  onUploadError: (error: string) => void;
}

export default function ImageUploadWidget({ onUploadSuccess, onUploadError }: ImageUploadWidgetProps) {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();

  useEffect(() => {
    // Load Cloudinary script
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/latest/eu.js';
      script.onload = initializeWidget;
      document.body.appendChild(script);
    } else {
      initializeWidget();
    }
  }, []);

  const initializeWidget = () => {
    cloudinaryRef.current = (window as any).cloudinary;
    
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        folder: 'print-society/gallery',
        resourceType: 'auto',
        maxFiles: 1,
      },
      (error: any, result: any) => {
        if (error) {
          onUploadError(error.message || 'Upload failed');
          return;
        }
        
        if (result.event === 'success') {
          const imageUrl = result.info.secure_url;
          // Create thumbnail URL (limit to 300x300)
          const thumbnailUrl = imageUrl.replace(
            /upload\//,
            'upload/w_300,h_300,c_fill,q_auto/'
          );
          
          onUploadSuccess(imageUrl, thumbnailUrl);
        }
      }
    );
  };

  const handleClick = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
    >
      <Upload size={18} />
      Upload Image
    </button>
  );
}

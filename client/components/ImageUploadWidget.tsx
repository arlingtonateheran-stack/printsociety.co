import { useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadWidgetProps {
  onUploadSuccess: (url: string, thumbnailUrl: string) => void;
  onUploadError: (error: string) => void;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function ImageUploadWidget({ onUploadSuccess, onUploadError }: ImageUploadWidgetProps) {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error('Missing Cloudinary config:', { cloudName, uploadPreset });
      onUploadError('Cloudinary configuration missing');
      return;
    }

    // Load Cloudinary script
    const loadScript = () => {
      if (window.cloudinary) {
        initializeWidget();
      } else {
        const script = document.createElement('script');
        script.src = 'https://upload-widget.cloudinary.com/latest/eu.js';
        script.async = true;
        script.onload = initializeWidget;
        script.onerror = () => {
          console.error('Failed to load Cloudinary script');
          onUploadError('Failed to load upload widget');
        };
        document.body.appendChild(script);
      }
    };

    const initializeWidget = () => {
      try {
        cloudinaryRef.current = window.cloudinary;

        widgetRef.current = cloudinaryRef.current.createUploadWidget(
          {
            cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
            uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
            folder: 'print-society/gallery',
            resourceType: 'auto',
            maxFiles: 1,
            showAdvancedOptions: false,
          },
          (error: any, result: any) => {
            if (error) {
              console.error('Upload error:', error);
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

        setIsReady(true);
      } catch (err) {
        console.error('Widget initialization error:', err);
        onUploadError('Failed to initialize upload widget');
      }
    };

    loadScript();
  }, [onUploadSuccess, onUploadError]);

  const handleClick = () => {
    if (widgetRef.current) {
      try {
        widgetRef.current.open();
      } catch (err) {
        console.error('Error opening widget:', err);
        onUploadError('Failed to open upload widget');
      }
    } else {
      onUploadError('Upload widget not ready. Please refresh the page.');
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      disabled={!isReady}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
    >
      <Upload size={18} />
      {isReady ? 'Upload Image' : 'Loading...'}
    </button>
  );
}

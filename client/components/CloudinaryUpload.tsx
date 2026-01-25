import { useEffect, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface CloudinaryUploadProps {
  onUploadSuccess: (result: any) => void;
  onUploadError?: (error: any) => void;
  multiple?: boolean;
  folder?: string;
  maxFileSize?: number; // in MB
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function CloudinaryUpload({
  onUploadSuccess,
  onUploadError,
  multiple = false,
  folder = 'sticky-slap',
  maxFileSize = 10,
}: CloudinaryUploadProps) {
  const widgetRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

  useEffect(() => {
    // Load Cloudinary script
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/latest/CloudinaryUploadWidget.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const openWidget = () => {
    if (!window.cloudinary) {
      console.error('Cloudinary widget not loaded');
      return;
    }

    setIsLoading(true);

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        folder: folder,
        multiple: multiple,
        maxFileSize: maxFileSize * 1024 * 1024, // Convert MB to bytes
        sources: ['local', 'url', 'camera'],
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        showAdvancedOptions: false,
        cropping: false,
        styles: {
          palette: {
            window: '#000000',
            windowBorder: '#3A64FF',
            tabIcon: '#ffffff',
            menuIcons: '#3A64FF',
            textDark: '#000000',
            textLight: '#ffffff',
            link: '#3A64FF',
            action: '#3A64FF',
            inactiveTabIcon: '#ffffff',
            error: '#FF0000',
            inProgress: '#3A64FF',
            complete: '#20B44B',
            sourceBg: '#E8E8E8',
          },
          fonts: {
            default: null,
            "'Fira Sans', sans-serif": {
              url: 'https://fonts.googleapis.com/css?family=Fira+Sans',
              active: true,
            },
          },
        },
      },
      (error: any, result: any) => {
        setIsLoading(false);

        if (error) {
          console.error('Upload error:', error);
          onUploadError?.(error);
          return;
        }

        if (result && result.event === 'success') {
          const uploadResult = result.info;
          setUploadedFiles([...uploadedFiles, uploadResult]);
          onUploadSuccess(uploadResult);
        }
      }
    );

    widgetRef.current = widget;
    widget.open();
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <button
        onClick={openWidget}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
      >
        <Upload size={20} />
        {isLoading ? 'Uploading...' : 'Upload Image'}
      </button>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Uploaded Files:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={file.secure_url}
                    alt={file.public_id}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.public_id}
                    </p>
                    <p className="text-xs text-gray-600">
                      {file.width}x{file.height}px
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  className="p-1 hover:bg-gray-200 rounded transition"
                  title="Remove"
                >
                  <X size={18} className="text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

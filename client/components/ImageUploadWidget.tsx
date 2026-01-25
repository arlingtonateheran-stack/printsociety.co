import { useState, useRef, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadWidgetProps {
  onUploadSuccess: (url: string, thumbnailUrl: string) => void;
  onUploadError: (error: string) => void;
}

export default function ImageUploadWidget({ onUploadSuccess, onUploadError }: ImageUploadWidgetProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary configuration missing');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'print-society/gallery');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.secure_url;

      // Create thumbnail URL (limit to 300x300)
      const thumbnailUrl = imageUrl.replace(
        /upload\//,
        'upload/w_300,h_300,c_fill,q_auto/'
      );

      onUploadSuccess(imageUrl, thumbnailUrl);
      toast.success('Image uploaded successfully');

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      onUploadError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
      <button
        onClick={handleClick}
        type="button"
        disabled={isUploading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
      >
        <Upload size={18} />
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </>
  );
}

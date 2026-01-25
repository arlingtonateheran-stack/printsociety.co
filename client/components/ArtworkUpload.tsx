import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadDesignFile } from '../lib/supabase';

interface UploadedDesign {
  file: File;
  preview: string;
  path: string;
  url: string;
}

interface ArtworkUploadProps {
  onUpload?: (design: UploadedDesign) => void;
}

export default function ArtworkUpload({ onUpload }: ArtworkUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDesign, setUploadedDesign] = useState<UploadedDesign | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    setError(null);

    // Validate file size (50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError(`File size exceeds 50MB limit. Your file is ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB.`);
      return;
    }

    if (selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);

      // Generate preview
      const reader = new FileReader();
      reader.onload = async (e) => {
        const previewData = e.target?.result as string;
        setPreview(previewData);

        // Upload to Supabase Storage
        try {
          setUploading(true);
          const { path, url } = await uploadDesignFile(selectedFile);

          const design: UploadedDesign = {
            file: selectedFile,
            preview: previewData,
            path,
            url
          };

          setUploadedDesign(design);
          onUpload?.(design);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Upload failed';
          setError(errorMsg);
          setPreview(null);
          setFile(null);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setError('Please upload an image file (PNG, JPG, GIF, etc.)');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setUploadedDesign(null);
    setError(null);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <h3 className="text-xs font-bold text-gray-700 uppercase mb-2">Upload Your Artwork</h3>
      <p className="text-xs text-gray-600 mb-2">Upload your artwork for custom stickers</p>

      {!preview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-4 text-center transition cursor-pointer ${
            dragActive
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          <Upload className="mx-auto mb-2 text-gray-400" size={28} />
          <p className="text-sm font-semibold text-gray-900 mb-1">
            Drag or click to upload
          </p>
          <p className="text-xs text-gray-600">
            All formats supported. Max file size: 50 MB | 1 file per order
          </p>
          <label className="hidden">
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.gif,.pdf,.ai,.psd"
              onChange={handleChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 object-contain bg-gray-100"
            />
          </div>

          <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-2">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
            <div className="text-xs text-green-900">
              <p className="font-semibold">{file?.name}</p>
              <p className="text-green-700">
                {(file?.size ? file.size / 1024 / 1024 : 0).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={clearFile}
              disabled={uploading}
              className="flex items-center justify-center gap-1 px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 transition font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={14} />
              Clear
            </button>
            <label>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.gif,.pdf,.ai,.psd"
                onChange={handleChange}
                disabled={uploading}
                className="hidden"
              />
              <span className={`flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 rounded text-xs font-semibold text-gray-800 ${
                uploading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-300 transition cursor-pointer'
              }`}>
                <Upload size={14} />
                {uploading ? 'Uploading...' : 'Replace'}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-2 mt-2">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-red-900">{error}</p>
        </div>
      )}

      {/* File Requirements - Compact */}
      <div className="text-xs text-gray-600 mt-2 space-y-1">
        <p className="font-semibold text-gray-700 mb-1">Requirements:</p>
        <ul className="space-y-0.5 text-gray-700">
          <li>• Resolution: 300 DPI or higher</li>
          <li>• Color Mode: RGB or CMYK</li>
          <li>• Bleed: Include 0.125" for edge printing</li>
          <li>• Font: Convert to outlines or embed</li>
        </ul>
      </div>
    </div>
  );
}

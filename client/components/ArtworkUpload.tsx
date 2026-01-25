import { useState } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';

interface ArtworkUploadProps {
  onUpload?: (file: File, preview: string) => void;
}

export default function ArtworkUpload({ onUpload }: ArtworkUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewData = e.target?.result as string;
        setPreview(previewData);
        onUpload?.(selectedFile, previewData);
      };
      reader.readAsDataURL(selectedFile);
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
              className="flex items-center justify-center gap-1 px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 transition font-semibold text-gray-700"
            >
              <X size={14} />
              Clear
            </button>
            <label>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.gif,.pdf,.ai,.psd"
                onChange={handleChange}
                className="hidden"
              />
              <span className="flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300 transition font-semibold text-gray-800 cursor-pointer">
                <Upload size={14} />
                Replace
              </span>
            </label>
          </div>
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

import { useState } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';

interface ArtworkUploadProps {
  onUpload?: (file: File) => void;
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
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      onUpload?.(selectedFile);
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
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-black mb-4">Upload Your Artwork</h3>

        {!preview ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-primary'
            }`}
          >
            <Upload className="mx-auto mb-4 text-gray-400" size={40} />
            <p className="text-lg font-semibold text-black mb-2">
              Drag and drop your artwork here
            </p>
            <p className="text-gray-600 mb-4">or</p>
            <label className="inline-block">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleChange}
                className="hidden"
              />
              <span className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition cursor-pointer">
                Choose File
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-4">
              Supported formats: PNG, JPG, PDF, SVG (Max 10MB)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-contain bg-gray-50"
              />
            </div>

            <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-green-900">
                <p className="font-semibold mb-1">{file?.name}</p>
                <p className="text-xs text-green-800">
                  {(file?.size ? file.size / 1024 / 1024 : 0).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={clearFile}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-black"
              >
                <X size={18} />
                Clear
              </button>
              <label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-semibold text-black cursor-pointer">
                  <Upload size={18} />
                  Replace
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* File Requirements */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <p className="font-semibold text-black">File Requirements:</p>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Resolution: 300 DPI or higher for best quality</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Color Mode: RGB or CMYK</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Bleed: Include 0.125" bleed for edge-to-edge printing</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Font: Convert text to outlines or embed fonts</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

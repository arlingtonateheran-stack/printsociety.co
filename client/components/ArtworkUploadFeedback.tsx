import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { runPreflightValidation, ArtworkMetadata } from "@/shared/preflight";
import { calculateDetailedScore } from "@/shared/scoreCalculator";
import {
  Upload,
  FileUp,
  CheckCircle,
  AlertCircle,
  Loader,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

interface ArtworkUploadFeedbackProps {
  productType?: string;
  onValidationComplete?: (result: any) => void;
  onError?: (error: string) => void;
}

interface UploadState {
  file: File | null;
  loading: boolean;
  error: string | null;
  progress: number;
  showPreview: boolean;
}

export default function ArtworkUploadFeedback({
  productType = "sticker",
  onValidationComplete,
  onError,
}: ArtworkUploadFeedbackProps) {
  const [state, setState] = useState<UploadState>({
    file: null,
    loading: false,
    error: null,
    progress: 0,
    showPreview: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragOverRef = useRef(false);

  const allowedFormats = [
    "pdf",
    "png",
    "jpg",
    "jpeg",
    "svg",
    "ai",
    "psd",
  ];

  const handleFileSelect = async (file: File) => {
    // Validate file type
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedFormats.includes(fileExtension)) {
      const error = `Invalid file type. Allowed: ${allowedFormats.join(", ")}`;
      setState((prev) => ({ ...prev, error, file: null }));
      onError?.(error);
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      const error = "File size exceeds 50MB limit";
      setState((prev) => ({ ...prev, error, file: null }));
      onError?.(error);
      return;
    }

    setState((prev) => ({
      ...prev,
      file,
      error: null,
      loading: true,
      progress: 0,
    }));

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 30, 90),
        }));
      }, 100);

      // Simulate file analysis (in production, this would call an API)
      const metadata = await analyzeFile(file);

      clearInterval(progressInterval);

      // Run preflight validation
      const preflightResult = await runPreflightValidation(
        metadata,
        productType
      );
      const detailedScore = calculateDetailedScore(preflightResult, {
        width: 4,
        height: 4,
        minDPI: 150,
        maxDPI: 600,
        recommendedDPI: 300,
        bleedRequirements: {
          top: 0.125,
          right: 0.125,
          bottom: 0.125,
          left: 0.125,
        },
        allowedFormats: allowedFormats as any,
        preferredColorSpace: "cmyk",
        requiresCMYK: false,
      });

      setState((prev) => ({
        ...prev,
        loading: false,
        progress: 100,
      }));

      onValidationComplete?.({ preflightResult, detailedScore });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to analyze file";
      setState((prev) => ({
        ...prev,
        error: errorMsg,
        loading: false,
        file: null,
      }));
      onError?.(errorMsg);
    }
  };

  const analyzeFile = async (file: File): Promise<ArtworkMetadata> => {
    return new Promise((resolve) => {
      // Simulate reading file metadata
      const reader = new FileReader();

      reader.onload = (event) => {
        // In production, use a library like Image.js or sharp to get actual metadata
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const ext = file.name.split(".").pop()?.toLowerCase() as any;
          resolve({
            filename: file.name,
            fileFormat: ext,
            fileSize: file.size,
            width: img.width,
            height: img.height,
            dpi: 72, // Default, should be extracted from EXIF
            colorSpace: "rgb",
            hasAlpha: false,
            bleedPresent: false,
          });
        };

        img.onerror = () => {
          // Fallback for non-image files
          resolve({
            filename: file.name,
            fileFormat: ext,
            fileSize: file.size,
            width: 1000,
            height: 1000,
            dpi: 300,
            colorSpace: "rgb",
            hasAlpha: false,
            bleedPresent: false,
          });
        };
      };

      if (file.type.startsWith("image/")) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsArrayBuffer(file);
        setTimeout(() => {
          resolve({
            filename: file.name,
            fileFormat: ext,
            fileSize: file.size,
            width: 2400,
            height: 2400,
            dpi: 300,
            colorSpace: "cmyk",
            hasAlpha: false,
            bleedPresent: true,
          });
        }, 500);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    dragOverRef.current = true;
  };

  const handleDragLeave = () => {
    dragOverRef.current = false;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragOverRef.current = false;
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearFile = () => {
    setState({
      file: null,
      loading: false,
      error: null,
      progress: 0,
      showPreview: true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      {!state.file && (
        <Card
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
            dragOverRef.current
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedFormats.map((f) => `.${f}`).join(",")}
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                Drop your artwork here
              </p>
              <p className="text-sm text-gray-600">or click to browse</p>
            </div>
            <p className="text-xs text-gray-500">
              Supported: {allowedFormats.join(", ")} • Max 50MB
            </p>
          </div>
        </Card>
      )}

      {/* File Selected State */}
      {state.file && (
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FileUp className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {state.file.name}
                </p>
                <p className="text-sm text-gray-600">
                  {(state.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!state.loading && (
              <button
                onClick={clearFile}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {state.loading && (
            <div className="space-y-3">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader className="w-4 h-4 animate-spin" />
                Analyzing artwork...
              </div>
            </div>
          )}

          {/* Error State */}
          {state.error && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Upload Error</p>
                <p className="text-sm text-red-700 mt-1">{state.error}</p>
              </div>
            </div>
          )}

          {/* Success State */}
          {state.progress === 100 && !state.error && (
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">File Processed</p>
                <p className="text-sm text-green-700 mt-1">
                  Validation complete. Review results below.
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Requirements Checklist */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Before You Upload</h3>
        <div className="space-y-2">
          {[
            "Minimum 150 DPI (300 DPI recommended)",
            "Supported formats: PDF, PNG, JPG, SVG, AI, PSD",
            "CMYK color space preferred for print accuracy",
            "Include 0.125\" bleed on all sides",
            "File size under 50MB",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">
                ✓
              </div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Supported Formats */}
      <Card className="p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Supported Formats</h3>
          <button
            onClick={() =>
              setState((prev) => ({ ...prev, showPreview: !prev.showPreview }))
            }
            className="text-gray-600 hover:text-gray-900"
          >
            {state.showPreview ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {state.showPreview && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                name: "PDF",
                icon: "📄",
                desc: "Vector format - preferred",
              },
              {
                name: "PNG",
                icon: "🖼️",
                desc: "Raster with transparency",
              },
              { name: "JPG", icon: "📸", desc: "Raster without transparency" },
              { name: "SVG", icon: "✨", desc: "Scalable vector" },
              { name: "AI", icon: "🎨", desc: "Adobe Illustrator" },
              { name: "PSD", icon: "🎬", desc: "Adobe Photoshop" },
            ].map((format) => (
              <div
                key={format.name}
                className="p-3 bg-white rounded-lg border border-gray-200 text-center"
              >
                <div className="text-2xl mb-1">{format.icon}</div>
                <div className="text-xs font-semibold text-gray-900">
                  {format.name}
                </div>
                <div className="text-xs text-gray-600">{format.desc}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

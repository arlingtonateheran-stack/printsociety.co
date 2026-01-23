import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, CheckCircle, AlertCircle, X } from "lucide-react";
import type { CartLineItem } from "@shared/cart";

interface ArtworkUploadCheckoutProps {
  lineItems: CartLineItem[];
  onArtworkUpload: (itemId: string, fileUrl: string, fileName: string) => void;
  onArtworkRemove: (itemId: string) => void;
}

export function ArtworkUploadCheckout({
  lineItems,
  onArtworkUpload,
  onArtworkRemove,
}: ArtworkUploadCheckoutProps) {
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, { name: string; url: string }>
  >({});

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploadingItemId(itemId);

    // Validate file type
    const validTypes = ["application/pdf", "image/png", "image/jpeg", "application/postscript"];
    if (!validTypes.includes(file.type)) {
      setUploadError(
        "Invalid file type. Please upload PDF, PNG, JPG, or AI files."
      );
      setUploadingItemId(null);
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(
        "File size exceeds 10MB limit. Please compress your file."
      );
      setUploadingItemId(null);
      return;
    }

    // Simulate file upload (in real app, would upload to server/S3)
    setTimeout(() => {
      const fileUrl = URL.createObjectURL(file);
      setUploadedFiles((prev) => ({
        ...prev,
        [itemId]: { name: file.name, url: fileUrl },
      }));
      onArtworkUpload(itemId, fileUrl, file.name);
      setUploadingItemId(null);
    }, 1000);
  };

  const handleRemoveFile = (itemId: string) => {
    setUploadedFiles((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
    onArtworkRemove(itemId);
  };

  const pendingItems = lineItems.filter(
    (item) => item.artworkStatus === "pending"
  );
  const uploadedItems = lineItems.filter(
    (item) => item.artworkStatus === "uploaded" && uploadedFiles[item.id]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Upload Artwork</h2>

      {/* Important Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          High-resolution artwork (minimum 300 DPI) is required for production.
          You must upload artwork for all items before completing checkout.
        </AlertDescription>
      </Alert>

      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {/* Pending Uploads */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Items Needing Artwork ({pendingItems.length})
          </h3>
          {pendingItems.length === 0 && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle size={16} />
              All artwork uploaded
            </span>
          )}
        </div>

        {pendingItems.map((item) => (
          <Card key={item.id} className="p-4 border-2 border-dashed">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold">{item.productName}</h4>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} | {item.size} | {item.material}
                </p>
              </div>
            </div>

            <label className="block">
              <input
                type="file"
                onChange={(e) => handleFileSelect(e, item.id)}
                disabled={uploadingItemId === item.id}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.ai,.eps"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition cursor-pointer text-center">
                <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                <p className="text-sm font-medium text-gray-700">
                  {uploadingItemId === item.id
                    ? "Uploading..."
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500">
                  PDF, PNG, JPG, or AI (max 10MB)
                </p>
              </div>
            </label>
          </Card>
        ))}
      </div>

      {/* Uploaded Files */}
      {uploadedItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            Uploaded Artwork
          </h3>

          <div className="space-y-3">
            {uploadedItems.map((item) => {
              const file = uploadedFiles[item.id];
              return (
                <Card key={item.id} className="p-4 bg-green-50 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-600">{file?.name}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(item.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Status Summary */}
      <Card className="p-4 bg-gray-50">
        <h3 className="font-semibold mb-3">Upload Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Items</span>
            <span className="font-medium">{lineItems.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Artwork Uploaded</span>
            <span className="font-medium text-green-600">
              {uploadedItems.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pending Upload</span>
            <span className="font-medium text-orange-600">
              {pendingItems.length}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          {pendingItems.length === 0 ? (
            <p className="text-sm text-green-600 flex items-center gap-2">
              <CheckCircle size={16} />
              All artwork ready for production!
            </p>
          ) : (
            <p className="text-sm text-orange-600">
              Please upload artwork for all items to continue
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

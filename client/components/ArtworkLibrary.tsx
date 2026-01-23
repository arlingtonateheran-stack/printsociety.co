import { useState } from "react";
import { ArtworkFile } from "@shared/account";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Download,
  Copy,
  Trash2,
  Edit2,
  Search,
  Tag,
  Clock,
} from "lucide-react";

interface ArtworkLibraryProps {
  artworks: ArtworkFile[];
  onUpload?: (file: File) => void;
  onDelete?: (id: string) => void;
  onRename?: (id: string, newName: string) => void;
  onDuplicate?: (id: string) => void;
}

export function ArtworkLibrary({
  artworks,
  onUpload,
  onDelete,
  onRename,
  onDuplicate,
}: ArtworkLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const filteredArtworks = artworks.filter((art) =>
    art.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim() && onRename) {
      onRename(id, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Artwork Library</h2>
        <p className="text-gray-600">
          Manage all your uploaded designs and reuse them for new orders
        </p>
      </div>

      {/* Upload Section */}
      <Card className="p-6 border-2 border-dashed border-gray-300 hover:border-green-500 transition">
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onUpload) {
                onUpload(file);
              }
            }}
            accept=".pdf,.png,.jpg,.jpeg,.ai,.eps"
            className="hidden"
          />
          <Upload size={32} className="text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PDF, PNG, JPG, AI (max 10MB)
          </p>
        </label>
      </Card>

      {/* Search and Filter */}
      <div className="flex items-center gap-2">
        <Search size={20} className="text-gray-400" />
        <Input
          placeholder="Search artworks by name or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Artwork Grid */}
      {filteredArtworks.length === 0 ? (
        <Card className="p-8 text-center">
          <Tag size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {searchTerm ? "No Artworks Found" : "No Artworks Yet"}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Try a different search term"
              : "Upload your first design to get started"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArtworks.map((art) => (
            <Card key={art.id} className="overflow-hidden hover:shadow-md transition">
              {/* Artwork Preview */}
              <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                <img
                  src={art.fileUrl}
                  alt={art.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-black rounded">
                    {art.type}
                  </span>
                </div>
              </div>

              {/* Artwork Info */}
              <div className="p-4 space-y-3">
                {editingId === art.id ? (
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Button
                      onClick={() => handleSaveEdit(art.id)}
                      size="sm"
                      className="bg-green-600"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <h3 className="font-semibold text-gray-900 truncate">
                    {art.name}
                  </h3>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {art.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <p className="font-medium">Size</p>
                    <p>{formatFileSize(art.fileSize)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Resolution</p>
                    <p>{art.dpi} DPI</p>
                  </div>
                  <div>
                    <p className="font-medium">Times Used</p>
                    <p>{art.timesUsed}</p>
                  </div>
                  {art.lastUsedAt && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <p>{new Date(art.lastUsedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <button
                    onClick={() => handleStartEdit(art.id, art.name)}
                    className="flex-1 p-2 text-gray-600 hover:bg-gray-50 rounded transition text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Edit2 size={16} />
                    <span className="hidden sm:inline">Rename</span>
                  </button>
                  <button
                    onClick={() => onDuplicate?.(art.id)}
                    className="flex-1 p-2 text-gray-600 hover:bg-gray-50 rounded transition text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Copy size={16} />
                    <span className="hidden sm:inline">Duplicate</span>
                  </button>
                  <button
                    onClick={() => onDelete?.(art.id)}
                    className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded transition text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ImageUploadWidget from '@/components/ImageUploadWidget';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase, GalleryImage } from '@/lib/supabase';
import { Trash2, GripVertical, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
      toast.error('Failed to load gallery images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = async (url: string, thumbnailUrl: string) => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .insert({
          title: newImageTitle || 'Untitled',
          url,
          thumbnail_url: thumbnailUrl,
          alt_text: newImageAlt,
          sort_order: images.length,
          type: 'image',
        })
        .select();

      if (error) throw error;

      if (data) {
        setImages([...images, data[0]]);
        setNewImageTitle('');
        setNewImageAlt('');
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Failed to save image');
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;

      setImages(images.filter((img) => img.id !== id));
      toast.success('Image deleted');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleReorderImages = async (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);

    // Update sort orders
    const updates = newImages.map((img, idx) => ({
      id: img.id,
      sort_order: idx,
    }));

    try {
      for (const update of updates) {
        await supabase.from('gallery').update({ sort_order: update.sort_order }).eq('id', update.id);
      }
      setImages(newImages);
      toast.success('Gallery reordered');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to reorder gallery');
    }
  };

  const updateImageField = async (id: string, field: string, value: any) => {
    try {
      const { error } = await supabase.from('gallery').update({ [field]: value }).eq('id', id);

      if (error) throw error;
      setImages(images.map((img) => (img.id === id ? { ...img, [field]: value } : img)));
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Failed to update image');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gallery Manager</h1>
                <p className="text-gray-600 mt-1">Upload and manage product gallery images</p>
              </div>
            </div>

            {/* Upload Section */}
            <Card className="p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Image</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Title
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Product Shot 1"
                      value={newImageTitle}
                      onChange={(e) => setNewImageTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alt Text (for accessibility)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Die-cut vinyl stickers on surface"
                      value={newImageAlt}
                      onChange={(e) => setNewImageAlt(e.target.value)}
                    />
                  </div>
                </div>
                <ImageUploadWidget
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={(error) => toast.error(error)}
                />
              </div>
            </Card>

            {/* Gallery List */}
            <Card className="overflow-hidden">
              {isLoading ? (
                <div className="p-8 text-center text-gray-600">Loading gallery...</div>
              ) : images.length === 0 ? (
                <div className="p-8 text-center">
                  <AlertCircle className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-gray-600">No images in gallery yet. Upload one to get started.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Preview
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Alt Text
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Featured
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {images.map((image, idx) => (
                      <tr key={image.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <img
                            src={image.thumbnail_url || image.url}
                            alt={image.alt_text}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            type="text"
                            value={image.title}
                            onChange={(e) => updateImageField(image.id, 'title', e.target.value)}
                            className="text-sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            type="text"
                            value={image.alt_text}
                            onChange={(e) => updateImageField(image.id, 'alt_text', e.target.value)}
                            className="text-sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={image.is_featured}
                            onChange={(e) =>
                              updateImageField(image.id, 'is_featured', e.target.checked)
                            }
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => idx > 0 && handleReorderImages(idx, idx - 1)}
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            disabled={idx === 0}
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() =>
                              idx < images.length - 1 && handleReorderImages(idx, idx + 1)
                            }
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            disabled={idx === images.length - 1}
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

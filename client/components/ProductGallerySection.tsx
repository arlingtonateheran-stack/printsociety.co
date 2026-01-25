import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, GalleryImage } from '@/lib/supabase';

export default function ProductGallerySection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
      // Fallback to empty array
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="animate-pulse bg-gray-200 aspect-video rounded-lg"></div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  const galleryImages = images.map(img => img.url);
  const thumbnails = images.map(img => img.thumbnail_url || img.url);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Carousel */}
        <div className="md:col-span-2 relative bg-black rounded-lg overflow-hidden aspect-video">
          <img
            src={galleryImages[currentSlide]}
            alt={`Product ${currentSlide + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Slide Counter */}
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
            {currentSlide + 1}/{galleryImages.length}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition"
          >
            <ChevronLeft size={24} className="text-black" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition"
          >
            <ChevronRight size={24} className="text-black" />
          </button>
        </div>

        {/* Gallery Thumbnails */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-black uppercase tracking-wider">Gallery</h3>
          <div className="grid grid-cols-3 gap-2">
            {thumbnails.map((thumb, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`aspect-square rounded overflow-hidden border-2 transition ${
                  currentSlide === idx ? 'border-black' : 'border-gray-300'
                }`}
              >
                <img
                  src={thumb}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

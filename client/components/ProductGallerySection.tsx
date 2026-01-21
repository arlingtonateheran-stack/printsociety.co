import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Sample product images - in a real app, these would be from your API
const galleryImages = [
  'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1599081876663-4d3e7dd1e4a8?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=600&h=600&fit=crop',
];

const thumbnails = [
  'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1599081876663-4d3e7dd1e4a8?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1578926314433-d15bae410c17?w=150&h=150&fit=crop',
];

export default function ProductGallerySection() {
  const [currentSlide, setCurrentSlide] = useState(0);

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

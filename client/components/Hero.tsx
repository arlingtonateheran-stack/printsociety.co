import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center space-y-6">
        {/* Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
          <Sparkles size={16} />
          Premium Custom Stickers
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-black">
            Design Your Own
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold text-accent">
            Custom Stickers
          </h2>
        </div>

        {/* Description */}
        <p className="text-gray-700 max-w-2xl mx-auto text-lg">
          Express yourself with high-quality, custom stickers. Perfect for laptops, water bottles, walls, and more. Fast shipping, amazing designs.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="#" className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2">
            Start Creating <span>→</span>
          </Link>
          <Link to="#" className="border-2 border-black text-black px-8 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition">
            Shop Now <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

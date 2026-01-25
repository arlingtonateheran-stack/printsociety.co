import { Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const stars = Array.from({ length: 5 }, (_, i) => i);

  return (
    <section className="w-full bg-gradient-to-b from-[#151515] to-[#1a1a1a] py-12 sm:py-16 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6 order-2 lg:order-1">
            {/* Heading */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                Print Custom Stickers and Labels
              </h1>
            </div>

            {/* Rating/Reviews */}
            <a
              href="#"
              className="flex items-center gap-4 w-fit hover:opacity-80 transition"
            >
              <div className="flex gap-1">
                {stars.map((i) => (
                  <Star
                    key={i}
                    size={24}
                    className="fill-emerald-500 text-emerald-500"
                  />
                ))}
              </div>
              <div className="text-white">
                <span className="font-bold">4.7</span> out of{' '}
                <span className="font-bold">17,801</span> reviews
              </div>
            </a>

            {/* Benefit Text */}
            <div className="space-y-4">
              <p className="text-xl text-white leading-relaxed">
                Express delivery as fast as 2-4 business days. Get an instant proof and free shipping!
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link
                to="/products/die-cut-vinyl-stickers"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-black text-lg px-8 py-3 rounded-lg transition flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Make custom stickers
              </Link>
              <Link
                to="/products"
                className="text-white font-black text-lg px-8 py-3 rounded-lg hover:opacity-80 transition flex items-center justify-center gap-3 border-b-2 border-white"
              >
                All sticker products
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            <div className="relative w-full h-96 sm:h-[500px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-emerald-500/5 to-transparent rounded-2xl"></div>

              {/* Sticker Group Image Placeholder */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src="https://stickerapp.com/media/678x674/95396a9703/hero-stickergroup-desktop.png/m/600x0/filters:quality(60)"
                  alt="Custom Sticker Collections"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

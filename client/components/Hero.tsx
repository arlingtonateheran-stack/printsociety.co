import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  const stars = Array.from({ length: 5 }, (_, i) => i);

  return (
    <section className="w-full bg-black py-12 sm:py-16 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6 order-2 lg:order-1">
            {/* Heading */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                <p>Print Custom Stickers and Prints</p>
              </h1>
            </div>

            {/* Rating/Reviews */}
            <a
              href="#"
              className="flex items-center gap-4 w-fit hover:opacity-80 transition"
            >
              <div />
            </a>

            {/* Benefit Text */}
            <div className="space-y-4">
              <p className="text-xl text-gray-300 leading-relaxed">
                Express delivery as fast as 2-4 business days. Get an instant
                proof and free shipping!
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-2">
              <Link
                to="/products/die-cut-vinyl-stickers"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-black text-lg px-8 py-3 rounded-lg transition flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <p>Join the society</p>
              </Link>
              <Link
                to="/products"
                className="bg-white text-black font-black text-lg px-8 py-3 rounded-lg hover:opacity-80 transition flex items-center justify-center gap-3"
              >
                All sticker products
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            <div className="relative w-full h-80 sm:h-96 flex items-center justify-center">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2F38bbd1464537462d8e4cf3261e8352b9?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2F38bbd1464537462d8e4cf3261e8352b9?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2F38bbd1464537462d8e4cf3261e8352b9?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2F38bbd1464537462d8e4cf3261e8352b9?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2F38bbd1464537462d8e4cf3261e8352b9?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2F38bbd1464537462d8e4cf3261e8352b9?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2F38bbd1464537462d8e4cf3261e8352b9?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2F38bbd1464537462d8e4cf3261e8352b9"
                className="w-full object-cover object-center"
                style={{
                  aspectRatio: "1.1",
                  marginLeft: "20px",
                  minHeight: "20px",
                  minWidth: "20px",
                  overflow: "hidden",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

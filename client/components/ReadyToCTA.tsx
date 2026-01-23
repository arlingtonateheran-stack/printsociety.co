import { Link } from 'react-router-dom';

export default function ReadyToCTA() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto text-center space-y-8">
      <div>
        <h2 className="text-4xl md:text-5xl font-bold text-black">Ready to Create?</h2>
        <p className="text-gray-700 mt-4 max-w-2xl mx-auto text-lg">
          Join thousands of customers who are creating amazing custom stickers with Sticky Slap
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/products/die-cut-vinyl-stickers" className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2">
          Start Creating <span>→</span>
        </Link>
        <Link to="/products?category=stickers" className="border-2 border-black text-black px-8 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition">
          Sticker Deals
        </Link>
      </div>
    </section>
  );
}

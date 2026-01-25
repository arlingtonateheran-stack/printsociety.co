import { ShoppingCart, Hand } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2Fdc0d573640c04a0f81b1a11991f519d2?format=webp&width=800&height=1200"
            alt="Print Society Co"
            className="h-10 md:h-12 w-auto"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2 md:gap-8 text-xs md:text-base">
          <Link to="/products" className="hidden md:inline hover:opacity-80 transition font-medium">Shop</Link>
          <Link to="/proofs" className="hidden md:inline hover:opacity-80 transition font-medium">Proofs</Link>
          <Link to="#" className="hidden md:inline hover:opacity-80 transition">Deals</Link>
          <Link to="#" className="hidden md:inline hover:opacity-80 transition">News</Link>
          <Link to="/login" className="hidden sm:inline hover:opacity-80 transition">Login</Link>
          <Link to="/signup" className="hidden sm:inline hover:opacity-80 transition">Sign Up</Link>
          <button className="hover:opacity-80 transition p-1">
            <Hand size={18} className="md:w-5 md:h-5" />
          </button>
          <Link to="#" className="hover:opacity-80 transition p-1">
            <ShoppingCart size={18} className="md:w-5 md:h-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

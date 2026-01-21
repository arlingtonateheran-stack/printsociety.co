import { ShoppingCart, Hand } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Hand size={24} />
          <span>Sticky Slap</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link to="#" className="hover:opacity-80 transition">Track Order</Link>
          <Link to="#" className="hover:opacity-80 transition">Deals</Link>
          <Link to="#" className="hover:opacity-80 transition">News</Link>
          <Link to="#" className="hover:opacity-80 transition">Login</Link>
          <Link to="#" className="hover:opacity-80 transition">Sign Up</Link>
          <button className="hover:opacity-80 transition">
            <Hand size={20} />
          </button>
          <button className="hover:opacity-80 transition">
            <ShoppingCart size={20} />
          </button>
        </nav>
      </div>
    </header>
  );
}

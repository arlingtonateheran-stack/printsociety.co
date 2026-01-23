import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div className="space-y-3">
            <h4 className="font-bold text-black">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="#" className="hover:text-black transition">About</Link></li>
              <li><Link to="#" className="hover:text-black transition">Blog</Link></li>
              <li><Link to="#" className="hover:text-black transition">Press</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-black">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="#" className="hover:text-black transition">Help</Link></li>
              <li><Link to="#" className="hover:text-black transition">Shipping</Link></li>
              <li><Link to="#" className="hover:text-black transition">Returns</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-black">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/privacy" className="hover:text-black transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-black transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="font-bold text-black">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-black transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <p>© Sticky Slap, Inc. 2025</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-black transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-black transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

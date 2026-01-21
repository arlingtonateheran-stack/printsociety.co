import { Link } from 'react-router-dom';

export default function FeaturedCollection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-4xl font-bold text-black">Featured Collection</h2>
          <p className="text-gray-600 mt-2">Sticky Slap - Custom Stickers That Stick</p>
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold mt-1">✓</span>
            <p>Durability: Our waterproof stickers are engineered to last. With 3-5 years guaranteed, it is our standard</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold mt-1">✓</span>
            <p>Specialty Colors: Choose from exclusive brilliant colors, available finishes and more with us.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold mt-1">✓</span>
            <p>Manual Inspection: Every sticker is manually checked before packaging. Only best quality reaches customer.</p>
          </div>
        </div>

        <Link to="#" className="inline-block bg-accent text-black px-8 py-3 rounded-lg font-bold hover:opacity-90 transition uppercase text-sm tracking-wider">
          Explore Sticker Designs
        </Link>
      </div>
    </section>
  );
}

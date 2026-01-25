import { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '@shared/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArtworkUpload from '@/components/ArtworkUpload';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.slug === slug);

  const [selectedSize, setSelectedSize] = useState(product?.specifications.defaultSize || '');
  const [selectedMaterial, setSelectedMaterial] = useState(product?.specifications.defaultMaterial || '');
  const [selectedFinish, setSelectedFinish] = useState(product?.specifications.defaultFinish || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(product?.minQuantity || 50);
  const [selectedBorderCut, setSelectedBorderCut] = useState('full-bleed');

  if (!product) {
    return <Navigate to="/products" />;
  }

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    } else {
      setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(product.minQuantity, Math.min(newQuantity, product.maxQuantity)));
  };

  // Calculate pricing
  const material = product.specifications.materialOptions.find(m => m.id === selectedMaterial);
  const finish = product.specifications.finishOptions.find(f => f.id === selectedFinish);
  const priceMultiplier = (material?.priceMultiplier || 1) * (finish?.priceMultiplier || 1);

  // Find pricing tier
  const tier = product.pricingTiers.find(
    t => quantity >= t.quantityMin && quantity <= t.quantityMax
  );
  const pricePerUnit = (tier?.pricePerUnit || product.basePrice) * priceMultiplier;
  const subtotal = pricePerUnit * quantity;
  const setupFee = 25;
  const total = subtotal + setupFee;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
        >
          <ChevronLeft size={20} />
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Product Section with Gallery and Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 mb-3">
          <div className="grid grid-cols-3 gap-3">
            {/* Gallery - Left (spans 2 columns) */}
            <div className="col-span-2 space-y-2">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Image Navigation */}
                <button
                  onClick={() => handleImageNavigation('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition backdrop-blur"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => handleImageNavigation('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition backdrop-blur"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-gray-600 uppercase">Gallery</h3>
                <div className="grid grid-cols-3 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                        currentImageIndex === idx
                          ? 'border-yellow-400 shadow-lg'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info - Right */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 uppercase">{product.name}</h2>
                <p className="text-sm text-gray-600 mt-2">{product.fullDescription}</p>
              </div>
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-2 rounded-full transition ${
                  currentImageIndex === idx
                    ? 'bg-yellow-400 w-8'
                    : 'bg-gray-300 w-2'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Selection Options Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {/* Vinyl Finish */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-xs font-bold text-gray-700 uppercase mb-3">Select a Vinyl Finish</h3>
            <div className="space-y-2">
              {product.specifications.finishOptions.map(finish => (
                <button
                  key={finish.id}
                  onClick={() => setSelectedFinish(finish.id)}
                  className={`w-full px-3 py-2 rounded text-sm font-medium transition border-2 ${
                    selectedFinish === finish.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 bg-white hover:border-purple-400'
                  }`}
                >
                  <p className="text-xs font-semibold">{finish.name}</p>
                  {finish.priceMultiplier !== 1 && (
                    <p className="text-gray-600 text-xs">+${((finish.priceMultiplier - 1) * 0.15).toFixed(2)}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sticker Size */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-xs font-bold text-gray-700 uppercase mb-3">Select Size & Price</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {product.specifications.sizeOptions.map(size => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`w-full px-3 py-2 rounded text-sm transition border-2 flex flex-col ${
                    selectedSize === size.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 bg-white hover:border-purple-400'
                  }`}
                >
                  <p className="font-semibold text-xs">{size.label}</p>
                  <p className="text-gray-600 text-xs">+${(0.22).toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Border Cut */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-xs font-bold text-gray-700 uppercase mb-3">Select Border Cut</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedBorderCut('full-bleed')}
                className={`w-full px-3 py-2 rounded text-sm font-medium transition border-2 relative ${
                  selectedBorderCut === 'full-bleed'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 bg-white hover:border-purple-400'
                }`}
              >
                <p className="text-xs font-semibold">Full bleed cut</p>
                <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">Popular</span>
              </button>
              <button
                onClick={() => setSelectedBorderCut('white')}
                className={`w-full px-3 py-2 rounded text-sm font-medium transition border-2 ${
                  selectedBorderCut === 'white'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 bg-white hover:border-purple-400'
                }`}
              >
                <p className="text-xs font-semibold">White border cut</p>
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-3 text-white">
            <h3 className="text-xs font-bold uppercase mb-3">Select Quantity</h3>
            <div className="space-y-2">
              {[50, 100, 200, 300, 500, 1000, 2500].map(q => (
                <button
                  key={q}
                  onClick={() => handleQuantityChange(q)}
                  className={`w-full px-2 py-2 rounded text-xs transition flex justify-between items-center ${
                    quantity === q
                      ? 'border-2 border-yellow-400 bg-yellow-400/20'
                      : 'border border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <span className="font-semibold">{q.toLocaleString()}</span>
                  <span>${(pricePerUnit * q + setupFee).toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload & Notes Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Artwork Upload */}
          <ArtworkUpload />

          {/* Order Notes */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-xs font-bold text-gray-700 uppercase mb-2">📝 Order Notes (optional)</h3>
            <textarea
              placeholder="Add any special requests or notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-600 mt-2">Let us know about any special requirements or customizations</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white border border-gray-300 text-black py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button className="bg-white border border-gray-300 text-black py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
              🛒 Checkout
            </button>
          </div>
          <p className="text-center text-sm text-gray-600">
            Continue adding products or proceed to checkout when ready
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ShoppingCart, Check, Clock, Shield } from 'lucide-react';
import { products } from '@shared/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingCalculator from '@/components/PricingCalculator';
import ArtworkUpload from '@/components/ArtworkUpload';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find(p => p.slug === slug);

  const [selectedSize, setSelectedSize] = useState(product?.specifications.defaultSize || '');
  const [selectedMaterial, setSelectedMaterial] = useState(product?.specifications.defaultMaterial || '');
  const [selectedFinish, setSelectedFinish] = useState(product?.specifications.defaultFinish || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
    return <Navigate to="/products" />;
  }

  const sizeOption = product.specifications.sizeOptions.find(s => s.id === selectedSize);
  const materialOption = product.specifications.materialOptions.find(m => m.id === selectedMaterial);
  const finishOption = product.specifications.finishOptions.find(f => f.id === selectedFinish);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
        <a href="/products" className="hover:text-primary transition">Products</a>
        {' / '}
        <a href={`/products?category=${product.category}`} className="hover:text-primary transition capitalize">
          {product.category}
        </a>
        {' / '}
        <span className="text-black font-semibold">{product.name}</span>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      currentImageIndex === idx ? 'border-primary' : 'border-gray-300'
                    }`}
                  >
                    <img src={product.images[idx]} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <p className="text-primary font-semibold uppercase tracking-wider">{product.category}</p>
              <h1 className="text-4xl font-bold text-black mt-2">{product.name}</h1>
              <p className="text-gray-600 text-lg mt-4">{product.fullDescription}</p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200">
              <div className="text-center">
                <Clock className="mx-auto mb-2 text-primary" size={24} />
                <p className="text-sm text-gray-600">{product.turnaroundDays}-day turnaround</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-2 text-primary" size={24} />
                <p className="text-sm text-gray-600">Quality guaranteed</p>
              </div>
              <div className="text-center">
                <Check className="mx-auto mb-2 text-primary" size={24} />
                <p className="text-sm text-gray-600">Free online proof</p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-6 border-b border-gray-200 pb-8">
              {/* Size Selection */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">Size</label>
                <div className="grid grid-cols-2 gap-3">
                  {product.specifications.sizeOptions.map(size => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`px-4 py-3 border-2 rounded-lg font-medium transition ${
                        selectedSize === size.id
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 bg-white text-black hover:border-primary'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
                {sizeOption && (
                  <p className="text-xs text-gray-600 mt-2">
                    {sizeOption.width}" × {sizeOption.height}" ({sizeOption.unit})
                  </p>
                )}
              </div>

              {/* Material Selection */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">Material</label>
                <div className="space-y-2">
                  {product.specifications.materialOptions.map(material => (
                    <button
                      key={material.id}
                      onClick={() => setSelectedMaterial(material.id)}
                      className={`w-full px-4 py-3 border-2 rounded-lg text-left transition ${
                        selectedMaterial === material.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-black">{material.name}</p>
                          <p className="text-xs text-gray-600">{material.description}</p>
                        </div>
                        {material.priceMultiplier !== 1 && (
                          <span className="text-xs font-semibold text-gray-600">
                            {material.priceMultiplier > 1 ? '+' : ''}{((material.priceMultiplier - 1) * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Finish Selection */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">Finish</label>
                <div className="grid grid-cols-2 gap-3">
                  {product.specifications.finishOptions.map(finish => (
                    <button
                      key={finish.id}
                      onClick={() => setSelectedFinish(finish.id)}
                      className={`px-4 py-3 border-2 rounded-lg text-center transition ${
                        selectedFinish === finish.id
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 bg-white text-black hover:border-primary'
                      }`}
                    >
                      <p className="font-medium">{finish.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{finish.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button className="w-full border-2 border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition">
                Start Artwork Upload
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Calculator & Upload */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Pricing Calculator */}
          <PricingCalculator
            product={product}
            selectedMaterial={selectedMaterial}
            selectedFinish={selectedFinish}
          />

          {/* Artwork Upload */}
          <ArtworkUpload />
        </div>

        {/* Features List */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-black mb-8">Why Choose This Product?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex gap-3">
                <Check className="text-primary flex-shrink-0" size={24} />
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ-like Section */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-black mb-8">Specifications</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-black mb-4">Production Details</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li><strong>Turnaround:</strong> {product.turnaroundDays} business days</li>
                <li><strong>Minimum Order:</strong> {product.minQuantity} units</li>
                <li><strong>Maximum Order:</strong> {product.maxQuantity.toLocaleString()} units</li>
                <li><strong>Cut Type:</strong> {product.cutType.replace('-', ' ').charAt(0).toUpperCase() + product.cutType.slice(1).replace('-', ' ')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Available Options</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li><strong>Sizes:</strong> {product.specifications.sizeOptions.length} options</li>
                <li><strong>Materials:</strong> {product.specifications.materialOptions.length} options</li>
                <li><strong>Finishes:</strong> {product.specifications.finishOptions.length} options</li>
                <li><strong>Pricing Tiers:</strong> {product.pricingTiers.length} discount levels</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

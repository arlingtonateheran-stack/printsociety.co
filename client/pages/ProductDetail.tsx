import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, ChevronRight, Sliders, Loader2 } from 'lucide-react';
import { products as sampleProducts } from '@shared/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArtworkUpload from '@/components/ArtworkUpload';
import { useCart } from '@/contexts/CartContext';
import type { CartLineItem } from '@shared/cart';
import { supabase } from '@/lib/supabase';

interface UploadedDesign {
  file: File;
  preview: string;
  path: string;
  url: string;
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedFinish, setSelectedFinish] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(50);
  const [selectedBorderCut, setSelectedBorderCut] = useState('full-bleed');
  const [uploadedDesign, setUploadedDesign] = useState<UploadedDesign | null>(null);

  useEffect(() => {
    fetchProductData();
  }, [slug]);

  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      // Try to find in sample data first for immediate UI if possible, or just fetch
      const sampleProd = sampleProducts.find(p => p.slug === slug);

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          price_blocks(*),
          material_options(*),
          quantity_tiers(*),
          size_options(*),
          finish_options(*, finish_price_blocks(*)),
          product_options(*)
        `)
        .eq("slug", slug)
        .single();

      if (error) {
        if (sampleProd) {
          setProduct(sampleProd);
          initSelection(sampleProd);
          return;
        }
        throw error;
      }

      // Map Supabase data to the structure expected by the component
      const mappedProduct = {
        ...data,
        images: data.images || [data.thumbnail_url || "https://images.unsplash.com/photo-1572375927902-1c09e2d93c3b?w=800&q=80"],
        specifications: {
          defaultSize: data.size_options?.[0]?.id || "",
          defaultMaterial: data.material_options?.[0]?.id || "",
          defaultFinish: data.finish_options?.[0]?.id || "",
          sizeOptions: (data.size_options || []).map((s: any) => ({
            id: s.id,
            label: `${s.width}" x ${s.height}"`,
            width: s.width,
            height: s.height
          })),
          materialOptions: (data.material_options || []).map((m: any) => ({
            id: m.id,
            name: m.name,
            priceMultiplier: m.price_per_sq_in ? (Number(m.price_per_sq_in) / 0.12) : 1 // Normalize to sample logic
          })),
          finishOptions: (data.finish_options || []).map((f: any) => ({
            id: f.id,
            name: f.name,
            priceMultiplier: 1 // Finishes usually use blocks, but for simple UI we'll use 1
          }))
        },
        minQuantity: data.quantity_tiers?.[0]?.min_qty || 50,
        maxQuantity: 10000,
        pricingTiers: (data.quantity_tiers || []).map((t: any) => ({
          quantityMin: t.min_qty,
          quantityMax: t.max_qty || 10000,
          pricePerUnit: Number(t.price_per_unit)
        }))
      };

      setProduct(mappedProduct);
      initSelection(mappedProduct);
    } catch (error: any) {
      console.error("Error fetching product:", error);
      const errorMessage = error?.message || "Error loading product detail";
      // We don't toast here to keep UI clean, but could if needed
    } finally {
      setIsLoading(false);
    }
  };

  const initSelection = (p: any) => {
    setSelectedSize(p.specifications?.defaultSize || '');
    setSelectedMaterial(p.specifications?.defaultMaterial || '');
    setSelectedFinish(p.specifications?.defaultFinish || '');
    setQuantity(p.minQuantity || 50);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

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

  const handleDesignUpload = (design: UploadedDesign) => {
    setUploadedDesign(design);
    // Store in localStorage for checkout page - save the file reference (URL) instead of preview
    localStorage.setItem('uploadedDesign', JSON.stringify({
      name: design.file.name,
      size: design.file.size,
      preview: design.preview,
      path: design.path,
      url: design.url
    }));
  };

  const handleAddToCart = () => {
    const cartItem: CartLineItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      quantity,
      size: selectedSize,
      material: selectedMaterial,
      finish: selectedFinish,
      unitPrice: pricePerUnit,
      subtotal: pricePerUnit * quantity,
      artworkUrl: uploadedDesign?.url,
      artworkStatus: uploadedDesign ? 'uploaded' : 'pending',
    };

    addToCart(cartItem);
    // Navigate to cart to show confirmation
    navigate('/cart');
  };

  const handleCheckout = () => {
    if (!uploadedDesign) {
      // For MVP, require artwork upload before checkout
      alert('Please upload your artwork before proceeding to checkout');
      return;
    }

    const cartItem: CartLineItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      quantity,
      size: selectedSize,
      material: selectedMaterial,
      finish: selectedFinish,
      unitPrice: pricePerUnit,
      subtotal: pricePerUnit * quantity,
      artworkUrl: uploadedDesign.url,
      artworkStatus: 'uploaded',
    };

    addToCart(cartItem);
    // Navigate to checkout with cart data
    navigate('/checkout');
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition text-sm sm:text-base"
        >
          <ChevronLeft size={20} />
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-12 sm:pb-20">
        {/* Product Section with Gallery and Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-2 sm:p-3 mb-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {/* Gallery - Left (spans 2 columns) */}
            <div className="sm:col-span-2 space-y-2">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2">
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
          <div className="flex justify-center gap-2 mt-2">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 mb-2">
          {/* Vinyl Finish */}
          <div className="bg-gray-50 rounded-lg p-1.5 border border-gray-200">
            <h3 className="text-[10px] font-bold text-gray-700 uppercase mb-1.5">Select a Vinyl Finish</h3>
            <div className="space-y-1">
              {product.specifications.finishOptions.map(finish => (
                <button
                  key={finish.id}
                  onClick={() => setSelectedFinish(finish.id)}
                  className={`w-full px-2 py-1 rounded text-xs font-medium transition border-2 ${
                    selectedFinish === finish.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 bg-white hover:border-purple-400'
                  }`}
                >
                  <p className="text-[11px] font-semibold">{finish.name}</p>
                  {finish.priceMultiplier !== 1 && (
                    <p className="text-gray-600 text-[10px]">+${((finish.priceMultiplier - 1) * 0.15).toFixed(2)}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sticker Size */}
          <div className="bg-gray-50 rounded-lg p-1.5 border border-gray-200">
            <h3 className="text-[10px] font-bold text-gray-700 uppercase mb-1.5">Select Size & Price</h3>
            <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-1">
              {product.specifications.sizeOptions.map(size => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`w-full px-2 py-1 rounded text-xs transition border-2 flex flex-col items-center justify-center text-center ${
                    selectedSize === size.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 bg-white hover:border-purple-400'
                  }`}
                >
                  <p className="font-semibold text-[11px]">{size.label}</p>
                  <p className="text-gray-600 text-[10px]">+${(0.22).toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Border Cut */}
          <div className="bg-gray-50 rounded-lg p-1.5 border border-gray-200">
            <h3 className="text-[10px] font-bold text-gray-700 uppercase mb-1.5">Select Border Cut</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedBorderCut('full-bleed')}
                className={`w-full px-2 py-1 rounded text-xs font-medium transition border-2 relative ${
                  selectedBorderCut === 'full-bleed'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 bg-white hover:border-purple-400'
                }`}
              >
                <p className="text-[11px] font-semibold">Full bleed cut</p>
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[8px] px-1 py-0.5 rounded shadow-sm">Popular</span>
              </button>
              <button
                onClick={() => setSelectedBorderCut('white')}
                className={`w-full px-2 py-1 rounded text-xs font-medium transition border-2 ${
                  selectedBorderCut === 'white'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 bg-white hover:border-purple-400'
                }`}
              >
                <p className="text-[11px] font-semibold">White border cut</p>
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="backdrop-blur-md bg-white/5 rounded-lg p-1.5 border border-gray-300 shadow-sm">
            <h3 className="text-[10px] font-bold text-black uppercase mb-1.5 flex items-center gap-1.5">
              <Sliders size={12} className="text-black" />
              Select a quantity
            </h3>
            <div className="grid grid-cols-1 gap-1">
              {[50, 100, 200, 300, 500, 1000, 2500].map(q => (
                <button
                  key={q}
                  onClick={() => handleQuantityChange(q)}
                  className={`w-full px-2 py-1 rounded text-[11px] transition flex justify-between items-center gap-1.5 ${
                    quantity === q
                      ? 'border-2 border-yellow-400 bg-yellow-400/20'
                      : 'border border-gray-200 bg-white/50 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-black">{q.toLocaleString()}</span>
                  <span className="font-semibold text-black">${(pricePerUnit * q + setupFee).toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload & Notes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {/* Artwork Upload */}
          <ArtworkUpload onUpload={handleDesignUpload} />

          {/* Order Notes */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-xs font-bold text-gray-700 uppercase mb-2">📝 Order Notes (optional)</h3>
            <textarea
              placeholder="Add any special requests or notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-600 mt-2">Let us know about any special requirements or customizations</p>
          </div>
        </div>

        {/* Design Preview */}
        {uploadedDesign && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase mb-2">Design Preview</h3>
            <div className="flex gap-3 items-start">
              <img
                src={uploadedDesign.preview}
                alt="Design preview"
                className="w-20 h-20 object-cover rounded border border-gray-300"
              />
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-900">{uploadedDesign.file.name}</p>
                <p className="text-xs text-gray-600 mb-2">{(uploadedDesign.file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  onClick={() => setUploadedDesign(null)}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-1 sm:space-y-1.5">
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={handleAddToCart}
              className="bg-white border border-gray-300 text-black py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button
              onClick={handleCheckout}
              className="bg-white border border-gray-300 text-black py-2 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
            >
              🛒 Checkout
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-600">
            Continue adding products or proceed to checkout when ready
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

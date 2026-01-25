import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import { products, categories, type ProductCategory } from '@shared/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'popular';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.includes(query))
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'popular':
        sorted.sort((a, b) => b.tags.length - a.tags.length);
        break;
      default:
        break;
    }

    return sorted;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-black text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Custom Products</h1>
          <p className="text-gray-300 text-lg">Choose from a variety of custom printing options</p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products, materials, finishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as ProductCategory)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-8 bg-white"
              >
                <option value="relevance">Most Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-sm text-primary font-semibold uppercase tracking-wider">
                          {product.category}
                        </p>
                        <h3 className="text-xl font-bold text-black mt-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                      </div>

                      {/* Price */}
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-gray-600 text-sm">From</p>
                        <p className="text-2xl font-bold text-primary">
                          ${product.basePrice.toFixed(2)}
                        </p>
                        <p className="text-gray-500 text-xs">per unit (qty: {product.minQuantity}+)</p>
                      </div>

                      {/* Features */}
                      <ul className="text-xs text-gray-600 space-y-1">
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <button className="w-full mt-4 bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No products found</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

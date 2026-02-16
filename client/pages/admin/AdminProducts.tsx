import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

import { products as sampleProducts } from "@shared/products";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // Fallback to sample data if database query fails or tables don't exist
        console.warn("Supabase fetch failed, falling back to sample data", error);
        setProducts(sampleProducts);
        return;
      }

      if (data && data.length > 0) {
        setProducts(data);
      } else {
        // If Supabase is connected but empty, use sample data for better DX
        setProducts(sampleProducts);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setProducts(sampleProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      (p.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.sku?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
                <p className="text-gray-600 mt-1">Manage products, options, and groupings</p>
              </div>
              <button
                onClick={() => navigate("/admin/products/new")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Plus size={18} />
                New Product
              </button>
            </div>

            {/* Search */}
            <Card className="p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>

            {/* Products Table */}
            <Card className="overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <Loader2 className="h-10 w-10 animate-spin mb-4 text-green-600" />
                  <p>Loading your product catalog...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-lg">No products found</p>
                  <p className="text-sm">Try adjusting your search or add a new product.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 text-gray-600">{product.category}</td>
                        <td className="px-6 py-4 font-mono text-sm text-gray-600">{product.sku}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => navigate(`/admin/products/${product.id}`)}
                            className="text-green-600 hover:text-green-700 font-medium text-sm"
                          >
                            Edit →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

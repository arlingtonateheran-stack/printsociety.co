import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const sampleProducts = [
  {
    id: "prod-001",
    name: "Die-Cut Vinyl Stickers",
    category: "Stickers",
    sku: "DCV-001",
    stock: 450,
    price: "$0.35",
    status: "active",
  },
  {
    id: "prod-002",
    name: "Sticker Sheets",
    category: "Sheets",
    sku: "SS-001",
    stock: 120,
    price: "$1.50",
    status: "active",
  },
  {
    id: "prod-003",
    name: "Roll Labels",
    category: "Labels",
    sku: "RL-001",
    stock: 85,
    price: "$0.12",
    status: "active",
  },
  {
    id: "prod-004",
    name: "Vinyl Banners",
    category: "Banners",
    sku: "VB-001",
    stock: 32,
    price: "$2.00",
    status: "active",
  },
];

export default function AdminProducts() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = sampleProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
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
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Base Price
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
                      <td className="px-6 py-4 text-gray-900">{product.stock} units</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{product.price}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                          Edit →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

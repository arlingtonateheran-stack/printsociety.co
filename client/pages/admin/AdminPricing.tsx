import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function AdminPricing() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pricing Rules Engine</h1>
                <p className="text-gray-600 mt-1">Configure modular pricing with formulas, tiers, and triggers</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <Plus size={18} />
                New Rule
              </button>
            </div>

            <Card className="p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing Rules Engine</h2>
              <p className="text-gray-600">
                Create dynamic pricing with no base price. Set triggers for quantity, material, finish, size, and rush fees.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Formula-Based</h3>
                  <p className="text-sm text-gray-600">
                    (sq inches × material cost × quantity multiplier) + finish % + rush fee
                  </p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Tiered Pricing</h3>
                  <p className="text-sm text-gray-600">
                    Set price breaks based on order quantity
                  </p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Material Options</h3>
                  <p className="text-sm text-gray-600">
                    Adjust pricing by vinyl type, paper, polyester, etc.
                  </p>
                </Card>
              </div>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

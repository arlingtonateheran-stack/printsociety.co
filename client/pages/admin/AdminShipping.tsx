import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Truck, Plus } from "lucide-react";

export default function AdminShipping() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Shipping Station</h1>
                <p className="text-gray-600 mt-1">Generate labels, manage carriers, and track shipments</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <Plus size={18} />
                New Batch
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">READY TO SHIP</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">PENDING LABELS</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">3</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">SHIPPED TODAY</p>
                <p className="text-3xl font-bold text-green-600 mt-2">8</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">AVG TIME (hrs)</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">2.4</p>
              </Card>
            </div>

            <Card className="p-12 text-center">
              <Truck className="mx-auto text-gray-400 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Shipping Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Bulk select orders, generate shipping labels for USPS/UPS/FedEx, import tracking numbers, and auto-notify customers
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">Bulk Label Gen</h3>
                  <p className="text-xs text-gray-600">Generate multiple labels at once</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">Tracking Import</h3>
                  <p className="text-xs text-gray-600">Paste or upload tracking numbers</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">Auto Notify</h3>
                  <p className="text-xs text-gray-600">Customers get email updates</p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

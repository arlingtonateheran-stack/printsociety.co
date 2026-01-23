import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import OrderStatusWidget from "@/components/admin/widgets/OrderStatusWidget";
import RevenueWidget from "@/components/admin/widgets/RevenueWidget";
import ProofQueueWidget from "@/components/admin/widgets/ProofQueueWidget";
import ShippingQueueWidget from "@/components/admin/widgets/ShippingQueueWidget";
import StockAlertsWidget from "@/components/admin/widgets/StockAlertsWidget";
import ActiveDiscountsWidget from "@/components/admin/widgets/ActiveDiscountsWidget";
import TrafficSnapshotWidget from "@/components/admin/widgets/TrafficSnapshotWidget";
import { Card } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Shop health at a glance</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition"
              >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            {/* Last Refresh Time */}
            <p className="text-sm text-gray-500 mb-6">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>

            {/* Critical Alerts Banner */}
            <Card className="bg-red-50 border-red-200 mb-8 p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-red-900">Critical Alerts</h3>
                <p className="text-sm text-red-700 mt-1">
                  3 orders awaiting artwork · 2 low stock items · 1 proof revision pending
                </p>
              </div>
            </Card>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Quick Stats */}
              <Card className="p-6">
                <p className="text-gray-600 text-sm font-medium">Today's Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$2,450</p>
                <p className="text-green-600 text-sm mt-2">+12% vs yesterday</p>
              </Card>

              <Card className="p-6">
                <p className="text-gray-600 text-sm font-medium">Active Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
                <p className="text-gray-600 text-sm mt-2">8 in production</p>
              </Card>

              <Card className="p-6">
                <p className="text-gray-600 text-sm font-medium">Pending Proofs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
                <p className="text-orange-600 text-sm mt-2">3 overdue</p>
              </Card>

              <Card className="p-6">
                <p className="text-gray-600 text-sm font-medium">Ready to Ship</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                <p className="text-blue-600 text-sm mt-2">Awaiting labels</p>
              </Card>
            </div>

            {/* Main Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <OrderStatusWidget />
              <RevenueWidget />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <ProofQueueWidget />
              <ShippingQueueWidget />
              <StockAlertsWidget />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ActiveDiscountsWidget />
              <TrafficSnapshotWidget />
            </div>

            {/* System Health */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">API Status</p>
                  <p className="text-green-600 font-semibold mt-1">✓ Operational</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Database</p>
                  <p className="text-green-600 font-semibold mt-1">✓ Healthy</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Background Jobs</p>
                  <p className="text-green-600 font-semibold mt-1">✓ Running</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Service</p>
                  <p className="text-green-600 font-semibold mt-1">✓ Active</p>
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

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  "awaiting-artwork": "bg-gray-100 text-gray-800",
  "proof-sent": "bg-blue-100 text-blue-800",
  "awaiting-approval": "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  "in-production": "bg-purple-100 text-purple-800",
  "ready-to-ship": "bg-orange-100 text-orange-800",
  shipped: "bg-green-100 text-green-800",
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      const errorMessage = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
      toast.error(`Failed to load orders: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderId = order.id || "";
    const orderNumber = order.order_number || "";
    const customerName = order.customer_name || "";

    const matchesSearch =
      orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <Plus size={18} />
                New Order
              </button>
            </div>

            {/* Filters */}
            <Card className="p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="awaiting-artwork">Awaiting Artwork</option>
                  <option value="proof-sent">Proof Sent</option>
                  <option value="approved">Approved</option>
                  <option value="in-production">In Production</option>
                  <option value="ready-to-ship">Ready to Ship</option>
                </select>

                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <Filter size={18} />
                  More Filters
                </button>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredOrders.length}</span> orders
                </p>
                <button className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700">
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
            </Card>

            {/* Orders Table */}
            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-20 text-center">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-green-600 mb-4" />
                        <p className="text-gray-500">Loading orders...</p>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-20 text-center text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono font-semibold text-green-600 hover:underline">
                            {order.order_number || order.id.substring(0, 8)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900">{order.customer_name || order.customer_email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              statusColors[order.status] || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {(order.status || "awaiting-artwork").replace(/-/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900">{order.quantity || 1}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          ${(order.total || order.total_amount || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/orders/${order.id}`);
                            }}
                            className="text-green-600 hover:text-green-700 font-medium text-sm"
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
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

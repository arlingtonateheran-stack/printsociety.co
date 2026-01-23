import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const sampleOrders = [
  {
    id: "ORD-001",
    customer: "Acme Corp",
    status: "proof-sent",
    items: 5,
    total: 450,
    date: "2025-01-20",
  },
  {
    id: "ORD-002",
    customer: "Design Studio",
    status: "in-production",
    items: 3,
    total: 280,
    date: "2025-01-19",
  },
  {
    id: "ORD-003",
    customer: "Brand Co",
    status: "ready-to-ship",
    items: 8,
    total: 720,
    date: "2025-01-18",
  },
  {
    id: "ORD-004",
    customer: "Creative Labs",
    status: "awaiting-artwork",
    items: 2,
    total: 180,
    date: "2025-01-17",
  },
  {
    id: "ORD-005",
    customer: "Art House",
    status: "approved",
    items: 6,
    total: 540,
    date: "2025-01-16",
  },
];

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

  const filteredOrders = sampleOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
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
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-green-600 hover:underline">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{order.customer}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[order.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.replace(/-/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{order.items}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ${order.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{order.date}</td>
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

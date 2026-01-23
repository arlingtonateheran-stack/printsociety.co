import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Upload } from "lucide-react";
import { useState } from "react";

const sampleCustomers = [
  {
    id: "cust-001",
    name: "Acme Corp",
    email: "contact@acme.com",
    orders: 5,
    ltv: 2850,
    tags: ["wholesale", "vip"],
  },
  {
    id: "cust-002",
    name: "Design Studio",
    email: "hello@designstudio.com",
    orders: 12,
    ltv: 6200,
    tags: ["repeat", "vip"],
  },
  {
    id: "cust-003",
    name: "Brand Co",
    email: "team@brand.co",
    orders: 3,
    ltv: 1450,
    tags: ["new"],
  },
  {
    id: "cust-004",
    name: "Creative Labs",
    email: "support@creative.labs",
    orders: 8,
    ltv: 4100,
    tags: ["repeat"],
  },
];

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = sampleCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
                <p className="text-gray-600 mt-1">CRM lite with tags, LTV, and order history</p>
              </div>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <Upload size={18} />
                  Import CSV
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  <Plus size={18} />
                  New Customer
                </button>
              </div>
            </div>

            <Card className="p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>

            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      LTV
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{customer.email}</td>
                      <td className="px-6 py-4 text-gray-900">{customer.orders}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ${customer.ltv.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {customer.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-green-600 hover:text-green-700 font-medium text-sm">
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

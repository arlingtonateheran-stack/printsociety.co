import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const tickets = [
  {
    id: "TKT-001",
    customer: "Acme Corp",
    subject: "Proof revision request",
    status: "open",
    priority: "high",
    assigned: "Sarah",
    created: "2025-01-20",
  },
  {
    id: "TKT-002",
    customer: "Design Studio",
    subject: "Shipping label issue",
    status: "in-progress",
    priority: "medium",
    assigned: "John",
    created: "2025-01-19",
  },
  {
    id: "TKT-003",
    customer: "Brand Co",
    subject: "Order question",
    status: "resolved",
    priority: "low",
    assigned: "Sarah",
    created: "2025-01-18",
  },
];

const statusColors: Record<string, string> = {
  open: "bg-red-100 text-red-800",
  "in-progress": "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

export default function AdminTickets() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = tickets.filter(
    (t) =>
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
              <p className="text-gray-600 mt-1">Manage customer support tickets and issues</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">OPEN</p>
                <p className="text-3xl font-bold text-red-600 mt-2">8</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">IN PROGRESS</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">5</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">RESOLVED</p>
                <p className="text-3xl font-bold text-green-600 mt-2">42</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">AVG RESPONSE</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">2.3h</p>
              </Card>
            </div>

            <Card className="p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search tickets..."
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
                      Ticket
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Assigned
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-mono font-semibold text-gray-900">
                        {ticket.id}
                      </td>
                      <td className="px-6 py-4 text-gray-900">{ticket.customer}</td>
                      <td className="px-6 py-4 text-gray-600">{ticket.subject}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[ticket.status] || "bg-gray-100"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            ticket.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : ticket.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{ticket.assigned}</td>
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

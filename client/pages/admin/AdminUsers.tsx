import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Plus, Shield } from "lucide-react";

const users = [
  {
    id: 1,
    name: "Admin Owner",
    email: "owner@stickyslap.com",
    role: "Owner",
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Designer",
    email: "sarah@stickyslap.com",
    role: "Designer",
    status: "active",
  },
  {
    id: 3,
    name: "John Shipping",
    email: "john@stickyslap.com",
    role: "Shipping",
    status: "active",
  },
  {
    id: 4,
    name: "Support Team",
    email: "support@stickyslap.com",
    role: "Support",
    status: "active",
  },
];

export default function AdminUsers() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Users & Roles</h1>
                <p className="text-gray-600 mt-1">Manage staff access and permissions</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <Plus size={18} />
                Invite User
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">TOTAL USERS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">ACTIVE</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{users.length}</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">ROLES</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">4</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">CUSTOM ROLES</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
              </Card>
            </div>

            <Card className="overflow-hidden mb-8">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Role
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
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Shield size={16} className="text-gray-400" />
                          <span className="text-gray-900">{user.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {user.status}
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

            <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Owner</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Full access</li>
                    <li>✓ Manage staff</li>
                    <li>✓ View analytics</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Designer</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Send proofs</li>
                    <li>✓ Manage artwork</li>
                    <li>✓ View orders</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Shipping</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Generate labels</li>
                    <li>✓ Track shipments</li>
                    <li>✓ View analytics</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Support</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Manage tickets</li>
                    <li>✓ View orders</li>
                    <li>✓ Help center</li>
                  </ul>
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

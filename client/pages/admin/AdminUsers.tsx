import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Plus, Shield, Mail, User, Loader2, CheckCircle, XCircle, Edit2, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  designer: "bg-blue-100 text-blue-800",
  shipping: "bg-orange-100 text-orange-800",
  support: "bg-teal-100 text-teal-800",
  customer: "bg-gray-100 text-gray-800",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ is_active: !currentStatus })
        .eq("id", userId);

      if (error) throw error;

      setUsers(users.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    admins: users.filter(u => u.role === 'admin').length,
    staff: users.filter(u => ['designer', 'shipping', 'support'].includes(u.role)).length
  };

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
                <p className="text-gray-600 mt-1">Manage staff access, permissions and account status.</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 gap-2">
                <Plus size={18} />
                Invite User
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Users</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Admins</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Staff</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.staff}</p>
                </div>
              </Card>
            </div>

            <Card className="overflow-hidden mb-8 border-none shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <Loader2 className="mx-auto animate-spin text-green-600 mb-2" size={32} />
                          <p className="text-gray-500">Loading user directory...</p>
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold border border-gray-200">
                                {user.name?.charAt(0) || "U"}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{user.name}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Mail size={12} />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              className={`text-xs font-bold px-3 py-1.5 rounded-full border-none focus:ring-2 focus:ring-green-500 cursor-pointer ${roleColors[user.role] || "bg-gray-100"}`}
                              value={user.role}
                              onChange={(e) => updateUserRole(user.id, e.target.value)}
                            >
                              <option value="admin">Admin</option>
                              <option value="designer">Designer</option>
                              <option value="shipping">Shipping</option>
                              <option value="support">Support</option>
                              <option value="customer">Customer</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              user.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active ? <CheckCircle size={10} /> : <XCircle size={10} />}
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`${user.is_active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'} font-bold text-xs`}
                                onClick={() => toggleUserStatus(user.id, user.is_active)}
                              >
                                {user.is_active ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                <Edit2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 border-t-4 border-t-purple-500">
                <h4 className="font-bold text-gray-900 mb-2">Admin</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Full system access. Can manage staff, pricing, discounts, and high-level analytics.
                </p>
              </Card>
              <Card className="p-6 border-t-4 border-t-blue-500">
                <h4 className="font-bold text-gray-900 mb-2">Designer</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Focuses on artwork and proofs. Can manage customer designs and update order artwork status.
                </p>
              </Card>
              <Card className="p-6 border-t-4 border-t-orange-500">
                <h4 className="font-bold text-gray-900 mb-2">Shipping</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Handles logistics. Access to order fulfillment, shipping labels, and tracking updates.
                </p>
              </Card>
              <Card className="p-6 border-t-4 border-t-teal-500">
                <h4 className="font-bold text-gray-900 mb-2">Support</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Customer relations. Manages support tickets and has view-access to customer history.
                </p>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

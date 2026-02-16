import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Upload,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShoppingBag,
  User as UserIcon,
  ChevronRight,
  Loader2,
  Download,
  X
} from "lucide-react";
import { supabase, getCustomers } from "@/lib/supabase";
import { toast } from "sonner";
import { CreateCustomerModal } from "./components/CreateCustomerModal";

export default function AdminCustomers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await getCustomers();
      setCustomers(data || []);
    } catch (error: any) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const searchMatch = 
      (c.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.user?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.business_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || "").includes(searchTerm);
    
    const statusMatch = statusFilter === "all" || (statusFilter === "active" ? c.user?.is_active : !c.user?.is_active);
    
    return searchMatch && statusMatch;
  }).sort((a, b) => {
    if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === "revenue") return (b.lifetime_value || 0) - (a.lifetime_value || 0);
    if (sortBy === "orders") return (b.total_orders || 0) - (a.total_orders || 0);
    return 0;
  });

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Email", "Business", "Phone", "Orders", "Revenue", "Status", "Joined"];
    const rows = filteredCustomers.map(c => [
      c.id,
      c.user?.name,
      c.user?.email,
      c.business_name || "N/A",
      c.phone || "N/A",
      c.total_orders || 0,
      c.lifetime_value || 0,
      c.user?.is_active ? "Active" : "Inactive",
      new Date(c.created_at).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + 
      headers.join(",") + "\n" + 
      rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Customers exported successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage relationships, track LTV, and monitor customer activity.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2" onClick={exportToCSV}>
                  <Download size={18} />
                  Export
                </Button>
                <Button variant="outline" className="gap-2">
                  <Upload size={18} />
                  Import
                </Button>

                <CreateCustomerModal onSuccess={fetchCustomers} />
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <UserIcon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Customers</p>
                  <p className="text-2xl font-bold">{customers.length}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Avg. LTV</p>
                  <p className="text-2xl font-bold">
                    ${customers.length ? (customers.reduce((acc, c) => acc + (c.lifetime_value || 0), 0) / customers.length).toFixed(2) : "0.00"}
                  </p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Avg. Orders</p>
                  <p className="text-2xl font-bold">
                    {customers.length ? (customers.reduce((acc, c) => acc + (c.total_orders || 0), 0) / customers.length).toFixed(1) : "0"}
                  </p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">New This Month</p>
                  <p className="text-2xl font-bold">
                    {customers.filter(c => new Date(c.created_at) > new Date(new Date().getFullYear(), new Date().getMonth(), 1)).length}
                  </p>
                </div>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search by name, email, business or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 px-3 border rounded-lg bg-white">
                    <Filter size={16} className="text-gray-400" />
                    <select 
                      className="bg-transparent h-10 text-sm focus:outline-none min-w-[120px]"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 px-3 border rounded-lg bg-white">
                    <select 
                      className="bg-transparent h-10 text-sm focus:outline-none min-w-[140px]"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="revenue">Highest Revenue</option>
                      <option value="orders">Most Orders</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customers Table */}
            <Card className="overflow-hidden border-none shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact & Business</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Metrics</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <Loader2 className="mx-auto animate-spin text-green-600 mb-2" size={32} />
                          <p className="text-gray-500">Loading customers...</p>
                        </td>
                      </tr>
                    ) : filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <p className="text-gray-500 text-lg">No customers found matching your criteria.</p>
                          <Button variant="link" onClick={() => {setSearchTerm(""); setStatusFilter("all");}} className="text-green-600">
                            Clear all filters
                          </Button>
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
                                {customer.user?.name?.charAt(0) || "U"}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                                  {customer.user?.name || "Unnamed User"}
                                </p>
                                <p className="text-xs text-gray-500">Member since {new Date(customer.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail size={14} className="text-gray-400" />
                                {customer.user?.email}
                              </div>
                              {customer.business_name && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <ShoppingBag size={14} className="text-gray-400" />
                                  {customer.business_name}
                                </div>
                              )}
                              {customer.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone size={14} className="text-gray-400" />
                                  {customer.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900">${(customer.lifetime_value || 0).toLocaleString()} Revenue</div>
                              <div className="text-xs text-gray-500">{customer.total_orders || 0} Orders</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              customer.user?.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {customer.user?.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Link to={`/admin/customers/${customer.id}`}>
                              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 gap-1 font-bold">
                                View CRM
                                <ChevronRight size={14} />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

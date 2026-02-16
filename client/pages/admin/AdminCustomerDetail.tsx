import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Tag, 
  StickyNote, 
  ShoppingBag, 
  Activity, 
  Settings, 
  MessageSquare,
  User as UserIcon,
  DollarSign,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Undo2,
  FileText,
  Ban,
  Save
} from "lucide-react";
import { supabase, getCustomerById } from "@/lib/supabase";
import { toast } from "sonner";

export default function AdminCustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [internalNotes, setInternalNotes] = useState<any[]>([]);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    business_name: "",
    status: "active"
  });

  useEffect(() => {
    if (customerId) {
      fetchCustomerData();
      fetchCustomerNotes();
    }
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      setIsLoading(true);
      const data = await getCustomerById(customerId!);
      setCustomer(data);
      setEditForm({
        name: data.user?.name || "",
        email: data.user?.email || "",
        phone: data.phone || "",
        business_name: data.business_name || "",
        status: data.status || "active"
      });

      if (data?.user_id) {
        // Fetch addresses
        const { data: addrData } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", data.user_id);
        setAddresses(addrData || []);

        // Fetch orders
        const { data: orderData } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_email", data.user?.email)
          .order("created_at", { ascending: false });
        setOrders(orderData || []);
      }
    } catch (error: any) {
      console.error("Error fetching customer data:", error);
      toast.error("Failed to load customer profile");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomerNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("customer_notes")
        .select(`
          *,
          author:users(name)
        `)
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setInternalNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      setIsSavingNote(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("customer_notes")
        .insert([{
          customer_id: customerId,
          author_id: user.id,
          note: newNote,
          type: 'general'
        }])
        .select(`
          *,
          author:users(name)
        `)
        .single();

      if (error) throw error;

      setInternalNotes([data, ...internalNotes]);
      setNewNote("");
      toast.success("Internal note saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save note");
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      
      // Update User table (name)
      const { error: userError } = await supabase
        .from("users")
        .update({ name: editForm.name })
        .eq("id", customer.user_id);
      
      if (userError) throw userError;

      // Update Customer Profile table
      const { error: profileError } = await supabase
        .from("customer_profiles")
        .update({
          phone: editForm.phone,
          business_name: editForm.business_name,
          status: editForm.status
        })
        .eq("id", customerId);
      
      if (profileError) throw profileError;

      setCustomer({
        ...customer,
        user: { ...customer.user, name: editForm.name },
        phone: editForm.phone,
        business_name: editForm.business_name,
        status: editForm.status
      });

      toast.success("Customer profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const toggleAccountStatus = async () => {
    try {
      const newStatus = !customer.user?.is_active;
      const { error } = await supabase
        .from("users")
        .update({ is_active: newStatus })
        .eq("id", customer.user_id);

      if (error) throw error;
      
      setCustomer({
        ...customer,
        user: { ...customer.user, is_active: newStatus }
      });
      toast.success(`Account ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error("Failed to update account status");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center">
          <AlertCircle size={48} className="text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Customer Not Found</h2>
          <Button variant="link" onClick={() => navigate("/admin/customers")} className="mt-2 text-green-600">
            Back to Customers
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Breadcrumb & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/customers")}>
                  <ArrowLeft size={20} />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{customer.user?.name}</h1>
                  <p className="text-gray-600 text-sm">Customer ID: {customer.id}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2" onClick={() => window.open(`mailto:${customer.user?.email}`)}>
                  <Mail size={16} />
                  Message
                </Button>
                <Button 
                  variant={customer.user?.is_active ? "outline" : "destructive"} 
                  className="gap-2"
                  onClick={toggleAccountStatus}
                >
                  {customer.user?.is_active ? <Ban size={16} /> : <CheckCircle size={16} />}
                  {customer.user?.is_active ? "Deactivate" : "Activate"}
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 gap-2" onClick={() => document.getElementById('note-textarea')?.focus()}>
                  <StickyNote size={16} />
                  Add Note
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Summary */}
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center text-3xl font-bold text-green-700 mb-4 border-2 border-green-200">
                      {customer.user?.name?.charAt(0) || "U"}
                    </div>
                    <h2 className="text-xl font-bold">{customer.user?.name}</h2>
                    <p className="text-gray-500 text-sm">{customer.business_name || "Personal Account"}</p>
                    <div className="mt-3 flex gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${customer.user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {customer.user?.is_active ? 'Active' : 'Inactive'}
                      </span>
                      {customer.business_name && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Wholesale
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="text-gray-400" size={18} />
                      <span className="text-gray-600">{customer.user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="text-gray-400" size={18} />
                      <span className="text-gray-600">{customer.phone || "No phone added"}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="text-gray-400 mt-1" size={18} />
                      <span className="text-gray-600">
                        {addresses.find(a => a.is_default)?.street || "No primary address"}
                        <br />
                        {addresses.find(a => a.is_default)?.city} {addresses.find(a => a.is_default)?.state_province}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign size={18} className="text-green-600" />
                    Financial Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">LTV</p>
                      <p className="text-xl font-bold">${(customer.lifetime_value || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Total Orders</p>
                      <p className="text-xl font-bold">{customer.total_orders || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Avg Order</p>
                      <p className="text-xl font-bold">
                        ${customer.total_orders ? (customer.lifetime_value / customer.total_orders).toFixed(2) : "0.00"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Joined</p>
                      <p className="text-sm font-bold">{new Date(customer.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag size={18} className="text-blue-600" />
                    Segments & Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border">Verified Email</span>
                    {customer.lifetime_value > 1000 && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium border border-purple-200">High LTV</span>
                    )}
                    {customer.total_orders > 5 && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">Repeat Buyer</span>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 border-dashed border px-3 text-xs">
                      + Add Tag
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Right Column - Tabs */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6 gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent px-2 py-3 font-bold text-gray-500">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent px-2 py-3 font-bold text-gray-500">
                      Orders ({orders.length})
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent px-2 py-3 font-bold text-gray-500">
                      Activity
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent px-2 py-3 font-bold text-gray-500">
                      Internal Notes ({internalNotes.length})
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent px-2 py-3 font-bold text-gray-500">
                      Settings
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-6">
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock size={16} />
                            Recent Activity
                          </h4>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-1 h-2 w-2 rounded-full bg-green-500 shadow-sm" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Signed in to account</p>
                                <p className="text-xs text-gray-500">Yesterday at 4:32 PM</p>
                              </div>
                            </div>
                            {orders.length > 0 && (
                              <div className="flex items-start gap-3">
                                <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shadow-sm" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Placed Order #{orders[0].order_number}</p>
                                  <p className="text-xs text-gray-500">{new Date(orders[0].created_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                            )}
                            <div className="flex items-start gap-3">
                              <div className="mt-1 h-2 w-2 rounded-full bg-orange-500 shadow-sm" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Support Ticket Created</p>
                                <p className="text-xs text-gray-500">Last week</p>
                              </div>
                            </div>
                          </div>
                          <Button variant="link" className="mt-4 p-0 h-auto text-green-600 text-sm font-bold">
                            View all activity →
                          </Button>
                        </Card>

                        <Card className="p-6">
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin size={16} />
                            Primary Address
                          </h4>
                          {addresses.length > 0 ? (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-900">
                                {addresses[0].first_name} {addresses[0].last_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {addresses[0].street}
                                {addresses[0].street_2 && `, ${addresses[0].street_2}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {addresses[0].city}, {addresses[0].state_province} {addresses[0].zip_postal_code}
                              </p>
                              <p className="text-sm text-gray-600">{addresses[0].country}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No address on file</p>
                          )}
                          <Button variant="link" className="mt-4 p-0 h-auto text-green-600 text-sm font-bold">
                            Manage addresses →
                          </Button>
                        </Card>
                      </div>

                      <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <ShoppingBag size={16} />
                            Latest Orders
                          </h4>
                          <Button variant="link" className="p-0 h-auto text-green-600 text-sm font-bold">
                            View all →
                          </Button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead>
                              <tr className="border-b text-gray-500">
                                <th className="pb-3 font-semibold">Order ID</th>
                                <th className="pb-3 font-semibold">Date</th>
                                <th className="pb-3 font-semibold">Status</th>
                                <th className="pb-3 font-semibold text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {orders.slice(0, 5).map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                  <td className="py-3">
                                    <Link to={`/admin/orders/${order.id}`} className="font-bold text-green-600 hover:underline">
                                      #{order.order_number?.split('-').pop()}
                                    </Link>
                                  </td>
                                  <td className="py-3">{new Date(order.created_at).toLocaleDateString()}</td>
                                  <td className="py-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase ${
                                      order.status === 'delivered' || order.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {order.status}
                                    </span>
                                  </td>
                                  <td className="py-3 text-right font-bold">${order.total?.toFixed(2)}</td>
                                </tr>
                              ))}
                              {orders.length === 0 && (
                                <tr>
                                  <td colSpan={4} className="py-8 text-center text-gray-500">No orders found for this customer.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="orders">
                    <Card className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <h4 className="font-bold text-gray-900 text-xl">Order History</h4>
                        <div className="flex gap-2">
                          <Input placeholder="Search orders..." className="w-full md:w-64 h-9" />
                          <Button variant="outline" size="sm">Filter</Button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="px-4 py-3 font-bold text-gray-600">Order ID</th>
                              <th className="px-4 py-3 font-bold text-gray-600">Date</th>
                              <th className="px-4 py-3 font-bold text-gray-600">Status</th>
                              <th className="px-4 py-3 font-bold text-gray-600">Actions</th>
                              <th className="px-4 py-3 font-bold text-gray-600 text-right">Amount</th>
                              <th className="px-4 py-3 text-right"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {orders.map(order => (
                              <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-4 py-4">
                                  <span className="font-bold text-gray-900 block">#{order.order_number}</span>
                                  <span className="text-xs text-gray-500">{order.product_name || "Custom Order"}</span>
                                </td>
                                <td className="px-4 py-4 text-gray-600">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    order.status === 'delivered' || order.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2 gap-1 text-gray-600 border border-gray-200" onClick={() => toast.info("Resending invoice...")}>
                                      <FileText size={12} />
                                      Invoice
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2 gap-1 text-red-600 border border-red-100 hover:bg-red-50" onClick={() => toast.info("Processing refund...")}>
                                      <Undo2 size={12} />
                                      Refund
                                    </Button>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-right font-bold text-gray-900">
                                  ${order.total?.toFixed(2)}
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <Link to={`/admin/orders/${order.id}`}>
                                    <Button variant="ghost" size="icon" className="group-hover:text-green-600">
                                      <ExternalLink size={16} />
                                    </Button>
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="activity">
                    <Card className="p-6">
                      <h4 className="font-bold text-gray-900 text-xl mb-6">Interaction Timeline</h4>
                      <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                        {orders.length > 0 && (
                          <div className="relative">
                            <div className="absolute -left-8 top-1 h-6 w-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center z-10">
                              <ShoppingBag size={12} className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">Order #{orders[0].order_number} Processed</p>
                              <p className="text-gray-500 text-xs mt-1">{new Date(orders[0].created_at).toLocaleString()}</p>
                            </div>
                          </div>
                        )}

                        <div className="relative">
                          <div className="absolute -left-8 top-1 h-6 w-6 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center z-10">
                            <Mail size={12} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Automated Email: Welcome Message</p>
                            <p className="text-gray-500 text-xs mt-1">Sent on {new Date(customer.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {internalNotes.slice(0, 3).map(note => (
                          <div key={note.id} className="relative">
                            <div className="absolute -left-8 top-1 h-6 w-6 rounded-full bg-gray-100 border-2 border-gray-400 flex items-center justify-center z-10">
                              <StickyNote size={12} className="text-gray-600" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">Internal Note Added</p>
                              <p className="text-gray-500 text-xs mt-1">{new Date(note.created_at).toLocaleString()}</p>
                              <div className="mt-2 p-3 bg-gray-50 rounded border text-sm text-gray-600 italic">
                                "{note.note}"
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notes">
                    <Card className="p-6">
                      <h4 className="font-bold text-gray-900 text-xl mb-6">Internal CRM Notes</h4>
                      
                      <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Add New Interaction Note</label>
                        <textarea
                          id="note-textarea"
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px] text-sm"
                          placeholder="Log a call, meeting, or internal observation about this customer..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        />
                        <div className="mt-3 flex justify-end">
                          <Button 
                            className="bg-green-600 hover:bg-green-700 font-bold"
                            onClick={handleAddNote}
                            disabled={isSavingNote || !newNote.trim()}
                          >
                            {isSavingNote && <Loader2 size={16} className="animate-spin mr-2" />}
                            Log Interaction
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {internalNotes.length > 0 ? (
                          internalNotes.map(note => (
                            <div key={note.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold uppercase">
                                    {note.author?.name?.charAt(0) || "A"}
                                  </div>
                                  <span className="text-sm font-bold">{note.author?.name || "Admin"}</span>
                                </div>
                                <span className="text-xs text-gray-400">{new Date(note.created_at).toLocaleString()}</span>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">{note.note}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">No interaction notes yet. Start logging your communication history.</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="settings">
                    <Card className="p-6">
                      <h4 className="font-bold text-gray-900 text-xl mb-6 border-b pb-4">Account Settings & Editing</h4>
                      
                      <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Full Name</label>
                            <Input 
                              value={editForm.name}
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Email Address (Read-only)</label>
                            <Input 
                              value={editForm.email}
                              disabled
                              className="bg-gray-50"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Phone Number</label>
                            <Input 
                              value={editForm.phone}
                              onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Business Name</label>
                            <Input 
                              value={editForm.business_name}
                              onChange={(e) => setEditForm({...editForm, business_name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Account Status</label>
                            <select
                              className="w-full h-10 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              value={editForm.status}
                              onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="blocked">Blocked</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-sm font-bold text-gray-700 block">Communication Preferences</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                              <input type="checkbox" defaultChecked className="h-4 w-4 text-green-600 rounded" />
                              <span className="text-sm">Email Marketing</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                              <input type="checkbox" defaultChecked className="h-4 w-4 text-green-600 rounded" />
                              <span className="text-sm">Order SMS Updates</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                              <input type="checkbox" defaultChecked className="h-4 w-4 text-green-600 rounded" />
                              <span className="text-sm">Promotional Post</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t flex justify-end gap-3">
                          <Button variant="outline" type="button" onClick={() => fetchCustomerData()}>Discard Changes</Button>
                          <Button className="bg-green-600 hover:bg-green-700 font-bold gap-2" disabled={isSavingProfile}>
                            {isSavingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save CRM Updates
                          </Button>
                        </div>
                      </form>

                      <div className="mt-12 pt-8 border-t">
                        <h5 className="text-red-600 font-bold mb-4">Danger Zone</h5>
                        <div className="p-4 border border-red-100 rounded-lg bg-red-50 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-red-900">Block Customer Account</p>
                            <p className="text-xs text-red-700">Prevent this customer from logging in or placing new orders.</p>
                          </div>
                          <Button variant="destructive" size="sm" onClick={toggleAccountStatus}>
                            {customer.user?.is_active ? "Block Account" : "Unblock Account"}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Truck, Plus, Download, Copy, Check, Loader2, Search, Filter, RefreshCcw } from "lucide-react";
import { supabase, ShippingBatch, extractErrorMessage, updateOrderTracking } from "@/lib/supabase";
import { toast } from "sonner";

interface ShippingOrder {
  id: string;
  order_number: string;
  customer_name: string;
  weight: string;
  selected: boolean;
  status: string;
  created_at: string;
}

export default function AdminShipping() {
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [batches, setBatches] = useState<ShippingBatch[]>([]);
  const [carrier, setCarrier] = useState("usps");
  const [trackingPaste, setTrackingPaste] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchShippingData();
  }, []);

  const fetchShippingData = async () => {
    try {
      setIsLoading(true);

      // Fetch orders ready to ship
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          created_at,
          customer_profiles(
            user_id,
            users(name, email)
          )
        `)
        .eq('status', 'ready-to-ship');

      if (ordersError) throw ordersError;

      const formattedOrders: ShippingOrder[] = (ordersData || []).map(o => ({
        id: o.id,
        order_number: o.order_number,
        customer_name: (o.customer_profiles as any)?.users?.name || (o.customer_profiles as any)?.users?.email || "Guest",
        weight: (Math.random() * 5 + 0.5).toFixed(1) + " lbs", // Random weight for now
        selected: false,
        status: o.status,
        created_at: o.created_at
      }));

      setOrders(formattedOrders);

      // Fetch recent batches
      const { data: batchesData, error: batchesError } = await supabase
        .from('shipping_batches')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (batchesError && batchesError.code !== 'PGRST116') {
        // If table doesn't exist, we'll just have an empty list
        console.warn("Could not fetch batches:", batchesError);
      } else {
        setBatches(batchesData || []);
      }

    } catch (error) {
      console.error("Error fetching shipping data:", error);
      const message = extractErrorMessage(error, "Failed to load shipping data");

      // Provide helpful context if tables are missing
      if (message.includes("relation") && message.includes("does not exist")) {
        toast.error("Database tables missing. Please ensure SHIPPING_TABLES.sql has been applied.");
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectedOrders = orders.filter((o) => o.selected);
  const selectedCount = selectedOrders.length;
  const totalWeight = selectedOrders
    .reduce((sum, o) => sum + parseFloat(o.weight), 0);

  const toggleOrder = (id: string) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, selected: !o.selected } : o))
    );
  };

  const toggleAllOrders = () => {
    const allSelected = orders.length > 0 && orders.every((o) => o.selected);
    setOrders(orders.map((o) => ({ ...o, selected: !allSelected })));
  };

  const handleGenerateLabels = async () => {
    if (selectedCount === 0) return;

    try {
      setIsProcessing(true);

      // 1. Create a batch
      const batchNumber = `BATCH-${Date.now().toString().slice(-6)}`;
      const { data: batch, error: batchError } = await supabase
        .from('shipping_batches')
        .insert([{
          batch_number: batchNumber,
          carrier: carrier,
          status: 'processing'
        }])
        .select()
        .single();

      if (batchError) throw batchError;

      // 2. Generate labels (mocking label creation for now)
      const labelsToCreate = selectedOrders.map(o => ({
        order_id: o.id,
        batch_id: batch.id,
        carrier: carrier,
        label_url: `https://example.com/labels/${o.id}.pdf`,
        tracking_number: `TRK${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        weight: parseFloat(o.weight)
      }));

      const { error: labelsError } = await supabase
        .from('shipping_labels')
        .insert(labelsToCreate);

      if (labelsError) throw labelsError;

      // 3. Update orders to 'shipped' (optional, might want to wait for actual shipping)
      // For this "station", we'll just keep them as is or mark them as processing

      toast.success(`Generated ${selectedCount} labels in ${batchNumber}`);

      // Update batch status to completed
      await supabase.from('shipping_batches').update({ status: 'completed' }).eq('id', batch.id);

      fetchShippingData();
    } catch (error) {
      console.error("Error generating labels:", error);
      toast.error(extractErrorMessage(error, "Failed to generate labels"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportTracking = async () => {
    if (!trackingPaste.trim()) return;

    const lines = trackingPaste.trim().split('\n');
    if (lines.length === 0) return;

    try {
      setIsProcessing(true);
      let successCount = 0;

      for (const line of lines) {
        // Expected format: ORDER_NUMBER, TRACKING_NUMBER or just TRACKING_NUMBER if we can match somehow
        // For simplicity, let's assume paste is: order_number, tracking_number
        const parts = line.split(/[,\s\t]+/).filter(Boolean);
        if (parts.length < 2) continue;

        const orderNum = parts[0].trim();
        const trackingNum = parts[1].trim();

        // Find order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('id')
          .eq('order_number', orderNum)
          .single();

        if (order) {
          await updateOrderTracking(order.id, trackingNum, carrier);
          successCount++;
        }
      }

      toast.success(`Successfully imported ${successCount} tracking numbers`);
      setTrackingPaste("");
      fetchShippingData();
    } catch (error) {
      console.error("Error importing tracking:", error);
      toast.error(extractErrorMessage(error, "Failed to import tracking numbers"));
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredOrders = orders.filter(o =>
    o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <h1 className="text-3xl font-bold text-gray-900">Shipping Station</h1>
                  <p className="text-gray-600 mt-1">Bulk label generation and shipment tracking</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={fetchShippingData}
                    disabled={isLoading}
                    variant="outline"
                    className="gap-2"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
                    Refresh Queue
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 gap-2">
                    <Plus size={18} />
                    New Batch
                  </Button>
                </div>
              </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Ready to Ship</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-gray-900">{isLoading ? "..." : orders.length}</p>
                  <p className="text-sm text-gray-500 font-medium">orders</p>
                </div>
              </Card>
              <Card className="p-6 border-blue-100 bg-blue-50/30">
                <p className="text-blue-600 text-xs font-medium uppercase tracking-wider">Selected</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-blue-600">{selectedCount}</p>
                  <p className="text-sm text-blue-500 font-medium">labels</p>
                </div>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Total Weight</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-gray-900">{totalWeight.toFixed(1)}</p>
                  <p className="text-sm text-gray-500 font-medium">lbs</p>
                </div>
              </Card>
              <Card className="p-6 border-green-100 bg-green-50/30">
                <p className="text-green-600 text-xs font-medium uppercase tracking-wider">Est. Shipping</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-green-600">${(selectedCount * 5.99).toFixed(2)}</p>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Orders List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search by order # or customer..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter size={18} />
                    Filter
                  </Button>
                </div>

                <Card className="p-0 overflow-hidden">
                  <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-gray-900">Shipping Queue</h2>
                    <Button
                      variant="link"
                      onClick={toggleAllOrders}
                      className="text-sm text-green-600 hover:text-green-700 font-medium h-auto p-0"
                    >
                      {orders.length > 0 && orders.every((o) => o.selected) ? "Deselect All" : "Select All"}
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3">
                            <input
                              type="checkbox"
                              checked={orders.length > 0 && orders.every((o) => o.selected)}
                              onChange={toggleAllOrders}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Order #</th>
                          <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Customer</th>
                          <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Created</th>
                          <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Weight</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {isLoading ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center">
                              <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-2" />
                              <p className="text-gray-500">Loading orders...</p>
                            </td>
                          </tr>
                        ) : filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center">
                              <Truck className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                              <p className="text-gray-500">No orders ready for shipping</p>
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((order) => (
                            <tr
                              key={order.id}
                              onClick={() => toggleOrder(order.id)}
                              className={`hover:bg-gray-50 transition cursor-pointer ${
                                order.selected ? "bg-blue-50/50" : ""
                              }`}
                            >
                              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={order.selected}
                                  onChange={() => toggleOrder(order.id)}
                                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                              </td>
                              <td className="px-6 py-4 font-mono font-bold text-gray-900">
                                {order.order_number}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{order.customer_name}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-right font-medium text-gray-900">
                                {order.weight}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Actions Sidebar */}
              <div className="space-y-4">
                {/* Carrier Selection */}
                <Card className="p-4 shadow-sm border-none">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Select Carrier
                  </label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
                  >
                    <option value="usps">USPS (United States Postal Service)</option>
                    <option value="ups">UPS (United Parcel Service)</option>
                    <option value="fedex">FedEx (Federal Express)</option>
                    <option value="dhl">DHL Express</option>
                  </select>
                </Card>

                {/* Generate Labels */}
                <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-lg">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Download size={18} />
                    Label Generation
                  </h3>
                  <p className="text-blue-100 text-sm mb-6">
                    Automatically generate shipping labels and tracking numbers for selected orders.
                  </p>
                  <Button
                    onClick={handleGenerateLabels}
                    disabled={selectedCount === 0 || isProcessing}
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold"
                  >
                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Truck size={18} />}
                    Process {selectedCount} Shipments
                  </Button>
                </Card>

                {/* Print Options */}
                <Card className="p-4 space-y-2 shadow-sm border-none bg-white">
                  <Button variant="outline" className="w-full gap-2 text-sm font-medium">
                    <Copy size={16} className="text-gray-400" />
                    Copy Labels to Clipboard
                  </Button>
                  <Button variant="outline" className="w-full gap-2 text-sm font-medium">
                    <Download size={16} className="text-gray-400" />
                    Download Batch PDF
                  </Button>
                </Card>
              </div>
            </div>

            {/* Tracking Numbers Import */}
            <Card className="p-6 mb-8 shadow-sm border-none bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Import External Tracking</h2>
                <div className="flex gap-2">
                  <Button variant="link" className="text-xs font-bold text-green-600 hover:text-green-700 uppercase tracking-wider h-auto p-0">
                    Download Template
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste data (Format: ORDER_NUMBER, TRACKING_NUMBER)
                  </label>
                  <textarea
                    value={trackingPaste}
                    onChange={(e) => setTrackingPaste(e.target.value)}
                    placeholder="ORD-1001, 1Z999AA10123456784
ORD-1002, 1Z999AA10234567895"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm bg-gray-50"
                    rows={4}
                  />
                  <Button
                    onClick={handleImportTracking}
                    disabled={!trackingPaste.trim() || isProcessing}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 font-bold"
                  >
                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    Update Order Tracking
                  </Button>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bulk CSV Upload
                  </label>
                  <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-green-500 hover:bg-green-50/30 transition cursor-pointer flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                      <Plus size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Click to upload CSV</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Must contain 'order_number' and 'tracking_number' columns
                      </p>
                    </div>
                    <input type="file" className="hidden" accept=".csv" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Batch History */}
            <Card className="p-0 overflow-hidden shadow-sm border-none bg-white">
              <div className="p-4 border-b bg-white flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Shipment Batch History</h2>
                <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700 font-medium h-auto p-0">View All History →</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Batch ID</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Carrier</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Created At</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {batches.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                          No shipment batches recorded yet
                        </td>
                      </tr>
                    ) : (
                      batches.map(batch => (
                        <tr key={batch.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-mono font-bold text-gray-900">
                            {batch.batch_number}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium uppercase text-gray-700">{batch.carrier}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                              batch.status === 'completed' ? 'bg-green-100 text-green-700' :
                              batch.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {batch.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(batch.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              className="text-green-600 hover:text-green-700 font-bold text-sm h-auto p-0"
                            >
                              Details →
                            </Button>
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

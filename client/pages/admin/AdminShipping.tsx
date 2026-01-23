import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Truck, Plus, Download, Copy, Check } from "lucide-react";

const shippingOrders = [
  { id: "ORD-003", customer: "Brand Co", weight: "2.3 lbs", selected: false },
  { id: "ORD-007", customer: "Design Studio", weight: "1.1 lbs", selected: false },
  { id: "ORD-011", customer: "Creative Labs", weight: "4.2 lbs", selected: false },
  { id: "ORD-014", customer: "Art House", weight: "0.8 lbs", selected: false },
  { id: "ORD-018", customer: "Brand Co", weight: "3.5 lbs", selected: false },
  { id: "ORD-022", customer: "Design Studio", weight: "1.9 lbs", selected: false },
];

export default function AdminShipping() {
  const [orders, setOrders] = useState(shippingOrders);
  const [carrier, setCarrier] = useState("usps");
  const [trackingPaste, setTrackingPaste] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedCount = orders.filter((o) => o.selected).length;
  const totalWeight = orders
    .filter((o) => o.selected)
    .reduce((sum, o) => sum + parseFloat(o.weight), 0);

  const toggleOrder = (id: string) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, selected: !o.selected } : o))
    );
  };

  const toggleAllOrders = () => {
    const allSelected = orders.every((o) => o.selected);
    setOrders(orders.map((o) => ({ ...o, selected: !allSelected })));
  };

  const handleGenerateLabels = () => {
    alert(
      `Generated ${selectedCount} shipping labels for ${carrier.toUpperCase()}\nTotal weight: ${totalWeight.toFixed(1)} lbs`
    );
  };

  const handleCopyTrackingNumbers = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <Plus size={18} />
                New Batch
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">READY TO SHIP</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">SELECTED</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{selectedCount}</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">TOTAL WEIGHT</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalWeight.toFixed(1)} lbs
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">ESTIMATED COST</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ${(selectedCount * 3.5).toFixed(2)}
                </p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Orders List */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Orders Ready to Ship</h2>
                    <button
                      onClick={toggleAllOrders}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      {orders.every((o) => o.selected) ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={orders.every((o) => o.selected)}
                              onChange={toggleAllOrders}
                              className="rounded"
                            />
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Order
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Customer
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Weight
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            className={`hover:bg-gray-50 transition ${
                              order.selected ? "bg-blue-50" : ""
                            }`}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={order.selected}
                                onChange={() => toggleOrder(order.id)}
                                className="rounded"
                              />
                            </td>
                            <td className="px-4 py-3 font-mono font-semibold text-gray-900">
                              {order.id}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{order.customer}</td>
                            <td className="px-4 py-3 text-gray-900">{order.weight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Actions Sidebar */}
              <div className="space-y-4">
                {/* Carrier Selection */}
                <Card className="p-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Select Carrier
                  </label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option value="usps">USPS</option>
                    <option value="ups">UPS</option>
                    <option value="fedex">FedEx</option>
                    <option value="dhl">DHL</option>
                  </select>
                </Card>

                {/* Generate Labels */}
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <button
                    onClick={handleGenerateLabels}
                    disabled={selectedCount === 0}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Generate {selectedCount} Labels
                  </button>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    {selectedCount > 0
                      ? `Ready to generate labels for ${selectedCount} orders`
                      : "Select orders to generate labels"}
                  </p>
                </Card>

                {/* Action Buttons */}
                <Card className="p-4 space-y-2">
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                    📋 Copy Labels
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                    🖨️ Print Labels
                  </button>
                </Card>
              </div>
            </div>

            {/* Tracking Numbers Import */}
            <Card className="p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Tracking Numbers</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Paste tracking numbers (one per line)
                  </label>
                  <textarea
                    value={trackingPaste}
                    onChange={(e) => setTrackingPaste(e.target.value)}
                    placeholder="1Z999AA10123456784
1Z999AA10234567895"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                    rows={4}
                  />
                  <button className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm">
                    Import Tracking Numbers
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Or upload CSV file
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition cursor-pointer">
                    <p className="text-sm text-gray-600">
                      Drag and drop CSV file here, or click to select
                    </p>
                    <input type="file" className="hidden" accept=".csv" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Batch History */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Shipment Batches</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Batch ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Carrier
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Created
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
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-mono font-semibold text-gray-900">
                        BATCH-001
                      </td>
                      <td className="px-6 py-4 text-gray-600">12 orders</td>
                      <td className="px-6 py-4 text-gray-900">USPS</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">2025-01-20</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Shipped
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                          View →
                        </button>
                      </td>
                    </tr>
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

import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Send,
  Package,
  Truck,
  MessageSquare,
  Edit,
} from "lucide-react";

// Sample order data
const sampleOrder = {
  id: "ORD-001",
  customerName: "Acme Corp",
  customerEmail: "contact@acme.com",
  status: "proof-sent",
  createdAt: new Date("2025-01-20"),
  
  lineItems: [
    {
      id: "item-1",
      productName: "Die-Cut Vinyl Stickers",
      quantity: 100,
      material: "Vinyl",
      finish: "Glossy",
      size: "3\" x 3\"",
      unitPrice: 0.35,
      subtotal: 35,
    },
  ],
  
  artworkFiles: [
    {
      id: "art-1",
      fileName: "design_final.pdf",
      uploadedAt: new Date("2025-01-20T10:30:00"),
      status: "approved",
    },
  ],
  
  proofs: [
    {
      id: "proof-1",
      version: 1,
      sentAt: new Date("2025-01-20T14:00:00"),
      status: "sent",
      messageToCustomer: "Here is your proof. Please review and let us know if any changes are needed.",
    },
  ],
  
  shippingAddress: {
    firstName: "John",
    lastName: "Smith",
    company: "Acme Corp",
    street: "123 Main St",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    phone: "555-0123",
  },
  
  timeline: [
    {
      timestamp: new Date("2025-01-20T10:00:00"),
      action: "Order created",
      actor: "Customer",
    },
    {
      timestamp: new Date("2025-01-20T10:30:00"),
      action: "Artwork uploaded",
      actor: "Customer",
    },
    {
      timestamp: new Date("2025-01-20T14:00:00"),
      action: "Proof sent",
      actor: "Sarah Designer",
    },
  ],
  
  internalNotes: "",
  customerNotes: "",
};

const OrderStatusSteps = [
  { status: "awaiting-artwork", label: "Awaiting Artwork", icon: Upload },
  { status: "proof-sent", label: "Proof Sent", icon: Send },
  { status: "approved", label: "Approved", icon: CheckCircle },
  { status: "in-production", label: "In Production", icon: Package },
  { status: "ready-to-ship", label: "Ready to Ship", icon: Truck },
];

export default function AdminOrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(sampleOrder);
  const [proofMessage, setProofMessage] = useState("");
  const [internalNote, setInternalNote] = useState("");

  const currentStatusIndex = OrderStatusSteps.findIndex(
    (step) => step.status === order.status
  );

  const handleStatusTransition = (newStatus: string) => {
    setOrder({ ...order, status: newStatus as any });
  };

  const handleSendProof = () => {
    if (proofMessage.trim()) {
      alert(`Proof sent with message: ${proofMessage}`);
      setProofMessage("");
    }
  };

  const handleAddNote = () => {
    if (internalNote.trim()) {
      const newNote = {
        ...order,
        internalNotes: (order.internalNotes ? order.internalNotes + "\n" : "") + internalNote,
      };
      setOrder(newNote);
      setInternalNote("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{order.id}</h1>
                  <p className="text-gray-600 mt-1">
                    {order.customerName} · Created {order.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <Edit size={18} />
                  Edit Order
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Status Timeline */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Production Status</h2>
                  <div className="space-y-4">
                    {OrderStatusSteps.map((step, idx) => {
                      const Icon = step.icon;
                      const isActive = step.status === order.status;
                      const isCompleted = idx < currentStatusIndex;
                      const isPending = idx > currentStatusIndex;

                      return (
                        <div key={step.status}>
                          <button
                            onClick={() => handleStatusTransition(step.status)}
                            className={`w-full p-4 rounded-lg border-2 transition flex items-start gap-4 ${
                              isActive
                                ? "border-green-600 bg-green-50"
                                : isCompleted
                                  ? "border-green-200 bg-green-50"
                                  : "border-gray-200 bg-gray-50 opacity-50"
                            }`}
                          >
                            <div className="flex-shrink-0 mt-1">
                              <Icon
                                size={20}
                                className={
                                  isCompleted || isActive
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <p
                                className={`font-semibold ${
                                  isActive ? "text-green-900" : "text-gray-900"
                                }`}
                              >
                                {step.label}
                              </p>
                              {isCompleted && (
                                <p className="text-xs text-green-700 mt-1">✓ Completed</p>
                              )}
                              {isPending && (
                                <p className="text-xs text-gray-600 mt-1">Pending</p>
                              )}
                            </div>
                          </button>
                          {idx < OrderStatusSteps.length - 1 && (
                            <div className="py-2 flex justify-center">
                              <div className="h-6 w-0.5 bg-gray-300"></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Line Items */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                  <div className="space-y-4">
                    {order.lineItems.map((item) => (
                      <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{item.productName}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Qty: {item.quantity} · {item.material} · {item.finish} · {item.size}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-gray-900">${item.subtotal}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.quantity} × ${item.unitPrice} per unit
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between">
                    <p className="font-semibold text-gray-900">Total:</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${order.lineItems.reduce((sum, item) => sum + item.subtotal, 0)}
                    </p>
                  </div>
                </Card>

                {/* Artwork & Proofs */}
                {order.status === "awaiting-artwork" && (
                  <Card className="p-6 border-2 border-orange-200 bg-orange-50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-orange-900">Awaiting Customer Artwork</p>
                        <p className="text-sm text-orange-800 mt-1">
                          Customer needs to upload artwork files before production can begin.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {order.artworkFiles.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Artwork Files</h2>
                    <div className="space-y-2">
                      {order.artworkFiles.map((file) => (
                        <div
                          key={file.id}
                          className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{file.fileName}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              Uploaded {file.uploadedAt.toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              file.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {file.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Send Proof Section */}
                {order.status === "awaiting-artwork" || order.status === "proof-sent" ? (
                  <Card className="p-6 border-2 border-blue-200 bg-blue-50">
                    <h2 className="text-lg font-semibold text-blue-900 mb-4">Send Proof</h2>
                    <div className="space-y-3">
                      <textarea
                        value={proofMessage}
                        onChange={(e) => setProofMessage(e.target.value)}
                        placeholder="Message to customer..."
                        className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                      <button
                        onClick={handleSendProof}
                        disabled={!proofMessage.trim()}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                      >
                        <Send size={18} />
                        Send Proof
                      </button>
                    </div>
                  </Card>
                ) : null}

                {/* Proof History */}
                {order.proofs.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Proof History</h2>
                    <div className="space-y-4">
                      {order.proofs.map((proof) => (
                        <div key={proof.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-semibold text-gray-900">Proof v{proof.version}</p>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                proof.status === "sent"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {proof.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Sent {proof.sentAt.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 italic">
                            "{proof.messageToCustomer}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Customer Info */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-semibold text-gray-900">{order.customerName}</p>
                    <p>{order.customerEmail}</p>
                    <p className="text-xs">View customer profile →</p>
                  </div>
                </Card>

                {/* Shipping Address */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    {order.shippingAddress.company && <p>{order.shippingAddress.company}</p>}
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.phone}</p>
                  </div>
                </Card>

                {/* Internal Notes */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Internal Notes</h3>
                  <div className="space-y-2">
                    <textarea
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      placeholder="Add internal notes..."
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      rows={3}
                    />
                    <button
                      onClick={handleAddNote}
                      disabled={!internalNote.trim()}
                      className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition text-sm"
                    >
                      Add Note
                    </button>
                  </div>
                  {order.internalNotes && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded whitespace-pre-wrap">
                        {order.internalNotes}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* Timeline */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Activity Timeline</h2>
              <div className="space-y-4">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <Clock size={16} className="text-green-600" />
                      {idx < order.timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-gray-900">{event.action}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {event.timestamp.toLocaleString()} by {event.actor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

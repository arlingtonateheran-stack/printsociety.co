import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
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
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react";

const OrderStatusSteps = [
  { status: "awaiting-artwork", label: "Awaiting Artwork", icon: Upload },
  { status: "proof-sent", label: "Proof Sent", icon: Send },
  { status: "approved", label: "Approved", icon: CheckCircle },
  { status: "in-production", label: "In Production", icon: Package },
  { status: "ready-to-ship", label: "Ready to Ship", icon: Truck },
];

export default function AdminOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [proofMessage, setProofMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [internalNote, setInternalNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      verifyTables();
    }
  }, [orderId]);

  const verifyTables = async () => {
    try {
      const tables = ["orders", "proofs", "artwork_files"];
      for (const table of tables) {
        const { error } = await supabase.from(table).select("count", { count: "exact", head: true });
        if (error) {
          console.error(`[DEBUG] Table check failed for '${table}':`, JSON.stringify(error, null, 2));
        } else {
          console.log(`[DEBUG] Table check passed for '${table}'`);
        }
      }
    } catch (e) {
      console.error("[DEBUG] Unexpected error during table verification:", e);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);

      // Check if orderId is a valid UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId || "");

      console.log(`[DEBUG] Fetching order details for ${isUUID ? 'UUID' : 'number'}: ${orderId}`);

      // Attempt full query with joins
      const response = await supabase
        .from("orders")
        .select(`
          *,
          proofs(*),
          artwork_files(*)
        `)
        .eq(isUUID ? "id" : "order_number", orderId)
        .maybeSingle();

      const { data, error } = response;

      if (error) {
        console.error("[DEBUG] Supabase error (full query):", JSON.stringify(error, null, 2));

        // Fallback: try simple query without joins to see if relationship is the issue
        console.log("[DEBUG] Attempting fallback query without joins...");
        const fallbackResponse = await supabase
          .from("orders")
          .select("*")
          .eq(isUUID ? "id" : "order_number", orderId)
          .maybeSingle();

        const { data: fallbackData, error: fallbackError } = fallbackResponse;

        if (fallbackError) {
          console.error("[DEBUG] Supabase error (fallback query):", JSON.stringify(fallbackError, null, 2));
          throw fallbackError;
        }

        if (fallbackData) {
          console.warn("[DEBUG] Order found without joins, but joined query failed. This usually means a missing relationship/FK in Supabase.");
          setOrder({ ...fallbackData, proofs: [], artwork_files: [] });
          toast.warning("Order loaded without proofs/artwork due to database relationship issue.");
          return;
        }

        throw error;
      }

      if (!data) {
        console.warn(`[DEBUG] No order found with ${isUUID ? 'ID' : 'number'}: ${orderId}`);
        setOrder(null);
      } else {
        console.log("[DEBUG] Order data successfully fetched:", data);
        setOrder(data);
      }
    } catch (error: any) {
      console.error("[DEBUG] Detailed error fetching order details:", error);

      let errorMessage = "Unknown error";
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = error.message || error.details || error.hint || `Error code: ${error.code}`;
        // Force serialization if we still have an object/empty message
        if (errorMessage.includes('[object Object]') || errorMessage === 'undefined' || !errorMessage) {
          errorMessage = JSON.stringify(error);
        }
      }

      toast.error(`Failed to load order details: ${errorMessage}`, {
        duration: 15000, // Show for 15 seconds so user can copy
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatusIndex = OrderStatusSteps.findIndex(
    (step) => step.status === order?.status
  );

  const handleStatusTransition = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", order.id);

      if (error) throw error;
      setOrder({ ...order, status: newStatus as any });
      toast.success("Order status updated");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendProof = async () => {
    if (!proofMessage.trim() && !selectedFile) return;

    try {
      setIsUpdating(true);
      let fileUrl = "";

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `proofs/${order.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('customer-designs')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('customer-designs')
          .getPublicUrl(filePath);

        fileUrl = publicUrlData.publicUrl;
      }

      const { error: proofError } = await supabase
        .from("proofs")
        .insert([{
          order_id: order.id,
          message_to_customer: proofMessage,
          file_url: fileUrl,
          version: (order.proofs?.length || 0) + 1,
          status: 'sent'
        }]);

      if (proofError) throw proofError;

      // Update order status to proof-sent if it was awaiting-artwork
      if (order.status === 'awaiting-artwork') {
        await supabase.from("orders").update({ status: 'proof-sent' }).eq("id", order.id);
      }

      toast.success("Proof sent successfully");
      setProofMessage("");
      setSelectedFile(null);
      fetchOrderDetails();
    } catch (error) {
      console.error("Error sending proof:", error);
      toast.error("Failed to send proof");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleAddNote = async () => {
    if (!internalNote.trim()) return;

    try {
      setIsUpdating(true);
      const newNotes = (order.internal_notes ? order.internal_notes + "\n" : "") + internalNote;

      const { error } = await supabase
        .from("orders")
        .update({ internal_notes: newNotes })
        .eq("id", order.id);

      if (error) throw error;

      setOrder({ ...order, internal_notes: newNotes });
      setInternalNote("");
      toast.success("Internal note added");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add internal note");
    } finally {
      setIsUpdating(false);
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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <p className="text-gray-500 mb-4">Order not found.</p>
          <div className="max-w-md w-full p-4 bg-white rounded-lg shadow-sm border text-xs overflow-auto max-h-60">
             <p className="font-bold mb-2">Debug Info (Admin Only):</p>
             <pre>{JSON.stringify({ orderId, orderNumber: orderId, isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId || "") }, null, 2)}</pre>
             <button
               onClick={() => fetchOrderDetails()}
               className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
             >
               Retry Fetch
             </button>
          </div>
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
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate("/admin/orders")}
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 font-medium"
              >
                <ArrowLeft size={18} />
                Back to Orders
              </button>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{order.order_number || order.id.substring(0, 8)}</h1>
                  <p className="text-gray-600 mt-1">
                    {order.customer_name || order.customer_email} · Created {new Date(order.created_at).toLocaleDateString()}
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
                            disabled={isUpdating}
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
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{order.product_name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Qty: {order.quantity} · {order.selected_material || 'Standard Vinyl'} · {order.selected_finish} · {order.selected_size}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">${order.subtotal || 0}</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.quantity} × ${order.price_per_unit || 0} per unit
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between">
                    <p className="font-semibold text-gray-900">Total:</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${order.total || 0}
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

                {order.design_file_url && (
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Artwork Files</h2>
                    <div className="space-y-2">
                      <div
                        className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{order.design_file_name || 'design.pdf'}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Primary design file
                          </p>
                        </div>
                        <a
                          href={order.design_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold hover:bg-blue-200 transition"
                        >
                          Download
                        </a>
                      </div>
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

                      {/* File Attachment */}
                      <div className="space-y-2">
                        {selectedFile ? (
                          <div className="flex items-center justify-between p-2 bg-blue-100 border border-blue-200 rounded-lg text-sm">
                            <div className="flex items-center gap-2 text-blue-800">
                              <Upload size={16} />
                              <span className="font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                              <span className="text-xs text-blue-600">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button
                              onClick={removeFile}
                              className="text-blue-500 hover:text-blue-700 transition p-1"
                            >
                              <X size={16} />
                              <span className="sr-only">Remove</span>
                            </button>
                          </div>
                        ) : (
                          <div className="relative">
                            <input
                              type="file"
                              id="proof-file"
                              className="hidden"
                              onChange={handleFileChange}
                              accept="image/*,application/pdf"
                            />
                            <label
                              htmlFor="proof-file"
                              className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-100 cursor-pointer transition text-sm font-medium"
                            >
                              <Upload size={18} />
                              Attach proof file (PDF, Image)
                            </label>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleSendProof}
                        disabled={!proofMessage.trim() && !selectedFile}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                      >
                        <Send size={18} />
                        Send Proof
                      </button>
                    </div>
                  </Card>
                ) : null}

                {/* Proof History */}
                {order.proofs && order.proofs.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Proof History</h2>
                    <div className="space-y-4">
                      {order.proofs.map((proof: any) => (
                        <div key={proof.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-semibold text-gray-900">Proof v{proof.version}</p>
                            <div className="flex gap-2">
                              {proof.file_url && (
                                <a
                                  href={proof.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
                                >
                                  View File
                                </a>
                              )}
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
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Sent {new Date(proof.sent_at).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 italic">
                            "{proof.message_to_customer}"
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
                    <p className="font-semibold text-gray-900">{order.customer_name || 'Guest'}</p>
                    <p>{order.customer_email}</p>
                  </div>
                </Card>

                {/* Shipping Address */}
                {order.shipping_address && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-900">
                        {order.shipping_address.firstName} {order.shipping_address.lastName}
                      </p>
                      {order.shipping_address.company && <p>{order.shipping_address.company}</p>}
                      <p>{order.shipping_address.street}</p>
                      <p>
                        {order.shipping_address.city}, {order.shipping_address.state}{" "}
                        {order.shipping_address.zipCode}
                      </p>
                      <p>{order.shipping_address.phone}</p>
                    </div>
                  </Card>
                )}

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
                      disabled={!internalNote.trim() || isUpdating}
                      className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition text-sm"
                    >
                      Add Note
                    </button>
                  </div>
                  {order.internal_notes && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded whitespace-pre-wrap">
                        {order.internal_notes}
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
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <Clock size={16} className="text-green-600" />
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-gray-900">Order created</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
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

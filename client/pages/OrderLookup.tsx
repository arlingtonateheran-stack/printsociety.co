import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sampleOrders } from "@shared/account";
import { orderStatusColors } from "@shared/account";
import { Search, Package, Truck, CheckCircle, AlertCircle, Calendar } from "lucide-react";

export default function OrderLookup() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [foundOrder, setFoundOrder] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);
    setError("");
    setFoundOrder(null);

    if (!orderNumber.trim() || !email.trim()) {
      setError("Please enter both order number and email.");
      return;
    }

    // Simple lookup - in production would hit an API
    const order = sampleOrders.find(
      (o) =>
        o.orderNumber.toLowerCase() === orderNumber.toLowerCase() &&
        o.shippingAddress.name.toLowerCase() === email.toLowerCase()
    );

    if (order) {
      setFoundOrder(order as any);
    } else {
      setError(
        "Order not found. Please check your order number and email address."
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "proof-approved":
        return <Package size={24} className="text-blue-600" />;
      case "in-production":
        return <Package size={24} className="text-purple-600" />;
      case "shipped":
        return <Truck size={24} className="text-green-600" />;
      case "delivered":
        return <CheckCircle size={24} className="text-gray-600" />;
      default:
        return <AlertCircle size={24} className="text-yellow-600" />;
    }
  };

  const getTimelineSteps = (status: string) => {
    const steps = [
      { status: "proof-approved", label: "Proof Approved", icon: CheckCircle },
      { status: "in-production", label: "In Production", icon: Package },
      { status: "shipped", label: "Shipped", icon: Truck },
      { status: "delivered", label: "Delivered", icon: CheckCircle },
    ];

    const statusMap = {
      "proof-approved": 0,
      "in-production": 1,
      "shipped": 2,
      "delivered": 3,
    };

    const currentIndex = statusMap[status as keyof typeof statusMap] ?? -1;

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Track Your Order</h1>
            <p className="text-gray-600">
              Enter your order number and email to check the status of your order.
              No login required.
            </p>
          </div>

          {!foundOrder ? (
            <>
              {/* Search Form */}
              <Card className="p-8 mb-8">
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Number (e.g., ORD-2025-001) *
                      </label>
                      <Input
                        placeholder="ORD-2025-001"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className={error && !orderNumber ? "border-red-500" : ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address on Order *
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={error && !email ? "border-red-500" : ""}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold flex items-center justify-center gap-2"
                  >
                    <Search size={20} />
                    Track Order
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Your order information will be displayed in real-time.
                  </p>
                </form>
              </Card>

              {/* Help Section */}
              <Card className="p-8 bg-blue-50 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4">
                  Need help finding your order number?
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>
                    • Check your email for the order confirmation message
                  </li>
                  <li>
                    • Your order number starts with "ORD-" and can be found in
                    the subject line
                  </li>
                  <li>
                    • If you've misplaced it, <a href="/support" className="underline font-medium">contact support</a> with
                    your email and we can help
                  </li>
                </ul>
              </Card>
            </>
          ) : (
            <>
              {/* Order Found */}
              <div className="space-y-6">
                {/* Order Header */}
                <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-600">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {foundOrder.orderNumber}
                      </h2>
                      <p className="text-gray-600">
                        Ordered on{" "}
                        {new Date(foundOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(foundOrder.status)}
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className={`text-lg font-bold ${orderStatusColors[foundOrder.status].text}`}>
                          {orderStatusColors[foundOrder.status].label}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Order Items */}
                <Card className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {foundOrder.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center pb-3 border-b last:border-b-0"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.productName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} | {item.size} | {item.material}
                          </p>
                        </div>
                        <p className="font-bold text-gray-900">
                          ${item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-green-600">
                      ${foundOrder.total.toFixed(2)}
                    </span>
                  </div>
                </Card>

                {/* Timeline */}
                <Card className="p-6">
                  <h3 className="font-bold text-gray-900 mb-6">Order Timeline</h3>
                  <div className="space-y-4">
                    {getTimelineSteps(foundOrder.status).map(
                      (step, index) => (
                        <div key={step.status} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                step.completed
                                  ? "bg-green-600 text-white"
                                  : step.current
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              <step.icon size={20} />
                            </div>
                            {index < getTimelineSteps(foundOrder.status).length - 1 && (
                              <div
                                className={`w-1 h-12 ${
                                  step.completed ? "bg-green-600" : "bg-gray-200"
                                }`}
                              />
                            )}
                          </div>
                          <div className="pt-1">
                            <p className="font-semibold text-gray-900">
                              {step.label}
                            </p>
                            {step.completed && !step.current && (
                              <p className="text-sm text-gray-600">
                                Completed
                              </p>
                            )}
                            {step.current && (
                              <p className="text-sm text-blue-600 font-medium">
                                In progress
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </Card>

                {/* Tracking Info */}
                {foundOrder.trackingNumber && foundOrder.status === "shipped" && (
                  <Card className="p-6 bg-green-50 border border-green-200">
                    <h3 className="font-bold text-green-900 mb-3">
                      Tracking Information
                    </h3>
                    <p className="text-sm text-green-700 mb-2">
                      Tracking Number
                    </p>
                    <p className="font-mono text-lg font-bold text-green-600 mb-4">
                      {foundOrder.trackingNumber}
                    </p>
                    {foundOrder.estimatedDelivery && (
                      <div className="flex items-center gap-2 text-green-700">
                        <Calendar size={16} />
                        <p>
                          Estimated Delivery:{" "}
                          {new Date(
                            foundOrder.estimatedDelivery
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </Card>
                )}

                {/* Shipping Address */}
                <Card className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Shipping Address
                  </h3>
                  <p className="font-medium text-gray-900">
                    {foundOrder.shippingAddress.name}
                  </p>
                  <p className="text-gray-600">
                    {foundOrder.shippingAddress.street}
                  </p>
                  <p className="text-gray-600">
                    {foundOrder.shippingAddress.city},{" "}
                    {foundOrder.shippingAddress.state}{" "}
                    {foundOrder.shippingAddress.zipCode}
                  </p>
                </Card>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setFoundOrder(null);
                      setOrderNumber("");
                      setEmail("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Look Up Another Order
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Contact Support About This Order
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

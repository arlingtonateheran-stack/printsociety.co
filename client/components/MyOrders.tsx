import { Order, orderStatusColors } from "@shared/account";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Truck, Check, ArrowRight } from "lucide-react";

interface MyOrdersProps {
  orders: Order[];
}

export function MyOrders({ orders }: MyOrdersProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending-proof":
        return <Package size={20} className="text-yellow-600" />;
      case "proof-approved":
        return <Check size={20} className="text-blue-600" />;
      case "in-production":
        return <Package size={20} className="text-purple-600" />;
      case "shipped":
        return <Truck size={20} className="text-green-600" />;
      case "delivered":
        return <Check size={20} className="text-gray-600" />;
      case "cancelled":
        return <ArrowRight size={20} className="text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Orders</h2>
        <p className="text-gray-600">
          Track your orders from proof approval through delivery
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="p-8 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Orders Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start by creating your first custom order
          </p>
          <Button className="bg-green-600 hover:bg-green-700">
            Shop Now
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const colors = orderStatusColors[order.status];

            return (
              <Card key={order.id} className="p-6 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-500">
                          Ordered on{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
                    {colors.label}
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4 pb-4 border-b">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm mb-2"
                    >
                      <span className="text-gray-700">
                        {item.productName} ({item.quantity}x)
                      </span>
                      <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-lg font-bold mt-2">
                    <span>Total</span>
                    <span className="text-green-600">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Tracking Info */}
                {order.trackingNumber && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      Tracking Number
                    </p>
                    <p className="font-mono font-bold text-blue-700">
                      {order.trackingNumber}
                    </p>
                    {order.estimatedDelivery && (
                      <p className="text-sm text-gray-600 mt-2">
                        Estimated Delivery:{" "}
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Shipping Address */}
                <div className="mb-4 text-sm">
                  <p className="text-gray-600 mb-1">Shipping To</p>
                  <p className="font-medium">
                    {order.shippingAddress.name}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.street}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {order.trackingUrl && order.status === "shipped" && (
                    <Button variant="outline" className="sm:flex-1">
                      Track Shipment
                    </Button>
                  )}
                  {order.proofId && order.status === "pending-proof" && (
                    <Button
                      variant="outline"
                      className="sm:flex-1"
                    >
                      View Proof
                    </Button>
                  )}
                  {order.status === "delivered" && (
                    <Button variant="outline" className="sm:flex-1">
                      Reorder
                    </Button>
                  )}
                  <Button className="sm:flex-1 bg-green-600 hover:bg-green-700">
                    View Details
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Truck, Box } from "lucide-react";
import { Link } from "react-router-dom";

const shippingQueue = [
  { id: 1, orderNum: "ORD-003", items: 5, weight: "2.3 lbs", status: "ready" },
  { id: 2, orderNum: "ORD-007", items: 3, weight: "1.1 lbs", status: "ready" },
  { id: 3, orderNum: "ORD-011", items: 8, weight: "4.2 lbs", status: "ready" },
  { id: 4, orderNum: "ORD-014", items: 2, weight: "0.8 lbs", status: "pending-label" },
];

export default function ShippingQueueWidget() {
  const readyToShip = shippingQueue.filter((s) => s.status === "ready").length;
  const pendingLabels = shippingQueue.filter((s) => s.status === "pending-label").length;
  const totalWeight = shippingQueue.reduce((sum, item) => sum + parseFloat(item.weight), 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Shipping Queue</h3>
        <Link
          to="/admin/shipping"
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          Station →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-gray-600 text-xs font-medium">Ready</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{readyToShip}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-gray-600 text-xs font-medium">Pending Labels</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{pendingLabels}</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-gray-600 text-xs font-medium">Total Weight</p>
          <p className="text-xl font-bold text-purple-600 mt-1">{totalWeight.toFixed(1)} lbs</p>
        </div>
      </div>

      <div className="space-y-2">
        {shippingQueue.slice(0, 3).map((item) => (
          <div key={item.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Box size={16} className="text-gray-600" />
              <div>
                <p className="font-medium text-gray-900 text-sm">{item.orderNum}</p>
                <p className="text-xs text-gray-600">{item.items} items · {item.weight}</p>
              </div>
            </div>
            {item.status === "pending-label" && (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                Label pending
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">Bulk label generation</span> available for {readyToShip} orders
        </p>
      </div>
    </Card>
  );
}

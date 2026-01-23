import { Card } from "@/components/ui/card";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const stockAlerts = [
  { id: 1, material: "Holographic Vinyl", current: 5, threshold: 20, level: "critical" },
  { id: 2, material: "Metallic Paper", current: 12, threshold: 15, level: "warning" },
  { id: 3, material: "Kraft Roll Stock", current: 8, threshold: 25, level: "critical" },
  { id: 4, material: "Premium Glossy", current: 45, threshold: 30, level: "ok" },
];

export default function StockAlertsWidget() {
  const critical = stockAlerts.filter((s) => s.level === "critical").length;
  const warning = stockAlerts.filter((s) => s.level === "warning").length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
        <Link
          to="/admin/products"
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          Manage →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-red-50 rounded-lg">
          <p className="text-gray-600 text-xs font-medium">Critical</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{critical}</p>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg">
          <p className="text-gray-600 text-xs font-medium">Warning</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{warning}</p>
        </div>
      </div>

      <div className="space-y-2">
        {stockAlerts
          .filter((s) => s.level !== "ok")
          .map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg ${
                item.level === "critical" ? "bg-red-50" : "bg-yellow-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  {item.level === "critical" ? (
                    <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                  ) : (
                    <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{item.material}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {item.current} of {item.threshold} rolls
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-600">
                    {Math.round((item.current / item.threshold) * 100)}%
                  </p>
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-300 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full ${
                    item.level === "critical" ? "bg-red-600" : "bg-yellow-600"
                  }`}
                  style={{ width: `${(item.current / item.threshold) * 100}%` }}
                />
              </div>
            </div>
          ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">Next restock scheduled</span> for March 20, 2025
        </p>
      </div>
    </Card>
  );
}

import { Card } from "@/components/ui/card";
import { Tag, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const activeDiscounts = [
  { id: 1, code: "SPRING20", type: "20% off", usage: "145 / 500", expiry: "5 days" },
  { id: 2, code: "BULK10", type: "10% off", usage: "89 / unlimited", expiry: "30 days" },
  { id: 3, code: "FREESHIP", type: "Free shipping", usage: "234 / 1000", expiry: "3 days" },
  { id: 4, code: "VIP25", type: "25% off", usage: "12 / 100", expiry: "10 days" },
];

export default function ActiveDiscountsWidget() {
  const totalUsage = activeDiscounts.reduce((sum, d) => {
    const match = d.usage.match(/\d+/);
    return sum + (match ? parseInt(match[0]) : 0);
  }, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Active Discount Codes</h3>
        <Link
          to="/admin/discounts"
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          Manage →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-gray-600 text-xs font-medium">Active Codes</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{activeDiscounts.length}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-gray-600 text-xs font-medium">Total Redeems</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{totalUsage}</p>
        </div>
      </div>

      <div className="space-y-3">
        {activeDiscounts.slice(0, 3).map((discount) => (
          <div key={discount.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-gray-600" />
                  <p className="font-mono font-semibold text-gray-900 text-sm">
                    {discount.code}
                  </p>
                </div>
                <p className="text-xs text-gray-600 mt-1">{discount.type}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                  <Clock size={12} />
                  {discount.expiry}
                </div>
              </div>
            </div>
            <div className="bg-white rounded px-2 py-1 text-xs text-gray-600">
              {discount.usage} uses
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-purple-50 rounded-lg text-center">
        <p className="text-xs text-purple-800">
          <span className="font-semibold">Create new discount</span> for upcoming promotions
        </p>
      </div>
    </Card>
  );
}

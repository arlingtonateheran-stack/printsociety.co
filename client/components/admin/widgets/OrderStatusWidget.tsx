import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const data = [
  { name: "Awaiting Artwork", value: 3 },
  { name: "Proof Sent", value: 5 },
  { name: "Awaiting Approval", value: 2 },
  { name: "In Production", value: 8 },
  { name: "Ready to Ship", value: 12 },
];

export default function OrderStatusWidget() {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Orders by Status</h3>
        <Link
          to="/admin/orders"
          className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 pt-6 border-t grid grid-cols-5 gap-2 text-center">
        {data.map((item, idx) => (
          <div key={idx}>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-600 mt-1">{item.name}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{total}</span> total active orders
        </p>
      </div>
    </Card>
  );
}

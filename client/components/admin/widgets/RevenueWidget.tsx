import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { day: "Mon", revenue: 1200 },
  { day: "Tue", revenue: 1900 },
  { day: "Wed", revenue: 1600 },
  { day: "Thu", revenue: 2100 },
  { day: "Fri", revenue: 2400 },
  { day: "Sat", revenue: 2800 },
  { day: "Sun", revenue: 2200 },
];

export default function RevenueWidget() {
  const weekTotal = data.reduce((sum, item) => sum + item.revenue, 0);
  const weekAvg = Math.round(weekTotal / data.length);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
        <div className="flex items-center gap-1 text-green-600 font-semibold">
          <TrendingUp size={18} />
          +18%
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-gray-600 text-xs font-medium">Today</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">$2,450</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs font-medium">This Week</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${weekTotal.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs font-medium">Daily Avg</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${weekAvg.toLocaleString()}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: "#22c55e", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

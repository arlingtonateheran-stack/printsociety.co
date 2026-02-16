import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { week: "W1", revenue: 8400 },
  { week: "W2", revenue: 9200 },
  { week: "W3", revenue: 11500 },
  { week: "W4", revenue: 10800 },
];

const orderData = [
  { day: "Mon", orders: 12, revenue: 2400 },
  { day: "Tue", orders: 14, revenue: 2800 },
  { day: "Wed", orders: 18, revenue: 3600 },
  { day: "Thu", orders: 16, revenue: 3200 },
  { day: "Fri", orders: 22, revenue: 4400 },
  { day: "Sat", orders: 28, revenue: 5600 },
  { day: "Sun", orders: 20, revenue: 4000 },
];

export default function AdminAnalytics() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
              <p className="text-gray-600 mt-1">View comprehensive business metrics and trends</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">THIS MONTH REVENUE</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$39,900</p>
                <p className="text-green-600 text-xs mt-2">+24% vs last month</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">TOTAL ORDERS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">438</p>
                <p className="text-green-600 text-xs mt-2">+18% vs last month</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">AVG ORDER VALUE</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$91</p>
                <p className="text-green-600 text-xs mt-2">+6% vs last month</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">CONVERSION RATE</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">3.4%</p>
                <p className="text-gray-600 text-xs mt-2">Stable vs last month</p>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Revenue */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
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
                      dot={{ fill: "#22c55e" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Daily Orders vs Revenue */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders & Revenue by Day</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={orderData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Products</h3>
                <div className="space-y-3">
                  {[
                    { name: "Die-Cut Vinyl Stickers", sales: 156, revenue: 5460 },
                    { name: "Sticker Sheets", sales: 98, revenue: 4410 },
                    { name: "Roll Labels", sales: 87, revenue: 2088 },
                    { name: "Kiss-Cut Labels", sales: 65, revenue: 2080 },
                    { name: "Vinyl Banners", sales: 32, revenue: 2560 },
                  ].map((product, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{product.sales} sales</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${product.revenue.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <p className="text-sm text-gray-600">New Customers</p>
                    <p className="text-2xl font-bold text-green-600">34</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <p className="text-sm text-gray-600">Repeat Customers</p>
                    <p className="text-2xl font-bold text-blue-600">142</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                    <p className="text-sm text-gray-600">Avg Customer LTV</p>
                    <p className="text-2xl font-bold text-purple-600">$487</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                    <p className="text-sm text-gray-600">Repeat Rate</p>
                    <p className="text-2xl font-bold text-orange-600">80.7%</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

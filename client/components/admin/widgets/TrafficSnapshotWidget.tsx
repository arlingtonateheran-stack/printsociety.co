import { Card } from "@/components/ui/card";
import { Eye, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const trafficData = [
  { path: "/products", views: 2840, label: "Products Page" },
  { path: "/products/die-cut-stickers", views: 1240, label: "Die-Cut Stickers" },
  { path: "/products/sticker-sheets", views: 980, label: "Sticker Sheets" },
  { path: "/checkout", views: 650, label: "Checkout" },
];

const topProducts = [
  { name: "Die-Cut Vinyl Stickers", views: 1240, rank: 1 },
  { name: "Sticker Sheets", views: 980, rank: 2 },
  { name: "Roll Labels", views: 720, rank: 3 },
  { name: "Vinyl Banners", views: 450, rank: 4 },
];

export default function TrafficSnapshotWidget() {
  const totalViews = trafficData.reduce((sum, item) => sum + item.views, 0);
  const totalVisitors = 3200;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Traffic & SEO</h3>
        <Link
          to="/admin/analytics"
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          Details →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Users size={16} />
            <p className="text-xs font-medium">Visitors</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">{totalVisitors.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <Eye size={16} />
            <p className="text-xs font-medium">Page Views</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{totalViews.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <TrendingUp size={16} />
            <p className="text-xs font-medium">Conversion</p>
          </div>
          <p className="text-2xl font-bold text-purple-600">3.2%</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Top Pages</h4>
        <div className="space-y-2">
          {trafficData.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <p className="text-sm text-gray-700">{item.label}</p>
              <p className="text-sm font-semibold text-gray-900">{item.views.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Top Products</h4>
        <div className="space-y-2">
          {topProducts.slice(0, 2).map((product, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <span className="font-semibold text-gray-900">#{product.rank}</span>
                {product.name}
              </p>
              <p className="text-sm font-semibold text-gray-900">{product.views} views</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-lg text-center">
        <p className="text-xs text-green-800">
          <span className="font-semibold">SEO Score: 85/100</span> - Optimize meta tags for better ranking
        </p>
      </div>
    </Card>
  );
}

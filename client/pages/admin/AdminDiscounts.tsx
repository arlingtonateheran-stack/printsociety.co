import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Tag, Plus } from "lucide-react";

const discounts = [
  {
    id: 1,
    code: "SPRING20",
    type: "20% off",
    usage: "145/500",
    expiry: "5 days",
    status: "active",
  },
  {
    id: 2,
    code: "BULK10",
    type: "10% off",
    usage: "89/∞",
    expiry: "30 days",
    status: "active",
  },
  {
    id: 3,
    code: "FREESHIP",
    type: "Free shipping",
    usage: "234/1000",
    expiry: "3 days",
    status: "active",
  },
  {
    id: 4,
    code: "VIP25",
    type: "25% off",
    usage: "12/100",
    expiry: "10 days",
    status: "active",
  },
];

export default function AdminDiscounts() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Discount Codes</h1>
                <p className="text-gray-600 mt-1">Create and manage promotions with rules and limits</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <Plus size={18} />
                New Discount
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">ACTIVE CODES</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{discounts.length}</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">TOTAL REDEEMS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">714</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">REVENUE IMPACT</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">-$3.2K</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">EXPIRING SOON</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">2</p>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Expiry
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {discounts.map((discount) => (
                    <tr key={discount.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Tag size={16} className="text-gray-400" />
                          <span className="font-mono font-semibold text-gray-900">
                            {discount.code}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{discount.type}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{discount.usage}</td>
                      <td className="px-6 py-4 text-gray-600">{discount.expiry}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {discount.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                          Edit →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

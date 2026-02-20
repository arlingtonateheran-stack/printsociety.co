import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Tag, Plus, Loader2, Trash2, Edit2, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DiscountModal } from "./components/DiscountModal";

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("discounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDiscounts(data || []);
    } catch (error: any) {
      const errorMessage = error.message || error.details || error.hint || "Failed to load discounts";
      console.error("Error fetching discounts:", error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("discounts")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setDiscounts(discounts.map(d =>
        d.id === id ? { ...d, is_active: !currentStatus } : d
      ));
      toast.success(`Discount ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error: any) {
      const errorMessage = error.message || error.details || error.hint || "Failed to update status";
      console.error("Error updating status:", error);
      toast.error(errorMessage);
    }
  };

  const deleteDiscount = async (id: string) => {
    if (!confirm("Are you sure you want to delete this discount?")) return;

    try {
      const { error } = await supabase
        .from("discounts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setDiscounts(discounts.filter(d => d.id !== id));
      toast.success("Discount deleted");
    } catch (error: any) {
      const errorMessage = error.message || error.details || error.hint || "Failed to delete discount";
      console.error("Error deleting discount:", error);
      toast.error(errorMessage);
    }
  };

  const getStatusBadge = (discount: any) => {
    const now = new Date();
    const expiry = new Date(discount.expires_at);
    const isExpired = expiry < now;

    if (!discount.is_active) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 flex items-center gap-1 w-fit">
          <XCircle size={12} />
          Inactive
        </span>
      );
    }

    if (isExpired) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 flex items-center gap-1 w-fit">
          <AlertCircle size={12} />
          Expired
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1 w-fit">
        <CheckCircle2 size={12} />
        Active
      </span>
    );
  };

  const formatDiscountType = (discount: any) => {
    switch (discount.discount_type) {
      case 'percentage': return `${discount.discount_value}% Off`;
      case 'fixed': return `$${discount.discount_value} Off`;
      case 'freeShipping': return 'Free Shipping';
      default: return discount.discount_type;
    }
  };

  const activeCodes = discounts.filter(d => d.is_active && new Date(d.expires_at) > new Date()).length;
  const expiringSoon = discounts.filter(d => {
    const now = new Date();
    const expiry = new Date(d.expires_at);
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return d.is_active && diffDays > 0 && diffDays <= 7;
  }).length;

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
              <DiscountModal onSuccess={fetchDiscounts} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">ACTIVE CODES</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{activeCodes}</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">TOTAL REDEEMS</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {discounts.reduce((acc, d) => acc + (d.usage_count || 0), 0)}
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">TOTAL CODES</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{discounts.length}</p>
              </Card>
              <Card className="p-6">
                <p className="text-gray-600 text-xs font-medium">EXPIRING SOON</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{expiringSoon}</p>
              </Card>
            </div>

            <Card className="overflow-hidden border-none shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Discount Info
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Benefit
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Usage
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Expiry
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center">
                          <Loader2 className="h-10 w-10 animate-spin mx-auto text-green-600 mb-4" />
                          <p className="text-gray-500 font-medium">Loading discounts...</p>
                        </td>
                      </tr>
                    ) : discounts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <Tag size={48} className="text-gray-200" />
                            <p className="text-lg">No discount codes found.</p>
                            <DiscountModal
                              onSuccess={fetchDiscounts}
                              trigger={
                                <Button variant="link" className="text-green-600 font-bold">
                                  Create your first discount
                                </Button>
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ) : (
                      discounts.map((discount) => (
                        <tr key={discount.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-mono font-bold text-gray-900 text-lg">
                                {discount.code}
                              </span>
                              <span className="text-xs text-gray-500">{discount.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            {formatDiscountType(discount)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {discount.usage_count || 0} / {discount.usage_limit || "∞"}
                              </span>
                              <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{
                                    width: discount.usage_limit
                                      ? `${Math.min((discount.usage_count / discount.usage_limit) * 100, 100)}%`
                                      : '0%'
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(discount.expires_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(discount)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={discount.is_active ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}
                                onClick={() => toggleStatus(discount.id, discount.is_active)}
                              >
                                {discount.is_active ? "Deactivate" : "Activate"}
                              </Button>
                              <DiscountModal
                                discount={discount}
                                onSuccess={fetchDiscounts}
                                trigger={
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                                    <Edit2 size={16} />
                                  </Button>
                                }
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:bg-red-50"
                                onClick={() => deleteDiscount(discount.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

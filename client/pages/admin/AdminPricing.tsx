import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Loader2,
  Trash2,
  Edit2,
  Calculator,
  Layers,
  Layers3,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PricingRuleModal } from "./components/PricingRuleModal";

export default function AdminPricing() {
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("pricing_rules")
        .select(`
          *,
          product:products(name)
        `)
        .order("priority", { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error: any) {
      console.error("Error fetching rules:", error);
      toast.error("Failed to load pricing rules");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("pricing_rules")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setRules(rules.map(r =>
        r.id === id ? { ...r, is_active: !currentStatus } : r
      ));
      toast.success(`Rule ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const deleteRule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pricing rule?")) return;

    try {
      const { error } = await supabase
        .from("pricing_rules")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setRules(rules.filter(r => r.id !== id));
      toast.success("Pricing rule deleted");
    } catch (error: any) {
      toast.error("Failed to delete rule");
    }
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'quantity': return <Layers size={16} className="text-blue-500" />;
      case 'material': return <Layers3 size={16} className="text-purple-500" />;
      case 'finish': return <Zap size={16} className="text-orange-500" />;
      case 'rush-fee': return <Calculator size={16} className="text-red-500" />;
      default: return <Calculator size={16} className="text-gray-500" />;
    }
  };

  const formatRuleLogic = (rule: any) => {
    let text = "";
    if (rule.logic === 'tiered') text = "Tiered pricing";
    else if (rule.logic === 'formula') text = "Formula-based";
    else text = "Flat adjustment";

    if (rule.calculation_type === 'percentage') {
      text += ` (${rule.calculation_value > 0 ? '+' : ''}${rule.calculation_value}%)`;
    } else if (rule.calculation_type === 'value') {
      text += ` (${rule.calculation_value > 0 ? '+' : ''}$${rule.calculation_value})`;
    }
    return text;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pricing Rules Engine</h1>
                <p className="text-gray-600 mt-1">Configure modular pricing with formulas, tiers, and triggers</p>
              </div>
              <PricingRuleModal onSuccess={fetchRules} />
            </div>

            {/* Quick Stats/Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 border-l-4 border-l-blue-500 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Layers size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Rules</p>
                    <p className="text-2xl font-black text-gray-900">{rules.filter(r => r.is_active).length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 border-l-4 border-l-purple-500 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                    <Calculator size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Complex Formulas</p>
                    <p className="text-2xl font-black text-gray-900">{rules.filter(r => r.logic === 'formula').length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 border-l-4 border-l-green-500 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Sync Status</p>
                    <p className="text-2xl font-black text-gray-900">Live</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Rules Table */}
            <Card className="overflow-hidden border-none shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[50px]">Priority</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trigger</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Condition</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Calculation Logic</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-20 text-center">
                          <Loader2 className="h-10 w-10 animate-spin mx-auto text-green-600 mb-4" />
                          <p className="text-gray-500 font-medium">Analyzing pricing rules...</p>
                        </td>
                      </tr>
                    ) : rules.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-20 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <Calculator size={48} className="text-gray-200" />
                            <p className="text-lg">No pricing rules defined yet.</p>
                            <PricingRuleModal
                              onSuccess={fetchRules}
                              trigger={
                                <Button variant="link" className="text-green-600 font-bold">
                                  Create your first rule
                                </Button>
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ) : (
                      rules.map((rule) => (
                        <tr key={rule.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-xs">
                              {rule.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-gray-900">
                              {rule.product?.name || "All Products"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 capitalize">
                              {getTriggerIcon(rule.trigger)}
                              {rule.trigger.replace('-', ' ')}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {rule.trigger === 'quantity' ? (
                              `Qty: ${rule.quantity_min || 0} - ${rule.quantity_max || '∞'}`
                            ) : rule.trigger === 'rush-fee' ? (
                              `Standard Rush`
                            ) : (
                              'Specific Option'
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {formatRuleLogic(rule)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              rule.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {rule.is_active ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                              {rule.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={rule.is_active ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}
                                onClick={() => toggleStatus(rule.id, rule.is_active)}
                              >
                                {rule.is_active ? "Disable" : "Enable"}
                              </Button>
                              <PricingRuleModal
                                rule={rule}
                                onSuccess={fetchRules}
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
                                onClick={() => deleteRule(rule.id)}
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

            {/* Help/Documentation */}
            <div className="mt-12 p-6 bg-amber-50 rounded-xl border border-amber-100 flex gap-4">
              <AlertTriangle className="text-amber-500 shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-amber-900">How Priority Works</h4>
                <p className="text-sm text-amber-800 mt-1">
                  Rules are applied from highest priority to lowest. If multiple rules match the same trigger,
                  the one with the higher priority number will take precedence or be applied first in calculations.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

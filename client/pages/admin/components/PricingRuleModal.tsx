import React, { useState, useEffect } from "react";
import { Plus, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface PricingRuleModalProps {
  rule?: any;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function PricingRuleModal({ rule, onSuccess, trigger }: PricingRuleModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    product_id: "",
    trigger: "quantity",
    logic: "flat",
    quantity_min: "",
    quantity_max: "",
    option_id: "",
    calculation_type: "value",
    calculation_value: "",
    calculation_expression: "",
    priority: "0",
    is_active: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (rule) {
      setFormData({
        product_id: rule.product_id || "",
        trigger: rule.trigger || "quantity",
        logic: rule.logic || "flat",
        quantity_min: rule.quantity_min?.toString() || "",
        quantity_max: rule.quantity_max?.toString() || "",
        option_id: rule.option_id || "",
        calculation_type: rule.calculation_type || "value",
        calculation_value: rule.calculation_value?.toString() || "",
        calculation_expression: rule.calculation_expression || "",
        priority: rule.priority?.toString() || "0",
        is_active: rule.is_active ?? true,
      });
      if (rule.product_id) fetchOptions(rule.product_id);
    } else {
      setFormData({
        product_id: "",
        trigger: "quantity",
        logic: "flat",
        quantity_min: "",
        quantity_max: "",
        option_id: "",
        calculation_type: "value",
        calculation_value: "",
        calculation_expression: "",
        priority: "0",
        is_active: true,
      });
    }
  }, [rule]);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("id, name");
    setProducts(data || []);
  };

  const fetchOptions = async (productId: string) => {
    const { data } = await supabase
      .from("product_options")
      .select("id, name")
      .eq("product_id", productId);
    setOptions(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_id || !formData.trigger || !formData.logic) {
      toast.error("Required fields missing");
      return;
    }

    try {
      setIsSaving(true);
      
      const payload = {
        product_id: formData.product_id,
        trigger: formData.trigger,
        logic: formData.logic,
        quantity_min: formData.quantity_min ? parseInt(formData.quantity_min) : null,
        quantity_max: formData.quantity_max ? parseInt(formData.quantity_max) : null,
        option_id: formData.option_id || null,
        calculation_type: formData.calculation_type,
        calculation_value: formData.calculation_value ? parseFloat(formData.calculation_value) : null,
        calculation_expression: formData.calculation_expression || null,
        priority: parseInt(formData.priority) || 0,
        is_active: formData.is_active,
      };

      if (rule?.id) {
        const { error } = await supabase
          .from("pricing_rules")
          .update(payload)
          .eq("id", rule.id);
        if (error) throw error;
        toast.success("Pricing rule updated");
      } else {
        const { error } = await supabase
          .from("pricing_rules")
          .insert([payload]);
        if (error) throw error;
        toast.success("Pricing rule created");
      }

      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error saving rule:", error);
      toast.error(error.message || "Failed to save rule");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-green-600 hover:bg-green-700">
            <Plus size={18} />
            New Rule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{rule ? "Edit Pricing Rule" : "Create Pricing Rule"}</DialogTitle>
            <DialogDescription>
              Configure how the price should be calculated based on specific triggers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="product">Applicable Product *</Label>
                <Select
                  value={formData.product_id}
                  onValueChange={(val) => {
                    setFormData({ ...formData, product_id: val });
                    fetchOptions(val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="trigger">Trigger Type *</Label>
                <Select
                  value={formData.trigger}
                  onValueChange={(val) => setFormData({ ...formData, trigger: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quantity">Quantity Range</SelectItem>
                    <SelectItem value="material">Material Option</SelectItem>
                    <SelectItem value="finish">Finish Option</SelectItem>
                    <SelectItem value="size">Size Range</SelectItem>
                    <SelectItem value="rush-fee">Rush Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logic">Pricing Logic *</Label>
                <Select
                  value={formData.logic}
                  onValueChange={(val) => setFormData({ ...formData, logic: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Logic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiered">Tiered (Price per unit)</SelectItem>
                    <SelectItem value="formula">Formula-based</SelectItem>
                    <SelectItem value="flat">Flat Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.trigger === 'quantity' && (
              <div className="grid grid-cols-2 gap-4 border p-3 rounded-lg bg-gray-50">
                <div className="grid gap-2">
                  <Label htmlFor="qty_min">Min Quantity</Label>
                  <Input
                    id="qty_min"
                    type="number"
                    value={formData.quantity_min}
                    onChange={(e) => setFormData({ ...formData, quantity_min: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="qty_max">Max Quantity</Label>
                  <Input
                    id="qty_max"
                    type="number"
                    value={formData.quantity_max}
                    onChange={(e) => setFormData({ ...formData, quantity_max: e.target.value })}
                  />
                </div>
              </div>
            )}

            {(formData.trigger === 'material' || formData.trigger === 'finish') && (
              <div className="grid gap-2 border p-3 rounded-lg bg-gray-50">
                <Label htmlFor="option">Select Option Link</Label>
                <Select
                  value={formData.option_id}
                  onValueChange={(val) => setFormData({ ...formData, option_id: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Option" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.length > 0 ? options.map(o => (
                      <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                    )) : <SelectItem value="none" disabled>No options found for product</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-4 border-t pt-4">
              <h4 className="font-bold text-sm uppercase text-gray-500">Calculation</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="calc_type">Calculation Type</Label>
                  <Select
                    value={formData.calculation_type}
                    onValueChange={(val) => setFormData({ ...formData, calculation_type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="value">Fixed Value ($)</SelectItem>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="expression">Custom Expression</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="calc_val">Value / Amount</Label>
                  <Input
                    id="calc_val"
                    type="number"
                    step="0.0001"
                    value={formData.calculation_value}
                    onChange={(e) => setFormData({ ...formData, calculation_value: e.target.value })}
                    disabled={formData.calculation_type === 'expression'}
                  />
                </div>
              </div>

              {formData.calculation_type === 'expression' && (
                <div className="grid gap-2">
                  <Label htmlFor="expression">Math Expression</Label>
                  <Input
                    id="expression"
                    value={formData.calculation_expression}
                    onChange={(e) => setFormData({ ...formData, calculation_expression: e.target.value })}
                    placeholder="(area * 0.05) + setup_fee"
                  />
                  <p className="text-[10px] text-gray-500 italic">Available variables: area, quantity, unit_price, setup_fee</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
              {rule ? "Update Rule" : "Create Rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

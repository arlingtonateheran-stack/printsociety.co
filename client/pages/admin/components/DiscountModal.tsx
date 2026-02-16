import React, { useState, useEffect } from "react";
import { Plus, Loader2, Save, X } from "lucide-react";
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

interface DiscountModalProps {
  discount?: any;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function DiscountModal({ discount, onSuccess, trigger }: DiscountModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    discount_type: "percentage",
    discount_value: "",
    usage_limit: "",
    starts_at: new Date().toISOString().split('T')[0],
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    is_active: true,
  });

  useEffect(() => {
    if (discount) {
      setFormData({
        code: discount.code || "",
        name: discount.name || "",
        discount_type: discount.discount_type || "percentage",
        discount_value: discount.discount_value?.toString() || "",
        usage_limit: discount.usage_limit?.toString() || "",
        starts_at: discount.starts_at ? new Date(discount.starts_at).toISOString().split('T')[0] : "",
        expires_at: discount.expires_at ? new Date(discount.expires_at).toISOString().split('T')[0] : "",
        is_active: discount.is_active ?? true,
      });
    }
  }, [discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name || !formData.discount_value) {
      toast.error("Code, Name, and Value are required");
      return;
    }

    try {
      setIsSaving(true);
      
      const payload = {
        code: formData.code.toUpperCase().trim(),
        name: formData.name.trim(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        starts_at: new Date(formData.starts_at).toISOString(),
        expires_at: new Date(formData.expires_at).toISOString(),
        is_active: formData.is_active,
      };

      if (discount?.id) {
        const { error } = await supabase
          .from("discounts")
          .update(payload)
          .eq("id", discount.id);
        if (error) throw error;
        toast.success("Discount updated successfully");
      } else {
        const { error } = await supabase
          .from("discounts")
          .insert([payload]);
        if (error) throw error;
        toast.success("Discount created successfully");
      }

      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error saving discount:", error);
      toast.error(error.message || "Failed to save discount");
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
            New Discount
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{discount ? "Edit Discount" : "Create New Discount"}</DialogTitle>
            <DialogDescription>
              Set up a discount code with specific rules and expiration dates.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Discount Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="SAVE20"
                  className="font-mono uppercase"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Internal Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Spring Sale 2024"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Discount Type</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(val) => setFormData({ ...formData, discount_type: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    <SelectItem value="freeShipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Value *</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  placeholder={formData.discount_type === 'percentage' ? "20" : "10.00"}
                  required={formData.discount_type !== 'freeShipping'}
                  disabled={formData.discount_type === 'freeShipping'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="starts_at">Starts At</Label>
                <Input
                  id="starts_at"
                  type="date"
                  value={formData.starts_at}
                  onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expires_at">Expires At</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="limit">Usage Limit (Optional)</Label>
              <Input
                id="limit"
                type="number"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                placeholder="Leave blank for unlimited"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="animate-spin mr-2" size={18} />
              ) : (
                <Save className="mr-2" size={18} />
              )}
              {discount ? "Update Discount" : "Create Discount"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

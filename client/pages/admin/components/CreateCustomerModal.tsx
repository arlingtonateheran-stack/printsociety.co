import React, { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
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
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface CreateCustomerModalProps {
  onSuccess: () => void;
}

export function CreateCustomerModal({ onSuccess }: CreateCustomerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    business_name: "",
  });

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.email || !newCustomer.name) {
      toast.error("Name and Email are required");
      return;
    }

    try {
      setIsCreating(true);

      // 1. Create entry in users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([{
          name: newCustomer.name,
          email: newCustomer.email,
          role: 'customer',
          is_active: true,
          is_verified: false
        }])
        .select()
        .single();

      if (userError) {
        if (userError.code === '23505') throw new Error("A user with this email already exists.");
        throw userError;
      }

      // 2. Create entry in customer_profiles table
      const { error: profileError } = await supabase
        .from("customer_profiles")
        .insert([{
          user_id: userData.id,
          business_name: newCustomer.business_name,
          phone: newCustomer.phone,
          lifetime_value: 0,
          total_orders: 0
        }]);

      if (profileError) throw profileError;

      toast.success("Customer created successfully");
      setIsOpen(false);
      setNewCustomer({ name: "", email: "", phone: "", business_name: "" });
      onSuccess();
    } catch (error: any) {
      console.error("Error creating customer:", error);
      const errorMessage = error.message || error.details || error.hint || (typeof error === 'object' ? JSON.stringify(error) : String(error));
      toast.error(errorMessage || "Failed to create customer");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-green-600 hover:bg-green-700">
          <Plus size={18} />
          New Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleCreateCustomer}>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Create a new customer profile. They will be added to your CRM immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="business">Business Name (Optional)</Label>
              <Input
                id="business"
                value={newCustomer.business_name}
                onChange={(e) => setNewCustomer({ ...newCustomer, business_name: e.target.value })}
                placeholder="Acme Corp"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                placeholder="(555) 000-0000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isCreating}>
              {isCreating ? <Loader2 className="animate-spin mr-2" size={18} /> : <Plus className="mr-2" size={18} />}
              Create Customer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

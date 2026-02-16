import React, { useState } from "react";
import { Plus, Loader2, UserPlus, Shield } from "lucide-react";
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

interface InviteUserModalProps {
  onSuccess: () => void;
}

export function InviteUserModal({ onSuccess }: InviteUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "designer",
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name) {
      toast.error("Name and Email are required");
      return;
    }

    try {
      setIsCreating(true);

      // Check if user already exists in public users table
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", formData.email)
        .single();

      if (existing) {
        throw new Error("A user with this email already exists in the directory.");
      }

      // 1. Create entry in public users table
      // Note: In a production app, you would use a Supabase Edge Function with Service Role
      // to create the Auth user without signing out the admin.
      // For this implementation, we prep the record in the public table.
      const { error } = await supabase
        .from("users")
        .insert([{
          name: formData.name,
          email: formData.email,
          role: formData.role,
          is_active: true,
          is_verified: false
        }]);

      if (error) {
        if (error.code === '23505') throw new Error("Email already registered.");
        throw error;
      }

      toast.success(`${formData.name} added to staff as ${formData.role}`);
      setIsOpen(false);
      setFormData({ name: "", email: "", role: "designer" });
      onSuccess();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 gap-2">
          <Plus size={18} />
          Invite Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleCreateUser}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="text-green-600" size={20} />
              Add Staff Member
            </DialogTitle>
            <DialogDescription>
              Add a new team member to your dashboard. They will need to sign up with this email to access their account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Smith"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jane@printsociety.co"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Assign Role</Label>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin (Full Access)</SelectItem>
                  <SelectItem value="designer">Designer (Artwork & Proofs)</SelectItem>
                  <SelectItem value="shipping">Shipping (Fulfillment)</SelectItem>
                  <SelectItem value="support">Support (Tickets)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isCreating}>
              {isCreating ? <Loader2 className="animate-spin mr-2" size={18} /> : <Shield className="mr-2" size={18} />}
              Add to Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

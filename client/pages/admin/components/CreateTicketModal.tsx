import React, { useState, useEffect } from "react";
import { MessageSquare, Loader2, Save } from "lucide-react";
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

interface CreateTicketModalProps {
  onSuccess: () => void;
}

export function CreateTicketModal({ onSuccess }: CreateTicketModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    customer_id: "",
    subject: "",
    priority: "medium",
    status: "open",
    linked_order_id: "",
    initial_message: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from("customer_profiles")
      .select("id, business_name, user:users(name, email)");
    setCustomers(data || []);
  };

  const fetchCustomerOrders = async (customerId: string) => {
    // Get customer email first to match orders
    const customer = customers.find(c => c.id === customerId);
    if (!customer?.user?.email) return;

    const { data } = await supabase
      .from("orders")
      .select("id, order_number")
      .eq("customer_email", customer.user.email);
    setOrders(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_id || !formData.subject || !formData.initial_message) {
      toast.error("Required fields missing");
      return;
    }

    try {
      setIsCreating(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate a ticket number
      const ticketNumber = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Create the ticket
      const { data: ticket, error: ticketError } = await supabase
        .from("support_tickets")
        .insert([{
          ticket_number: ticketNumber,
          customer_id: formData.customer_id,
          subject: formData.subject,
          priority: formData.priority,
          status: formData.status,
          linked_order_id: formData.linked_order_id || null,
        }])
        .select()
        .single();

      if (ticketError) throw ticketError;

      // 2. Add the initial message
      const { error: messageError } = await supabase
        .from("ticket_messages")
        .insert([{
          ticket_id: ticket.id,
          author_id: user.id,
          author_role: 'support',
          message: formData.initial_message,
          is_internal: false
        }]);

      if (messageError) throw messageError;

      toast.success(`Ticket ${ticketNumber} created successfully`);
      setIsOpen(false);
      setFormData({
        customer_id: "",
        subject: "",
        priority: "medium",
        status: "open",
        linked_order_id: "",
        initial_message: "",
      });
      onSuccess();
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      toast.error(error.message || "Failed to create ticket");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 gap-2">
          <MessageSquare size={18} />
          New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>
              Open a new support case for a customer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Select Customer *</Label>
              <Select
                value={formData.customer_id}
                onValueChange={(val) => {
                  setFormData({ ...formData, customer_id: val });
                  fetchCustomerOrders(val);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Search customers..." />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.user?.name} ({c.business_name || c.user?.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Briefly describe the issue"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(val) => setFormData({ ...formData, priority: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="order">Link to Order (Optional)</Label>
                <Select
                  value={formData.linked_order_id}
                  onValueChange={(val) => setFormData({ ...formData, linked_order_id: val })}
                  disabled={!formData.customer_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.customer_id ? "Select Order" : "Select Customer First"} />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.length > 0 ? orders.map(o => (
                      <SelectItem key={o.id} value={o.id}>#{o.order_number}</SelectItem>
                    )) : <SelectItem value="none" disabled>No orders found</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Initial Message *</Label>
              <textarea
                id="message"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px] text-sm"
                placeholder="Explain the reason for this ticket..."
                value={formData.initial_message}
                onChange={(e) => setFormData({ ...formData, initial_message: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isCreating}>
              {isCreating ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
              Create Ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

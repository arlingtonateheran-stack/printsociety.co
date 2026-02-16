import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  MessageSquare, 
  User, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Shield,
  Trash2,
  Lock,
  Unlock
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AdminTicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    if (ticketId) {
      fetchTicketData();
      fetchMessages();
    }
  }, [ticketId]);

  const fetchTicketData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("support_tickets")
        .select(`
          *,
          customer:customer_profiles(
            id,
            user:users(id, name, email)
          ),
          assigned_to:users(name)
        `)
        .eq("id", ticketId)
        .single();

      if (error) throw error;
      setTicket(data);
    } catch (error: any) {
      console.error("Error fetching ticket:", error);
      toast.error("Failed to load ticket details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("ticket_messages")
        .select(`
          *,
          author:users(name)
        `)
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      setIsSending(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("ticket_messages")
        .insert([{
          ticket_id: ticketId,
          author_id: user.id,
          author_role: 'support',
          message: replyMessage,
          is_internal: isInternal
        }])
        .select(`
          *,
          author:users(name)
        `)
        .single();

      if (error) throw error;

      setMessages([...messages, data]);
      setReplyMessage("");
      toast.success(isInternal ? "Internal note added" : "Reply sent successfully");

      // Auto-update status to in-progress if it's open
      if (ticket.status === 'open' && !isInternal) {
        updateTicketStatus('in-progress');
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send reply");
    } finally {
      setIsSending(false);
    }
  };

  const updateTicketStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: newStatus })
        .eq("id", ticketId);

      if (error) throw error;
      setTicket({ ...ticket, status: newStatus });
      toast.success(`Ticket status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const updateTicketPriority = async (newPriority: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ priority: newPriority })
        .eq("id", ticketId);

      if (error) throw error;
      setTicket({ ...ticket, priority: newPriority });
      toast.success(`Priority updated to ${newPriority}`);
    } catch (error) {
      toast.error("Failed to update priority");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center">
          <AlertCircle size={48} className="text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Ticket Not Found</h2>
          <Button variant="link" onClick={() => navigate("/admin/tickets")} className="mt-2 text-green-600">
            Back to Tickets
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/tickets")}>
                  <ArrowLeft size={20} />
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{ticket.ticket_number}</h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                      ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {ticket.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">{ticket.subject}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {ticket.status !== 'resolved' ? (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 gap-2"
                    onClick={() => updateTicketStatus('resolved')}
                  >
                    <CheckCircle size={18} />
                    Resolve Ticket
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    className="gap-2"
                    onClick={() => updateTicketStatus('open')}
                  >
                    <ArrowLeft size={18} />
                    Reopen Ticket
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Info */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User size={18} className="text-gray-400" />
                    Customer Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Name</p>
                      <Link 
                        to={`/admin/customers/${ticket.customer?.id}`}
                        className="text-sm font-bold text-green-600 hover:underline flex items-center gap-1"
                      >
                        {ticket.customer?.user?.name}
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Email</p>
                      <p className="text-sm text-gray-900">{ticket.customer?.user?.email}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield size={18} className="text-gray-400" />
                    Ticket Metadata
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">Priority</p>
                      <select 
                        className="w-full h-9 px-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={ticket.priority}
                        onChange={(e) => updateTicketPriority(e.target.value)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Created At</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock size={14} />
                        {new Date(ticket.created_at).toLocaleString()}
                      </div>
                    </div>
                    {ticket.linked_order_id && (
                      <div className="pt-2 border-t">
                        <Link 
                          to={`/admin/orders/${ticket.linked_order_id}`}
                          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          View Linked Order
                          <ExternalLink size={10} />
                        </Link>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Chat Section */}
              <div className="lg:col-span-3 space-y-6 flex flex-col h-[700px]">
                <Card className="flex-1 flex flex-col overflow-hidden bg-white">
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex flex-col ${
                          msg.author_role === 'customer' ? 'items-start' : 'items-end'
                        }`}
                      >
                        <div className={`max-w-[80%] rounded-2xl p-4 ${
                          msg.is_internal 
                            ? 'bg-amber-50 border border-amber-200 text-amber-900' 
                            : msg.author_role === 'customer' 
                              ? 'bg-gray-100 text-gray-900' 
                              : 'bg-green-600 text-white shadow-md'
                        }`}>
                          {msg.is_internal && (
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase mb-1 text-amber-600">
                              <Shield size={10} />
                              Internal Note
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          <div className={`text-[10px] mt-2 flex items-center gap-2 ${
                            msg.author_role === 'customer' || msg.is_internal ? 'text-gray-400' : 'text-green-100'
                          }`}>
                            <span className="font-bold">{msg.author?.name || 'System'}</span>
                            <span>•</span>
                            <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20">
                        <MessageSquare size={48} className="text-gray-200 mb-4" />
                        <p className="text-gray-500">No messages in this ticket yet.</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t bg-gray-50">
                    <form onSubmit={handleSendReply}>
                      <div className="flex items-center gap-3 mb-3">
                        <button 
                          type="button"
                          onClick={() => setIsInternal(!isInternal)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            isInternal 
                              ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {isInternal ? <Lock size={12} /> : <Unlock size={12} />}
                          {isInternal ? 'Internal Note' : 'Public Reply'}
                        </button>
                      </div>
                      <div className="relative">
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder={isInternal ? "Add an internal note only team can see..." : "Type your reply to the customer..."}
                          className={`w-full p-4 pr-14 border rounded-xl focus:outline-none focus:ring-2 min-h-[100px] text-sm resize-none ${
                            isInternal ? 'focus:ring-amber-500 bg-amber-50/30' : 'focus:ring-green-500 bg-white'
                          }`}
                        />
                        <button
                          type="submit"
                          disabled={isSending || !replyMessage.trim()}
                          className={`absolute right-3 bottom-3 p-2 rounded-lg transition-colors ${
                            isInternal 
                              ? 'bg-amber-600 text-white hover:bg-amber-700' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          } disabled:opacity-50`}
                        >
                          {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2 italic">
                        {isInternal ? "Visibility: Admins and Support staff only." : "Visibility: Customer will be notified via email."}
                      </p>
                    </form>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

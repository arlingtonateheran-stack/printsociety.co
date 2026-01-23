import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TicketSystem } from "@/components/TicketSystem";
import { ContactForm } from "@/components/ContactForm";
import { sampleTickets } from "@shared/support";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

export default function Support() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [tickets, setTickets] = useState(sampleTickets);

  const handleCreateTicket = (formData: any) => {
    // Create new ticket from form data
    const newTicket = {
      id: `ticket-${Date.now()}`,
      ticketNumber: `TK-2025-${String(tickets.length + 1).padStart(3, "0")}`,
      customerId: "user-001",
      customerName: formData.name,
      customerEmail: formData.email,
      subject: formData.subject,
      category: formData.category,
      priority: formData.priority,
      status: "open" as const,
      description: formData.message,
      messages: [
        {
          id: `msg-${Date.now()}`,
          authorId: "user-001",
          authorName: formData.name,
          authorRole: "customer" as const,
          message: formData.message,
          createdAt: new Date(),
          isInternal: false,
        },
      ],
      relatedOrderId: formData.orderNumber || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTickets((prev) => [newTicket, ...prev]);
    setActiveTab("tickets");
  };

  const handleReplyToTicket = (ticketId: string, message: string) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              messages: [
                ...ticket.messages,
                {
                  id: `msg-${Date.now()}`,
                  authorId: "user-001",
                  authorName: ticket.customerName,
                  authorRole: "customer" as const,
                  message,
                  createdAt: new Date(),
                  isInternal: false,
                },
              ],
              updatedAt: new Date(),
            }
          : ticket
      )
    );
  };

  const myTickets = tickets.filter((t) => t.customerId === "user-001");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Support Center</h1>
            <p className="text-gray-600">
              Manage your support tickets and get help from our team
            </p>
          </div>

          {/* Quick Help Alert */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-blue-900">Need immediate help?</p>
              <p className="text-sm text-blue-700">
                Check our <a href="/help" className="underline font-medium">Help Center</a> for articles and FAQs that might answer your question instantly.
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="tickets">
                My Tickets ({myTickets.length})
              </TabsTrigger>
              <TabsTrigger value="create">Create New</TabsTrigger>
            </TabsList>

            {/* My Tickets Tab */}
            <TabsContent value="tickets" className="mt-6">
              <TicketSystem
                tickets={myTickets}
                onReplyToTicket={handleReplyToTicket}
              />
            </TabsContent>

            {/* Create New Ticket Tab */}
            <TabsContent value="create" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ContactForm onSubmit={handleCreateTicket} />
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-bold text-green-900 mb-2">
                      ✓ Response Time
                    </h3>
                    <p className="text-sm text-green-700">
                      We aim to respond to all support tickets within 24 hours.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-bold text-blue-900 mb-2">
                      💡 Pro Tip
                    </h3>
                    <p className="text-sm text-blue-700">
                      Include your order number for faster issue resolution.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-bold text-yellow-900 mb-2">
                      ⏱️ Best Time
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Submit tickets during business hours (9 AM - 5 PM EST) for faster responses.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

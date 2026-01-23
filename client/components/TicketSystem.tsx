import { useState } from "react";
import { SupportTicket, ticketStatusColors, ticketPriorityColors } from "@shared/support";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Search, ChevronRight, Clock, AlertCircle } from "lucide-react";

interface TicketSystemProps {
  tickets: SupportTicket[];
  onReplyToTicket?: (ticketId: string, message: string) => void;
}

export function TicketSystem({ tickets, onReplyToTicket }: TicketSystemProps) {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleReply = () => {
    if (replyMessage.trim() && selectedTicket) {
      onReplyToTicket?.(selectedTicket.id, replyMessage);
      setReplyMessage("");
    }
  };

  if (selectedTicket) {
    return (
      <TicketDetail
        ticket={selectedTicket}
        onBack={() => setSelectedTicket(null)}
        onReply={handleReply}
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Support Tickets</h2>
        <p className="text-gray-600">
          View your support tickets and communicate with our team
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            placeholder="Search tickets by number or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-full font-medium transition ${
              filterStatus === "all"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {["open", "pending", "in-progress", "resolved", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full font-medium transition capitalize ${
                filterStatus === status
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Tickets Found
          </h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== "all"
              ? "No tickets match your search or filter"
              : "You don't have any support tickets yet"}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => {
            const statusColors = ticketStatusColors[ticket.status];
            const priorityColors = ticketPriorityColors[ticket.priority];

            return (
              <Card
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="p-4 cursor-pointer hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">
                        {ticket.ticketNumber}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                        {statusColors.label}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors.bg} ${priorityColors.text}`}>
                        {priorityColors.label}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium">{ticket.subject}</p>
                    <p className="text-sm text-gray-600">
                      {ticket.category} • Created{" "}
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="text-gray-400 flex-shrink-0" />
                </div>

                {/* Last Message Preview */}
                {ticket.messages.length > 0 && (
                  <p className="text-sm text-gray-600 border-t pt-3 line-clamp-1">
                    {ticket.messages[ticket.messages.length - 1].message}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Ticket Detail View
interface TicketDetailProps {
  ticket: SupportTicket;
  onBack: () => void;
  onReply: () => void;
  replyMessage: string;
  setReplyMessage: (message: string) => void;
}

function TicketDetail({
  ticket,
  onBack,
  onReply,
  replyMessage,
  setReplyMessage,
}: TicketDetailProps) {
  const statusColors = ticketStatusColors[ticket.status];
  const priorityColors = ticketPriorityColors[ticket.priority];

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
      >
        ← Back to Tickets
      </button>

      {/* Ticket Header */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{ticket.ticketNumber}</h1>
            <h2 className="text-xl text-gray-700 font-semibold mb-3">
              {ticket.subject}
            </h2>
            <p className="text-gray-600">
              {ticket.category} •{" "}
              {new Date(ticket.createdAt).toLocaleDateString()} •{" "}
              {ticket.messages.length} responses
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className={`px-4 py-2 rounded-lg text-sm font-medium text-center ${statusColors.bg} ${statusColors.text}`}>
              {statusColors.label}
            </span>
            <span className={`px-4 py-2 rounded-lg text-sm font-medium text-center ${priorityColors.bg} ${priorityColors.text}`}>
              Priority: {priorityColors.label}
            </span>
          </div>
        </div>

        {/* Timeline Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-gray-600 mb-1">Created</p>
            <p className="font-medium text-gray-900">
              {new Date(ticket.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Last Updated</p>
            <p className="font-medium text-gray-900">
              {new Date(ticket.updatedAt).toLocaleDateString()}
            </p>
          </div>
          {ticket.responseTime && (
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-green-600" />
              <div>
                <p className="text-xs text-gray-600 mb-1">Response Time</p>
                <p className="font-medium text-gray-900">
                  {ticket.responseTime} min
                </p>
              </div>
            </div>
          )}
          {ticket.resolutionTime && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Resolution Time</p>
              <p className="font-medium text-gray-900">
                {Math.ceil(ticket.resolutionTime / 60)} hours
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Description */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap">
          {ticket.description}
        </p>
      </Card>

      {/* Messages */}
      <div>
        <h3 className="text-xl font-bold mb-4">Conversation</h3>
        <div className="space-y-4">
          {ticket.messages.map((message) => (
            <Card
              key={message.id}
              className={`p-4 ${
                message.authorRole === "support"
                  ? "border-l-4 border-green-500 bg-green-50"
                  : "border-l-4 border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    {message.authorName}
                    {message.authorRole === "support" && (
                      <span className="ml-2 inline-block px-2 py-1 text-xs bg-green-200 text-green-700 rounded font-medium">
                        Support Team
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {message.message}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Reply Section */}
      {ticket.status !== "closed" && (
        <Card className="p-6 bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-4">Add Reply</h3>
          <div className="space-y-3">
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button
              onClick={onReply}
              disabled={!replyMessage.trim()}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Send size={16} />
              Send Reply
            </Button>
          </div>
        </Card>
      )}

      {ticket.status === "closed" && (
        <Card className="p-4 bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-700">
            <AlertCircle size={18} />
            This ticket is closed. You cannot reply to closed tickets.
          </div>
        </Card>
      )}
    </div>
  );
}

import { useState } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  author: "user" | "agent";
  message: string;
  timestamp: Date;
}

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      author: "agent",
      message:
        "Hi there! 👋 Welcome to Sticky Slap support. How can we help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: String(messages.length + 1),
      author: "user",
      message: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: ChatMessage = {
        id: String(messages.length + 2),
        author: "agent",
        message:
          "Thanks for your message! An agent will respond shortly. In the meantime, check our Help Center for quick answers.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition hover:scale-110 z-40"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 px-4 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition flex items-center gap-2 z-40"
      >
        <MessageCircle size={18} />
        <span className="font-medium">Chat with us</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-bold">Sticky Slap Support</h3>
          <p className="text-sm text-green-100">We typically reply in minutes</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-green-700 rounded transition"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-green-700 rounded transition"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.author === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.author === "user"
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.author === "user"
                    ? "text-green-100"
                    : "text-gray-500"
                }`}
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-green-600 hover:bg-green-700 text-white p-2"
          >
            <Send size={18} />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💬 Chat available Monday-Friday, 9 AM - 5 PM EST
        </p>
      </div>
    </div>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tag, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Deals() {
  const deals = [
    {
      id: 1,
      title: "Bulk Sticker Special",
      description: "Get 20% off when you order 500+ die-cut stickers.",
      code: "BULK20",
      expires: "Ends in 3 days",
      image: "https://images.unsplash.com/photo-1572375927902-e6090dbb9033?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "New Customer Discount",
      description: "First time ordering? Use this code for $10 off your first order.",
      code: "WELCOME10",
      expires: "Always active",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      title: "Sample Pack",
      description: "Get a custom sample pack of our materials for just $1.",
      code: "SAMPLES1",
      expires: "Limited time",
      image: "https://images.unsplash.com/photo-1589118949245-7d40088ad846?w=800&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Current Deals & Offers</h1>
          <p className="text-lg text-gray-600">Save big on your next print project with our exclusive discounts.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
              <img src={deal.image} alt={deal.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mb-2">
                  <Tag size={16} />
                  <span>{deal.code}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{deal.title}</h3>
                <p className="text-gray-600 mb-4">{deal.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={14} />
                    <span>{deal.expires}</span>
                  </div>
                  <Link to="/products" className="text-black font-bold flex items-center gap-1 hover:gap-2 transition-all">
                    Shop Now <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HelpCenter as HelpCenterComponent } from "@/components/HelpCenter";
import { ContactForm } from "@/components/ContactForm";
import { helpArticles, faqs } from "@shared/support";
import { Card } from "@/components/ui/card";
import { MessageCircle, LifeBuoy, Clock, AlertCircle } from "lucide-react";

export default function HelpCenter() {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {showContactForm ? (
            <>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 mb-6"
              >
                ← Back to Help Center
              </button>
              <ContactForm />
            </>
          ) : (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {helpArticles.length}
                  </div>
                  <p className="text-gray-600">Help Articles</p>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {faqs.length}
                  </div>
                  <p className="text-gray-600">FAQ Questions</p>
                </Card>
                <Card className="p-6 text-center">
                  <Clock size={32} className="mx-auto text-yellow-600 mb-2" />
                  <p className="text-gray-600">24/7 Available</p>
                </Card>
                <Card className="p-6 text-center">
                  <LifeBuoy size={32} className="mx-auto text-purple-600 mb-2" />
                  <p className="text-gray-600">Expert Support</p>
                </Card>
              </div>

              {/* Help Center Component */}
              <HelpCenterComponent articles={helpArticles} faqs={faqs} />

              {/* Support CTA */}
              <Card className="p-8 bg-gradient-to-r from-green-600 to-green-700 text-white mt-12 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Didn't find what you're looking for?
                    </h2>
                    <p className="text-green-100">
                      Our support team is ready to help. Get a response within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="px-6 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition whitespace-nowrap"
                  >
                    Contact Support
                  </button>
                </div>
              </Card>

              {/* Quick Links */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 hover:shadow-lg transition">
                  <MessageCircle size={32} className="text-blue-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">
                    Check Your Tickets
                  </h3>
                  <p className="text-gray-600 mb-4">
                    View the status of your support tickets and communicate with our team.
                  </p>
                  <a
                    href="/support"
                    className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
                  >
                    Go to Tickets →
                  </a>
                </Card>

                <Card className="p-6 hover:shadow-lg transition">
                  <AlertCircle size={32} className="text-yellow-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">
                    Track Your Order
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Check the status of your orders without logging in.
                  </p>
                  <a
                    href="/order-lookup"
                    className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
                  >
                    Lookup Order →
                  </a>
                </Card>

                <Card className="p-6 hover:shadow-lg transition">
                  <LifeBuoy size={32} className="text-green-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">
                    Common Issues
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Quick solutions for the most common questions we receive.
                  </p>
                  <a
                    href="#faqs"
                    className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
                  >
                    View FAQs →
                  </a>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Truck } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6">
              <ArrowLeft size={18} />
              Back to home
            </Link>
            <h1 className="text-4xl font-bold">Shipping Policy</h1>
            <p className="text-gray-300 mt-2">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
            {/* Intro */}
            <Card className="bg-blue-50 border-blue-200 p-6 mb-8">
              <div className="flex items-start gap-4">
                <Truck className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Fast, Reliable Shipping</h2>
                  <p className="text-gray-700">
                    We partner with trusted carriers to get your custom products to you safely and on time.
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Production Time</h2>
              <p className="text-gray-700 mb-4">
                <strong>Production begins after proof approval</strong>. Standard turnaround is 3-5 business days for
                most products.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Standard Production</p>
                  <p className="text-gray-700 text-sm">3-5 business days</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Rush Production</p>
                  <p className="text-gray-700 text-sm">1-2 business days (additional fee applies)</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Custom Orders</p>
                  <p className="text-gray-700 text-sm">Quote-based, typically 5-10 business days</p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Shipping Methods & Times</h2>
              <p className="text-gray-700 mb-4">
                We offer multiple shipping options. Delivery time begins <strong>after production is complete</strong>.
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">USPS Priority Mail</p>
                  <p className="text-gray-700 text-sm mb-2">2-3 business days (continental US)</p>
                  <p className="text-gray-600 text-xs">Most economical option for smaller orders</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">USPS Priority Mail Express</p>
                  <p className="text-gray-700 text-sm mb-2">1-2 business days (continental US)</p>
                  <p className="text-gray-600 text-xs">Fastest USPS option with tracking</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">UPS Ground</p>
                  <p className="text-gray-700 text-sm mb-2">3-5 business days (continental US)</p>
                  <p className="text-gray-600 text-xs">Good for larger, heavier orders</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">International Shipping</p>
                  <p className="text-gray-700 text-sm mb-2">5-15 business days (varies by country)</p>
                  <p className="text-gray-600 text-xs">Customs clearance time varies</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Shipping Costs</h2>
              <p className="text-gray-700 mb-4">
                Shipping costs are calculated based on package weight, dimensions, and destination. Costs are shown
                before checkout.
              </p>
              <Card className="bg-yellow-50 border-yellow-200 p-4 mb-4">
                <p className="text-yellow-900">
                  <strong>💡 Tip:</strong> Larger orders may qualify for free shipping. Promotions are automatically
                  applied at checkout.
                </p>
              </Card>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Tracking & Delivery Confirmation</h2>
              <p className="text-gray-700 mb-4">
                All orders include tracking information. You'll receive:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Confirmation email when your order ships</li>
                <li>Tracking number and carrier information</li>
                <li>Real-time tracking updates from the carrier</li>
                <li>Delivery confirmation when package arrives</li>
              </ul>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  Check your email or login to your account to view tracking information anytime.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Shipping Address Requirements</h2>
              <p className="text-gray-700 mb-4">Please ensure your shipping address is:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">✓ Complete</p>
                  <p className="text-sm text-gray-700">Full street address with apartment/suite numbers</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">✓ Accurate</p>
                  <p className="text-sm text-gray-700">Correct spelling of city, state, and ZIP code</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">✓ Reachable</p>
                  <p className="text-sm text-gray-700">Must be a valid delivery address</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">✓ Deliverable</p>
                  <p className="text-sm text-gray-700">PO boxes only available for USPS</p>
                </div>
              </div>
              <p className="text-gray-700 mt-4">
                <strong>Note:</strong> Sticky Slap is not responsible for packages sent to incorrect addresses provided
                by the customer.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Shipping Insurance</h2>
              <p className="text-gray-700 mb-4">
                We recommend shipping insurance for high-value orders. Optional insurance can be added at checkout to
                protect against loss or damage during shipping.
              </p>
              <Card className="bg-green-50 border-green-200 p-4">
                <p className="text-green-900">
                  <strong>What insurance covers:</strong> Package loss, theft, and damage caused during shipping
                </p>
                <p className="text-green-800 text-sm mt-2">
                  Insurance claim processing typically takes 5-10 business days
                </p>
              </Card>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Delivery Issues</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Package Not Arrived</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    If your package hasn't arrived by the expected delivery date:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 text-sm">
                    <li>Check tracking information online</li>
                    <li>Allow additional time (carriers sometimes run late)</li>
                    <li>Contact the carrier directly</li>
                    <li>Email us at support@stickyslap.com with tracking number</li>
                  </ol>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Package Damaged During Shipping</h3>
                  <p className="text-red-800 text-sm">
                    <strong>Important:</strong> Report damage to the carrier within 48 hours. Document with photos of
                    outer box and damage. Then contact us for a refund or replacement.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Signature Requirements</h2>
              <p className="text-gray-700 mb-4">
                Most orders do not require a signature. However, signature confirmation may be required for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>High-value orders</li>
                <li>International shipments</li>
                <li>Orders with insurance</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Address Changes</h2>
              <p className="text-gray-700 mb-4">
                <strong>You can change your address only BEFORE the order ships</strong>.
              </p>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-900 font-semibold mb-2">To change your address:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
                  <li>Contact us immediately at support@stickyslap.com</li>
                  <li>Include your order number</li>
                  <li>Provide the correct address</li>
                </ol>
                <p className="text-blue-900 text-sm mt-3">
                  <strong>Note:</strong> If your order has already shipped, you'll need to arrange with the carrier.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <Card className="bg-green-50 border-green-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Questions?</h3>
                <p className="text-gray-700 mb-4">
                  Our support team is ready to help:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p>📧 <strong>support@stickyslap.com</strong></p>
                  <p>📞 <strong>(555) 000-0000</strong></p>
                  <p className="text-sm text-gray-600">Response time: 24 hours</p>
                </div>
              </Card>
            </section>

            {/* Footer Links */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex gap-4 justify-center">
                <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </Link>
                <span className="text-gray-400">•</span>
                <Link to="/refund-policy" className="text-blue-600 hover:text-blue-700 font-medium">
                  Refund Policy
                </Link>
                <span className="text-gray-400">•</span>
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

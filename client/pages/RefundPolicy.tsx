import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function RefundPolicy() {
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
            <h1 className="text-4xl font-bold">Refund Policy</h1>
            <p className="text-gray-300 mt-2">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
            {/* Intro */}
            <Card className="bg-blue-50 border-blue-200 p-6 mb-8">
              <div className="flex items-start gap-4">
                <RefreshCw className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Understanding Our Refund Policy</h2>
                  <p className="text-gray-700">
                    Because all products are custom-made to your specifications, our refund policy is designed to be fair
                    to both customers and our production team.
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. No Refunds for Approved Orders</h2>
              <p className="text-gray-700 mb-4">
                Once you approve a proof and your order enters production, <strong>no refunds are available</strong>.
                Proof approval is your final confirmation that all details are correct.
              </p>
              <Card className="bg-red-50 border-red-200 p-4 mb-4">
                <p className="text-red-900 font-semibold mb-2">Why this policy exists:</p>
                <ul className="space-y-1 text-red-800 text-sm">
                  <li>• Custom products are produced based on your approved specifications</li>
                  <li>• Materials are sourced and production begins immediately</li>
                  <li>• Cancellation would result in complete waste of materials and labor</li>
                </ul>
              </Card>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Refunds for Defective Products</h2>
              <p className="text-gray-700 mb-4">
                If you receive a product that is <strong>defective</strong> due to an error on our part, we will offer a
                refund or reprint.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900">What qualifies as defective:</p>
                  <ul className="space-y-1 text-gray-700 text-sm mt-2">
                    <li>✓ Printing errors (wrong colors, misalignment)</li>
                    <li>✓ Manufacturing defects (torn material, poor cuts)</li>
                    <li>✓ Material damage during shipping (our responsibility)</li>
                    <li>✓ Wrong product shipped (our error)</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="font-semibold text-yellow-900">What does NOT qualify:</p>
                  <ul className="space-y-1 text-yellow-800 text-sm mt-2">
                    <li>✗ Color appearing different than on-screen</li>
                    <li>✗ Spelling errors approved in the proof</li>
                    <li>✗ Design not matching expectations (personal preference)</li>
                    <li>✗ Damaged by customer after receipt</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Defect Claim Process</h2>
              <p className="text-gray-700 mb-4">To claim a refund or reprint:</p>
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div className="flex gap-4">
                  <span className="font-bold text-blue-900 flex-shrink-0">1.</span>
                  <div>
                    <p className="font-medium text-gray-900">Contact us within 7 days of delivery</p>
                    <p className="text-sm text-gray-600">Send photos of the defect to support@stickyslap.com</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-bold text-blue-900 flex-shrink-0">2.</span>
                  <div>
                    <p className="font-medium text-gray-900">Provide clear evidence</p>
                    <p className="text-sm text-gray-600">Include order number, photos of defect, and a description</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-bold text-blue-900 flex-shrink-0">3.</span>
                  <div>
                    <p className="font-medium text-gray-900">We review and respond</p>
                    <p className="text-sm text-gray-600">Within 48 hours, we'll approve a refund or reprint</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Refund Resolution Options</h2>
              <p className="text-gray-700 mb-4">If we approve your defect claim, you have two options:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card className="p-4 border-2 border-green-200 bg-green-50">
                  <h4 className="font-bold text-gray-900 mb-2">Reprint</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    We'll reprint your order at no charge and ship it to you immediately.
                  </p>
                  <p className="text-xs text-green-700 font-semibold">Fastest solution</p>
                </Card>
                <Card className="p-4 border-2 border-blue-200 bg-blue-50">
                  <h4 className="font-bold text-gray-900 mb-2">Refund</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    We'll refund your order amount. Shipping costs are non-refundable.
                  </p>
                  <p className="text-xs text-blue-700 font-semibold">Processed within 5-10 days</p>
                </Card>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Shipping Damage Claims</h2>
              <p className="text-gray-700 mb-4">
                If your package arrives damaged and it's the shipping carrier's fault:
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">What we need:</p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Photos of the damaged package (outer box and damage)</li>
                    <li>Photos of the damaged products inside</li>
                    <li>Your order number</li>
                  </ul>
                </div>
                <p className="text-gray-700 text-sm">
                  <strong>Note:</strong> We recommend taking photos immediately upon receipt. Carriers may deny claims if
                  you don't report damage within 48 hours.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cancellation Policy</h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">Before Proof</p>
                  <p className="text-green-800 text-sm">
                    Full refund. We haven't started production yet.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="font-semibold text-yellow-900 mb-2">After Proof Approval</p>
                  <p className="text-yellow-800 text-sm">
                    <strong>No refund.</strong> Production has begun. This is why careful proof review is important.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Shipping Costs</h2>
              <p className="text-gray-700 mb-4">
                <strong>Shipping is non-refundable</strong> in most cases, even if you return a product. However:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>
                  If we ship the wrong product, we cover return shipping and reimburse original shipping
                </li>
                <li>
                  If the product is defective due to our error, we cover return and replacement shipping
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <Card className="bg-green-50 border-green-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Questions About Refunds?</h3>
                <p className="text-gray-700 mb-4">
                  Contact our customer support team and we'll help resolve any issues:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p>📧 <strong>support@printsociety.co</strong></p>
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
                <Link to="/shipping-policy" className="text-blue-600 hover:text-blue-700 font-medium">
                  Shipping Policy
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

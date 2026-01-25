import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
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
            <h1 className="text-4xl font-bold">Terms of Service</h1>
            <p className="text-gray-300 mt-2">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
            {/* Table of Contents */}
            <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { num: 1, title: "Services" },
                  { num: 2, title: "Account Registration" },
                  { num: 3, title: "Artwork & IP" },
                  { num: 4, title: "Proofing & Approval" },
                  { num: 5, title: "Color Accuracy" },
                  { num: 6, title: "Turnaround & Shipping" },
                  { num: 7, title: "Returns & Refunds" },
                  { num: 8, title: "Prohibited Content" },
                ].map((item) => (
                  <a
                    key={item.num}
                    href={`#section-${item.num}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {item.num}. {item.title}
                  </a>
                ))}
              </div>
            </Card>

            {/* Section 1 */}
            <section id="section-1" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Services</h2>
              <p className="text-gray-700 mb-4">
                Print Society .co ("Company," "we," "us," or "our") provides custom-printed products
                including, but not limited to, stickers, labels, and related printed materials.
                All products are made to order based on customer-submitted designs.
              </p>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Account Registration</h2>
              <p className="text-gray-700 mb-4">
                To place an order, approve proofs, or access order history, you may be required
                to create an account.
              </p>
              <p className="font-semibold text-gray-900 mb-2">You agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Provide accurate information</li>
                <li>Keep login credentials secure</li>
                <li>Accept responsibility for all activity under your account</li>
              </ul>
              <p className="text-gray-700">
                We reserve the right to suspend or terminate accounts for misuse, fraud, or
                violation of these terms.
              </p>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Artwork & Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                By uploading artwork, you confirm that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>You own the rights to the design, OR</li>
                <li>You have permission/license to use the artwork</li>
              </ul>
              <Card className="bg-yellow-50 border-yellow-200 p-4 mb-4">
                <p className="text-yellow-900 font-semibold">
                  ⚠️ Print Society .co is not responsible for copyright or trademark violations caused
                  by customer-submitted artwork.
                </p>
              </Card>
              <p className="text-gray-700">
                You grant Print Society .co a limited license to use your artwork only to fulfill your
                order and provide proofs.
              </p>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Proofing & Approval (VERY IMPORTANT)</h2>
              <p className="text-gray-700 mb-4">
                Before production, a digital proof will be sent for your approval.
              </p>
              <p className="font-semibold text-gray-900 mb-2">Customers are responsible for reviewing proofs carefully for:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Layout and positioning</li>
                <li>Size and scale</li>
                <li>Spelling and text</li>
                <li>Cut lines</li>
                <li>Orientation</li>
                <li>Color appearance</li>
              </ul>
              <Card className="bg-red-50 border-red-200 p-4 mb-4">
                <p className="text-red-900 font-semibold mb-2">Once a proof is approved:</p>
                <ul className="space-y-1 text-red-800">
                  <li>❌ No changes can be made</li>
                  <li>❌ No refunds or reprints for approved errors</li>
                  <li>✓ Production will proceed to completion</li>
                </ul>
              </Card>
              <p className="text-gray-700">
                Failure to respond to proof requests within the specified timeframe may delay
                production.
              </p>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Color Accuracy & Printing Variations</h2>
              <p className="text-gray-700 mb-4">
                Due to differences between screens, printers, materials, and finishes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Colors may vary slightly from on-screen previews</li>
                <li>Minor variations in shade, hue, and saturation are normal</li>
                <li>Material texture may affect color appearance</li>
                <li>Different finish types (matte, glossy, holographic) display colors differently</li>
              </ul>
              <p className="text-gray-700">
                Minor variations are not considered defects. We do not guarantee exact color
                matching unless a paid color-matching service is selected.
              </p>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Turnaround Time & Shipping</h2>
              <p className="text-gray-700 mb-4">
                Production times are estimates and begin after proof approval. Shipping time is
                separate from production time.
              </p>
              <p className="font-semibold text-gray-900 mb-2">Print Society .co is not responsible for:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Carrier delays (USPS, UPS, FedEx, DHL, etc.)</li>
                <li>Weather disruptions or natural disasters</li>
                <li>Incorrect addresses provided by the customer</li>
                <li>Package loss or damage by shipping carriers</li>
                <li>Customs delays on international orders</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Returns, Refunds & Reprints</h2>
              <p className="text-gray-700 mb-4">
                Because all products are custom-made to your specifications:
              </p>
              <Card className="bg-gray-50 border-gray-200 p-4 mb-4">
                <p className="font-semibold text-gray-900 mb-2">All sales are final once approved and printed.</p>
                <p className="text-gray-700 text-sm">
                  We may offer reprints or refunds only if the product is defective or the error
                  was caused by Print Society .co.
                </p>
              </Card>
              <p className="font-semibold text-gray-900 mb-2">To submit a claim:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Contact us within 7 days of delivery</li>
                <li>Provide clear photos of the defect</li>
                <li>Include your order number</li>
              </ul>
              <p className="text-gray-700">
                Claims submitted after 7 days cannot be processed. All decisions are made at
                Print Society .co's discretion.
              </p>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Prohibited Content</h2>
              <p className="text-gray-700 mb-4">
                We do not print content that includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Hate speech or discriminatory content</li>
                <li>Illegal content or symbols</li>
                <li>Explicit, obscene, or abusive material</li>
                <li>Content violating intellectual property laws</li>
                <li>Counterfeit or infringing designs</li>
                <li>Medical or pharmaceutical claims</li>
              </ul>
              <p className="text-gray-700">
                We reserve the right to refuse or cancel orders at our discretion without
                explanation or refund.
              </p>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, Print Society .co is not liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Lost profits or business interruption</li>
                <li>Indirect, incidental, or consequential damages</li>
                <li>Damages from third-party claims</li>
              </ul>
              <p className="text-gray-700">
                Our maximum liability shall not exceed the amount you paid for the order.
              </p>
            </section>

            {/* Section 10 */}
            <section id="section-10" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700">
                We may update these Terms of Service at any time. Continued use of our site and
                services constitutes your acceptance of the updated terms. We recommend reviewing
                this page periodically for changes.
              </p>
            </section>

            {/* Section 11 */}
            <section id="section-11" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions regarding these Terms of Service, please contact us:
              </p>
              <Card className="bg-green-50 border-green-200 p-4">
                <p className="font-semibold text-gray-900 mb-2">Print Society .co Support</p>
                <p className="text-gray-700">📧 support@stickyslap.com</p>
                <p className="text-gray-700 text-sm mt-2">Response time: 24-48 hours</p>
              </Card>
            </section>

            {/* Footer Links */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex gap-4 justify-center">
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </Link>
                <span className="text-gray-400">•</span>
                <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                  Home
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

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Eye, Shield } from "lucide-react";

export default function Privacy() {
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
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-gray-300 mt-2">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
            {/* Intro Card */}
            <Card className="bg-blue-50 border-blue-200 p-6 mb-8">
              <div className="flex items-start gap-4">
                <Shield className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Privacy Matters</h2>
                  <p className="text-gray-700">
                    Sticky Slap respects your privacy and is committed to protecting your personal
                    information. This policy explains how we collect, use, and protect your data.
                  </p>
                </div>
              </div>
            </Card>

            {/* Table of Contents */}
            <Card className="p-6 mb-8 bg-gray-50 border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { num: 1, title: "Information We Collect" },
                  { num: 2, title: "How We Use Your Info" },
                  { num: 3, title: "Artwork & File Privacy" },
                  { num: 4, title: "Cookies & Analytics" },
                  { num: 5, title: "Third-Party Services" },
                  { num: 6, title: "Data Security" },
                  { num: 7, title: "Your Rights" },
                  { num: 8, title: "Children's Privacy" },
                ].map((item) => (
                  <a
                    key={item.num}
                    href={`#section-${item.num}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    {item.num}. {item.title}
                  </a>
                ))}
              </div>
            </Card>

            {/* Section 1 */}
            <section id="section-1" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[
                  "Name & contact email",
                  "Shipping & billing address",
                  "Phone number",
                  "Uploaded artwork files",
                  "Order history",
                  "Communications & support tickets",
                  "Payment information",
                  "Account preferences",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">→</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold text-gray-900 mt-6 mb-3">Information Collected Automatically:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>IP address and device information</li>
                <li>Browser type and operating system</li>
                <li>Browsing behavior on our site</li>
                <li>Pages visited and time spent</li>
                <li>Cookies and analytics data</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { icon: "✓", title: "Process orders and payments", desc: "Fulfill your custom print orders" },
                  { icon: "✓", title: "Send proofs and updates", desc: "Provide proofs for approval and order status updates" },
                  { icon: "✓", title: "Provide customer support", desc: "Respond to questions and resolve issues" },
                  { icon: "✓", title: "Improve our services", desc: "Analyze usage to enhance website and services" },
                  { icon: "✓", title: "Marketing (opt-in)", desc: "Send email about new products and promotions" },
                  { icon: "✓", title: "Fraud prevention", desc: "Protect against unauthorized access" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900">
                      <span className="text-green-600 mr-2">{item.icon}</span>
                      {item.title}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Artwork & File Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your artwork and design files are handled with care:
              </p>
              <Card className="bg-green-50 border-green-200 p-4 space-y-3 mb-4">
                {[
                  "🔒 Artwork is stored securely on our servers",
                  "🚫 Never sold or shared with third parties",
                  "📋 Used only to fulfill your order and provide proofs",
                  "🗑️ You can request deletion anytime",
                  "📅 Deleted files are permanently removed within 30 days",
                ].map((item, idx) => (
                  <p key={idx} className="text-gray-800 text-sm">{item}</p>
                ))}
              </Card>
              <p className="text-gray-700">
                Your designs are your intellectual property. We don't use them for any other
                purpose or customers.
              </p>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies & Analytics</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and analytics tools to improve your experience:
              </p>
              <div className="space-y-3 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900">Essential Cookies</p>
                  <p className="text-gray-700 text-sm">Required for site functionality and security</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900">Performance Cookies</p>
                  <p className="text-gray-700 text-sm">Help us understand how visitors use our site</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900">Marketing Cookies</p>
                  <p className="text-gray-700 text-sm">Track conversions and improve advertising</p>
                </div>
              </div>
              <p className="text-gray-700">
                You can disable cookies in your browser settings, but some features may not function
                properly.
              </p>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We work with trusted partners to provide our services. We may share necessary
                information with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li><strong>Payment Processors:</strong> To securely process your payments</li>
                <li><strong>Shipping Carriers:</strong> To deliver your orders (USPS, UPS, FedEx)</li>
                <li><strong>Email Services:</strong> To send proofs and updates</li>
                <li><strong>Analytics Tools:</strong> To understand user behavior and improve services</li>
              </ul>
              <p className="text-gray-700">
                These providers are contractually required to protect your data and use it only for
                the purposes we specify.
              </p>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We use industry-standard security measures to protect your information:
              </p>
              <Card className="bg-blue-50 border-blue-200 p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Lock className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">We use:</p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>✓ SSL/TLS encryption for data in transit</li>
                      <li>✓ Secure password hashing for login credentials</li>
                      <li>✓ Firewall protection and intrusion detection</li>
                      <li>✓ Regular security audits and updates</li>
                    </ul>
                  </div>
                </div>
              </Card>
              <p className="text-gray-700 text-sm">
                <strong>Disclaimer:</strong> No online system is 100% secure. While we take every
                reasonable precaution, we cannot guarantee absolute security.
              </p>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <div className="space-y-3">
                {[
                  { title: "Access Your Data", desc: "Request a copy of the personal information we hold about you" },
                  { title: "Correct Information", desc: "Update or fix inaccurate information in your account" },
                  { title: "Delete Your Account", desc: "Request full deletion of your account and associated data" },
                  { title: "Opt Out of Marketing", desc: "Unsubscribe from promotional emails at any time" },
                  { title: "Export Your Data", desc: "Download your information in a portable format" },
                  { title: "Withdraw Consent", desc: "Stop us from using your data for non-essential purposes" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 text-sm mt-4">
                To exercise any of these rights, contact us at support@stickyslap.com with your request.
              </p>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
              <Card className="bg-yellow-50 border-yellow-200 p-4">
                <p className="text-yellow-900">
                  <strong>⚠️ Important:</strong> Sticky Slap does not knowingly collect personal
                  information from individuals under 13 years old. If we learn that we have
                  collected data from a child, we will delete it promptly. Parents or guardians
                  who believe their child has provided information to us should contact us
                  immediately.
                </p>
              </Card>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Policy Updates</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy periodically to reflect changes in our practices,
                technology, or legal requirements. Updates will be posted on this page with a new
                "Last updated" date. Your continued use of Sticky Slap following any changes
                constitutes your acceptance of the updated policy.
              </p>
            </section>

            {/* Section 10 */}
            <section id="section-10" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or our
                privacy practices:
              </p>
              <Card className="bg-green-50 border-green-200 p-6">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">Sticky Slap Privacy Team</p>
                    <p className="text-gray-700 mt-1">📧 <strong>privacy@stickyslap.com</strong></p>
                    <p className="text-gray-700">📧 <strong>support@stickyslap.com</strong></p>
                    <p className="text-gray-600 text-sm mt-3">
                      Response time: 24-48 hours
                    </p>
                  </div>
                  <div className="pt-4 border-t border-green-200">
                    <p className="text-sm text-gray-700">
                      <strong>Data Subject Access Requests:</strong> We comply with legal requests
                      for your personal data under applicable privacy laws.
                    </p>
                  </div>
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

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Monitor, Volume2, Navigation, Zap } from "lucide-react";

export default function Accessibility() {
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
            <h1 className="text-4xl font-bold">Accessibility Statement</h1>
            <p className="text-gray-300 mt-2">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
            {/* Intro Card */}
            <Card className="bg-blue-50 border-blue-200 p-6 mb-8">
              <div className="flex items-start gap-4">
                <Monitor className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Our Commitment to Accessibility</h2>
                  <p className="text-gray-700">
                    Sticky Slap is committed to ensuring that our website and services are accessible
                    to everyone, including people with disabilities. We continuously work to improve
                    the accessibility of our digital platforms.
                  </p>
                </div>
              </div>
            </Card>

            {/* Table of Contents */}
            <Card className="p-6 mb-8 bg-gray-50 border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { num: 1, title: "Accessibility Features" },
                  { num: 2, title: "Web Standards Compliance" },
                  { num: 3, title: "Navigation & Keyboard" },
                  { num: 4, title: "Vision & Color" },
                  { num: 5, title: "Audio & Video" },
                  { num: 6, title: "Mobile Accessibility" },
                  { num: 7, title: "Assistive Technologies" },
                  { num: 8, title: "Accessibility Issues" },
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Accessibility Features</h2>
              <p className="text-gray-700 mb-4">
                Our website includes the following accessibility features:
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { icon: "🔤", title: "Resizable Text", desc: "Users can increase or decrease font sizes" },
                  { icon: "🎨", title: "High Contrast Mode", desc: "Option for higher contrast text and backgrounds" },
                  { icon: "⌨️", title: "Keyboard Navigation", desc: "Full navigation using keyboard only" },
                  { icon: "🔍", title: "Skip Links", desc: "Skip to main content and navigation shortcuts" },
                  { icon: "📱", title: "Responsive Design", desc: "Works on devices of all sizes" },
                  { icon: "🔊", title: "Screen Reader Support", desc: "Compatible with assistive technology" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900">
                      <span className="mr-2">{item.icon}</span>
                      {item.title}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Web Standards Compliance</h2>
              <p className="text-gray-700 mb-4">
                Sticky Slap strives to comply with the Web Content Accessibility Guidelines (WCAG)
                2.1 Level AA standards, which provide guidance for making web content more accessible
                to people with disabilities.
              </p>
              <Card className="bg-green-50 border-green-200 p-4">
                <p className="text-green-900 font-semibold mb-2">Standards We Follow:</p>
                <ul className="space-y-2 text-green-800 text-sm">
                  <li>✓ WCAG 2.1 Level AA compliance targets</li>
                  <li>✓ Section 508 of the Rehabilitation Act</li>
                  <li>✓ ADA (Americans with Disabilities Act) compliance</li>
                  <li>✓ Regular accessibility audits and testing</li>
                </ul>
              </Card>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Navigation & Keyboard Accessibility</h2>
              <p className="text-gray-700 mb-4">
                Our website is fully navigable using keyboard controls:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>All interactive elements are keyboard accessible</li>
                <li>Tab key moves between interactive elements in logical order</li>
                <li>Enter key activates buttons and links</li>
                <li>Space key activates checkboxes and toggles</li>
                <li>Escape key closes modals and menus</li>
                <li>Skip links allow jumping over repetitive content</li>
              </ul>
              <p className="text-gray-700 text-sm bg-yellow-50 border border-yellow-200 p-3 rounded">
                If you find keyboard navigation issues, please contact us at accessibility@stickyslap.com
              </p>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Vision & Color Accessibility</h2>
              <p className="text-gray-700 mb-4">
                We design with visual accessibility in mind:
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { title: "Color Contrast", desc: "Text has sufficient contrast ratios (4.5:1 or better)" },
                  { title: "Color Independence", desc: "Information is not conveyed by color alone" },
                  { title: "Text Alternatives", desc: "Images have descriptive alt text" },
                  { title: "Font Legibility", desc: "Clear, sans-serif fonts for better readability" },
                  { title: "Text Sizing", desc: "Support for browser zoom up to 200%" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Audio & Video Content</h2>
              <p className="text-gray-700 mb-4">
                For multimedia content on our site:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Videos include captions for dialogue and sound effects</li>
                <li>Transcripts provided for audio content</li>
                <li>Audio descriptions available for visual information</li>
                <li>Controls are keyboard accessible and clearly labeled</li>
                <li>No content flashes more than 3 times per second</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Mobile Accessibility</h2>
              <p className="text-gray-700 mb-4">
                Our mobile experience is designed with accessibility in mind:
              </p>
              <Card className="bg-blue-50 border-blue-200 p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Navigation className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Mobile Features:</p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>✓ Touch targets are at least 44x44 pixels</li>
                      <li>✓ Proper spacing between interactive elements</li>
                      <li>✓ Works with mobile screen readers (VoiceOver, TalkBack)</li>
                      <li>✓ Responsive design adapts to all screen sizes</li>
                      <li>✓ Landscape and portrait orientations supported</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Assistive Technology Support</h2>
              <p className="text-gray-700 mb-4">
                Our website is compatible with:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[
                  { name: "NVDA", type: "Screen Reader (Windows)" },
                  { name: "JAWS", type: "Screen Reader (Windows)" },
                  { name: "VoiceOver", type: "Screen Reader (Mac/iOS)" },
                  { name: "TalkBack", type: "Screen Reader (Android)" },
                  { name: "Dragon NaturallySpeaking", type: "Voice Control" },
                  { name: "ZoomText", type: "Magnification Software" },
                ].map((tool, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900">{tool.name}</p>
                    <p className="text-gray-600 text-sm mt-1">{tool.type}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 text-sm">
                If you experience issues with any assistive technology, please let us know.
              </p>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Reporting Accessibility Issues</h2>
              <p className="text-gray-700 mb-4">
                We're committed to fixing accessibility barriers. If you encounter any issues:
              </p>
              <Card className="bg-green-50 border-green-200 p-6 mb-4">
                <p className="font-semibold text-gray-900 mb-3">How to Report</p>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">Email us:</p>
                    <p className="text-gray-700">📧 <strong>accessibility@stickyslap.com</strong></p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Or contact support:</p>
                    <p className="text-gray-700">📧 <strong>support@stickyslap.com</strong></p>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <p className="text-sm text-gray-700">
                      <strong>Include:</strong> Page URL, description of the issue, and your browser/assistive technology
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      <strong>Response time:</strong> We aim to respond within 24-48 hours
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Continuous Improvement</h2>
              <Card className="bg-purple-50 border-purple-200 p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Zap className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Our Accessibility Roadmap:</p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Regular accessibility audits and testing</li>
                      <li>• User feedback integration</li>
                      <li>• Staff training on accessibility best practices</li>
                      <li>• Third-party accessibility reviews</li>
                      <li>• Keeping up with latest WCAG guidelines</li>
                    </ul>
                  </div>
                </div>
              </Card>
              <p className="text-gray-700">
                Accessibility is an ongoing effort. We're always looking for ways to improve our
                digital experience for all users.
              </p>
            </section>

            {/* Section 10 */}
            <section id="section-10" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Additional Resources</h2>
              <p className="text-gray-700 mb-4">
                For more information about accessibility:
              </p>
              <div className="space-y-3">
                {[
                  { name: "WebAIM", url: "https://webaim.org" },
                  { name: "W3C Web Accessibility Initiative (WAI)", url: "https://www.w3.org/WAI/" },
                  { name: "WCAG 2.1 Guidelines", url: "https://www.w3.org/WAI/WCAG21/quickref/" },
                  { name: "Americans with Disabilities Act (ADA)", url: "https://www.ada.gov" },
                ].map((resource, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900">{resource.name}</p>
                    <p className="text-blue-600 text-sm mt-1">{resource.url}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer Links */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </Link>
                <span className="text-gray-400">•</span>
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

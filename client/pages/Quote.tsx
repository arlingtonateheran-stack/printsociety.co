import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Upload, Loader, Check } from 'lucide-react';

export default function Quote() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    productType: '',
    quantity: '',
    size: '',
    material: '',
    specialRequirements: '',
    timeline: '',
    budget: '',
    artworkFile: null as File | null,
  });

  const productTypes = [
    'Custom Stickers (Die-Cut)',
    'Sticker Sheets',
    'Roll Labels',
    'Vinyl Banners',
    'Packaging Labels',
    'Product Decals',
    'Window Clings',
    'Other (describe below)',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, artworkFile: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // TODO: Replace with actual API call
    // const response = await api.post('/quotes', formData);
    
    setSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-900 to-green-800 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Custom Quote</h1>
            <p className="text-green-100 text-lg max-w-2xl">
              Have a special project that doesn't fit our standard pricing? Request a custom quote from our team.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {submitted ? (
            // Success State
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Request Received!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for submitting your quote request. Our team will review your project and send you a
                personalized quote within 24 hours.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>What's next?</strong>
                  <br />
                  Check your email at <span className="font-semibold">{formData.email}</span> for updates and our
                  custom quote.
                </p>
              </div>

              <button
                onClick={() => navigate('/')}
                className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Back to Home
              </button>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl mb-2">📋</div>
                  <p className="text-sm font-medium text-gray-900">Fill Out Form</p>
                  <p className="text-xs text-gray-600 mt-1">Tell us about your project</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl mb-2">📧</div>
                  <p className="text-sm font-medium text-gray-900">We Review</p>
                  <p className="text-xs text-gray-600 mt-1">Within 24 hours</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <p className="text-sm font-medium text-gray-900">Get Quote</p>
                  <p className="text-xs text-gray-600 mt-1">Custom pricing sent to email</p>
                </div>
              </div>

              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                          <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company/Brand</label>
                        <Input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
                        <select
                          name="productType"
                          value={formData.productType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select a product type...</option>
                          {productTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                          <Input
                            type="text"
                            name="quantity"
                            placeholder="e.g., 1000 units"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                          <Input
                            type="text"
                            name="size"
                            placeholder={"e.g., 3\" x 3\""}
                            value={formData.size}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Material/Finish Preference</label>
                        <Input
                          type="text"
                          name="material"
                          placeholder="e.g., Vinyl, Matte, Holographic"
                          value={formData.material}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Timeline *</label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">When do you need this?</option>
                          <option value="asap">ASAP (Rush - 3-5 days)</option>
                          <option value="1-2weeks">1-2 weeks</option>
                          <option value="2-4weeks">2-4 weeks</option>
                          <option value="1month">1 month or more</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select budget range</option>
                          <option value="under500">Under $500</option>
                          <option value="500-1000">$500 - $1,000</option>
                          <option value="1000-5000">$1,000 - $5,000</option>
                          <option value="5000-10000">$5,000 - $10,000</option>
                          <option value="over10000">$10,000+</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                        <textarea
                          name="specialRequirements"
                          value={formData.specialRequirements}
                          onChange={handleInputChange}
                          placeholder="Tell us about any special requests, specifications, or details we should know about..."
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Artwork Upload */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Artwork (Optional)</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition cursor-pointer">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="artwork-upload"
                        accept=".pdf,.ai,.psd,.eps,.png,.jpg,.svg"
                      />
                      <label htmlFor="artwork-upload" className="cursor-pointer">
                        <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm font-medium text-gray-900">
                          {formData.artworkFile ? formData.artworkFile.name : 'Drag artwork here or click to upload'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, AI, PSD, PNG, JPG, SVG (up to 100 MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="border-t pt-6">
                    <button
                      type="submit"
                      disabled={isLoading || !formData.name || !formData.email || !formData.productType}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Request Custom Quote
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Card>

              {/* Help Section */}
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Have questions about your custom project? Our team is here to help:
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>📧 Email: support@printsociety.co</p>
                  <p>📞 Phone: (555) 000-0000</p>
                  <p>💬 Chat with us during business hours (9 AM - 5 PM EST)</p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

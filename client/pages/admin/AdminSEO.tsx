import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";

export default function AdminSEO() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">SEO & Content</h1>
                <p className="text-gray-600 mt-1">Manage metadata, schema markup, and internal linking</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <Plus size={18} />
                New Page
              </button>
            </div>

            <Card className="p-12 text-center">
              <Search className="mx-auto text-gray-400 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SEO-First Product System</h2>
              <p className="text-gray-600 max-w-3xl mx-auto mb-8">
                Control every product and category's SEO metadata, add FAQ schema, manage internal linking, and structure H1/H2 hierarchy
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Meta Tags</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Title & description</li>
                    <li>✓ OG image & tags</li>
                    <li>✓ Canonical URLs</li>
                  </ul>
                </Card>
                <Card className="p-6 bg-green-50 border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Schema Markup</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Product schema</li>
                    <li>✓ FAQ schema</li>
                    <li>✓ Breadcrumbs</li>
                  </ul>
                </Card>
                <Card className="p-6 bg-purple-50 border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Content Structure</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ H1/H2 hierarchy</li>
                    <li>✓ Keywords</li>
                    <li>✓ Alt text</li>
                  </ul>
                </Card>
                <Card className="p-6 bg-orange-50 border-orange-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Internal Linking</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Link blocks</li>
                    <li>✓ Related products</li>
                    <li>✓ Navigation</li>
                  </ul>
                </Card>
              </div>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

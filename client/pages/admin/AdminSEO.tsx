import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Search, Plus, Globe, Package, Layout, Loader2, AlertCircle, CheckCircle, ExternalLink, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEOEditModal } from "./components/SEOEditModal";

export default function AdminSEO() {
  const [entities, setEntities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      setIsLoading(true);

      // Fetch Products
      const { data: products } = await supabase
        .from("products")
        .select("id, name, slug, status");

      // Fetch Categories
      const { data: categories } = await supabase
        .from("product_categories")
        .select("id, name, slug");

      // Fetch SEO Metadata
      const { data: seoMeta } = await supabase
        .from("seo_meta")
        .select("*");

      const combined = [
        ...(products?.map(p => ({ ...p, type: 'product', seo: seoMeta?.find(s => s.entity_id === p.id && s.entity_type === 'product') })) || []),
        ...(categories?.map(c => ({ ...c, type: 'category', seo: seoMeta?.find(s => s.entity_id === c.id && s.entity_type === 'category') })) || [])
      ];

      setEntities(combined);
    } catch (error: any) {
      console.error("Error fetching SEO data:", error);
      toast.error("Failed to load SEO directory");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntities = entities.filter(e => {
    const searchMatch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       e.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = typeFilter === "all" || e.type === typeFilter;
    return searchMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">SEO & Content</h1>
                <p className="text-gray-600 mt-1">Manage metadata, schema markup, and search engine visibility.</p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700 gap-2">
                  <Plus size={18} />
                  Add New Entity
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Globe size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Pages Indexed</p>
                  <p className="text-2xl font-bold">{entities.length}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">SEO Optimized</p>
                  <p className="text-2xl font-bold text-green-600">{entities.filter(e => e.seo).length}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Missing SEO</p>
                  <p className="text-2xl font-bold text-red-600">{entities.filter(e => !e.seo).length}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <Layout size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">H1 Configured</p>
                  <p className="text-2xl font-bold text-purple-600">{entities.filter(e => e.seo?.h1_text).length}</p>
                </div>
              </Card>
            </div>

            <Card className="p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search by name or slug..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 border rounded-lg bg-white">
                  <Filter size={16} className="text-gray-400" />
                  <select
                    className="bg-transparent h-10 text-sm focus:outline-none min-w-[140px]"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="product">Products Only</option>
                    <option value="category">Categories Only</option>
                    <option value="page">Custom Pages</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border-none shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Page / Entity</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">SEO Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Meta Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Sync</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <Loader2 className="mx-auto animate-spin text-green-600 mb-2" size={32} />
                          <p className="text-gray-500 font-medium">Fetching SEO directory...</p>
                        </td>
                      </tr>
                    ) : filteredEntities.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <p className="text-gray-500 text-lg">No entities found.</p>
                          <Button variant="link" onClick={() => {setSearchTerm(""); setTypeFilter("all");}} className="text-green-600">
                            Clear all filters
                          </Button>
                        </td>
                      </tr>
                    ) : (
                      filteredEntities.map((entity) => (
                        <tr key={`${entity.type}-${entity.id}`} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
                                entity.type === 'product' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                              }`}>
                                {entity.type === 'product' ? <Package size={20} /> : <Layout size={20} />}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                                  {entity.name}
                                </p>
                                <p className="text-xs text-gray-500 font-mono">/{entity.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-bold uppercase text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {entity.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {entity.seo ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                <CheckCircle size={12} />
                                Optimized
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                <AlertCircle size={12} />
                                Missing
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 max-w-[200px] truncate">
                            <span className="text-sm text-gray-600">
                              {entity.seo?.title || <span className="text-gray-400 italic">Not set</span>}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {entity.seo?.updated_at ? new Date(entity.seo.updated_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <SEOEditModal
                                seoMeta={entity.seo}
                                entityId={entity.id}
                                entityType={entity.type}
                                entityName={entity.name}
                                onSuccess={fetchEntities}
                              />
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-600" onClick={() => window.open(`/${entity.type === 'product' ? 'products' : 'category'}/${entity.slug}`, '_blank')}>
                                <ExternalLink size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

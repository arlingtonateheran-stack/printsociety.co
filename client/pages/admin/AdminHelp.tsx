import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { supabase, HelpArticle, FAQ, HelpCategory, extractErrorMessage } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Edit2, Trash2, HelpCircle, BookOpen, Layout, ArrowUpDown, Eye } from "lucide-react";
import { HelpCategoryModal } from "./components/HelpCategoryModal";
import { HelpArticleModal } from "./components/HelpArticleModal";
import { FAQModal } from "./components/FAQModal";

export default function AdminHelp() {
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [articles, setArticles] = useState<(HelpArticle & { category?: HelpCategory })[]>([]);
  const [faqs, setFaqs] = useState<(FAQ & { category?: HelpCategory })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHelpData();
  }, []);

  const fetchHelpData = async () => {
    try {
      setIsLoading(true);
      const [categoriesRes, articlesRes, faqsRes] = await Promise.all([
        supabase.from('help_categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('help_articles').select('*, category:help_categories(*)').order('created_at', { ascending: false }),
        supabase.from('help_faqs').select('*, category:help_categories(*)').order('sort_order', { ascending: true })
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (articlesRes.error) throw articlesRes.error;
      if (faqsRes.error) throw faqsRes.error;

      setCategories(categoriesRes.data || []);
      setArticles(articlesRes.data || []);
      setFaqs(faqsRes.data || []);
    } catch (error: any) {
      console.error("Error fetching help data:", error);
      const message = extractErrorMessage(error, "Failed to load help data");

      // Provide helpful context if tables are missing
      if (message.includes("relation") && message.includes("does not exist")) {
        toast.error("Database tables missing. Please ensure HELP_TABLES.sql has been applied.");
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm(`Are you sure you want to delete this ${table.replace('help_', '')}?`)) return;

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Item deleted");
      fetchHelpData();
    } catch (error: any) {
      toast.error(extractErrorMessage(error, "Failed to delete item"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Help Center Management</h1>
              <p className="text-gray-600 mt-1">Manage categories, help articles, and frequently asked questions</p>
            </div>

            <Tabs defaultValue="articles">
              <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>

              {/* Articles Tab */}
              <TabsContent value="articles">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Help Articles</h2>
                  <HelpArticleModal categories={categories} onSuccess={fetchHelpData} />
                </div>
                <Card className="overflow-hidden border-none shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Article</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Views</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 bg-white">
                        {isLoading ? (
                          <tr><td colSpan={5} className="px-6 py-10 text-center"><Loader2 className="animate-spin mx-auto text-green-600" /></td></tr>
                        ) : articles.length === 0 ? (
                          <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">No articles found</td></tr>
                        ) : (
                          articles.map((article) => (
                            <tr key={article.id} className="hover:bg-gray-50 transition-colors group">
                              <td className="px-6 py-4">
                                <p className="font-bold text-gray-900">{article.title}</p>
                                <p className="text-xs text-gray-500">/help/{article.slug}</p>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{article.category?.name || 'Uncategorized'}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{article.views}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                  {article.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <a href={`/help?article=${article.id}`} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600"><Eye size={16} /></Button>
                                  </a>
                                  <HelpArticleModal article={article} categories={categories} onSuccess={fetchHelpData} trigger={<Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600"><Edit2 size={16} /></Button>} />
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => deleteItem('help_articles', article.id)}><Trash2 size={16} /></Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* FAQs Tab */}
              <TabsContent value="faqs">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
                  <FAQModal categories={categories} onSuccess={fetchHelpData} />
                </div>
                <Card className="overflow-hidden border-none shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Question</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sort</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 bg-white">
                        {isLoading ? (
                          <tr><td colSpan={4} className="px-6 py-10 text-center"><Loader2 className="animate-spin mx-auto text-green-600" /></td></tr>
                        ) : faqs.length === 0 ? (
                          <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-500">No FAQs found</td></tr>
                        ) : (
                          faqs.map((faq) => (
                            <tr key={faq.id} className="hover:bg-gray-50 transition-colors group">
                              <td className="px-6 py-4">
                                <p className="font-bold text-gray-900">{faq.question}</p>
                                <p className="text-xs text-gray-500 line-clamp-1">{faq.answer}</p>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{faq.category?.name || 'Uncategorized'}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{faq.sort_order}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <FAQModal faq={faq} categories={categories} onSuccess={fetchHelpData} trigger={<Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600"><Edit2 size={16} /></Button>} />
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => deleteItem('help_faqs', faq.id)}><Trash2 size={16} /></Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Help Categories</h2>
                  <HelpCategoryModal onSuccess={fetchHelpData} />
                </div>
                <Card className="overflow-hidden border-none shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Icon</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sort</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 bg-white">
                        {isLoading ? (
                          <tr><td colSpan={4} className="px-6 py-10 text-center"><Loader2 className="animate-spin mx-auto text-green-600" /></td></tr>
                        ) : categories.length === 0 ? (
                          <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-500">No categories found</td></tr>
                        ) : (
                          categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50 transition-colors group">
                              <td className="px-6 py-4">
                                <p className="font-bold text-gray-900">{category.name}</p>
                                <p className="text-xs text-gray-500">{category.description}</p>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 font-mono">{category.icon}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{category.sort_order}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <HelpCategoryModal category={category} onSuccess={fetchHelpData} trigger={<Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600"><Edit2 size={16} /></Button>} />
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => deleteItem('help_categories', category.id)}><Trash2 size={16} /></Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { supabase, PressItem } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit2, Trash2, Download, FileText, Archive, Image as ImageIcon, ExternalLink, ArrowUpDown } from "lucide-react";
import { PressModal } from "./components/PressModal";

export default function AdminPress() {
  const [assets, setAssets] = useState<PressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('press_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setAssets(data || []);
    } catch (error: any) {
      console.error("Error fetching press assets:", error);
      toast.error("Failed to load press items");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAsset = async (id: string) => {
    if (!confirm("Are you sure you want to delete this press asset?")) return;

    try {
      const { error } = await supabase
        .from('press_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAssets(assets.filter(a => a.id !== id));
      toast.success("Asset deleted");
    } catch (error: any) {
      toast.error("Failed to delete asset");
    }
  };

  const getFileIcon = (type: string | null) => {
    const t = type?.toUpperCase();
    if (t === 'PDF') return <FileText className="text-red-500" size={20} />;
    if (t === 'ZIP' || t === 'RAR') return <Archive className="text-orange-500" size={20} />;
    if (t === 'JPG' || t === 'PNG' || t === 'SVG') return <ImageIcon className="text-blue-500" size={20} />;
    return <Download className="text-gray-400" size={20} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Media Kit Management</h1>
                <p className="text-gray-600 mt-1">Manage files and assets for your media kit</p>
              </div>
              <PressModal onSuccess={fetchAssets} />
            </div>

            <Card className="overflow-hidden border-none shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Asset Info</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sort</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <Loader2 className="h-10 w-10 animate-spin mx-auto text-green-600 mb-4" />
                          <p className="text-gray-500 font-medium">Loading assets...</p>
                        </td>
                      </tr>
                    ) : assets.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                          <p className="text-lg">No media kit assets found.</p>
                          <PressModal onSuccess={fetchAssets} trigger={
                            <Button variant="link" className="text-green-600 font-bold">Add your first asset</Button>
                          } />
                        </td>
                      </tr>
                    ) : (
                      assets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-gray-50 rounded group-hover:bg-white transition">
                                {getFileIcon(asset.file_type)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 leading-tight">{asset.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{asset.description || 'No description'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-gray-700">
                            {asset.file_type || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {asset.file_size || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {asset.sort_order}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a href={asset.file_url} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                                  <ExternalLink size={16} />
                                </Button>
                              </a>
                              <PressModal 
                                asset={asset} 
                                onSuccess={fetchAssets} 
                                trigger={
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                                    <Edit2 size={16} />
                                  </Button>
                                } 
                              />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-600 hover:bg-red-50"
                                onClick={() => deleteAsset(asset.id)}
                              >
                                <Trash2 size={16} />
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

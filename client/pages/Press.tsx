import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase, PressItem } from "@/lib/supabase";
import { Loader2, Download, FileText, Archive, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function Press() {
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
      console.error("Error fetching press items:", error);
      let errorMessage = "An unknown error occurred";
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = error.message || error.details || error.hint || JSON.stringify(error);
        if (errorMessage === "{}" || errorMessage === "[object Object]") {
          errorMessage = "Database error. Check if the press_items table exists and has RLS policies.";
        }
      }
      toast.error(`Error fetching press items: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (type: string | null) => {
    const t = type?.toUpperCase();
    if (t === 'PDF') return <FileText className="text-red-500" size={24} />;
    if (t === 'ZIP' || t === 'RAR') return <Archive className="text-orange-500" size={24} />;
    if (t === 'JPG' || t === 'PNG' || t === 'SVG') return <ImageIcon className="text-blue-500" size={24} />;
    return <Download className="text-gray-400" size={24} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Press & Media Kit</h1>

        <section className="mb-12 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Print Society .co</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Print Society .co is a leading custom printing platform that combines advanced technology with
            traditional craftsmanship. Founded in 2025, we have quickly become the go-to partner for businesses
            and individuals seeking high-quality, custom-printed materials with a focus on stickers, decals,
            and labels.
          </p>
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg">Founded: 2025</div>
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">Headquarters: Austin, TX</div>
            <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg">Sector: Custom Printing & Design</div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Assets</h2>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-gray-100">
              <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-2" />
              <p className="text-gray-500 text-sm">Loading media assets...</p>
            </div>
          ) : assets.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">No media assets currently available for download.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {assets.map((asset) => (
                <a
                  key={asset.id}
                  href={asset.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-green-500 hover:shadow-md transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-green-50 transition">
                      {getFileIcon(asset.file_type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{asset.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                        {asset.file_type} {asset.file_size && `• ${asset.file_size}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-green-600 group-hover:translate-y-0.5 transition">
                      <Download size={20} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Press Contact</h2>
          <div className="p-8 bg-black text-white rounded-2xl shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white shrink-0">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-xl font-bold mb-1">Media Relations Team</p>
                <a href="mailto:press@printsociety.co" className="text-green-400 hover:text-green-300 transition text-lg font-medium">press@printsociety.co</a>
                <p className="text-gray-400 mt-6 text-sm leading-relaxed border-t border-white/10 pt-4">
                  For all press inquiries, interview requests, and media permissions, please include your outlet name, story topic, and deadline in your initial email.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

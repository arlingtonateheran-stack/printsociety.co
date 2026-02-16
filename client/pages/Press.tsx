import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Press() {
  const assets = [
    { title: "Brand Identity Guidelines", type: "PDF", size: "2.4 MB" },
    { title: "High-Res Logo Pack", type: "ZIP", size: "15.8 MB" },
    { title: "Executive Headshots", type: "JPG", size: "45.2 MB" },
    { title: "Product Photography", type: "ZIP", size: "128.5 MB" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Press & Media Kit</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Print Society .co</h2>
          <p className="text-gray-600 mb-6">
            Print Society .co is a leading custom printing platform that combines advanced technology with 
            traditional craftsmanship. Founded in 2025, we have quickly become the go-to partner for businesses 
            and individuals seeking high-quality, custom-printed materials with a focus on stickers, decals, 
            and labels.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Assets</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {assets.map((asset, idx) => (
              <div key={idx} className="p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:bg-gray-50 cursor-pointer transition">
                <div>
                  <h3 className="font-semibold text-gray-900">{asset.title}</h3>
                  <p className="text-xs text-gray-500">{asset.type} • {asset.size}</p>
                </div>
                <button className="text-black font-bold text-sm">Download</button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Press Contact</h2>
          <div className="p-6 bg-black text-white rounded-2xl">
            <p className="font-bold mb-1">Media Relations Team</p>
            <p className="text-gray-400">press@printsociety.co</p>
            <p className="text-gray-400 mt-4 text-sm">For all press inquiries, please include your outlet and deadline.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

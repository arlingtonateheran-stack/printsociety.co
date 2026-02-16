import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-black mb-8">Crafting Quality Since 2025</h1>
          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            <p>
              Welcome to <strong>Print Society .co</strong>, your premier destination for high-quality custom printing. 
              We believe that every brand, artist, and individual deserves to see their vision brought to life with 
              precision and care.
            </p>
            <p>
              Our journey started with a simple mission: to make professional-grade printing accessible to everyone. 
              From die-cut stickers to large-format banners, we use the latest technology and the finest materials 
              to ensure your prints stand out.
            </p>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 my-12">
              <h2 className="text-2xl font-bold text-black mb-4 italic">"Quality is not an act, it is a habit."</h2>
              <p className="text-gray-500">— Our Design Philosophy</p>
            </div>
            <p>
              Based in the heart of the creative community, we are more than just a print shop. We are partners in 
              your creative process. Our online proofing system ensures that you are 100% satisfied with your 
              design before it even hits the press.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

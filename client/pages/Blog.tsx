import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "5 Tips for Perfect Sticker Design",
      excerpt: "Learn how to optimize your artwork for the best printing results...",
      date: "Jan 15, 2025",
      author: "Alex Print",
      category: "Tutorial",
      image: "https://images.unsplash.com/photo-1572375927902-e6090dbb9033?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "The Rise of Vinyl: Why Quality Matters",
      excerpt: "Not all vinyl is created equal. We dive into the science of adhesive materials...",
      date: "Jan 10, 2025",
      author: "Sarah Design",
      category: "Material Science",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      title: "Starting Your Own Sticker Business",
      excerpt: "A comprehensive guide to launching your brand with custom merchandise...",
      date: "Jan 05, 2025",
      author: "Mike Biz",
      category: "Business",
      image: "https://images.unsplash.com/photo-1589118949245-7d40088ad846?w=800&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">The Print Society Blog</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-green-600 font-bold uppercase tracking-wider mb-2">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-gray-500">By {post.author}</span>
                  <Link to="#" className="text-black text-sm font-bold hover:underline">Read More</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

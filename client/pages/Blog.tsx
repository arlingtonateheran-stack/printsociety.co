import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { supabase, BlogPost as BlogPostType } from "@/lib/supabase";
import { Loader2, Calendar, User } from "lucide-react";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">The Print Society Blog</h1>
          <p className="text-gray-600 mt-2 text-lg">Insights, tutorials, and stories from the world of custom printing.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-green-600 mb-4" />
            <p className="text-gray-500 font-medium">Loading articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No blog posts found. Check back later!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col h-full">
                <Link to={`/blog/${post.slug}`} className="block overflow-hidden">
                  <img
                    src={post.image_url || "https://images.unsplash.com/photo-1572375927902-e6090dbb9033?w=800&auto=format&fit=crop&q=60"}
                    alt={post.title}
                    className="w-full h-48 object-cover hover:scale-105 transition duration-300"
                  />
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-green-600 font-bold uppercase tracking-wider mb-2">
                    {post.category && <span>{post.category}</span>}
                    {post.category && <span>•</span>}
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link to={`/blog/${post.slug}`} className="hover:text-green-600 transition">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t mt-auto">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <User size={12} />
                      By {post.author_name || 'Admin'}
                    </span>
                    <Link to={`/blog/${post.slug}`} className="text-black text-sm font-bold hover:underline">Read More</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

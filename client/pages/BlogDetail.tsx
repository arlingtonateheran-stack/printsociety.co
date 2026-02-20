import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase, BlogPost } from "@/lib/supabase";
import { Loader2, ArrowLeft, Calendar, User, Tag } from "lucide-react";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      setPost(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
          <Link to="/blog" className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition">
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      {/* Article Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link to="/blog" className="inline-flex items-center gap-2 text-green-600 font-bold mb-6 hover:text-green-700 transition">
            <ArrowLeft size={18} />
            Back to Articles
          </Link>
          <div className="flex items-center gap-3 text-sm text-green-600 font-bold uppercase tracking-wider mb-4">
            {post.category && <span>{post.category}</span>}
            {post.category && <span>•</span>}
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.published_at).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 border-t pt-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{post.author_name || 'Admin'}</p>
              <p className="text-xs text-gray-500">Staff Writer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.image_url && (
        <div className="max-w-5xl mx-auto px-4 -mt-10 mb-12">
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="w-full h-[400px] md:h-[500px] object-cover rounded-3xl shadow-2xl border-4 border-white" 
          />
        </div>
      )}

      {/* Article Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full prose prose-green prose-lg lg:prose-xl">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-serif">
          {post.content}
        </div>
      </main>

      <Footer />
    </div>
  );
}

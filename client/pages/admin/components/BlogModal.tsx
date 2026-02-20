import React, { useState, useEffect } from "react";
import { Plus, Loader2, Save, X, Globe, FileText, Layout, User, Tag, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase, BlogPost } from "@/lib/supabase";
import { toast } from "sonner";

interface BlogModalProps {
  post?: BlogPost;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function BlogModal({ post, onSuccess, trigger }: BlogModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    author_name: "",
    category: "",
    image_url: "",
    status: "published",
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        slug: post.slug || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        author_name: post.author_name || "",
        category: post.category || "",
        image_url: post.image_url || "",
        status: post.status || "published",
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        author_name: "",
        category: "",
        image_url: "",
        status: "published",
      });
    }
  }, [post, isOpen]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: post ? prev.slug : generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Title, Slug, and Content are required");
      return;
    }

    try {
      setIsSaving(true);
      
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim().toLowerCase(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim(),
        author_name: formData.author_name.trim(),
        category: formData.category.trim(),
        image_url: formData.image_url.trim(),
        status: formData.status,
        published_at: post?.published_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (post?.id) {
        const { error } = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", post.id);
        if (error) throw error;
        toast.success("Post updated successfully");
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert([payload]);
        if (error) throw error;
        toast.success("Post created successfully");
      }

      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error saving blog post:", error);
      toast.error(error.message || "Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-green-600 hover:bg-green-700">
            <Plus size={18} />
            New Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{post ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
            <DialogDescription>
              Write and publish an article for your blog. Slug is generated automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Post Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="How to Design Perfect Stickers"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug / URL *</Label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">/blog/</span>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="how-to-design-perfect-stickers"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="author">Author Name</Label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="author"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="Alex Print"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <div className="relative">
                  <Tag size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Tutorial"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Featured Image URL</Label>
              <div className="relative">
                <ImageIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                <Input
                  id="image"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Publishing Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-gray-400" />
                    <SelectValue placeholder="Select status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="excerpt">Excerpt / Summary</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A brief summary for the blog listing page..."
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Post Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog post content here..."
                rows={10}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="animate-spin mr-2" size={18} />
              ) : (
                <Save className="mr-2" size={18} />
              )}
              {post ? "Update Article" : "Publish Article"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

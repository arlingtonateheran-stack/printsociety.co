import React, { useState, useEffect } from "react";
import { Plus, Loader2, Save, Globe, User, Tag, Image as ImageIcon, Layout, BookOpen } from "lucide-react";
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
import { supabase, HelpArticle, HelpCategory } from "@/lib/supabase";
import { toast } from "sonner";

interface HelpArticleModalProps {
  article?: HelpArticle;
  categories: HelpCategory[];
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function HelpArticleModal({ article, categories, onSuccess, trigger }: HelpArticleModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category_id: "",
    content: "",
    excerpt: "",
    author: "",
    image_url: "",
    status: "published",
    tags: "",
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        slug: article.slug || "",
        category_id: article.category_id || "",
        content: article.content || "",
        excerpt: article.excerpt || "",
        author: article.author || "",
        image_url: article.image_url || "",
        status: article.status || "published",
        tags: (article.tags || []).join(", "),
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        category_id: categories[0]?.id || "",
        content: "",
        excerpt: "",
        author: "Support Team",
        image_url: "",
        status: "published",
        tags: "",
      });
    }
  }, [article, categories, isOpen]);

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
      slug: article ? prev.slug : generateSlug(title)
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
        category_id: formData.category_id || null,
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim(),
        author: formData.author.trim(),
        image_url: formData.image_url.trim(),
        status: formData.status,
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
        updated_at: new Date().toISOString(),
      };

      if (article?.id) {
        const { error } = await supabase
          .from("help_articles")
          .update(payload)
          .eq("id", article.id);
        if (error) throw error;
        toast.success("Article updated successfully");
      } else {
        const { error } = await supabase
          .from("help_articles")
          .insert([payload]);
        if (error) throw error;
        toast.success("Article created successfully");
      }

      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error saving help article:", error);
      toast.error(error.message || "Failed to save article");
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
            New Article
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{article ? "Edit Help Article" : "Create New Help Article"}</DialogTitle>
            <DialogDescription>
              Write a detailed help article for your customers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Article Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="How to Prepare Your Artwork"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug / URL *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">/help/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="how-to-prepare-artwork"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(val) => setFormData({ ...formData, category_id: val })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="author">Author</Label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Support Team"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger id="status">
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Image URL (Optional)</Label>
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
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <div className="relative">
                <Tag size={16} className="absolute left-3 top-3 text-gray-400" />
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="artwork, dpi, setup"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="excerpt">Excerpt / Summary</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A brief summary for the article card..."
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Article Content * (Supports basic formatting)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your help article here. Use # for headings."
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
              {article ? "Update Article" : "Publish Article"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

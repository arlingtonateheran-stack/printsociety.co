import React, { useState, useEffect } from "react";
import { Save, Loader2, Globe, Search, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface SEOEditModalProps {
  seoMeta?: any;
  entityId: string;
  entityType: 'product' | 'category' | 'article' | 'collection' | 'page';
  entityName: string;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function SEOEditModal({ seoMeta, entityId, entityType, entityName, onSuccess, trigger }: SEOEditModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    keywords: "",
    og_title: "",
    og_description: "",
    og_image: "",
    canonical_url: "",
    h1_text: "",
    noindex: false,
    nofollow: false,
  });

  useEffect(() => {
    if (seoMeta) {
      setFormData({
        title: seoMeta.title || "",
        description: seoMeta.description || "",
        slug: seoMeta.slug || "",
        keywords: seoMeta.keywords?.join(", ") || "",
        og_title: seoMeta.og_title || "",
        og_description: seoMeta.og_description || "",
        og_image: seoMeta.og_image || "",
        canonical_url: seoMeta.canonical_url || "",
        h1_text: seoMeta.h1_text || "",
        noindex: seoMeta.noindex || false,
        nofollow: seoMeta.nofollow || false,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        slug: "",
        keywords: "",
        og_title: "",
        og_description: "",
        og_image: "",
        canonical_url: "",
        h1_text: "",
        noindex: false,
        nofollow: false,
      });
    }
  }, [seoMeta, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      toast.error("Title and Slug are required");
      return;
    }

    try {
      setIsSaving(true);
      
      const payload = {
        entity_id: entityId,
        entity_type: entityType,
        title: formData.title,
        description: formData.description,
        slug: formData.slug.toLowerCase().trim().replace(/\s+/g, '-'),
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
        og_title: formData.og_title || formData.title,
        og_description: formData.og_description || formData.description,
        og_image: formData.og_image,
        canonical_url: formData.canonical_url,
        h1_text: formData.h1_text,
        noindex: formData.noindex,
        nofollow: formData.nofollow,
        updated_at: new Date().toISOString(),
      };

      if (seoMeta?.id) {
        const { error } = await supabase
          .from("seo_meta")
          .update(payload)
          .eq("id", seoMeta.id);
        if (error) throw error;
        toast.success("SEO Metadata updated");
      } else {
        const { error } = await supabase
          .from("seo_meta")
          .insert([payload]);
        if (error) throw error;
        toast.success("SEO Metadata created");
      }

      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error saving SEO:", error);
      toast.error(error.message || "Failed to save SEO metadata");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Globe size={14} />
            Edit SEO
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>SEO Settings: {entityName}</DialogTitle>
            <DialogDescription>
              Optimize how this {entityType} appears in search engines and social media.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-6">
            {/* Search Preview */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="text-[14px] text-[#1a0dab] font-medium truncate mb-1">
                {formData.title || "Page Title Preview"}
              </p>
              <p className="text-[12px] text-[#006621] truncate mb-1">
                https://printsociety.co/{formData.slug || "page-slug"}
              </p>
              <p className="text-[13px] text-[#545454] line-clamp-2">
                {formData.description || "Enter a meta description to see how it will appear in Google search results."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Meta Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="50-60 characters recommended"
                  required
                />
                <p className="text-[10px] text-gray-500">{formData.title.length} characters</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="product-name-slug"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Meta Description</Label>
              <textarea
                id="description"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[80px] text-sm"
                placeholder="150-160 characters recommended"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <p className="text-[10px] text-gray-500">{formData.description.length} characters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="h1">H1 Header Text</Label>
                <Input
                  id="h1"
                  value={formData.h1_text}
                  onChange={(e) => setFormData({ ...formData, h1_text: e.target.value })}
                  placeholder="Main page title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keywords">Keywords (Comma separated)</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="custom stickers, labels, printing"
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <ImageIcon size={16} />
                Social Media (Open Graph)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="og_title">OG Title</Label>
                  <Input
                    id="og_title"
                    value={formData.og_title}
                    onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                    placeholder="Social media title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="og_image">OG Image URL</Label>
                  <Input
                    id="og_image"
                    value={formData.og_image}
                    onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h4 className="font-bold text-sm">Indexing & Advanced</h4>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.noindex}
                    onChange={(e) => setFormData({ ...formData, noindex: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Noindex (Hide from search)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.nofollow}
                    onChange={(e) => setFormData({ ...formData, nofollow: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Nofollow (Don't follow links)</span>
                </label>
              </div>
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
              Save SEO Settings
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

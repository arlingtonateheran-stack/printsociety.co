import React, { useState, useEffect } from "react";
import { Plus, Loader2, Save, Tag, Layout, ArrowUpDown, HelpCircle } from "lucide-react";
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
import { supabase, HelpCategory } from "@/lib/supabase";
import { toast } from "sonner";

interface HelpCategoryModalProps {
  category?: HelpCategory;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function HelpCategoryModal({ category, onSuccess, trigger }: HelpCategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "HelpCircle",
    sort_order: 0,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        icon: category.icon || "HelpCircle",
        sort_order: category.sort_order || 0,
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        icon: "HelpCircle",
        sort_order: 0,
      });
    }
  }, [category, isOpen]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: category ? prev.slug : generateSlug(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      toast.error("Name and Slug are required");
      return;
    }

    try {
      setIsSaving(true);
      
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim().toLowerCase(),
        description: formData.description.trim(),
        icon: formData.icon.trim(),
        sort_order: parseInt(formData.sort_order.toString()),
        updated_at: new Date().toISOString(),
      };

      if (category?.id) {
        const { error } = await supabase
          .from("help_categories")
          .update(payload)
          .eq("id", category.id);
        if (error) throw error;
        toast.success("Category updated successfully");
      } else {
        const { error } = await supabase
          .from("help_categories")
          .insert([payload]);
        if (error) throw error;
        toast.success("Category created successfully");
      }

      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error saving help category:", error);
      toast.error(error.message || "Failed to save category");
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
            New Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{category ? "Edit Help Category" : "Create New Category"}</DialogTitle>
            <DialogDescription>
              Create a category to group help articles and FAQs.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Getting Started"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug / URL *</Label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">/help/category/</span>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="getting-started"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon Name (Lucide)</Label>
                <div className="relative">
                  <Layout size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="BookOpen"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sort">Sort Order</Label>
                <div className="relative">
                  <ArrowUpDown size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="sort"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value || "0") })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description of this category..."
                rows={3}
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
              {category ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

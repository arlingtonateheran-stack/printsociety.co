import React, { useState, useEffect } from "react";
import { Plus, Loader2, Save, X, FileText, Layout, User, Tag, Image as ImageIcon, Link as LinkIcon, Download, Archive, ArrowUpDown } from "lucide-react";
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
import { supabase, PressItem } from "@/lib/supabase";
import { toast } from "sonner";

interface PressModalProps {
  asset?: PressItem;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function PressModal({ asset, onSuccess, trigger }: PressModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_url: "",
    file_type: "PDF",
    file_size: "",
    category: "general",
    sort_order: 0,
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        title: asset.title || "",
        description: asset.description || "",
        file_url: asset.file_url || "",
        file_type: asset.file_type || "PDF",
        file_size: asset.file_size || "",
        category: asset.category || "general",
        sort_order: asset.sort_order || 0,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        file_url: "",
        file_type: "PDF",
        file_size: "",
        category: "general",
        sort_order: 0,
      });
    }
  }, [asset, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.file_url) {
      toast.error("Title and File URL are required");
      return;
    }

    try {
      setIsSaving(true);
      
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        file_url: formData.file_url.trim(),
        file_type: formData.file_type.trim().toUpperCase(),
        file_size: formData.file_size.trim(),
        category: formData.category.trim(),
        sort_order: parseInt(formData.sort_order.toString()),
        updated_at: new Date().toISOString(),
      };

      if (asset?.id) {
        const { error } = await supabase
          .from("press_items")
          .update(payload)
          .eq("id", asset.id);
        if (error) throw error;
        toast.success("Media asset updated successfully");
      } else {
        const { error } = await supabase
          .from("press_items")
          .insert([payload]);
        if (error) throw error;
        toast.success("Media asset created successfully");
      }

      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error saving press asset:", error);
      toast.error(error.message || "Failed to save asset");
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
            New Asset
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{asset ? "Edit Media Asset" : "Add New Media Asset"}</DialogTitle>
            <DialogDescription>
              Add a new file, logo, or image to the Press & Media kit page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Asset Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="High-Res Logo Pack"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="url">File / Download URL *</Label>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                <Input
                  id="url"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="https://storage.googleapis.com/..."
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">File Type (e.g. PDF, ZIP)</Label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="type"
                    value={formData.file_type}
                    onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                    placeholder="PDF"
                    className="pl-10 uppercase font-mono"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="size">File Size (e.g. 2.4 MB)</Label>
                <div className="relative">
                  <Archive size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="size"
                    value={formData.file_size}
                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                    placeholder="2.4 MB"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <div className="relative">
                  <Tag size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="General"
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
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A brief description of this media asset..."
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
              {asset ? "Update Asset" : "Add Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

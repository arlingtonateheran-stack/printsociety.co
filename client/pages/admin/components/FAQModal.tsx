import React, { useState, useEffect } from "react";
import { Plus, Loader2, Save, HelpCircle, ArrowUpDown } from "lucide-react";
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
import { supabase, FAQ, HelpCategory } from "@/lib/supabase";
import { toast } from "sonner";

interface FAQModalProps {
  faq?: FAQ;
  categories: HelpCategory[];
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function FAQModal({ faq, categories, onSuccess, trigger }: FAQModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category_id: "",
    sort_order: 0,
  });

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question || "",
        answer: faq.answer || "",
        category_id: faq.category_id || "",
        sort_order: faq.sort_order || 0,
      });
    } else {
      setFormData({
        question: "",
        answer: "",
        category_id: categories[0]?.id || "",
        sort_order: 0,
      });
    }
  }, [faq, categories, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      toast.error("Question and Answer are required");
      return;
    }

    try {
      setIsSaving(true);
      
      const payload = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        category_id: formData.category_id || null,
        sort_order: parseInt(formData.sort_order.toString()),
        updated_at: new Date().toISOString(),
      };

      if (faq?.id) {
        const { error } = await supabase
          .from("help_faqs")
          .update(payload)
          .eq("id", faq.id);
        if (error) throw error;
        toast.success("FAQ updated successfully");
      } else {
        const { error } = await supabase
          .from("help_faqs")
          .insert([payload]);
        if (error) throw error;
        toast.success("FAQ created successfully");
      }

      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error saving FAQ:", error);
      toast.error(error.message || "Failed to save FAQ");
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
            New FAQ
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{faq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
            <DialogDescription>
              Add a quick question and answer for the FAQ section.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="How long does production take?"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="answer">Answer *</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Standard production takes 3-5 business days..."
                rows={5}
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
              {faq ? "Update FAQ" : "Add FAQ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

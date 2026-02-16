import { useState } from "react";
import { TicketCategory, TicketPriority } from "@shared/support";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import { sendEmail, EMAIL_TEMPLATES } from "@/utils/email";

interface ContactFormProps {
  onSubmit?: (formData: {
    name: string;
    email: string;
    subject: string;
    category: TicketCategory;
    priority: TicketPriority;
    message: string;
    orderNumber?: string;
  }) => void;
  relatedOrderId?: string;
}

export function ContactForm({ onSubmit, relatedOrderId }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "other" as TicketCategory,
    priority: "medium" as TicketPriority,
    message: "",
    orderNumber: relatedOrderId || "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories: { value: TicketCategory; label: string; description: string }[] = [
    { value: "artwork", label: "Artwork", description: "Questions about file formats, DPI, colors" },
    { value: "order", label: "Order", description: "General order questions" },
    { value: "proof", label: "Proof", description: "Issues with proof review or approval" },
    { value: "shipping", label: "Shipping", description: "Tracking and delivery questions" },
    { value: "billing", label: "Billing", description: "Payment and invoice issues" },
    { value: "product", label: "Product", description: "Questions about our products" },
    { value: "other", label: "Other", description: "Anything else" },
  ];

  const priorities: { value: TicketPriority; label: string; description: string }[] = [
    { value: "low", label: "Low", description: "General inquiry" },
    { value: "medium", label: "Medium", description: "Standard support" },
    { value: "high", label: "High", description: "Urgent issue" },
    { value: "urgent", label: "Urgent", description: "Critical problem" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Send notification email to support team
      const supportTemplate = EMAIL_TEMPLATES.supportTicket(
        formData.name,
        formData.subject,
        formData.category,
        formData.message,
        false
      );

      await sendEmail({
        to: "support@printsociety.co",
        subject: supportTemplate.subject,
        html: supportTemplate.html
      });

      // Send confirmation email to customer
      const customerTemplate = EMAIL_TEMPLATES.supportTicket(
        formData.name,
        formData.subject,
        formData.category,
        formData.message,
        true
      );

      await sendEmail({
        to: formData.email,
        subject: customerTemplate.subject,
        html: customerTemplate.html
      });

      onSubmit?.(formData);
      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "other",
          priority: "medium",
          message: "",
          orderNumber: "",
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to submit ticket:", error);
      setErrors({ form: "Failed to send message. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (submitted) {
    return (
      <Card className="p-8 text-center bg-green-50 border border-green-200">
        <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
        <h3 className="text-2xl font-bold text-green-900 mb-2">
          Thank You!
        </h3>
        <p className="text-green-700 mb-2">
          Your support ticket has been created successfully.
        </p>
        <p className="text-green-600 text-sm">
          We'll get back to you within 24 hours at {formData.email}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-2">Create Support Ticket</h2>
      <p className="text-gray-600 mb-6">
        Tell us about your issue and we'll get back to you as soon as possible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="John Doe"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john@example.com"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.email}
            </p>
          )}
        </div>

        {/* Order Number (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Related Order Number (Optional)
          </label>
          <Input
            value={formData.orderNumber}
            onChange={(e) => handleChange("orderNumber", e.target.value)}
            placeholder="ORD-2025-001"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                handleChange("category", e.target.value as TicketCategory)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority *
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                handleChange("priority", e.target.value as TicketPriority)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {priorities.map((pri) => (
                <option key={pri.value} value={pri.value}>
                  {pri.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject *
          </label>
          <Input
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            placeholder="Brief description of your issue"
            className={errors.subject ? "border-red-500" : ""}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder="Please describe your issue in detail..."
            rows={6}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.message.length}/500 characters
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader size={18} className="animate-spin" />}
          {isSubmitting ? "Sending..." : "Create Support Ticket"}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          * Required fields. We typically respond within 24 hours.
        </p>
      </form>
    </Card>
  );
}

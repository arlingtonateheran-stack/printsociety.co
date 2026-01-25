import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PriceCalculator from "@/components/admin/PriceCalculator";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2, ChevronDown, GripVertical, Upload, X } from "lucide-react";

type PriceBlockType = "fixed" | "matrix" | "formula";

interface PriceBlock {
  id: string;
  label: string;
  type: PriceBlockType;
  appliesWhen?: string[];
  value: number | Record<string, any>;
}

interface OptionValue {
  id: string;
  name: string;
  priceModifier: number;
  swatchImage?: string;
}

interface ProductOption {
  id: string;
  name: string;
  type: "select" | "checkbox" | "dimension" | "radio";
  required: boolean;
  priceBehavior: "add" | "override" | "multiply";
  defaultValue?: string;
  values: OptionValue[];
  priceBlocks?: PriceBlock[];
  isExpanded?: boolean;
}

interface SizeOption {
  id: string;
  width: number;
  height: number;
  pricePerSqIn: number;
}

interface MaterialOption {
  id: string;
  name: string;
  pricePerSqIn?: number;
}

interface FinishOption {
  id: string;
  name: string;
  priceBlocks: PriceBlock[];
}

interface QuantityTier {
  id: string;
  min: number;
  max?: number;
  pricePerUnit: number;
}

interface ProductVariant {
  id: string;
  name: string;
  replacesPricingBlocks: boolean;
  pricingBlocks: PriceBlock[];
}

interface DesignUploadSettings {
  enabled: boolean;
  description: string;
  maxFileSizeMB: number;
  allowedFormats: {
    png: boolean;
    jpg: boolean;
    jpeg: boolean;
    gif: boolean;
    svg: boolean;
  };
}

interface ConditionLogic {
  type: "all" | "any";
  description?: string;
}

interface QuantitySettings {
  showSelectionPanel: boolean;
  fixedQuantity?: number | null;
}

interface ProductData {
  name: string;
  slug: string;
  category: string;
  sku: string;
  description: string;
  status: "active" | "inactive" | "discontinued";
  pricingBlocks: PriceBlock[];
  options: ProductOption[];
  sizeOptions: SizeOption[];
  materialOptions: MaterialOption[];
  finishOptions: FinishOption[];
  quantityTiers: QuantityTier[];
  rushOptions: ProductOption[];
  variants: ProductVariant[];
  designUploadSettings: DesignUploadSettings;
  conditionLogic: ConditionLogic;
  quantitySettings: QuantitySettings;
}

export default function AdminProductForm() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditing = Boolean(productId);

  const [activeTab, setActiveTab] = useState<"basic" | "pricing" | "options" | "variants">("basic");

  const [product, setProduct] = useState<ProductData>({
    name: "",
    slug: "",
    category: "",
    sku: "",
    description: "",
    status: "active",
    pricingBlocks: [],
    options: [],
    sizeOptions: [],
    materialOptions: [
      {
        id: "mat-1",
        name: "Standard Vinyl",
        pricePerSqIn: 0.12,
      },
    ],
    finishOptions: [],
    quantityTiers: [
      { id: "qty-1", min: 1, max: 100, pricePerUnit: 0.20 },
      { id: "qty-2", min: 101, max: 250, pricePerUnit: 0.14 },
      { id: "qty-3", min: 251, max: 1000, pricePerUnit: 0.09 },
    ],
    rushOptions: [],
    variants: [],
    designUploadSettings: {
      enabled: true,
      description: "Upload your custom sticker design",
      maxFileSizeMB: 5,
      allowedFormats: {
        png: true,
        jpg: true,
        jpeg: true,
        gif: true,
        svg: false,
      },
    },
    conditionLogic: {
      type: "all",
      description: "All conditions must be met",
    },
    quantitySettings: {
      showSelectionPanel: false,
      fixedQuantity: null,
    },
  });

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addPriceBlock = () => {
    const newBlock: PriceBlock = {
      id: `block-${Date.now()}`,
      label: "New Price Block",
      type: "fixed",
      value: 0,
    };
    setProduct((prev) => ({
      ...prev,
      pricingBlocks: [...prev.pricingBlocks, newBlock],
    }));
  };

  const removePriceBlock = (blockId: string) => {
    setProduct((prev) => ({
      ...prev,
      pricingBlocks: prev.pricingBlocks.filter((b) => b.id !== blockId),
    }));
  };

  const updatePriceBlock = (blockId: string, field: string, value: any) => {
    setProduct((prev) => ({
      ...prev,
      pricingBlocks: prev.pricingBlocks.map((b) =>
        b.id === blockId ? { ...b, [field]: value } : b
      ),
    }));
  };

  const addMaterial = () => {
    const newMaterial: MaterialOption = {
      id: `mat-${Date.now()}`,
      name: "New Material",
      pricePerSqIn: 0.12,
    };
    setProduct((prev) => ({
      ...prev,
      materialOptions: [...prev.materialOptions, newMaterial],
    }));
  };

  const removeMaterial = (matId: string) => {
    setProduct((prev) => ({
      ...prev,
      materialOptions: prev.materialOptions.filter((m) => m.id !== matId),
    }));
  };

  const updateMaterial = (matId: string, field: string, value: any) => {
    setProduct((prev) => ({
      ...prev,
      materialOptions: prev.materialOptions.map((m) =>
        m.id === matId ? { ...m, [field]: value } : m
      ),
    }));
  };

  const addQuantityTier = () => {
    const newTier: QuantityTier = {
      id: `qty-${Date.now()}`,
      min: 1,
      max: 100,
      pricePerUnit: 0.15,
    };
    setProduct((prev) => ({
      ...prev,
      quantityTiers: [...prev.quantityTiers, newTier],
    }));
  };

  const removeQuantityTier = (tierId: string) => {
    setProduct((prev) => ({
      ...prev,
      quantityTiers: prev.quantityTiers.filter((t) => t.id !== tierId),
    }));
  };

  const updateQuantityTier = (tierId: string, field: string, value: any) => {
    setProduct((prev) => ({
      ...prev,
      quantityTiers: prev.quantityTiers.map((t) =>
        t.id === tierId ? { ...t, [field]: value } : t
      ),
    }));
  };

  const addOption = () => {
    const newOption: ProductOption = {
      id: `opt-${Date.now()}`,
      name: "New Option",
      type: "select",
      required: false,
      priceBehavior: "add",
      defaultValue: "",
      values: [],
      isExpanded: true,
    };
    setProduct((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
  };

  const removeOption = (optionId: string) => {
    setProduct((prev) => ({
      ...prev,
      options: prev.options.filter((o) => o.id !== optionId),
    }));
  };

  const updateOption = (optionId: string, field: string, value: any) => {
    setProduct((prev) => ({
      ...prev,
      options: prev.options.map((o) =>
        o.id === optionId ? { ...o, [field]: value } : o
      ),
    }));
  };

  const toggleOptionExpanded = (optionId: string) => {
    setProduct((prev) => ({
      ...prev,
      options: prev.options.map((o) =>
        o.id === optionId ? { ...o, isExpanded: !o.isExpanded } : o
      ),
    }));
  };

  const addOptionValue = (optionId: string) => {
    const newValue: OptionValue = {
      id: `val-${Date.now()}`,
      name: "",
      priceModifier: 0,
    };
    setProduct((prev) => ({
      ...prev,
      options: prev.options.map((o) =>
        o.id === optionId ? { ...o, values: [...o.values, newValue] } : o
      ),
    }));
  };

  const removeOptionValue = (optionId: string, valueId: string) => {
    setProduct((prev) => ({
      ...prev,
      options: prev.options.map((o) =>
        o.id === optionId
          ? { ...o, values: o.values.filter((v) => v.id !== valueId) }
          : o
      ),
    }));
  };

  const updateOptionValue = (optionId: string, valueId: string, field: string, value: any) => {
    setProduct((prev) => ({
      ...prev,
      options: prev.options.map((o) =>
        o.id === optionId
          ? {
              ...o,
              values: o.values.map((v) =>
                v.id === valueId ? { ...v, [field]: value } : v
              ),
            }
          : o
      ),
    }));
  };

  const updateDesignUploadSettings = (field: string, value: any) => {
    setProduct((prev) => ({
      ...prev,
      designUploadSettings: {
        ...prev.designUploadSettings,
        [field]: value,
      },
    }));
  };

  const updateDesignUploadFormat = (format: keyof DesignUploadSettings["allowedFormats"], enabled: boolean) => {
    setProduct((prev) => ({
      ...prev,
      designUploadSettings: {
        ...prev.designUploadSettings,
        allowedFormats: {
          ...prev.designUploadSettings.allowedFormats,
          [format]: enabled,
        },
      },
    }));
  };

  const updateConditionLogic = (type: "all" | "any") => {
    setProduct((prev) => ({
      ...prev,
      conditionLogic: {
        type,
        description: type === "all" ? "All conditions must be met" : "Any condition can be met",
      },
    }));
  };

  const updateQuantitySettings = (field: string, value: any) => {
    setProduct((prev) => ({
      ...prev,
      quantitySettings: {
        ...prev.quantitySettings,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting advanced product:", product);
    // TODO: Connect to API
    navigate("/admin/products");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Back Button */}
            <button
              onClick={() => navigate("/admin/products")}
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
            >
              <ArrowLeft size={18} />
              Back to Products
            </button>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h1>
              <p className="text-gray-600 mt-1">
                Advanced Pricing Engine · Block-Based Cost Calculation
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b">
              {(["basic", "pricing", "options", "variants"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium border-b-2 transition ${
                    activeTab === tab
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* BASIC TAB */}
              {activeTab === "basic" && (
                <>
                  <Card className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Product Name *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={product.name}
                          onChange={handleBasicChange}
                          placeholder="e.g., Die-Cut Vinyl Stickers"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Slug *
                        </label>
                        <Input
                          type="text"
                          name="slug"
                          value={product.slug}
                          onChange={handleBasicChange}
                          placeholder="die-cut-vinyl-stickers"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Category *
                          </label>
                          <Input
                            type="text"
                            name="category"
                            value={product.category}
                            onChange={handleBasicChange}
                            placeholder="e.g., Stickers"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            SKU *
                          </label>
                          <Input
                            type="text"
                            name="sku"
                            value={product.sku}
                            onChange={handleBasicChange}
                            placeholder="e.g., DCV-001"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={product.description}
                          onChange={handleBasicChange}
                          placeholder="Product description..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Status *
                        </label>
                        <select
                          name="status"
                          value={product.status}
                          onChange={handleBasicChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="discontinued">Discontinued</option>
                        </select>
                      </div>
                    </div>
                  </Card>

                  {/* Condition Logic Section */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-green-100 border border-green-300 rounded-lg p-2">
                        <Plus size={20} className="text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Condition Logic</h2>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logic Type
                      </label>
                      <select
                        value={product.conditionLogic.type}
                        onChange={(e) => updateConditionLogic(e.target.value as "all" | "any")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="all">All conditions must be met</option>
                        <option value="any">Any condition can be met</option>
                      </select>
                      <p className="text-sm text-gray-600 mt-2">
                        Define how conditions interact with this product's options
                      </p>
                    </div>
                  </div>

                  {/* Quantity Settings Section */}
                  <div className="border-t border-gray-200 bg-white bg-opacity-5 pt-6 space-y-6">
                    {/* Show Quantity Selection Panel */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium text-gray-700">
                          Show Quantity Selection Panel
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantitySettings(
                              "showSelectionPanel",
                              !product.quantitySettings.showSelectionPanel
                            )
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            product.quantitySettings.showSelectionPanel
                              ? "bg-slate-400"
                              : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                              product.quantitySettings.showSelectionPanel
                                ? "translate-x-5"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Allow customers to select quantity tiers on the product page
                      </p>
                    </div>

                    {/* Fixed Quantity (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fixed Quantity (Optional)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={product.quantitySettings.fixedQuantity || ""}
                        onChange={(e) =>
                          updateQuantitySettings(
                            "fixedQuantity",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        placeholder="e.g., 100"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        If set, customers will order this fixed quantity
                      </p>
                    </div>
                  </div>

                  {/* Design Upload Settings */}
                  <Card className="p-6 border-t-2 border-t-gray-200">
                    <div className="space-y-6">
                      {/* Enable Toggle */}
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            updateDesignUploadSettings(
                              "enabled",
                              !product.designUploadSettings.enabled
                            )
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            product.designUploadSettings.enabled
                              ? "bg-slate-900"
                              : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                              product.designUploadSettings.enabled
                                ? "translate-x-5"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                        <label className="text-sm font-medium text-gray-700">
                          Enable customer design uploads
                        </label>
                      </div>

                      {product.designUploadSettings.enabled && (
                        <>
                          {/* Upload Description */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Upload Description
                            </label>
                            <Input
                              type="text"
                              value={product.designUploadSettings.description}
                              onChange={(e) =>
                                updateDesignUploadSettings("description", e.target.value)
                              }
                              placeholder="e.g., Upload your custom sticker design"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              This text will appear on the product page
                            </p>
                          </div>

                          {/* Max File Size */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Max File Size (MB)
                            </label>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              value={product.designUploadSettings.maxFileSizeMB}
                              onChange={(e) =>
                                updateDesignUploadSettings(
                                  "maxFileSizeMB",
                                  parseInt(e.target.value)
                                )
                              }
                            />
                          </div>

                          {/* Allowed File Formats */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Allowed File Formats
                            </label>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                              {(
                                ["png", "jpg", "jpeg", "gif", "svg"] as const
                              ).map((format) => (
                                <label
                                  key={format}
                                  className="flex items-center gap-3 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      product.designUploadSettings.allowedFormats[format]
                                    }
                                    onChange={(e) =>
                                      updateDesignUploadFormat(format, e.target.checked)
                                    }
                                    className="w-4 h-4 rounded"
                                  />
                                  <span className="text-sm font-medium text-gray-700 uppercase">
                                    {format}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                </>
              )}

              {/* PRICING TAB */}
              {activeTab === "pricing" && (
                <>
                  {/* Price Blocks */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">Price Blocks</h2>
                      <button
                        type="button"
                        onClick={addPriceBlock}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        <Plus size={16} />
                        Add Block
                      </button>
                    </div>

                    <div className="space-y-3">
                      {product.pricingBlocks.length === 0 ? (
                        <p className="text-gray-500 text-sm py-4">No price blocks yet. Add one to start.</p>
                      ) : (
                        product.pricingBlocks.map((block) => (
                          <div key={block.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-3">
                                <Input
                                  type="text"
                                  value={block.label}
                                  onChange={(e) => updatePriceBlock(block.id, "label", e.target.value)}
                                  placeholder="Block label (e.g., Rush Fee)"
                                  className="text-sm"
                                />
                                <select
                                  value={block.type}
                                  onChange={(e) => updatePriceBlock(block.id, "type", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                >
                                  <option value="fixed">Fixed ($)</option>
                                  <option value="matrix">Matrix (tiered)</option>
                                  <option value="formula">Formula (custom math)</option>
                                </select>

                                {block.type === "fixed" && (
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={block.value as number}
                                    onChange={(e) => updatePriceBlock(block.id, "value", parseFloat(e.target.value))}
                                    placeholder="$0.00"
                                  />
                                )}

                                {block.type === "matrix" && (
                                  <Input
                                    type="text"
                                    value={typeof block.value === "string" ? block.value : JSON.stringify(block.value)}
                                    onChange={(e) => {
                                      try {
                                        updatePriceBlock(block.id, "value", JSON.parse(e.target.value));
                                      } catch {
                                        updatePriceBlock(block.id, "value", e.target.value);
                                      }
                                    }}
                                    placeholder='{"1-100": 0.12, "101-500": 0.09}'
                                    className="text-sm font-mono"
                                  />
                                )}

                                {block.type === "formula" && (
                                  <Input
                                    type="text"
                                    value={block.value as string}
                                    onChange={(e) => updatePriceBlock(block.id, "value", e.target.value)}
                                    placeholder="width * height * rate * qty"
                                    className="text-sm font-mono"
                                  />
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removePriceBlock(block.id)}
                                className="ml-3 text-red-600 hover:text-red-700 p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>

                  {/* Material Options */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">Materials</h2>
                      <button
                        type="button"
                        onClick={addMaterial}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        <Plus size={16} />
                        Add Material
                      </button>
                    </div>

                    <div className="space-y-3">
                      {product.materialOptions.map((material) => (
                        <div key={material.id} className="border rounded-lg p-4 flex items-end gap-3">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                            <Input
                              type="text"
                              value={material.name}
                              onChange={(e) => updateMaterial(material.id, "name", e.target.value)}
                              placeholder="Material name"
                              className="text-sm"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Price per Sq In</label>
                            <Input
                              type="number"
                              step="0.01"
                              value={material.pricePerSqIn || ""}
                              onChange={(e) => updateMaterial(material.id, "pricePerSqIn", parseFloat(e.target.value))}
                              placeholder="$0.00"
                              className="text-sm"
                            />
                          </div>
                          {product.materialOptions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMaterial(material.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Quantity Tiers */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">Quantity Tiers</h2>
                      <button
                        type="button"
                        onClick={addQuantityTier}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        <Plus size={16} />
                        Add Tier
                      </button>
                    </div>

                    <div className="space-y-3">
                      {product.quantityTiers.map((tier) => (
                        <div key={tier.id} className="border rounded-lg p-4 flex items-end gap-3">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Min Qty</label>
                            <Input
                              type="number"
                              value={tier.min}
                              onChange={(e) => updateQuantityTier(tier.id, "min", parseInt(e.target.value))}
                              placeholder="1"
                              className="text-sm"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Max Qty</label>
                            <Input
                              type="number"
                              value={tier.max || ""}
                              onChange={(e) => updateQuantityTier(tier.id, "max", e.target.value ? parseInt(e.target.value) : undefined)}
                              placeholder="Leave empty for no limit"
                              className="text-sm"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Price per Unit</label>
                            <Input
                              type="number"
                              step="0.01"
                              value={tier.pricePerUnit}
                              onChange={(e) => updateQuantityTier(tier.id, "pricePerUnit", parseFloat(e.target.value))}
                              placeholder="$0.00"
                              className="text-sm"
                            />
                          </div>
                          {product.quantityTiers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuantityTier(tier.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Price Calculator */}
                  <PriceCalculator />
                </>
              )}

              {/* OPTIONS TAB */}
              {activeTab === "options" && (
                <>
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">Product Options</h2>
                      <button
                        type="button"
                        onClick={addOption}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        <Plus size={16} />
                        Add Option
                      </button>
                    </div>

                    {product.options.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p className="mb-4">No options yet. Add one to let customers customize products.</p>
                        <p className="text-sm">Examples: Size, Color, Material, Finish, Rush Turnaround</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {product.options.map((option) => (
                          <div key={option.id} className="border rounded-lg overflow-hidden">
                            {/* Option Header */}
                            <div className="bg-white border-b p-4 flex items-start gap-3">
                              <button
                                type="button"
                                className="text-gray-400 hover:text-gray-600 mt-1 flex-shrink-0"
                                disabled
                              >
                                <GripVertical size={20} />
                              </button>

                              <div className="flex-1 grid grid-cols-3 gap-4">
                                {/* Option Name */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Option Name
                                  </label>
                                  <Input
                                    type="text"
                                    value={option.name}
                                    onChange={(e) => updateOption(option.id, "name", e.target.value)}
                                    placeholder="e.g., Finish, Size, Color"
                                    className="text-sm"
                                  />
                                </div>

                                {/* Type */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                  </label>
                                  <select
                                    value={option.type}
                                    onChange={(e) => updateOption(option.id, "type", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  >
                                    <option value="select">Select</option>
                                    <option value="radio">Radio</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="dimension">Dimension</option>
                                  </select>
                                </div>

                                {/* Default Value */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Default Value
                                  </label>
                                  <select
                                    value={option.defaultValue || ""}
                                    onChange={(e) => updateOption(option.id, "defaultValue", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  >
                                    <option value="">Select default</option>
                                    {option.values.map((val) => (
                                      <option key={val.id} value={val.id}>
                                        {val.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {/* Required & Delete */}
                              <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={option.required}
                                    onChange={(e) => updateOption(option.id, "required", e.target.checked)}
                                    className="w-5 h-5"
                                  />
                                  <label className="text-sm font-medium text-gray-700">Required</label>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeOption(option.id)}
                                  className="text-red-600 hover:text-red-700 p-1"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>

                            {/* Option Values Section */}
                            <div className="bg-gray-50 p-4">
                              <div
                                className="flex items-center justify-between cursor-pointer mb-4"
                                onClick={() => toggleOptionExpanded(option.id)}
                              >
                                <h4 className="font-semibold text-gray-900">Option Values</h4>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addOptionValue(option.id);
                                    }}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                  >
                                    <Plus size={14} />
                                    Add Value
                                  </button>
                                  <ChevronDown
                                    size={20}
                                    className={`transition-transform ${
                                      option.isExpanded ? "rotate-180" : ""
                                    }`}
                                  />
                                </div>
                              </div>

                              {option.isExpanded && (
                                <div className="space-y-3">
                                  {option.values.length === 0 ? (
                                    <p className="text-gray-500 text-sm py-2">
                                      No values yet. Add one to give customers choices.
                                    </p>
                                  ) : (
                                    option.values.map((value) => (
                                      <div key={value.id} className="bg-white border rounded-lg p-4 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                              Value Name
                                            </label>
                                            <Input
                                              type="text"
                                              value={value.name}
                                              onChange={(e) =>
                                                updateOptionValue(option.id, value.id, "name", e.target.value)
                                              }
                                              placeholder="e.g., Satin, 5 inches"
                                              className="text-sm"
                                            />
                                          </div>

                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                              Price Modifier ($)
                                            </label>
                                            <Input
                                              type="number"
                                              step="0.01"
                                              value={value.priceModifier}
                                              onChange={(e) =>
                                                updateOptionValue(
                                                  option.id,
                                                  value.id,
                                                  "priceModifier",
                                                  parseFloat(e.target.value)
                                                )
                                              }
                                              placeholder="0.00"
                                              className="text-sm"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Add to base price</p>
                                          </div>
                                        </div>

                                        {/* Swatch Upload */}
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Swatch Image (Optional)
                                          </label>
                                          <label className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center cursor-pointer hover:border-gray-400 transition">
                                            <div className="flex items-center gap-2">
                                              <Upload size={16} className="text-gray-600" />
                                              <span className="text-sm text-gray-600">Upload swatch</span>
                                            </div>
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="hidden"
                                              onChange={(e) => {
                                                // TODO: Handle file upload to Cloudinary
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                  console.log("File selected:", file.name);
                                                }
                                              }}
                                            />
                                          </label>
                                        </div>

                                        {/* Remove Value */}
                                        <div className="flex justify-end mt-3 pt-3 border-t">
                                          <button
                                            type="button"
                                            onClick={() => removeOptionValue(option.id, value.id)}
                                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                                          >
                                            <X size={16} />
                                            Remove Value
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </>
              )}

              {/* VARIANTS TAB */}
              {activeTab === "variants" && (
                <Card className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Product Variants</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Variants let you create product sub-types with completely different pricing (e.g., sheets vs singles).
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      🚀 Coming soon: Create variants that replace pricing blocks
                    </p>
                  </div>
                </Card>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  {isEditing ? "Save Changes" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

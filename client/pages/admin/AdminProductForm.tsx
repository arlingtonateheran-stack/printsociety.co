import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2, ChevronDown } from "lucide-react";

type PriceBlockType = "fixed" | "matrix" | "formula";

interface PriceBlock {
  id: string;
  label: string;
  type: PriceBlockType;
  appliesWhen?: string[];
  value: number | Record<string, any>;
}

interface ProductOption {
  id: string;
  name: string;
  type: "select" | "checkbox" | "dimension";
  required: boolean;
  priceBehavior: "add" | "override" | "multiply";
  priceBlocks: PriceBlock[];
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
                </>
              )}

              {/* OPTIONS TAB */}
              {activeTab === "options" && (
                <Card className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Product Options</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Options allow customers to customize products with size, material, finish, rush turnaround, etc.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      🚀 Coming soon: Add custom options with price behaviors (add, override, multiply)
                    </p>
                  </div>
                </Card>
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

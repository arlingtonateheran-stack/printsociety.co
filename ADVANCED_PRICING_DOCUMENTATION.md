# Advanced Pricing Engine Documentation

## Overview

The Advanced Pricing Engine replaces traditional percentage-based pricing with a **block-based, deterministic system** that mirrors how real printing companies calculate costs. No base prices, no percentage margins—just pure cost blocks that stack together.

## Core Concept

```
Final Price = Sum of all applicable cost blocks
```

Instead of:
- ❌ Base Price × 1.4 (40% markup)
- ❌ Base Price + 25% for rush

We use:
- ✅ Material Block + Setup Block + Rush Block + Finish Block

---

## 1. Price Blocks

Price blocks are the fundamental building blocks of pricing. Each block represents a discrete cost component.

### Block Types

#### 🔹 Fixed Price Block

A flat fee that applies once per order or unit.

**Use cases:**
- Setup fees
- Design fees
- Rush turnaround fees
- White ink layers
- Specialty finishes

**Example:**
```json
{
  "type": "fixed",
  "label": "Setup Fee",
  "value": 35.00
}
```

#### 🔹 Matrix Price Block

Tiered pricing based on quantity, material, size, or any dimension.

**Use cases:**
- Quantity breaks (1–100 units vs 101–500)
- Material cost variations
- Size-based pricing
- Rush turnaround scaling

**Example - Quantity Matrix:**
```json
{
  "type": "matrix",
  "label": "Base Material Cost",
  "value": {
    "vinyl": {
      "1-100": 0.12,
      "101-500": 0.09,
      "501-1000": 0.06
    }
  }
}
```

**Example - Material Matrix:**
```json
{
  "type": "matrix",
  "label": "Material Pricing",
  "value": {
    "standard_vinyl": 0.12,
    "holographic_vinyl": 0.18,
    "matte_vinyl": 0.14
  }
}
```

#### 🔹 Formula Block

Custom math formulas for complex calculations. Used sparingly.

**Use cases:**
- Size-dependent pricing: `width * height * rate * quantity`
- Variable cost structures
- Specialty calculations

**Example:**
```json
{
  "type": "formula",
  "label": "Custom Size Cost",
  "value": "width * height * 0.05"
}
```

---

## 2. Product Model

Every product is built from modular components:

```typescript
Product {
  id: UUID
  name: string
  slug: string
  category: string
  description: string
  status: "active" | "inactive" | "discontinued"
  
  // Pricing components
  pricingBlocks: PriceBlock[]
  materialOptions: MaterialOption[]
  sizeOptions: SizeOption[]
  quantityTiers: QuantityTier[]
  finishOptions: FinishOption[]
  rushOptions: RushOption[]
  variants: ProductVariant[]
}
```

---

## 3. Material Options

Materials override or replace pricing based on selection.

```typescript
MaterialOption {
  id: UUID
  name: string
  pricePerSqIn?: number
  pricingOverride?: { pricePerSqIn: number }
}
```

**Example:**
```
Standard Vinyl: $0.12/sq in
Holographic Vinyl: $0.18/sq in
Matte Vinyl: $0.14/sq in
```

When a customer selects **Holographic**, the pricing recalculates using the holographic rate instead of standard.

---

## 4. Size Options

Sizes determine the square-inch cost basis.

```typescript
SizeOption {
  id: UUID
  width: number
  height: number
  pricePerSqIn?: number
}
```

**Example:**
```
2×2 inches = 4 sq in
3×3 inches = 9 sq in
4×4 inches = 16 sq in
```

Larger sizes can have reduced per-unit costs:
```
2×2: $0.12/sq in
4×4: $0.10/sq in (cheaper per inch due to efficiency)
```

---

## 5. Quantity Tiers

Real quantity-based pricing (NOT percentages).

```typescript
QuantityTier {
  id: UUID
  minQty: number
  maxQty?: number | null
  pricePerUnit: number
}
```

**Example:**
```
  1–100 units:    $0.20 per unit
101–250 units:    $0.14 per unit
251–1000 units:   $0.09 per unit
1001+ units:      $0.05 per unit (custom quote)
```

---

## 6. Finish Options

Finishes add optional cost per order or per unit.

```typescript
FinishOption {
  id: UUID
  name: string
  priceBlocks: PriceBlock[]
}
```

**Example: Matte Laminate**
```json
{
  "name": "Matte Laminate",
  "priceBlocks": [
    {
      "type": "matrix",
      "value": {
        "1-500": 0.02,
        "501-2000": 0.015,
        "2001+": 0.01
      }
    }
  ]
}
```

---

## 7. Rush Turnaround Options

Speed costs are fixed fees that lock out other options.

```typescript
RushOption {
  id: UUID
  name: string
  daysToProduction: number
  fixedFee?: number
  locksOtherOptions?: string[]
}
```

**Example:**
```
Standard (7-10 days): No fee
Express (2-3 days):   +$25
Next-Day:             +$50
```

---

## 8. Product Variants

Hard overrides for different product types (e.g., sheets vs singles).

```typescript
ProductVariant {
  id: UUID
  name: string
  replacesPricingBlocks: boolean
  pricingBlocks: PriceBlock[]
}
```

**Example:**
```
Variant: "Sticker Sheets" (replaces all base pricing)
Variant: "Roll Labels" (different material, different setup)
Variant: "Wholesale" (bulk pricing entirely different)
```

---

## 9. Price Calculation Logic

### Example: Die-Cut Vinyl Stickers

**Customer selects:**
- Quantity: 250 units
- Size: 3×3 inches (9 sq in)
- Material: Standard Vinyl
- Finish: Matte Laminate
- Rush: Standard

**Price calculation:**

```
1. Material Base (matrix lookup):
   Quantity tier 101-500 = $0.14/unit base

2. Size Cost:
   3×3 = 9 sq in
   9 × $0.12/sq in = $1.08 per unit

3. Quantity Cost:
   250 units × $1.08 = $270

4. Setup Fee (fixed):
   +$35

5. Matte Laminate (matrix lookup for 251-500):
   250 × $0.015 = $3.75

6. Rush Fee:
   $0 (standard)

TOTAL: $308.75
```

---

## 10. Custom Quotes

When customers exceed normal tiers or request unusual configurations:

```typescript
CustomQuote {
  id: UUID
  customerId: UUID
  productId: UUID
  reason: string
  specifications: string
  requestedPrice?: number
  adminNotes: string
  status: "pending" | "approved" | "rejected"
}
```

**Triggers custom quote:**
- Quantity exceeds largest tier
- Size outside predefined options
- Material combination not supported
- Special requirements requested

---

## 11. Database Schema

Key tables:

- `products` – Base product info
- `price_blocks` – Cost blocks (fixed, matrix, formula)
- `material_options` – Material choices
- `size_options` – Size choices
- `quantity_tiers` – Quantity breaks
- `finish_options` – Finish choices
- `finish_price_blocks` – Finish-specific costs
- `rush_options` – Turnaround options
- `product_variants` – Product sub-types
- `orders` – Customer orders
- `order_items` – Line items with pricing breakdown
- `custom_quotes` – Special quote requests
- `proofs` – Design approval workflow

---

## 12. Admin Interface Flow

### Create a Product

1. **Basic Info**: Name, slug, category, SKU
2. **Pricing Blocks**: Add fixed, matrix, and formula blocks
3. **Materials**: Define material options and override pricing
4. **Sizes**: Define available size options
5. **Quantity Tiers**: Set up quantity breaks
6. **Finishes**: Add specialty finish options with their own blocks
7. **Rush Options**: Define turnaround speeds and fees
8. **Variants**: Create sub-products (optional)

### Price Calculator

The admin interface includes a **live price calculator** to test configurations:

- Input: Width, height, quantity, material, finish, rush
- Output: Itemized price breakdown and final total
- Validation: Highlights when custom quotes are needed

---

## 13. Customer Checkout Flow

1. **Product Selection** → Choose product
2. **Customization** → Select size, material, finish, rush
3. **Quantity Entry** → Enter desired quantity
4. **Price Display** → Real-time price calculated
5. **Add to Cart** → Save with selected options
6. **Checkout** → Review all items and pricing

---

## 14. Key Advantages

| Feature | Percentage Pricing | Block Pricing |
|---------|------------------|----------------|
| Predictability | ❌ Hidden formulas | ✅ Transparent |
| Auditability | ❌ Hard to debug | ✅ Easy to trace |
| Margin Control | ❌ Leaks easily | ✅ Locked in |
| Scalability | ❌ Breaks at edges | ✅ Handles all sizes |
| Factory Friendly | ❌ Confusing | ✅ How they work |

---

## 15. Implementation Checklist

- [x] Database schema created
- [x] Product form UI with price blocks
- [x] Price calculator component
- [x] Material/size/quantity/finish management
- [ ] Backend API routes (products, orders, pricing)
- [ ] Checkout integration
- [ ] Proof workflow
- [ ] Custom quote system
- [ ] Admin dashboard with analytics

---

## Next Steps

1. **Run migrations**: Execute `SUPABASE_SCHEMA_ADVANCED.sql` in Supabase
2. **Insert test data**: Run `ADVANCED_PRICING_TEST_DATA.sql`
3. **Build API routes**: Create endpoints for product retrieval and order creation
4. **Connect checkout**: Integrate price calculation into cart/checkout
5. **Test pricing**: Use the admin calculator to validate configurations

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PricingConfig {
  baseMatrixRate?: number;
  width?: number;
  height?: number;
  quantity?: number;
  materialPricePerSqIn?: number;
  quantityTierPrice?: number;
  fixedBlocksSum?: number;
  finishPrice?: number;
  rushFee?: number;
}

export default function PriceCalculator() {
  const [config, setConfig] = useState<PricingConfig>({
    baseMatrixRate: 0.12,
    width: 2,
    height: 2,
    quantity: 100,
    materialPricePerSqIn: 0.12,
    quantityTierPrice: 0.20,
    fixedBlocksSum: 0,
    finishPrice: 0,
    rushFee: 0,
  });

  // Calculate final price
  const calculatePrice = () => {
    const {
      width = 1,
      height = 1,
      quantity = 1,
      materialPricePerSqIn = 0.12,
      quantityTierPrice = 0.20,
      fixedBlocksSum = 0,
      finishPrice = 0,
      rushFee = 0,
    } = config;

    // Size cost (square inches)
    const squareInches = width * height;

    // Material cost per unit
    const materialCostPerUnit = squareInches * materialPricePerSqIn;

    // Quantity-based unit cost
    const quantityBasedCost = materialCostPerUnit + quantityTierPrice;

    // Total material cost for all units
    const totalMaterialCost = quantityBasedCost * quantity;

    // Add finishes, rush fees, and fixed blocks
    const finalPrice =
      totalMaterialCost + finishPrice + rushFee + fixedBlocksSum;

    const pricePerUnit = quantity > 0 ? finalPrice / quantity : 0;

    return {
      squareInches: squareInches.toFixed(2),
      materialCostPerUnit: materialCostPerUnit.toFixed(2),
      totalMaterialCost: totalMaterialCost.toFixed(2),
      finishPrice: finishPrice.toFixed(2),
      rushFee: rushFee.toFixed(2),
      fixedBlocksSum: fixedBlocksSum.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
      pricePerUnit: pricePerUnit.toFixed(2),
    };
  };

  const prices = calculatePrice();

  const updateConfig = (key: string, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setConfig((prev) => ({
      ...prev,
      [key]: numValue,
    }));
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-bold text-lg text-blue-900 mb-4">Price Calculator</h3>
        <p className="text-sm text-blue-800 mb-4">
          Test your pricing blocks with real values
        </p>

        <div className="space-y-4">
          {/* Size inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Width (inches)
              </label>
              <Input
                type="number"
                step="0.1"
                value={isNaN(config.width ?? 0) ? "" : config.width}
                onChange={(e) => updateConfig("width", e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Height (inches)
              </label>
              <Input
                type="number"
                step="0.1"
                value={isNaN(config.height ?? 0) ? "" : config.height}
                onChange={(e) => updateConfig("height", e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <Input
              type="number"
              value={isNaN(config.quantity ?? 0) ? "" : config.quantity}
              onChange={(e) => updateConfig("quantity", e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Material price */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Material Price per Sq In ($)
            </label>
            <Input
              type="number"
              step="0.01"
              value={isNaN(config.materialPricePerSqIn ?? 0) ? "" : config.materialPricePerSqIn}
              onChange={(e) => updateConfig("materialPricePerSqIn", e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Quantity tier price */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Quantity Tier Price per Unit ($)
            </label>
            <Input
              type="number"
              step="0.01"
              value={isNaN(config.quantityTierPrice ?? 0) ? "" : config.quantityTierPrice}
              onChange={(e) => updateConfig("quantityTierPrice", e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Additional costs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Finish/Add-ons ($)
              </label>
              <Input
                type="number"
                step="0.01"
                value={isNaN(config.finishPrice ?? 0) ? "" : config.finishPrice}
                onChange={(e) => updateConfig("finishPrice", e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Rush Fee ($)
              </label>
              <Input
                type="number"
                step="0.01"
                value={isNaN(config.rushFee ?? 0) ? "" : config.rushFee}
                onChange={(e) => updateConfig("rushFee", e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Other Fixed Blocks Sum ($)
            </label>
            <Input
              type="number"
              step="0.01"
              value={isNaN(config.fixedBlocksSum ?? 0) ? "" : config.fixedBlocksSum}
              onChange={(e) => updateConfig("fixedBlocksSum", e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Results */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h3 className="font-bold text-lg text-green-900 mb-4">Calculated Price</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Size:</span>
            <span className="font-mono">{prices.squareInches} sq in</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Material per unit:</span>
            <span className="font-mono">${prices.materialCostPerUnit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total material:</span>
            <span className="font-mono">${prices.totalMaterialCost}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Finishes:</span>
            <span className="font-mono">${prices.finishPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rush fee:</span>
            <span className="font-mono">${prices.rushFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Other blocks:</span>
            <span className="font-mono">${prices.fixedBlocksSum}</span>
          </div>
          <div className="border-t border-green-200 pt-2 mt-2 flex justify-between font-bold">
            <span>Final Price:</span>
            <span className="text-green-700 font-mono">${prices.finalPrice}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Price per unit:</span>
            <span className="font-mono">${prices.pricePerUnit}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

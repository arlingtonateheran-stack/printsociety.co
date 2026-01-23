import { useState, useMemo } from 'react';
import { Info } from 'lucide-react';
import type { Product } from '@shared/products';

interface PricingCalculatorProps {
  product: Product;
  selectedMaterial: string;
  selectedFinish: string;
}

export default function PricingCalculator({
  product,
  selectedMaterial,
  selectedFinish,
}: PricingCalculatorProps) {
  const [quantity, setQuantity] = useState(product.minQuantity);

  // Calculate pricing
  const material = product.specifications.materialOptions.find(m => m.id === selectedMaterial);
  const finish = product.specifications.finishOptions.find(f => f.id === selectedFinish);

  const priceMultiplier = (material?.priceMultiplier || 1) * (finish?.priceMultiplier || 1);

  // Find pricing tier
  const tier = product.pricingTiers.find(
    t => quantity >= t.quantityMin && quantity <= t.quantityMax
  );

  const pricePerUnit = (tier?.pricePerUnit || product.basePrice) * priceMultiplier;
  const subtotal = pricePerUnit * quantity;
  const setupFee = 25; // Fixed setup fee
  const total = subtotal + setupFee;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(
      Math.max(parseInt(e.target.value) || product.minQuantity, product.minQuantity),
      product.maxQuantity
    );
    setQuantity(value);
  };

  const incrementQuantity = (amount: number) => {
    const newQuantity = Math.min(
      Math.max(quantity + amount, product.minQuantity),
      product.maxQuantity
    );
    setQuantity(newQuantity);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-bold text-black">Pricing Calculator</h3>

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-black">
          Quantity (min: {product.minQuantity}, max: {product.maxQuantity})
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => incrementQuantity(-50)}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
          />
          <button
            onClick={() => incrementQuantity(50)}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            +
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[50, 100, 250, 500, 1000].map(q => (
            q <= product.maxQuantity && (
              <button
                key={q}
                onClick={() => setQuantity(Math.max(q, product.minQuantity))}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  quantity === q
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-300 hover:border-primary'
                }`}
              >
                {q.toLocaleString()}
              </button>
            )
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Unit Price (after discounts)</span>
          <span className="font-semibold">${pricePerUnit.toFixed(4)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({quantity} units)</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm border-t pt-3">
          <span className="text-gray-600">Setup Fee (one-time)</span>
          <span className="font-semibold">${setupFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-3">
          <span>Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3 text-sm text-blue-900">
        <Info size={16} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Bulk Discounts Available</p>
          <p>Order {product.pricingTiers[Math.min(product.pricingTiers.length - 1, 2)].quantityMin}+ units for better pricing</p>
        </div>
      </div>

      {/* Material & Finish Impact */}
      {(material?.priceMultiplier !== 1 || finish?.priceMultiplier !== 1) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
          <p className="font-semibold mb-1">Price Modifiers</p>
          {material && material.priceMultiplier !== 1 && (
            <p>{material.name}: {((material.priceMultiplier - 1) * 100).toFixed(0)}% {material.priceMultiplier > 1 ? 'more' : 'less'}</p>
          )}
          {finish && finish.priceMultiplier !== 1 && (
            <p>{finish.name}: {((finish.priceMultiplier - 1) * 100).toFixed(0)}% {finish.priceMultiplier > 1 ? 'more' : 'less'}</p>
          )}
        </div>
      )}
    </div>
  );
}

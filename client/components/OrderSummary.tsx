import { useState, useEffect } from "react";
import { Cart, ShippingOption } from "@shared/cart";
import { Card } from "@/components/ui/card";

interface OrderSummaryProps {
  cart: Cart;
  shippingOption?: ShippingOption;
  promoCode?: string;
  discount?: number;
}

interface UploadedDesign {
  name: string;
  size: number;
  preview: string;
}

export function OrderSummary({
  cart,
  shippingOption,
  promoCode,
  discount = 0,
}: OrderSummaryProps) {
  const [uploadedDesign, setUploadedDesign] = useState<UploadedDesign | null>(null);

  useEffect(() => {
    // Retrieve design from localStorage
    const storedDesign = localStorage.getItem('uploadedDesign');
    if (storedDesign) {
      try {
        setUploadedDesign(JSON.parse(storedDesign));
      } catch (e) {
        console.error('Failed to parse uploaded design', e);
      }
    }
  }, []);

  const shippingCost = shippingOption?.basePrice || 0;
  const total = cart.subtotal + shippingCost - discount;

  return (
    <Card className="p-6 bg-gray-50">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

      {/* Design Preview */}
      {uploadedDesign && (
        <div className="mb-6 p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-xs font-bold text-gray-700 uppercase mb-2">Design</p>
          <img
            src={uploadedDesign.preview}
            alt="Design preview"
            className="w-full h-32 object-cover rounded border border-gray-300 mb-2"
          />
          <p className="text-xs text-gray-600">{uploadedDesign.name}</p>
          <p className="text-xs text-gray-500">{(uploadedDesign.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}

      {/* Line Items */}
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {cart.lineItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-700">
              {item.productName} ({item.quantity}x)
            </span>
            <span className="font-medium">${item.subtotal.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>${cart.subtotal.toFixed(2)}</span>
        </div>

        {shippingOption && (
          <div className="flex justify-between text-gray-700">
            <div>
              <p>Shipping</p>
              <p className="text-xs text-gray-500">{shippingOption.name}</p>
            </div>
            <span>
              {shippingOption.basePrice === 0
                ? "Free"
                : `$${shippingOption.basePrice.toFixed(2)}`}
            </span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <div>
              <p>Discount</p>
              {promoCode && (
                <p className="text-xs text-green-500">{promoCode}</p>
              )}
            </div>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        {/* Total */}
        <div className="border-t pt-3 mt-3 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-green-600">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Info */}
      {shippingOption && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900">
            Estimated Delivery
          </p>
          <p className="text-sm text-blue-700">
            {shippingOption.daysToDeliver} business days from production completion
          </p>
        </div>
      )}
    </Card>
  );
}

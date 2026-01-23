import { ShippingOption } from "@/shared/cart";
import { Card } from "@/components/ui/card";

interface ShippingOptionsProps {
  options: ShippingOption[];
  selectedOption: ShippingOption | undefined;
  onSelect: (option: ShippingOption) => void;
}

export function ShippingOptions({
  options,
  selectedOption,
  onSelect,
}: ShippingOptionsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Shipping Method</h2>
      <div className="grid gap-4">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer transition border-2 ${
              selectedOption?.id === option.id
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onSelect(option)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{option.name}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  {option.basePrice === 0 ? "Free" : `$${option.basePrice.toFixed(2)}`}
                </p>
                <p className="text-xs text-gray-500">
                  {option.daysToDeliver} business day
                  {option.daysToDeliver !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Selection indicator */}
            <div className="mt-4 flex items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  selectedOption?.id === option.id
                    ? "border-green-600 bg-green-600"
                    : "border-gray-300"
                }`}
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                {selectedOption?.id === option.id ? "Selected" : "Select"}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

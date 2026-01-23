import { useState } from "react";
import { BillingAddress, promoCodes } from "@shared/cart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

interface BillingInfoProps {
  billingData: Partial<BillingAddress>;
  onBillingChange: (data: Partial<BillingAddress>) => void;
  onPromoApply: (code: string, discount: number) => void;
  appliedPromo?: string;
  currentDiscount?: number;
}

export function BillingInfo({
  billingData,
  onBillingChange,
  onPromoApply,
  appliedPromo,
  currentDiscount = 0,
}: BillingInfoProps) {
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);

  const handlePromoApply = () => {
    setPromoError("");
    setPromoSuccess(false);

    const validCode = promoCodes.find(
      (code) => code.code.toUpperCase() === promoCode.toUpperCase() && code.isActive
    );

    if (!validCode) {
      setPromoError("Invalid or expired promo code");
      return;
    }

    if (validCode.minOrderAmount && 90.5 < validCode.minOrderAmount) {
      setPromoError(
        `Minimum order of $${validCode.minOrderAmount} required for this code`
      );
      return;
    }

    let discount = 0;
    if (validCode.discountType === "percentage") {
      discount = 90.5 * (validCode.discountValue / 100);
      if (validCode.maxDiscount && discount > validCode.maxDiscount) {
        discount = validCode.maxDiscount;
      }
    } else {
      discount = validCode.discountValue;
    }

    onPromoApply(promoCode.toUpperCase(), discount);
    setPromoSuccess(true);
    setPromoCode("");
  };

  const handleInputChange = (field: keyof BillingAddress, value: string) => {
    onBillingChange({ ...billingData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Billing Address */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="First Name"
              value={billingData.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
            <Input
              placeholder="Last Name"
              value={billingData.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              className="col-span-2"
              value={billingData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <Input
              placeholder="Phone"
              className="col-span-2"
              value={billingData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
            <Input
              placeholder="Company (optional)"
              className="col-span-2"
              value={billingData.company || ""}
              onChange={(e) => handleInputChange("company", e.target.value)}
            />
            <Input
              placeholder="Street Address"
              className="col-span-2"
              value={billingData.street || ""}
              onChange={(e) => handleInputChange("street", e.target.value)}
            />
            <Input
              placeholder="Apartment, suite, etc. (optional)"
              className="col-span-2"
              value={billingData.street2 || ""}
              onChange={(e) => handleInputChange("street2", e.target.value)}
            />
            <Input
              placeholder="City"
              value={billingData.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
            <Input
              placeholder="State/Province"
              value={billingData.state || ""}
              onChange={(e) => handleInputChange("state", e.target.value)}
            />
            <Input
              placeholder="ZIP/Postal Code"
              value={billingData.zipCode || ""}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
            />
            <Input
              placeholder="Country"
              className="col-span-2"
              value={billingData.country || ""}
              onChange={(e) => handleInputChange("country", e.target.value)}
            />
          </div>
        </Card>
      </div>

      {/* Promo Code */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Promo Code</h2>
        <Card className="p-6">
          {appliedPromo ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
              <CheckCircle className="text-green-600" size={20} />
              <div>
                <p className="font-semibold text-green-800">Code Applied</p>
                <p className="text-sm text-green-700">
                  {appliedPromo} - Save ${currentDiscount.toFixed(2)}
                </p>
              </div>
            </div>
          ) : null}

          {promoError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-sm text-red-700">{promoError}</p>
            </div>
          )}

          {promoSuccess && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-sm text-green-700">Promo code applied successfully!</p>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              disabled={!!appliedPromo}
            />
            <Button
              onClick={handlePromoApply}
              variant="outline"
              disabled={!promoCode || !!appliedPromo}
            >
              Apply
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Try codes like: STICKY10, SUMMER20, or WELCOME5
          </p>
        </Card>
      </div>
    </div>
  );
}

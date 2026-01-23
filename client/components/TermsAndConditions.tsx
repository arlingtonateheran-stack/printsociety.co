import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TermsAndConditionsProps {
  accepted: boolean;
  onAccept: (accepted: boolean) => void;
}

export function TermsAndConditions({
  accepted,
  onAccept,
}: TermsAndConditionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>

      <div className="mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
        >
          <span className="font-medium text-gray-700">
            Read full terms and conditions
          </span>
          {isExpanded ? (
            <ChevronUp className="text-gray-600" />
          ) : (
            <ChevronDown className="text-gray-600" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto text-sm text-gray-700 space-y-3">
            <h3 className="font-semibold text-gray-900">1. Product Details</h3>
            <p>
              All products are manufactured according to the specifications and
              materials selected during the order process. Colors shown online
              may vary slightly from printed materials due to screen differences.
            </p>

            <h3 className="font-semibold text-gray-900">2. Proofs & Approval</h3>
            <p>
              A digital proof will be provided for your approval before
              production. You have up to 3 revision requests included with your
              order. Approval must be received within 7 days. Failure to approve
              within this timeframe may result in production delays.
            </p>

            <h3 className="font-semibold text-gray-900">3. Artwork Requirements</h3>
            <p>
              You must provide high-resolution artwork (minimum 300 DPI) for
              production. We accept PDF, PNG, and AI files. Artwork must be
              uploaded before checkout completion or during the checkout process.
            </p>

            <h3 className="font-semibold text-gray-900">4. Production Timeline</h3>
            <p>
              Standard production takes 3-5 business days from proof approval.
              Rush production (2-3 business days) is available for an additional
              fee. Shipping times are not included in production timelines.
            </p>

            <h3 className="font-semibold text-gray-900">5. Shipping & Delivery</h3>
            <p>
              Standard shipping is free on all orders. Rush shipping options
              available. Orders are shipped via carrier and tracking information
              will be provided via email.
            </p>

            <h3 className="font-semibold text-gray-900">6. Returns & Refunds</h3>
            <p>
              Custom products are non-refundable once production has begun.
              Returns must be requested within 7 days of delivery with
              photographic proof of defects. Refunds are issued less shipping
              costs.
            </p>

            <h3 className="font-semibold text-gray-900">7. Quality Guarantee</h3>
            <p>
              We guarantee all products meet our quality standards. If you
              receive damaged or defective products, contact us within 7 days
              with photos for replacement or refund.
            </p>

            <h3 className="font-semibold text-gray-900">8. Intellectual Property</h3>
            <p>
              You represent that you own all rights to the artwork you provide.
              Sticky Slap is not responsible for any copyright or trademark
              infringement claims related to customer-provided artwork.
            </p>

            <h3 className="font-semibold text-gray-900">9. Limitation of Liability</h3>
            <p>
              Our liability is limited to the order total. We are not liable for
              lost profits, indirect damages, or consequential damages resulting
              from delays or product defects.
            </p>

            <h3 className="font-semibold text-gray-900">10. Privacy Policy</h3>
            <p>
              Your personal information is protected according to our Privacy
              Policy. We never share your data with third parties without
              consent.
            </p>
          </div>
        )}
      </div>

      {/* Acceptance Checkbox */}
      <div className="flex items-start gap-3 mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <Checkbox
          id="terms-accept"
          checked={accepted}
          onCheckedChange={(checked) => onAccept(checked === true)}
          className="mt-1"
        />
        <label
          htmlFor="terms-accept"
          className="flex-1 cursor-pointer text-sm"
        >
          <span className="font-medium text-gray-900">
            I agree to the Terms & Conditions
          </span>
          <p className="text-gray-600 mt-1">
            I understand and accept all terms, including artwork upload
            requirements, proof approval timelines, and our return policy.
          </p>
        </label>
      </div>

      {!accepted && (
        <p className="text-sm text-red-600 mt-3">
          You must accept the terms and conditions to proceed with checkout.
        </p>
      )}
    </Card>
  );
}

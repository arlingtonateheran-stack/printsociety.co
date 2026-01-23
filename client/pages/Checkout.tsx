import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShippingOptions } from "@/components/ShippingOptions";
import { BillingInfo } from "@/components/BillingInfo";
import { ArtworkUploadCheckout } from "@/components/ArtworkUploadCheckout";
import { OrderSummary } from "@/components/OrderSummary";
import { TermsAndConditions } from "@/components/TermsAndConditions";
import { ChevronRight, CheckCircle } from "lucide-react";
import type {
  Cart,
  CartLineItem,
  ShippingOption,
  BillingAddress,
} from "@shared/cart";
import { shippingOptions } from "@shared/cart";

type CheckoutStep =
  | "artwork"
  | "shipping"
  | "billing"
  | "terms"
  | "review"
  | "confirmation";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialCart: Cart = location.state?.cartData || {
    id: "cart-001",
    userId: "user-001",
    lineItems: [
      {
        id: "item-1",
        productId: "die-cut-stickers-vinyl",
        productName: "Die-Cut Vinyl Stickers",
        productSlug: "die-cut-vinyl-stickers",
        quantity: 100,
        size: "3\" - 4\"",
        material: "vinyl",
        finish: "glossy",
        unitPrice: 0.28,
        subtotal: 28,
        artworkStatus: "pending",
      },
    ],
    subtotal: 28,
    shippingCost: 0,
    discountAmount: 0,
    total: 28,
    termsAccepted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("artwork");
  const [cart, setCart] = useState<Cart>(initialCart);
  const [billingData, setBillingData] = useState<Partial<BillingAddress>>({});
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState("");

  const steps: CheckoutStep[] = [
    "artwork",
    "shipping",
    "billing",
    "terms",
    "review",
  ];
  const currentStepIndex = steps.indexOf(currentStep);

  const handleArtworkUpload = (itemId: string, fileUrl: string) => {
    setCart({
      ...cart,
      lineItems: cart.lineItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              artworkUrl: fileUrl,
              artworkStatus: "uploaded",
            }
          : item
      ),
    });
  };

  const handleArtworkRemove = (itemId: string) => {
    setCart({
      ...cart,
      lineItems: cart.lineItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              artworkUrl: undefined,
              artworkStatus: "pending",
            }
          : item
      ),
    });
  };

  const handlePromoApply = (code: string, discountAmount: number) => {
    setPromoCode(code);
    setDiscount(discountAmount);
    setCart({
      ...cart,
      discountAmount: discountAmount,
      total: cart.subtotal + (selectedShipping?.basePrice || 0) - discountAmount,
    });
  };

  const handleShippingSelect = (option: ShippingOption) => {
    setSelectedShipping(option);
    setCart({
      ...cart,
      shippingOption: option,
      shippingCost: option.basePrice,
      total: cart.subtotal + option.basePrice - discount,
    });
  };

  const handleBillingChange = (data: Partial<BillingAddress>) => {
    setBillingData((prev) => ({ ...prev, ...data }));
  };

  const canProceedToShipping = cart.lineItems.every(
    (item) => item.artworkStatus === "uploaded"
  );

  const canProceedToBilling = !!selectedShipping;

  const canProceedToTerms =
    Object.values(billingData).filter((v) => v).length > 0;

  const canProceedToReview = termsAccepted;

  const handleNext = () => {
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) {
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    const prevStep = steps[currentStepIndex - 1];
    if (prevStep) {
      setCurrentStep(prevStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlaceOrder = () => {
    // In a real app, submit order to backend
    setCurrentStep("confirmation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stepLabels: Record<CheckoutStep, string> = {
    artwork: "Artwork",
    shipping: "Shipping",
    billing: "Billing",
    terms: "Terms",
    review: "Review",
    confirmation: "Confirmation",
  };

  if (currentStep === "confirmation") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-4 py-12">
            <Card className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle className="text-green-600" size={48} />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for your order. Your order number is{" "}
                <span className="font-bold text-green-600">#ORD-2025-001234</span>
              </p>
              <p className="text-gray-600 mb-8">
                We'll send you a digital proof within 24 hours. You can track
                your proof and production status in your account dashboard.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/proofs")}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  View Your Proofs
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full"
                >
                  Return to Home
                </Button>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => navigate("/cart")}
                className="text-blue-600 hover:underline"
              >
                Cart
              </button>
              <ChevronRight size={16} className="text-gray-400" />

              <div className="flex items-center gap-2">
                {steps.map((step, index) => (
                  <div key={step} className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentStep(step)}
                      className={`font-medium ${
                        currentStepIndex === index
                          ? "text-green-600"
                          : currentStepIndex > index
                            ? "text-green-600"
                            : "text-gray-400"
                      }`}
                    >
                      {stepLabels[step]}
                    </button>
                    {index < steps.length - 1 && (
                      <ChevronRight
                        size={16}
                        className="text-gray-400"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Artwork Upload */}
              {currentStep === "artwork" && (
                <div>
                  <ArtworkUploadCheckout
                    lineItems={cart.lineItems}
                    onArtworkUpload={handleArtworkUpload}
                    onArtworkRemove={handleArtworkRemove}
                  />
                </div>
              )}

              {/* Shipping */}
              {currentStep === "shipping" && (
                <ShippingOptions
                  options={shippingOptions}
                  selectedOption={selectedShipping}
                  onSelect={handleShippingSelect}
                />
              )}

              {/* Billing */}
              {currentStep === "billing" && (
                <BillingInfo
                  billingData={billingData}
                  onBillingChange={handleBillingChange}
                  onPromoApply={handlePromoApply}
                  appliedPromo={promoCode}
                  currentDiscount={discount}
                />
              )}

              {/* Terms */}
              {currentStep === "terms" && (
                <TermsAndConditions
                  accepted={termsAccepted}
                  onAccept={setTermsAccepted}
                />
              )}

              {/* Review */}
              {currentStep === "review" && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Order Review</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Items</h3>
                      <div className="space-y-2">
                        {cart.lineItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span>{item.productName} ({item.quantity}x)</span>
                            <span className="font-medium">
                              ${item.subtotal.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-3">Shipping</h3>
                      <p className="text-sm">
                        {selectedShipping?.name} -{" "}
                        {selectedShipping?.daysToDeliver} business days
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-3">Billing Address</h3>
                      <p className="text-sm">
                        {billingData.firstName} {billingData.lastName}
                        <br />
                        {billingData.street}
                        {billingData.street2 && `, ${billingData.street2}`}
                        <br />
                        {billingData.city}, {billingData.state}{" "}
                        {billingData.zipCode}
                        <br />
                        {billingData.country}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {currentStepIndex > 0 && (
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="flex-1"
                  >
                    Previous Step
                  </Button>
                )}

                {currentStep !== "review" && (
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={
                      (currentStep === "artwork" && !canProceedToShipping) ||
                      (currentStep === "shipping" && !canProceedToBilling) ||
                      (currentStep === "billing" && !canProceedToTerms) ||
                      (currentStep === "terms" && !canProceedToReview)
                    }
                  >
                    Next Step
                  </Button>
                )}

                {currentStep === "review" && (
                  <Button
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    Place Order
                  </Button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <OrderSummary
                cart={cart}
                shippingOption={selectedShipping}
                promoCode={promoCode}
                discount={discount}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

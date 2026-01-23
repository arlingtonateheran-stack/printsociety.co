import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus } from "lucide-react";
import type { Cart, CartLineItem } from "@/shared/cart";

// Sample cart data (in a real app, this would come from state management or API)
const sampleCart: Cart = {
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
    {
      id: "item-2",
      productId: "sticker-sheets",
      productName: "Sticker Sheets",
      productSlug: "sticker-sheets",
      quantity: 50,
      size: "A4 (8.5\" x 11\")",
      material: "vinyl",
      finish: "matte",
      unitPrice: 1.25,
      subtotal: 62.5,
      artworkStatus: "pending",
    },
  ],
  subtotal: 90.5,
  shippingCost: 0,
  discountAmount: 0,
  total: 90.5,
  termsAccepted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart>(sampleCart);
  const [promoCode, setPromoCode] = useState("");

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = {
      ...cart,
      lineItems: cart.lineItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQuantity,
              subtotal: newQuantity * item.unitPrice,
            }
          : item
      ),
    };
    recalculateCart(updatedCart);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedCart = {
      ...cart,
      lineItems: cart.lineItems.filter((item) => item.id !== itemId),
    };
    recalculateCart(updatedCart);
  };

  const recalculateCart = (updatedCart: Cart) => {
    const subtotal = updatedCart.lineItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    setCart({
      ...updatedCart,
      subtotal,
      total: subtotal + updatedCart.shippingCost - updatedCart.discountAmount,
      updatedAt: new Date(),
    });
  };

  const handleApplyPromo = (code: string) => {
    // In a real app, validate against backend
    if (code.length > 0) {
      // Mock discount of 10%
      const discount = Math.min(cart.subtotal * 0.1, 50);
      setCart({
        ...cart,
        discountAmount: discount,
        promoCodeApplied: code,
        total: cart.subtotal + cart.shippingCost - discount,
      });
      setPromoCode("");
    }
  };

  const handleProceedToCheckout = () => {
    // Check if any items have pending artwork
    const pendingArtwork = cart.lineItems.filter(
      (item) => item.artworkStatus === "pending"
    );
    
    if (pendingArtwork.length > 0) {
      navigate("/checkout", { state: { cartData: cart } });
    } else {
      navigate("/checkout", { state: { cartData: cart } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              Review your items and proceed to checkout
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cart.lineItems.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-xl text-gray-600 mb-6">
                    Your cart is empty
                  </p>
                  <Link to="/products">
                    <Button>Continue Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.lineItems.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-6 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            {item.productName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.size} | {item.material} | {item.finish}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantity - 1
                                )
                              }
                              className="p-2 hover:bg-gray-100"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 min-w-12 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                              className="p-2 hover:bg-gray-100"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              ${item.unitPrice.toFixed(2)} each
                            </p>
                            <p className="text-lg font-semibold">
                              ${item.subtotal.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Artwork Status */}
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              item.artworkStatus === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : item.artworkStatus === "uploaded"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.artworkStatus === "pending"
                              ? "Artwork Pending"
                              : item.artworkStatus === "uploaded"
                                ? "Artwork Uploaded"
                                : "Artwork Approved"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>${cart.shippingCost.toFixed(2)}</span>
                  </div>
                  {cart.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${cart.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-4 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6 pb-6 border-b">
                  <label className="block text-sm font-medium mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleApplyPromo(promoCode)}
                      variant="outline"
                    >
                      Apply
                    </Button>
                  </div>
                  {cart.promoCodeApplied && (
                    <p className="text-sm text-green-600 mt-2">
                      Code "{cart.promoCodeApplied}" applied
                    </p>
                  )}
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white mb-3"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>

                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

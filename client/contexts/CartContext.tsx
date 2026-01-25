import { createContext, useContext, useState, ReactNode } from 'react';
import type { Cart, CartLineItem } from '@shared/cart';

interface CartContextType {
  cart: Cart;
  addToCart: (item: CartLineItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const emptyCart: Cart = {
  id: 'cart-' + Date.now(),
  lineItems: [],
  subtotal: 0,
  shippingCost: 0,
  discountAmount: 0,
  total: 0,
  termsAccepted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart);

  const addToCart = (newItem: CartLineItem) => {
    setCart((prevCart) => {
      // Check if item with same product and specs already exists
      const existingItemIndex = prevCart.lineItems.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.size === newItem.size &&
          item.material === newItem.material &&
          item.finish === newItem.finish
      );

      let updatedLineItems: CartLineItem[];

      if (existingItemIndex > -1) {
        // Update quantity if same product with same specs
        updatedLineItems = prevCart.lineItems.map((item, idx) =>
          idx === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + newItem.quantity,
                subtotal:
                  (item.quantity + newItem.quantity) * item.unitPrice,
              }
            : item
        );
      } else {
        // Add new item
        updatedLineItems = [...prevCart.lineItems, newItem];
      }

      const subtotal = updatedLineItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );

      return {
        ...prevCart,
        lineItems: updatedLineItems,
        subtotal,
        total: subtotal + prevCart.shippingCost - prevCart.discountAmount,
        updatedAt: new Date(),
      };
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const updatedLineItems = prevCart.lineItems.filter(
        (item) => item.id !== itemId
      );
      const subtotal = updatedLineItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );

      return {
        ...prevCart,
        lineItems: updatedLineItems,
        subtotal,
        total: subtotal + prevCart.shippingCost - prevCart.discountAmount,
        updatedAt: new Date(),
      };
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setCart((prevCart) => {
      const updatedLineItems = prevCart.lineItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.unitPrice,
            }
          : item
      );
      const subtotal = updatedLineItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );

      return {
        ...prevCart,
        lineItems: updatedLineItems,
        subtotal,
        total: subtotal + prevCart.shippingCost - prevCart.discountAmount,
        updatedAt: new Date(),
      };
    });
  };

  const clearCart = () => {
    setCart(emptyCart);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

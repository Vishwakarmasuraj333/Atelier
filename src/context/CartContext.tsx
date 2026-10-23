'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItemType {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    images: { url: string; alt?: string | null }[];
  };
  variant?: {
    id: string;
    title: string;
    color?: string | null;
    size?: string | null;
  } | null;
}

export interface AppliedCoupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number;
  description?: string | null;
}

interface CartContextType {
  items: CartItemType[];
  subtotal: number;
  totalItems: number;
  isDrawerOpen: boolean;
  appliedCoupon: AppliedCoupon | null;
  discountAmount: number;
  taxAmount: number;
  shippingFee: number;
  grandTotal: number;
  isLoading: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (productId: string, variantId?: string | null, quantity?: number) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.cart?.items) {
        setItems(data.cart.items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Re-calculate coupon discount if subtotal changed
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(appliedCoupon.discountValue, subtotal);
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(discountedSubtotal * 0.08 * 100) / 100;
  const shippingFee = subtotal === 0 || discountedSubtotal > 300 ? 0 : 35;
  const grandTotal = Math.round((discountedSubtotal + taxAmount + shippingFee) * 100) / 100;

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addToCart = async (productId: string, variantId?: string | null, quantity: number = 1) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, variantId, quantity }),
      });
      const data = await res.json();
      if (res.ok && data.cart?.items) {
        setItems(data.cart.items);
        setIsDrawerOpen(true);
        return { success: true };
      }
      return { success: false, error: data.error || 'Could not add item' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity }),
      });
      const data = await res.json();
      if (data.cart?.items) {
        setItems(data.cart.items);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await fetch(`/api/cart?itemId=${itemId}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (e) {
      console.error(e);
    }
  };

  const clearCart = async () => {
    try {
      await fetch('/api/cart', { method: 'DELETE' });
      setItems([]);
      setAppliedCoupon(null);
    } catch (e) {
      console.error(e);
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderAmount: subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.coupon) {
        setAppliedCoupon(data.coupon);
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid coupon' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        totalItems,
        isDrawerOpen,
        appliedCoupon,
        discountAmount,
        taxAmount,
        shippingFee,
        grandTotal,
        isLoading,
        openDrawer,
        closeDrawer,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

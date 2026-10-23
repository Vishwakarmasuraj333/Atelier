'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistProductIds: string[];
  totalWishlist: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);

  const refreshWishlist = async () => {
    if (!user) {
      setWishlistProductIds([]);
      return;
    }
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      if (data.items) {
        setWishlistProductIds(data.items.map((i: any) => i.productId));
      }
    } catch {
      setWishlistProductIds([]);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const isInWishlist = (productId: string) => wishlistProductIds.includes(productId);

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    if (!user) {
      window.location.href = '/account/login';
      return false;
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.isAdded) {
        setWishlistProductIds((prev) => [...prev, productId]);
        return true;
      } else {
        setWishlistProductIds((prev) => prev.filter((id) => id !== productId));
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistProductIds,
        totalWishlist: wishlistProductIds.length,
        isInWishlist,
        toggleWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

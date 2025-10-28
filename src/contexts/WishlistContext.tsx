'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, WishlistItem } from '@/types';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = useCallback((product: Product) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.some((item) => item.product.id === product.id);
      if (exists) {
        return prevItems;
      }
      return [...prevItems, { product }];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some((item) => item.product.id === productId);
  }, [wishlistItems]);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

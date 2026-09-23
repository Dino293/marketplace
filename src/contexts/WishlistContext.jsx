// src/contexts/WishlistContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getWishlistProducts, addToWishlist, removeFromWishlist } from '../utils/api';
import { useToast } from './ToastContext';
import { useLocale } from './LocaleContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistUpdate, setWishlistUpdate] = useState(0);
  const { showToast } = useToast();
  const { locale } = useLocale();

  const fetchWishlist = async () => {
    try {
      const res = await getWishlistProducts();
      if (!res.error && Array.isArray(res.data)) {
        setWishlistItems(res.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [wishlistUpdate]);

  const toggleWishlist = async (productId) => {
    try {
      const isInWishlist = wishlistItems.some(item => item.id === productId);
      
      if (isInWishlist) {
        await removeFromWishlist(productId);
        showToast(
          locale === "id" ? "Produk dihapus dari wishlist" : "Product removed from wishlist", 
          "success"
        );
      } else {
        await addToWishlist(productId);
        showToast(
          locale === "id" ? "Produk ditambahkan ke wishlist" : "Product added to wishlist", 
          "success"
        );
      }
      
      setWishlistUpdate(prev => prev + 1);
      return !isInWishlist;
    } catch (error) {
      showToast(
        locale === "id" ? "Gagal mengupdate wishlist" : "Failed to update wishlist", 
        "error"
      );
      throw error;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const value = {
    wishlistItems,
    toggleWishlist,
    isInWishlist,
    refreshWishlist: () => setWishlistUpdate(prev => prev + 1)
  };

  return (
    <WishlistContext.Provider value={value}>
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
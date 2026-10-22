// src/contexts/WishlistContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getWishlistProducts, toggleWishlistApi } from '../utils/api';
import { useToast } from './ToastContext';
import { useLocale } from './LocaleContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { locale } = useLocale();

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await getWishlistProducts();
      if (!res.error && Array.isArray(res.data)) {
        setWishlistItems(res.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    try {
      setLoading(true);
      const res = await toggleWishlistApi(productId);
      const nowInWishlist = res.inWishlist;
      
      showToast(
        nowInWishlist
          ? (locale === 'id' ? 'Ditambahkan ke wishlist' : 'Added to wishlist')
          : (locale === 'id' ? 'Dihapus dari wishlist' : 'Removed from wishlist'),
        'success'
      );
      
      await fetchWishlist();
      return nowInWishlist;
    } catch (error) {
      showToast(
        locale === 'id' ? 'Gagal mengupdate wishlist' : 'Failed to update wishlist',
        'error'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => String(item.id) === String(productId));
  };

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    toggleWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist,
    loading
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
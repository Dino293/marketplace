// src/contexts/CartContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
  getCart as apiGetCart, 
  addToCart as apiAddToCart, 
  updateCartQuantity as apiUpdateQty,
  removeFromCart as apiRemoveFromCart, 
  checkout as apiCheckout,
  clearCart as apiClearCart
} from '../utils/api';
import { useToast } from './ToastContext';
import { useLocale } from './LocaleContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { locale } = useLocale();

  const fetchCart = useCallback(async () => {
    try {
      const res = await apiGetCart();
      if (!res.error && Array.isArray(res.data)) {
        setCartItems(res.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, variantDetails = null, quantity = 1) => {
    try {
      setLoading(true);
      const res = await apiAddToCart(productId, variantDetails, quantity);
      if (!res.error && res.data) {
        setCartItems(res.data);
        showToast(
          locale === 'id' ? 'Produk berhasil ditambahkan ke keranjang!' : 'Product added to cart!',
          'success'
        );
      }
      return res;
    } catch (error) {
      showToast(
        locale === 'id' ? 'Gagal menambah ke keranjang' : 'Failed to add to cart',
        'error'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQty) => {
    try {
      const res = await apiUpdateQty(cartItemId, newQty);
      if (!res.error && res.data) {
        setCartItems(res.data);
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);
      const res = await apiRemoveFromCart(cartItemId);
      if (!res.error && res.data) {
        setCartItems(res.data);
        showToast(
          locale === 'id' ? 'Produk dihapus dari keranjang' : 'Product removed from cart',
          'success'
        );
      }
      return res;
    } catch (error) {
      showToast(
        locale === 'id' ? 'Gagal menghapus dari keranjang' : 'Failed to remove from cart',
        'error'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    await apiClearCart();
    setCartItems([]);
  };

  const checkout = async (orderDetails) => {
    try {
      setLoading(true);
      const res = await apiCheckout(orderDetails);
      if (!res.error) {
        if (Array.isArray(res.remainingCart)) {
          setCartItems(res.remainingCart);
        } else {
          setCartItems([]);
        }
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);

  const value = {
    cartItems,
    cartCount,
    cartSubtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
    refreshCart: fetchCart,
    loading
  };

  return (
    <CartContext.Provider value={value}>
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

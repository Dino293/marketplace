import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";
import { useLocale } from "./LocaleContext";

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const stored = localStorage.getItem("trio_compare_items");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();
  const { locale } = useLocale();

  useEffect(() => {
    try {
      localStorage.setItem("trio_compare_items", JSON.stringify(compareItems));
    } catch (e) {
      console.error("Failed to save compare items", e);
    }
  }, [compareItems]);

  const addToCompare = (product) => {
    if (!product || !product.id) return;

    if (compareItems.some(item => String(item.id) === String(product.id))) {
      showToast(
        locale === "id" 
          ? "Produk ini sudah ada di daftar perbandingan" 
          : "Product is already in compare list",
        "info"
      );
      return;
    }

    if (compareItems.length >= 4) {
      showToast(
        locale === "id" 
          ? "Maksimal perbandingan adalah 4 produk sekaligus" 
          : "Maximum comparison limit is 4 products",
        "warning"
      );
      return;
    }

    setCompareItems(prev => [...prev, product]);
    showToast(
      locale === "id" 
        ? `"${product.title}" ditambahkan ke perbandingan!` 
        : `Added to comparison!`,
      "success"
    );
  };

  const removeFromCompare = (productId) => {
    setCompareItems(prev => prev.filter(item => String(item.id) !== String(productId)));
    showToast(
      locale === "id" 
        ? "Produk dihapus dari perbandingan" 
        : "Product removed from compare",
      "info"
    );
  };

  const toggleCompare = (product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId) => {
    return compareItems.some(item => String(item.id) === String(productId));
  };

  const value = {
    compareItems,
    compareCount: compareItems.length,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    clearCompare,
    isInCompare
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}

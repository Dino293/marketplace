import React, { createContext, useState, useContext, useEffect } from 'react';

const LocaleContext = createContext();

export const translations = {
  id: {
    home: "Beranda",
    catalog: "Katalog",
    cart: "Keranjang",
    wishlist: "Wishlist",
    profile: "Profil Saya",
    login: "Masuk",
    register: "Daftar",
    logout: "Keluar Akun",
    searchPlaceholder: "Cari gadget, smartphone, aksesoris resmi...",
    allProducts: "Semua Produk",
    newArrivals: "Produk Terbaru",
    bestSellers: "Produk Terlaris",
    flashSale: "Flash Sale Terbatas",
    popularCategories: "Kategori Pilihan",
    officialWarranty: "Garansi Resmi 1 Tahun",
    fastDelivery: "Pengiriman Cepat",
    securePayment: "Transaksi 100% Aman",
    bestPrice: "Harga Terbaik Distributor",
    addToCart: "+ Keranjang",
    buyNow: "Beli Sekarang",
    emptyCart: "Keranjang Belanja Masih Kosong",
    emptyWishlist: "Wishlist Masih Kosong",
    checkout: "Lanjut ke Pembayaran",
    orderHistory: "Riwayat Pesanan",
    savedAddresses: "Alamat Tersimpan",
    darkMode: "Mode Gelap",
    lightMode: "Mode Terang",
    language: "Bahasa",
    guestNotice: "Anda dapat melihat-lihat katalog kami dengan bebas. Masuk akun diperlukan saat melakukan transaksi pembelian atau penjualan."
  },
  en: {
    home: "Home",
    catalog: "Catalog",
    cart: "Cart",
    wishlist: "Wishlist",
    profile: "My Profile",
    login: "Login",
    register: "Register",
    logout: "Logout",
    searchPlaceholder: "Search gadgets, smartphones, accessories...",
    allProducts: "All Products",
    newArrivals: "New Arrivals",
    bestSellers: "Weekly Best Sellers",
    flashSale: "Limited Flash Sale",
    popularCategories: "Popular Categories",
    officialWarranty: "1 Year Official Warranty",
    fastDelivery: "Fast Express Delivery",
    securePayment: "100% Secure Transaction",
    bestPrice: "Official Distributor Price",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    emptyCart: "Your Shopping Cart is Empty",
    emptyWishlist: "Your Wishlist is Empty",
    checkout: "Proceed to Checkout",
    orderHistory: "Order History",
    savedAddresses: "Saved Addresses",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    language: "Language",
    guestNotice: "You can freely browse our products. Logging in is only required when buying or selling items."
  }
};

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    try {
      const saved = localStorage.getItem('trio_locale');
      if (saved === 'id' || saved === 'en') return saved;
    } catch {
      // fallback
    }
    return 'id';
  });

  useEffect(() => {
    try {
      localStorage.setItem('trio_locale', locale);
    } catch (e) {
      console.error('Failed to save locale:', e);
    }
  }, [locale]);

  const toggleLocale = () => {
    setLocale(prev => (prev === 'id' ? 'en' : 'id'));
  };

  const t = (key) => {
    return translations[locale]?.[key] || translations['id']?.[key] || key;
  };

  const value = {
    locale,
    setLocale,
    toggleLocale,
    t
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
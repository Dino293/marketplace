import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSearch } from "../contexts/SearchContext";
import { useLocale } from "../contexts/LocaleContext";
import { useTheme } from "../contexts/ThemeContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { useCompare } from "../contexts/CompareContext";
import { getStoredOrders } from "../utils/api";
import SearchBar from "./SearchBar";
import OrderModal from "./OrderModal";
import {
  User,
  Heart,
  ShoppingBag,
  Smartphone,
  Headphones,
  Laptop,
  Tag,
  PlusCircle,
  LogOut,
  ChevronDown,
  Globe,
  Compass,
  Sun,
  Moon,
  Scale
} from "lucide-react";

export default function Navigation() {
  const { authUser, logout } = useAuth();
  const { 
    selectCategory, 
    selectBrand 
  } = useSearch();
  const { locale, toggleLocale, t } = useLocale();
  const { isDark, toggleTheme } = useTheme();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const { compareCount } = useCompare();
  
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const userMenuRef = useRef(null);
  const navDropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleOpenOrders = () => {
    setUserMenuOpen(false);
    setOrders(getStoredOrders());
    setOrderModalOpen(true);
  };

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (navDropdownRef.current && !navDropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    {
      icon: <Smartphone size={17} className="text-blue-500" />,
      label: locale === "id" ? "Ponsel & Tablet" : "Phones & Tablets",
      options: ["Smartphone", "Tablet"],
      category: "smartphone"
    },
    {
      icon: <Headphones size={17} className="text-purple-500" />,
      label: locale === "id" ? "Audio & Wearable" : "Audio & Wearable",
      options: ["Audio", "Accessories"],
      category: "audio"
    },
    {
      icon: <Laptop size={17} className="text-amber-500" />,
      label: locale === "id" ? "Komputer & Tablet" : "PC & Tablets",
      options: ["Tablet", "Accessories"],
      category: "tablet"
    },
    {
      icon: <Tag size={17} className="text-rose-500" />,
      label: locale === "id" ? "Brand Resmi" : "Official Brands",
      options: ["Apple", "Samsung", "Xiaomi", "Realme", "Vivo"],
      isBrand: true
    },
  ];

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleCategorySelect = (option, isBrand = false) => {
    if (isBrand) {
      selectBrand(option);
    } else {
      selectCategory(option.toLowerCase());
    }
    setActiveDropdown(null);
    navigate("/catalog");
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors duration-200">
        {/* Top Mini Bar */}
        <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 text-[11px] py-1.5 px-3 sm:px-6 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-slate-200 truncate max-w-[180px] xs:max-w-xs sm:max-w-none">
                {locale === "id" 
                  ? "Distributor Resmi Gadget & Aksesori Terpercaya Indonesia" 
                  : "Official Distributor of Premium Gadgets in Indonesia"}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/about" className="hover:text-white transition-colors hidden sm:inline">
                {locale === "id" ? "Tentang TRIO" : "About Us"}
              </Link>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-slate-300 font-semibold"
                aria-label="Toggle dark/light mode"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} className="text-blue-300" />}
                <span className="hidden sm:inline">{isDark ? "Terang" : "Gelap"}</span>
              </button>

              {/* Language Toggle Button */}
              <button 
                onClick={toggleLocale}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-slate-300 font-semibold"
                aria-label="Toggle language"
                title="Switch Language"
              >
                <Globe size={13} />
                <span className="uppercase">{locale}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                T
              </div>
              <div className="leading-tight">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  TRIO <span className="text-blue-600 font-extrabold text-sm sm:text-base">Distribusi</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block tracking-wider uppercase">
                  Marketplace
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl hidden md:block">
              <SearchBar />
            </div>

            {/* Quick Links & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Katalog Button */}
              <Link
                to="/catalog"
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-50/80 dark:hover:bg-slate-800 transition-colors"
              >
                <Compass size={17} />
                <span>{locale === "id" ? "Semua Katalog" : "Catalog"}</span>
              </Link>

              {/* Wishlist Link (Public for Guests too) */}
              <Link 
                to="/wishlist" 
                className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Compare Link */}
              <Link
                to="/compare"
                className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                aria-label="Perbandingan Produk"
                title="Bandingkan Barang (Compare)"
              >
                <Scale size={20} />
                {compareCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {compareCount}
                  </span>
                )}
              </Link>

              {/* Cart Link (Public for Guests too) */}
              <Link 
                to="/cart" 
                className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                aria-label="Shopping Cart"
                title="Keranjang Belanja"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={userMenuRef}>
                {authUser ? (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-black text-xs flex items-center justify-center">
                      {authUser.name ? authUser.name.charAt(0) : "U"}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 hidden sm:inline max-w-[100px] truncate">
                      {authUser.name || "Akun"}
                    </span>
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {locale === "id" ? "Masuk" : "Login"}
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors"
                    >
                      {locale === "id" ? "Daftar" : "Register"}
                    </Link>
                  </div>
                )}

                {/* Dropdown Menu */}
                {userMenuOpen && authUser && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">{authUser.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{authUser.email}</p>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        authUser.role === 'seller'
                          ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                      }`}>
                        {authUser.role === 'seller' ? "🏪 Penjual Mitra (Official)" : "🛒 Pembeli Terverifikasi"}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-blue-600 transition-colors"
                    >
                      <User size={16} />
                      <span>{locale === "id" ? "Profil & Alamat Saya" : "My Profile & Address"}</span>
                    </Link>

                    <button
                      onClick={handleOpenOrders}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <ShoppingBag size={16} />
                      <span>{locale === "id" ? "Riwayat Pesanan" : "Order History"}</span>
                    </button>

                    <Link
                      to="/add-product"
                      onClick={() => setUserMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors ${
                        authUser.role === 'seller'
                          ? "text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-blue-600"
                      }`}
                    >
                      <PlusCircle size={16} className={authUser.role === 'seller' ? "text-emerald-600" : ""} />
                      <span>{locale === "id" ? "Tambah Produk (Jual)" : "Add Product (Sell)"}</span>
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer font-semibold"
                      >
                        <LogOut size={16} />
                        <span>{locale === "id" ? "Keluar Akun" : "Logout"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search bar for mobile */}
          <div className="mt-3 md:hidden">
            <SearchBar />
          </div>

          {/* Category Quick Bar (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800" ref={navDropdownRef}>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {locale === "id" ? "Kategori Cepat:" : "Categories:"}
            </span>
            {categories.map((cat, idx) => (
              <div key={idx} className="relative">
                <button
                  onClick={() => toggleDropdown(idx)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                    activeDropdown === idx 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                  <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === idx ? "rotate-180" : ""}`} />
                </button>

                {activeDropdown === idx && (
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {cat.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleCategorySelect(opt, cat.isBrand)}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* Order Modal Component */}
      <OrderModal 
        isOpen={orderModalOpen} 
        onClose={() => setOrderModalOpen(false)} 
        orders={orders} 
      />
    </>
  );
}
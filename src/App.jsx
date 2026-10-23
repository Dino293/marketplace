import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";

// Pages
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import DetailPage from "./pages/DetailPage";
import ComparePage from "./pages/ComparePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AddProductPage from "./pages/AddProductPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

// Contexts
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { SearchProvider } from "./contexts/SearchContext";
import { LocaleProvider } from "./contexts/LocaleContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import { CompareProvider } from "./contexts/CompareContext";

// Components & Route Guards
import MobileBottomNav from "./components/MobileBottomNav";
import CompareFloatingBar from "./components/CompareFloatingBar";
import ChatbotWidget from "./components/ChatbotWidget";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LocaleProvider>
          <AuthProvider>
            <SearchProvider>
              <ToastProvider>
                <WishlistProvider>
                  <CartProvider>
                    <CompareProvider>
                      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans pb-16 md:pb-0 transition-colors duration-200">
                        <Navigation />
                        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
                          <Routes>
                            {/* Public & Guest Friendly Browsing (No Login Required) */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/catalog" element={<CatalogPage />} />
                            <Route path="/products/:id" element={<DetailPage />} />
                            <Route path="/compare" element={<ComparePage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            
                            {/* Protected Actions (Account Required) */}
                            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                            <Route path="/add-product" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
                            
                            {/* Auth Routes */}
                            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                            
                            {/* 404 Page */}
                            <Route path="*" element={<NotFoundPage />} />
                          </Routes>
                        </main>
                        
                        {/* Global Interactive Floatings & Widgets */}
                        <CompareFloatingBar />
                        <ChatbotWidget />
                        <MobileBottomNav />
                      </div>
                    </CompareProvider>
                  </CartProvider>
                </WishlistProvider>
              </ToastProvider>
            </SearchProvider>
          </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
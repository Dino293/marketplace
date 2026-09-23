import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";

// Pages
import HomePage from "./pages/HomePage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import DetailPage from "./pages/DetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { SearchProvider } from "./contexts/SearchContext";
import { LocaleProvider } from "./contexts/LocaleContext";
import { WishlistProvider } from "./contexts/WishlistContext";

// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <LocaleProvider>
        <AuthProvider>
          <SearchProvider>
            <ToastProvider>
              <WishlistProvider>
                <div className="app">
                  <Navigation />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                      <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                      <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                      <Route path="/products/:id" element={<ProtectedRoute><DetailPage /></ProtectedRoute>} />
                      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                </div>
              </WishlistProvider>
            </ToastProvider>
          </SearchProvider>
        </AuthProvider>
      </LocaleProvider>
    </ErrorBoundary>
  );
}
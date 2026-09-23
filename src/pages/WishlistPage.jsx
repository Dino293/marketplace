// src/pages/WishlistPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, addToCart } from "../utils/api";
import Spinner from "../components/Spinner";
import { useToast } from "../contexts/ToastContext";
import { useLocale } from "../contexts/LocaleContext";
import { useSearch } from "../contexts/SearchContext";
import { useWishlist } from "../contexts/WishlistContext";
import FooterSection from "../components/FooterSection";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import "../styles/style.css";

export default function WishlistPage() {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const { showToast } = useToast();
  const { locale } = useLocale();
  const { searchKeyword } = useSearch();
  const { wishlistItems, refreshWishlist, toggleWishlist } = useWishlist();

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    setActionLoading(id);
    try {
      await deleteProduct(id);
      showToast(locale === "id" ? "Produk dihapus" : "Product deleted", "success");
      refreshWishlist();
    } catch {
      showToast(locale === "id" ? "Gagal menghapus produk" : "Failed to delete product", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddToCart = async (id, e) => {
    e?.stopPropagation();
    setActionLoading(`cart-${id}`);
    try {
      await addToCart(id);
      showToast(locale === "id" ? "Produk ditambahkan ke keranjang" : "Product added to cart", "success");
      // Remove from wishlist after adding to cart
      await toggleWishlist(id);
    } catch {
      showToast(locale === "id" ? "Gagal menambah ke keranjang" : "Failed to add to cart", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveFromWishlist = async (id, e) => {
    e?.stopPropagation();
    setActionLoading(`wishlist-${id}`);
    try {
      await toggleWishlist(id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddAllToCart = async () => {
    setLoading(true);
    try {
      for (const item of filtered) {
        await addToCart(item.id);
        await toggleWishlist(item.id);
      }
      showToast(
        locale === "id" ? "Semua produk ditambahkan ke keranjang" : "All products added to cart", 
        "success"
      );
    } catch {
      showToast(
        locale === "id" ? "Gagal menambah beberapa produk" : "Failed to add some products", 
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const filtered = wishlistItems.filter((p) =>
    p.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const totalValue = filtered.reduce((sum, item) => sum + (item.price || 0), 0);

  if (wishlistItems.length === 0 && !searchKeyword) {
    return (
      <main className="wishlist-page">
        <div className="container">
          <div className="empty-wishlist">
            <Heart size={64} className="empty-icon" />
            <h2>{locale === "id" ? "Wishlist Kosong" : "Wishlist Empty"}</h2>
            <p>
              {locale === "id" 
                ? "Belum ada produk yang ditambahkan ke wishlist." 
                : "No products have been added to your wishlist yet."
              }
            </p>
            <Link to="/" className="btn-primary">
              {locale === "id" ? "Jelajahi Produk" : "Explore Products"}
            </Link>
          </div>
        </div>
        <FooterSection />
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1>{locale === "id" ? "Wishlist Anda" : "Your Wishlist"}</h1>
          <div className="wishlist-stats">
            <span>{filtered.length} {locale === "id" ? "produk" : "products"}</span>
            <span>•</span>
            <span>Rp {totalValue.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-wishlist">
            <p>
              {locale === "id" 
                ? `Tidak ada hasil untuk "${searchKeyword}"` 
                : `No results found for "${searchKeyword}"`
              }
            </p>
            <Link to="/" className="btn-primary">
              {locale === "id" ? "Jelajahi Produk" : "Explore Products"}
            </Link>
          </div>
        ) : (
          <div className="wishlist-content">
            <div className="wishlist-grid">
              {filtered.map((item) => (
                <div key={item.id} className="wishlist-item">
                  <Link to={`/products/${item.id}`} className="item-link">
                    <div className="item-image">
                      <img src={item.image} alt={item.title} />
                      <button 
                        className={`wishlist-remove-btn ${actionLoading === `wishlist-${item.id}` ? 'loading' : ''}`}
                        onClick={(e) => handleRemoveFromWishlist(item.id, e)}
                        disabled={actionLoading === `wishlist-${item.id}`}
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>
                    </div>
                    
                    <div className="item-info">
                      <h3 className="item-title">{item.title}</h3>
                      <p className="item-brand">{item.brand}</p>
                      <p className="item-price">Rp {item.price.toLocaleString("id-ID")}</p>
                    </div>
                  </Link>

                  <div className="item-actions">
                    <button 
                      onClick={(e) => handleAddToCart(item.id, e)}
                      disabled={actionLoading === `cart-${item.id}`}
                      className="btn-add-cart"
                    >
                      <ShoppingCart size={16} />
                      {actionLoading === `cart-${item.id}` 
                        ? (locale === "id" ? "Menambah..." : "Adding...") 
                        : (locale === "id" ? "Tambah Keranjang" : "Add to Cart")
                      }
                    </button>
                    
                    <button 
                      onClick={(e) => handleDelete(item.id, e)}
                      disabled={actionLoading === item.id}
                      className="btn-remove"
                    >
                      <Trash2 size={16} />
                      {actionLoading === item.id 
                        ? (locale === "id" ? "Menghapus..." : "Deleting...") 
                        : (locale === "id" ? "Hapus" : "Delete")
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="wishlist-sidebar">
              <div className="summary-card">
                <h3>{locale === "id" ? "Ringkasan Wishlist" : "Wishlist Summary"}</h3>
                <div className="summary-item">
                  <span>{locale === "id" ? "Total Produk" : "Total Items"}</span>
                  <span>{filtered.length}</span>
                </div>
                <div className="summary-item">
                  <span>{locale === "id" ? "Total Nilai" : "Total Value"}</span>
                  <span>Rp {totalValue.toLocaleString("id-ID")}</span>
                </div>
                <button 
                  onClick={handleAddAllToCart}
                  disabled={loading}
                  className="btn-primary full-width"
                >
                  {loading 
                    ? (locale === "id" ? "Menambah..." : "Adding...") 
                    : (locale === "id" ? "Tambah Semua ke Keranjang" : "Add All to Cart")
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <FooterSection />
    </main>
  );
}
// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, removeFromCart, checkout } from "../utils/api";
import Spinner from "../components/Spinner";
import { useToast } from "../contexts/ToastContext";
import { useLocale } from "../contexts/LocaleContext";
import FooterSection from "../components/FooterSection";
import { Trash2, Plus, Minus, Shield, Truck, ArrowRight } from "lucide-react";
import "../styles/style.css";

export default function CartPage() {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState({});
  const { showToast } = useToast();
  const { locale } = useLocale();

  const fetchCartProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      if (!res.error && Array.isArray(res.data)) {
        setCartProducts(res.data.filter((p) => p.inCart));
      } else {
        setCartProducts([]);
      }
    } catch {
      setCartProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const handleRemoveFromCart = async (id) => {
    setUpdatingItems(prev => ({ ...prev, [id]: true }));
    try {
      await removeFromCart(id);
      showToast(
        locale === "id" ? "Produk dihapus dari keranjang" : "Product removed from cart",
        "success"
      );
      fetchCartProducts();
    } catch {
      showToast(
        locale === "id" ? "Gagal menghapus dari keranjang" : "Failed to remove from cart",
        "error"
      );
    } finally {
      setUpdatingItems(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout();
      showToast(
        locale === "id" ? "Checkout berhasil" : "Checkout successful",
        "success"
      );
      setCartProducts([]);
    } catch {
      showToast(
        locale === "id" ? "Gagal checkout" : "Failed to checkout",
        "error"
      );
    }
  };

  const subtotal = cartProducts.reduce((total, product) => total + (product.price || 0), 0);
  const shippingFee = subtotal > 500000 ? 0 : 25000;
  const total = subtotal + shippingFee;

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner />
      </div>
    );
  }

  return (
    <main className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>{locale === "id" ? "Keranjang Belanja" : "Shopping Cart"}</h1>
          <span className="item-count">
            {cartProducts.length} {locale === "id" ? "item" : "items"}
          </span>
        </div>

        {cartProducts.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>{locale === "id" ? "Keranjang Kosong" : "Your Cart is Empty"}</h2>
            <p>
              {locale === "id" 
                ? "Belum ada produk yang ditambahkan ke keranjang." 
                : "You haven't added any products to your cart yet."
              }
            </p>
            <Link to="/" className="btn-primary">
              {locale === "id" ? "Jelajahi Produk" : "Explore Products"}
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-section">
              <div className="cart-items">
                {cartProducts.map((product) => (
                  <div key={product.id} className="cart-item">
                    <div className="item-image">
                      <img src={product.image} alt={product.title} />
                    </div>
                    
                    <div className="item-details">
                      <h3 className="item-title">{product.title}</h3>
                      <p className="item-brand">{product.brand}</p>
                      <p className="item-price">Rp {product.price.toLocaleString("id-ID")}</p>
                      
                      <div className="item-actions">
                        <button 
                          onClick={() => handleRemoveFromCart(product.id)}
                          disabled={updatingItems[product.id]}
                          className="remove-btn"
                        >
                          <Trash2 size={16} />
                          {locale === "id" ? "Hapus" : "Remove"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="trust-badges">
                <div className="trust-item">
                  <Shield size={20} />
                  <span>{locale === "id" ? "Transaksi Aman" : "Secure Transaction"}</span>
                </div>
                <div className="trust-item">
                  <Truck size={20} />
                  <span>{locale === "id" ? "Pengiriman Cepat" : "Fast Shipping"}</span>
                </div>
              </div>
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>{locale === "id" ? "Ringkasan Belanja" : "Order Summary"}</h3>
                
                <div className="summary-row">
                  <span>{locale === "id" ? "Subtotal" : "Subtotal"}</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                
                <div className="summary-row">
                  <span>{locale === "id" ? "Biaya Pengiriman" : "Shipping"}</span>
                  <span>
                    {shippingFee === 0 
                      ? (locale === "id" ? "Gratis" : "Free") 
                      : `Rp ${shippingFee.toLocaleString("id-ID")}`
                    }
                  </span>
                </div>

                {shippingFee > 0 && subtotal < 500000 && (
                  <div className="shipping-notice">
                    {locale === "id" 
                      ? `Tambahkan Rp ${(500000 - subtotal).toLocaleString("id-ID")} lagi untuk gratis ongkir!` 
                      : `Add Rp ${(500000 - subtotal).toLocaleString("id-ID")} more for free shipping!`
                    }
                  </div>
                )}

                <div className="summary-divider"></div>

                <div className="summary-total">
                  <span>{locale === "id" ? "Total" : "Total"}</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>

                <button onClick={handleCheckout} className="checkout-btn">
                  {locale === "id" ? "Lanjutkan ke Pembayaran" : "Proceed to Checkout"}
                  <ArrowRight size={16} />
                </button>

                <div className="security-notice">
                  <Shield size={14} />
                  <span>
                    {locale === "id" 
                      ? "Transaksi Anda aman dan terenkripsi" 
                      : "Your transaction is secure and encrypted"
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <FooterSection />
    </main>
  );
}
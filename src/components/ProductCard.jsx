import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { addToCart } from "../utils/api";
import { useToast } from "../contexts/ToastContext";
import { useLocale } from "../contexts/LocaleContext";
import { useWishlist } from "../contexts/WishlistContext";
import "../styles/style.css";

const ProductCard = ({ product, showDiscount = false, onWishlistUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { showToast } = useToast();
  const { locale } = useLocale();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);
  const fallbackImage = "/images/placeholder.jpg";

  const handleImageError = (e) => {
    if (e.target.src !== fallbackImage) {
      e.target.src = fallbackImage;
      e.target.className = 'image-error';
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    setLoading(true);
    try {
      await toggleWishlist(product.id);
      
      if (onWishlistUpdate) {
        onWishlistUpdate();
      }
    } catch (error) {
      // Error already handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart(product.id);
      showToast(
        locale === "id" ? "Produk ditambahkan ke keranjang" : "Product added to cart", 
        "success"
      );
    } catch (error) {
      showToast(
        locale === "id" ? "Gagal menambah ke keranjang" : "Failed to add to cart", 
        "error"
      );
    }
  };

  // Calculate rating (mock data)
  const rating = 4.5;
  const reviewCount = 128;

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="card-link">
        <div className="card-image-container">
          {!imageLoaded && (
            <div className="image-skeleton"></div>
          )}
          <img 
            src={product.image || fallbackImage} 
            alt={product.title}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
          {showDiscount && <div className="discount-badge">-20%</div>}
          
          <button 
            className={`wishlist-btn ${inWishlist ? 'in-wishlist' : ''} ${loading ? 'loading' : ''}`}
            onClick={handleToggleWishlist}
            disabled={loading}
            aria-label={inWishlist ? 
              (locale === "id" ? "Hapus dari wishlist" : "Remove from wishlist") : 
              (locale === "id" ? "Tambahkan ke wishlist" : "Add to wishlist")
            }
          >
            {inWishlist ? (
              <Heart size={20} fill="currentColor" />
            ) : (
              <Heart size={20} />
            )}
          </button>
        </div>
        
        <div className="card-content">
          <div className="product-brand-badge">{product.brand}</div>
          
          <h3 className="item-title">{product.title}</h3>
          
          <div className="rating-section">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  size={14}
                  fill={star <= Math.floor(rating) ? "#ffc107" : "none"}
                  color="#ffc107"
                />
              ))}
              <span className="rating-text">{rating}</span>
            </div>
            <span className="review-count">({reviewCount})</span>
          </div>

          <div className="price-section">
            <p className="item-price">Rp {product.price?.toLocaleString("id-ID") || '0'}</p>
            {showDiscount && (
              <p className="original-price">
                Rp {((product.price || 0) * 1.25).toLocaleString("id-ID")}
              </p>
            )}
          </div>
          
          <button 
            className="quick-cart-btn"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            {locale === "id" ? "Tambah Keranjang" : "Add to Cart"}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
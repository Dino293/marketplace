import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, AlertCircle } from "lucide-react";
import { useLocale } from "../contexts/LocaleContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";

const ProductCard = ({ product, showDiscount = false, onWishlistUpdate }) => {
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { locale } = useLocale();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const inWishlist = isInWishlist(product.id);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loadingWishlist) return;
    setLoadingWishlist(true);
    try {
      await toggleWishlist(product.id);
      if (onWishlistUpdate) onWishlistUpdate();
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id);
    } catch {
      // toast already fired
    }
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : showDiscount ? 15 : null;

  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link to={`/products/${product.id}`} className="flex flex-col h-full">
        {/* Image Container with Badges */}
        <div className="relative w-full aspect-square bg-slate-50/90 dark:bg-slate-900/60 overflow-hidden flex items-center justify-center p-3 sm:p-5">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 animate-pulse"></div>
          )}
          
          {imageError ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 p-4 text-center">
              <ShoppingBag size={36} className="mb-1 text-slate-300 dark:text-slate-600" />
              <span className="text-[10px] text-slate-400 font-medium">PT. TRIO Distribusi</span>
            </div>
          ) : (
            <img 
              src={product.image} 
              alt={product.title}
              onError={() => setImageError(true)}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
              className={`w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
          
          {/* Discount Badge */}
          {discountPercent && (
            <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-extrabold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs">
              -{discountPercent}%
            </span>
          )}

          {/* Low Stock Warning */}
          {isLowStock && (
            <span className="absolute bottom-2.5 left-2.5 bg-amber-500/95 text-white font-bold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 backdrop-blur-xs">
              <AlertCircle size={11} />
              {locale === "id" ? `Sisa ${product.stock}!` : `Only ${product.stock} left!`}
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button 
            type="button"
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md shadow-xs active:scale-90 transition-all cursor-pointer z-10 ${
              inWishlist 
                ? "bg-rose-50 dark:bg-rose-950/70 text-rose-500 hover:bg-rose-100" 
                : "bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-700"
            } ${loadingWishlist ? "opacity-50 pointer-events-none" : ""}`}
            onClick={handleToggleWishlist}
            disabled={loadingWishlist}
            aria-label={inWishlist ? "Hapus dari wishlist" : "Tambahkan ke wishlist"}
          >
            <Heart 
              size={17} 
              fill={inWishlist ? "currentColor" : "none"} 
              strokeWidth={2}
            />
          </button>
        </div>
        
        {/* Content Section */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
          <div>
            {/* Brand Badge */}
            {product.brand && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md inline-block mb-1.5">
                {product.brand}
              </span>
            )}
            
            {/* Title */}
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.title}
            </h3>
            
            {/* Rating Stars & Sold count */}
            <div className="flex items-center gap-1.5 my-1.5 text-xs">
              <div className="flex items-center text-amber-400">
                <Star size={13} fill="currentColor" stroke="none" />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200 text-xs">
                {product.rating || 4.8}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                ({product.reviewsCount || 40}+)
              </span>
            </div>
          </div>
          
          {/* Price & Action Button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 mt-2 flex items-center justify-between gap-2">
            <div>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through block leading-none mb-0.5">
                  Rp {product.originalPrice.toLocaleString("id-ID")}
                </span>
              )}
              <span className="text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                Rp {product.price?.toLocaleString("id-ID")}
              </span>
            </div>

            <button 
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isOutOfStock 
                  ? "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed" 
                  : "bg-blue-50 dark:bg-slate-700 hover:bg-blue-600 dark:hover:bg-blue-600 text-blue-600 dark:text-blue-300 hover:text-white dark:hover:text-white shadow-xs"
              }`}
              title={isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
            >
              <ShoppingBag size={16} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
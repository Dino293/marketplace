import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { useLocale } from "../contexts/LocaleContext";
import { useSearch } from "../contexts/SearchContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import FooterSection from "../components/FooterSection";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const { showToast } = useToast();
  const { locale } = useLocale();
  const { searchKeyword } = useSearch();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (id, e) => {
    e?.stopPropagation();
    setActionLoading(`cart-${id}`);
    try {
      await addToCart(id);
      await toggleWishlist(id);
    } catch {
      // toast already fired
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
        locale === "id" ? "Semua produk favorit berhasil dipindahkan ke keranjang" : "All products moved to cart", 
        "success"
      );
    } catch {
      showToast(
        locale === "id" ? "Gagal memproses beberapa produk" : "Failed to move products", 
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const filtered = wishlistItems.filter((p) =>
    (p.title || "").toLowerCase().includes((searchKeyword || "").toLowerCase())
  );

  const totalValue = filtered.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {locale === "id" ? "Wishlist Favorit Anda" : "Your Wishlist"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {filtered.length} {locale === "id" ? "produk impian tersimpan" : "saved items"} • Total Rp {totalValue.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
          <Heart size={24} fill="currentColor" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mb-4">
            <Heart size={36} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
            {locale === "id" ? "Wishlist Masih Kosong" : "Your Wishlist is Empty"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6">
            {locale === "id" 
              ? "Simpan gadget incaran Anda dengan mengklik ikon hati pada produk." 
              : "Save your favorite gadgets by tapping the heart icon on any product."}
          </p>
          <Link 
            to="/" 
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20"
          >
            {locale === "id" ? "Cari Produk Favorit" : "Explore Products"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Wishlist Items (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full aspect-square bg-slate-50 rounded-xl p-3 flex items-center justify-center overflow-hidden mb-3">
                    <img 
                      src={item.image || "/images/placeholder.jpg"} 
                      alt={item.title} 
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => { e.target.src = "/images/placeholder.jpg"; }}
                    />
                    <button
                      onClick={(e) => handleRemoveFromWishlist(item.id, e)}
                      disabled={actionLoading === `wishlist-${item.id}`}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-rose-50 shadow-xs transition-colors cursor-pointer"
                      title="Hapus dari Wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {item.brand || "Official"}
                  </span>
                  <Link to={`/products/${item.id}`}>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-sm font-extrabold text-slate-900 mt-2">
                    Rp {item.price?.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={(e) => handleAddToCart(item.id, e)}
                    disabled={actionLoading === `cart-${item.id}`}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <ShoppingCart size={14} />
                    <span>{locale === "id" ? "Pindahkan ke Keranjang" : "Move to Cart"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Wishlist Summary Card (4 cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                {locale === "id" ? "Ringkasan Wishlist" : "Wishlist Summary"}
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>{locale === "id" ? "Total Barang Favorit" : "Total Items"}</span>
                  <span className="font-bold text-slate-900">{filtered.length} item</span>
                </div>
                <div className="flex justify-between">
                  <span>{locale === "id" ? "Total Estimasi Nilai" : "Estimated Value"}</span>
                  <span className="font-extrabold text-blue-600 text-sm">
                    Rp {totalValue.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleAddAllToCart}
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{locale === "id" ? "Beli Semua (Pindah ke Cart)" : "Move All to Cart"}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <FooterSection />
    </div>
  );
}
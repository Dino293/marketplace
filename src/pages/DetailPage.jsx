import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, getProducts, getProductReviews, addProductReview } from "../utils/api";
import FooterSection from "../components/FooterSection";
import ProductCard from "../components/ProductCard";
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  ChevronRight, 
  Plus, 
  Minus, 
  Check, 
  AlertCircle,
  MessageSquare,
  Send,
  Sparkles
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { useLocale } from "../contexts/LocaleContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState("256GB");
  const [selectedColor, setSelectedColor] = useState("Titanium Gray");
  const [activeTab, setActiveTab] = useState("description"); // 'description' | 'specs' | 'reviews'
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const { showToast } = useToast();
  const { locale } = useLocale();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { authUser } = useAuth();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await getProductById(id);
        if (!res.error && res.data) {
          setProduct(res.data);
        } else {
          setProduct(null);
        }

        const revRes = await getProductReviews(id);
        if (!revRes.error) {
          setReviews(revRes.data || []);
        }

        const allRes = await getProducts();
        if (!allRes.error) {
          const related = allRes.data
            .filter(p => String(p.id) !== String(id))
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error loading product detail:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500">
          {locale === "id" ? "Memuat spesifikasi produk..." : "Loading product details..."}
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {locale === "id" ? "Produk Tidak Ditemukan" : "Product Not Found"}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          {locale === "id" ? "Produk yang Anda cari mungkin sudah dihapus atau tidak tersedia." : "The product you requested might have been removed."}
        </p>
        <Link to="/" className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs">
          {locale === "id" ? "Kembali ke Beranda" : "Back to Home"}
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const colors = [
    { name: "Titanium Gray", hex: "bg-slate-500" },
    { name: "Phantom Black", hex: "bg-slate-950" },
    { name: "Deep Blue", hex: "bg-blue-900" },
  ];

  const storages = [
    { label: "128GB", extra: 0 },
    { label: "256GB", extra: 1500000 },
    { label: "512GB", extra: 3500000 },
  ];

  const activeStorageExtra = storages.find(s => s.label === selectedStorage)?.extra || 0;
  const finalPrice = (product.price || 0) + activeStorageExtra;

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, {
        color: selectedColor,
        storage: selectedStorage,
        price: finalPrice
      }, quantity);
    } catch {
      // toast already fired
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  const handleAddReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await addProductReview(product.id, {
        rating: reviewRating,
        comment: reviewComment,
        userName: authUser?.name || "Pelanggan Setia"
      });
      if (!res.error && res.data) {
        setReviews([res.data, ...reviews]);
        setReviewComment("");
        showToast(locale === "id" ? "Ulasan Anda berhasil dikirim!" : "Review posted!", "success");
      }
    } catch {
      showToast(locale === "id" ? "Gagal mengirim ulasan" : "Failed to post review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const isLowStock = product.stock <= 5 && product.stock > 0;

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-blue-600 font-medium">Beranda</Link>
        <ChevronRight size={14} />
        <Link to="/catalog" className="hover:text-blue-600 font-medium capitalize">{product.category || "Gadget"}</Link>
        <ChevronRight size={14} />
        <span className="font-bold text-slate-800 truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Info Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full aspect-square bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center p-6 shadow-inner">
            <img 
              src={product.image || "/terlaris/1.jpg"} 
              alt={product.title} 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = "/terlaris/1.jpg";
              }}
            />
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                Diskon Promo
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl border-2 border-blue-600 p-1.5 bg-slate-50 cursor-pointer">
              <img src={product.image || "/terlaris/1.jpg"} alt="thumb" className="w-full h-full object-contain" />
            </div>
            <div className="w-16 h-16 rounded-xl border border-slate-200 p-1.5 bg-slate-50 cursor-pointer opacity-70 hover:opacity-100">
              <img src="/gulir/gambar 1.jpg" alt="thumb" className="w-full h-full object-contain" />
            </div>
            <div className="w-16 h-16 rounded-xl border border-slate-200 p-1.5 bg-slate-50 cursor-pointer opacity-70 hover:opacity-100">
              <img src="/gulir/gambar 2.jpg" alt="thumb" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        {/* Right: Details & Purchase Options */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                {product.brand || "Official"}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Garansi Resmi 1 Tahun PT. TRIO Distribusi
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Rating & Sold count */}
            <div className="flex items-center gap-3 mt-2.5 text-xs text-slate-600">
              <div className="flex items-center text-amber-400 gap-1 font-bold text-slate-800">
                <Star size={15} fill="currentColor" stroke="none" />
                <span>{product.rating || 4.8}</span>
              </div>
              <span>•</span>
              <span className="text-slate-500">{reviews.length} Ulasan Terverifikasi</span>
              <span>•</span>
              <span className="text-slate-500">Terjual 250+ unit</span>
            </div>
          </div>

          {/* Price */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">
                Rp {finalPrice.toLocaleString("id-ID")}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-slate-400 line-through">
                  Rp {(product.originalPrice + activeStorageExtra).toLocaleString("id-ID")}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="mt-2 flex items-center gap-2">
              {isLowStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">
                  <AlertCircle size={14} />
                  Stok Hampir Habis! Tersisa {product.stock} unit
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                  <Check size={14} />
                  Ready Stock di Gudang Distributor
                </span>
              )}
            </div>
          </div>

          {/* Varian Warna */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Pilih Warna: <strong className="text-slate-900">{selectedColor}</strong>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedColor === c.name
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${c.hex} border border-slate-300`}></span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Varian Kapasitas / Storage */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Kapasitas Penyimpanan: <strong className="text-slate-900">{selectedStorage}</strong>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {storages.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedStorage(s.label)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedStorage === s.label
                      ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Jumlah:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 shadow-xs cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-xs font-bold text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 shadow-xs cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-xs text-slate-400">Total Stok: {product.stock} unit</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 min-w-[160px] py-3.5 px-6 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 border border-blue-200 transition-colors cursor-pointer"
              >
                <ShoppingBag size={18} />
                <span>+ Keranjang</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 min-w-[160px] py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                Beli Sekarang
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-2xl border transition-colors cursor-pointer ${
                  inWishlist
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "bg-white border-slate-200 text-slate-400 hover:text-rose-500"
                }`}
                title={inWishlist ? "Hapus dari Wishlist" : "Simpan ke Wishlist"}
              >
                <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specs, Reviews */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-2 px-3 text-xs sm:text-sm font-extrabold transition-all cursor-pointer border-b-2 ${
              activeTab === "description"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Deskripsi Produk
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-2 px-3 text-xs sm:text-sm font-extrabold transition-all cursor-pointer border-b-2 ${
              activeTab === "specs"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Spesifikasi Lengkap
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-2 px-3 text-xs sm:text-sm font-extrabold transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === "reviews"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Ulasan Pembeli</span>
            <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === "description" && (
          <div className="prose text-xs sm:text-sm text-slate-600 leading-relaxed max-w-none space-y-3">
            <p>{product.description}</p>
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-slate-700 text-xs">
              <strong className="text-blue-900 block mb-1">Keunggulan Berbelanja di PT. TRIO Distribusi:</strong>
              <ul className="list-disc list-inside space-y-1">
                <li>Jaminan barang 100% original bersegel pabrik</li>
                <li>Garansi ganti unit 14 hari pertama jika ditemukan cacat pabrik</li>
                <li>Gratis konsultasi teknis & pengoperasian gadget</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Specs */}
        {activeTab === "specs" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {product.specs ? (
              Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">{k}</span>
                  <span className="font-semibold text-slate-900">{v}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500">Spesifikasi standar distributor resmi.</p>
            )}
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Write a Review */}
            <form onSubmit={handleAddReviewSubmit} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MessageSquare size={15} className="text-blue-600" />
                Tulis Ulasan untuk Produk Ini
              </h4>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Beri Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star size={18} fill={star <= reviewRating ? "currentColor" : "none"} strokeWidth={1.5} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Bagaimana pengalaman Anda memakai gadget ini? Ceritakan kualitas pengiriman, keaslian produk, dll."
                rows={3}
                className="w-full p-3 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                required
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send size={13} />
                <span>Kirim Ulasan</span>
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">{rev.userName}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.2 rounded-full font-bold">
                        {rev.userRole}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>

                  <div className="flex items-center text-amber-400 gap-0.5">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" stroke="none" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Produk Terkait Lainnya
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
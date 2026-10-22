import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import CategorySection from "../components/CategorySection";
import NewProductCarousel from "../components/NewProductCarousel";
import FlashSaleCarousel from "../components/FlashSaleCarousel";
import FooterSection from "../components/FooterSection";
import ProductCard from "../components/ProductCard";
import { 
  Shield, 
  PackageCheck, 
  Truck, 
  Tag, 
  X, 
  Filter, 
  Sparkles, 
  Flame, 
  Layers, 
  ArrowRight,
  ArrowUpDown,
  Compass
} from "lucide-react";
import { getProducts } from "../utils/api";
import { useLocale } from "../contexts/LocaleContext";
import { useSearch } from "../contexts/SearchContext";
import { useToast } from "../contexts/ToastContext";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistUpdate, setWishlistUpdate] = useState(0);
  const { locale } = useLocale();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { 
    searchKeyword, 
    selectedCategory, 
    clearFilters, 
    sortBy, 
    updateSort 
  } = useSearch();

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await getProducts();
        if (!res.error) {
          setProducts(res.data || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [wishlistUpdate]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(keyword) ||
        (product.brand && product.brand.toLowerCase().includes(keyword)) ||
        (product.category && product.category.toLowerCase().includes(keyword)) ||
        (product.description && product.description.toLowerCase().includes(keyword))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => 
        (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    return sorted;
  }, [products, searchKeyword, selectedCategory, sortBy]);

  const handleWishlistUpdate = () => {
    setWishlistUpdate(prev => prev + 1);
  };

  const handleClaimCoupon = (code) => {
    navigator.clipboard?.writeText(code);
    showToast(`Kupon ${code} berhasil disalin! Pakai di halaman keranjang saat checkout.`, "success");
  };

  const features = [
    { 
      icon: <Shield size={24} className="text-blue-600" />, 
      title: locale === "id" ? "Transaksi 100% Aman" : "100% Secure",
      desc: locale === "id" ? "Proteksi pembayaran terenkripsi" : "Encrypted payment protection" 
    },
    { 
      icon: <PackageCheck size={24} className="text-emerald-600" />, 
      title: locale === "id" ? "Garansi Resmi 1 Tahun" : "Official 1 Year Warranty",
      desc: locale === "id" ? "Klaim garansi mudah & terjamin" : "Guaranteed easy warranty claims" 
    },
    { 
      icon: <Truck size={24} className="text-amber-600" />, 
      title: locale === "id" ? "Pengiriman Cepat" : "Fast Delivery",
      desc: locale === "id" ? "SiCepat, JNE & GoSend Instant" : "Express & Instant logistics" 
    },
    { 
      icon: <Tag size={24} className="text-rose-600" />, 
      title: locale === "id" ? "Harga Distributor Resmi" : "Best Value Direct",
      desc: locale === "id" ? "Promo cashback & diskon kupon" : "Great cashbacks & deals" 
    },
  ];

  const brands = [
    { name: "Apple", image: "/produk/Apple.jpg" },
    { name: "Samsung", image: "/produk/Samsung.png" },
    { name: "Xiaomi", image: "/produk/Xiaomi.png" },
    { name: "Realme", image: "/produk/Realme.png" },
    { name: "Vivo", image: "/produk/Vivo.jpg" },
    { name: "Huawei", image: "/produk/Huawei.png" },
    { name: "Oppo", image: "/produk/Oppo.png" },
    { name: "Infinix", image: "/produk/Infinix.png" },
  ];

  const promoVouchers = [
    { image: "/promo/1.jpg", code: "TRIOBARU", text: "Diskon 10% Pengguna Baru" },
    { image: "/promo/2.jpg", code: "ONGKIRGRATIS", text: "Gratis Ongkos Kirim" },
    { image: "/promo/3.jpg", code: "HEMAT50", text: "Potongan Rp 50.000 Langsung" },
    { image: "/promo/4.jpg", code: "TRIOBARU", text: "Cashback Spesial Gadget" },
  ];

  const flashSaleItems = products.slice(0, 7);
  const newProducts = products.slice(7, 12);
  const bestSellers = products.slice(0, 8);
  const latestProducts = products.slice(4, 12);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">
          {locale === "id" ? "Menyiapkan produk terbaik..." : "Loading products..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Search Results Header if filter active */}
      {(searchKeyword || selectedCategory) && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">
                {locale === "id" ? "Hasil Pencarian" : "Search Results"}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {filteredProducts.length} {locale === "id" ? "produk ditemukan" : "products"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-600">
              {searchKeyword && (
                <span className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  {locale === "id" ? "Kata kunci:" : "Keyword:"} <strong className="text-slate-800">"{searchKeyword}"</strong>
                </span>
              )}
              {selectedCategory && (
                <span className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  {locale === "id" ? "Kategori:" : "Category:"} <strong className="text-slate-800">{selectedCategory}</strong>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown size={14} className="text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => updateSort(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold cursor-pointer"
              >
                <option value="latest">Terbaru</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>

            <button 
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <X size={15} />
              <span>{locale === "id" ? "Reset Filter" : "Reset Filter"}</span>
            </button>
          </div>
        </div>
      )}

      {/* When filtering is active */}
      {(searchKeyword || selectedCategory) ? (
        <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs">
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center">
              <div className="p-4 rounded-full bg-slate-100 text-slate-400 mb-4">
                <Filter size={36} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {locale === "id" ? "Tidak ada produk yang cocok" : "No matching products found"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6">
                {locale === "id" 
                  ? `Maaf, tidak ada produk yang cocok dengan pencarian Anda. Silakan coba kata kunci lain.`
                  : `Sorry, we couldn't find any products matching your query. Try different keywords.`}
              </p>
              <button 
                onClick={clearFilters}
                className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                {locale === "id" ? "Lihat Semua Produk" : "Browse All Products"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {filteredProducts.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  onWishlistUpdate={handleWishlistUpdate}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Normal Homepage Layout */
        <>
          {/* Hero Banner Carousel */}
          <NewProductCarousel items={newProducts} />

          {/* Value Features Strip */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-shadow"
              >
                <div className="p-2.5 rounded-xl bg-slate-50 shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{f.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Flash Sale Section */}
          <FlashSaleCarousel items={flashSaleItems} />

          {/* Categories Carousel */}
          <CategorySection />

          {/* Featured Brands */}
          <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-blue-600" />
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  {locale === "id" ? "Brand Pilihan & Resmi" : "Featured Brands"}
                </h2>
              </div>
              <Link 
                to="/catalog"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Semua Brand</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
              {brands.map((b, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/catalog")}
                  className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer text-center"
                >
                  <div className="w-12 h-12 flex items-center justify-center mb-2">
                    <img 
                      src={b.image} 
                      alt={b.name} 
                      className="max-h-full max-w-full object-contain filter group-hover:scale-110 transition-transform duration-200"
                      onError={(e) => {
                        e.target.src = '/terlaris/1.jpg';
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                    {b.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Best Sellers Grid */}
          <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Flame size={22} className="text-rose-500 fill-rose-500" />
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  {locale === "id" ? "Produk Terlaris Minggu Ini" : "Weekly Best Sellers"}
                </h2>
              </div>
              <Link
                to="/catalog"
                className="text-xs font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {bestSellers.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  showDiscount={true}
                  onWishlistUpdate={handleWishlistUpdate}
                />
              ))}
            </div>
          </section>

          {/* Promo Banners Grid */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {locale === "id" ? "Promo Spesial & Kupon Diskon" : "Special Promos & Vouchers"}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {promoVouchers.map((v, i) => (
                <div key={i} className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300">
                  <img 
                    src={v.image} 
                    alt={`Promo ${i + 1}`} 
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" 
                    onError={(e) => {
                      e.target.src = '/terlaris/1.jpg';
                    }} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <span className="text-[11px] font-bold text-white/90 drop-shadow-sm mb-1">{v.text}</span>
                    <button
                      onClick={() => handleClaimCoupon(v.code)}
                      className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-xl cursor-pointer w-fit shadow-xs transition-colors"
                    >
                      Klaim Kupon: {v.code}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Latest Products */}
          <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Layers size={22} className="text-blue-600" />
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  {locale === "id" ? "Rekomendasi Produk Terbaru" : "New Arrivals"}
                </h2>
              </div>
              <Link
                to="/catalog"
                className="text-xs font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Lihat Katalog</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {latestProducts.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  onWishlistUpdate={handleWishlistUpdate}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
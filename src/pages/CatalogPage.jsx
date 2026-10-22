import React, { useState, useEffect, useMemo } from "react";
import { getProducts } from "../utils/api";
import ProductCard from "../components/ProductCard";
import FooterSection from "../components/FooterSection";
import { useLocale } from "../contexts/LocaleContext";
import { useSearch } from "../contexts/SearchContext";
import { 
  Filter, 
  ArrowUpDown, 
  SlidersHorizontal, 
  X, 
  Check, 
  Sparkles,
  ShoppingBag,
  RotateCcw
} from "lucide-react";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  const { locale } = useLocale();
  const { 
    searchKeyword, 
    updateSearch,
    selectedCategory, 
    selectCategory, 
    selectedBrand, 
    selectBrand, 
    sortBy, 
    updateSort, 
    minPrice, 
    maxPrice, 
    setPriceRange,
    clearFilters 
  } = useSearch();

  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getProducts();
        if (!res.error && res.data) {
          setProducts(res.data);
        }
      } catch (e) {
        console.error("Error loading products:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const categories = [
    { label: "Semua Kategori", value: "all" },
    { label: "Smartphone", value: "smartphone" },
    { label: "Tablet", value: "tablet" },
    { label: "Audio", value: "audio" },
    { label: "Accessories", value: "accessories" },
  ];

  const brands = ["All", "Apple", "Samsung", "Xiaomi", "Realme", "Vivo"];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchKeyword) {
      const q = searchKeyword.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Brand
    if (selectedBrand && selectedBrand !== "All") {
      result = result.filter(p => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Stock
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Price
    if (minPrice > 0) {
      result = result.filter(p => p.price >= minPrice);
    }
    if (maxPrice > 0) {
      result = result.filter(p => p.price <= maxPrice);
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "latest":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [products, searchKeyword, selectedCategory, selectedBrand, inStockOnly, minPrice, maxPrice, sortBy]);

  const activeFiltersCount = (selectedCategory && selectedCategory !== "all" ? 1 : 0) +
    (selectedBrand && selectedBrand !== "All" ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minPrice > 0 || maxPrice > 0 ? 1 : 0) +
    (searchKeyword ? 1 : 0);

  return (
    <div className="space-y-8">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/20 to-transparent pointer-events-none"></div>
        <div className="max-w-2xl relative z-10">
          <span className="text-blue-300 font-extrabold text-xs tracking-wider uppercase bg-blue-950/60 px-3 py-1 rounded-full border border-blue-700/50 inline-block mb-3">
            {locale === "id" ? "Katalog Resmi Distributor" : "Official Catalog"}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            {locale === "id" ? "Eksplorasi Gadget & Elektronik" : "Explore Gadgets & Electronics"}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            {locale === "id" 
              ? "Temukan smartphone flagship, audio Hi-Res, dan aksesori original bergaransi resmi PT. TRIO Distribusi." 
              : "Discover official flagship smartphones, audio, and premium accessories with official warranty."}
          </p>
        </div>
      </div>

      {/* Main Layout: Sidebar Filter + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-blue-600" />
              <h2 className="font-extrabold text-slate-900 text-sm">
                {locale === "id" ? "Filter Produk" : "Filters"}
              </h2>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>{locale === "id" ? "Reset" : "Reset"}</span>
              </button>
            )}
          </div>

          {/* Kategori */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
              {locale === "id" ? "Kategori" : "Category"}
            </h3>
            <div className="space-y-1.5">
              {categories.map((cat) => {
                const active = (selectedCategory || "all") === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => selectCategory(cat.value === "all" ? null : cat.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      active
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{cat.label}</span>
                    {active && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
              Brand
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {brands.map((b) => {
                const active = (selectedBrand || "All") === b;
                return (
                  <button
                    key={b}
                    onClick={() => selectBrand(b === "All" ? null : b)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ketersediaan Stok */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>{locale === "id" ? "Hanya Produk Ready Stock" : "In Stock Only"}</span>
            </label>
          </div>
        </aside>

        {/* Content Column */}
        <div className="lg:col-span-3 space-y-5">
          {/* Controls Bar: Results count, Mobile filter button, Sort */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <SlidersHorizontal size={15} />
                <span>{locale === "id" ? "Filter" : "Filters"}</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <p className="text-xs font-bold text-slate-600">
                {locale === "id" 
                  ? `Menampilkan ${filteredProducts.length} produk pilihan` 
                  : `Showing ${filteredProducts.length} products`}
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={15} className="text-slate-400" />
              <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 hidden sm:inline">
                {locale === "id" ? "Urutkan:" : "Sort by:"}
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => updateSort(e.target.value)}
                className="text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl px-3 py-2 border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="latest">{locale === "id" ? "Terbaru" : "Newest"}</option>
                <option value="price-asc">{locale === "id" ? "Harga: Rendah ke Tinggi" : "Price: Low to High"}</option>
                <option value="price-desc">{locale === "id" ? "Harga: Tinggi ke Rendah" : "Price: High to Low"}</option>
                <option value="rating">{locale === "id" ? "Rating Tertinggi" : "Top Rated"}</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">
                {locale === "id" ? "Filter Aktif:" : "Active:"}
              </span>
              {searchKeyword && (
                <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold border border-blue-100">
                  Keyword: "{searchKeyword}"
                  <button onClick={() => updateSearch("")} className="hover:text-blue-900 cursor-pointer"><X size={12} /></button>
                </span>
              )}
              {selectedCategory && selectedCategory !== "all" && (
                <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold border border-blue-100">
                  {selectedCategory}
                  <button onClick={() => selectCategory(null)} className="hover:text-blue-900 cursor-pointer"><X size={12} /></button>
                </span>
              )}
              {selectedBrand && selectedBrand !== "All" && (
                <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold border border-blue-100">
                  {selectedBrand}
                  <button onClick={() => selectBrand(null)} className="hover:text-blue-900 cursor-pointer"><X size={12} /></button>
                </span>
              )}
              {inStockOnly && (
                <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold border border-blue-100">
                  Ready Stock
                  <button onClick={() => setInStockOnly(false)} className="hover:text-blue-900 cursor-pointer"><X size={12} /></button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 bg-white rounded-3xl p-12 border border-slate-100">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-slate-500">Memuat katalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs flex flex-col items-center">
              <div className="p-4 rounded-full bg-slate-100 text-slate-400 mb-3">
                <ShoppingBag size={36} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
                {locale === "id" ? "Tidak ada produk yang sesuai" : "No matching products"}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-5">
                {locale === "id" 
                  ? "Coba ganti filter atau kata kunci pencarian Anda untuk menemukan produk yang diinginkan." 
                  : "Try adjusting your filters or keywords."}
              </p>
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                {locale === "id" ? "Reset Semua Filter" : "Clear All Filters"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5">
              {filteredProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                {locale === "id" ? "Filter Produk" : "Filters"}
              </h3>
              <button 
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Kategori Mobile */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase mb-2">Kategori</h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => selectCategory(cat.value === "all" ? null : cat.value)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-center cursor-pointer ${
                      (selectedCategory || "all") === cat.value
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Mobile */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase mb-2">Brand</h4>
              <div className="flex flex-wrap gap-2">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => selectBrand(b === "All" ? null : b)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                      (selectedBrand || "All") === b
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
            >
              {locale === "id" ? `Terapkan Filter (${filteredProducts.length})` : "Apply Filters"}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

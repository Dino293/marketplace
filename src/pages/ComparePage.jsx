import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCompare } from "../contexts/CompareContext";
import { useCart } from "../contexts/CartContext";
import { useLocale } from "../contexts/LocaleContext";
import { useToast } from "../contexts/ToastContext";
import { getProducts } from "../utils/api";
import FooterSection from "../components/FooterSection";
import { 
  Scale, 
  Trash2, 
  ShoppingBag, 
  Plus, 
  Check, 
  Star, 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  Cpu,
  Monitor,
  BatteryCharging,
  HardDrive
} from "lucide-react";

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const { addToCart } = useCart();
  const { locale } = useLocale();
  const { showToast } = useToast();

  const [allProducts, setAllProducts] = useState([]);
  const [selectedToAdd, setSelectedToAdd] = useState("");

  useEffect(() => {
    async function loadCatalog() {
      const res = await getProducts();
      if (!res.error && res.data) {
        setAllProducts(res.data);
      }
    }
    loadCatalog();
  }, []);

  const handleAddProductById = (id) => {
    if (!id) return;
    const prod = allProducts.find(p => String(p.id) === String(id));
    if (prod) {
      addToCompare(prod);
      setSelectedToAdd("");
    }
  };

  // Quick 1-click popular comparisons
  const handleQuickComparePreset = () => {
    if (allProducts.length >= 3) {
      clearCompare();
      allProducts.slice(0, 3).forEach(p => addToCompare(p));
      showToast(locale === "id" ? "Membandingkan 3 Smartphone Flagship Teratas!" : "Loaded 3 top flagships!", "success");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-2 transition-colors"
          >
            <ArrowLeft size={15} />
            <span>{locale === "id" ? "Kembali ke Katalog" : "Back to Catalog"}</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {locale === "id" ? "Perbandingan Spesifikasi Produk" : "Product Comparison"}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {compareItems.length}/4
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {locale === "id" 
              ? "Bandingkan harga, spesifikasi chipset, layar, RAM, dan baterai untuk memilih gadget terbaik Anda" 
              : "Compare prices, specs, screens, and battery to choose your ideal device"}
          </p>
        </div>

        {compareItems.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Add More Product Dropdown */}
            {compareItems.length < 4 && (
              <select
                value={selectedToAdd}
                onChange={(e) => handleAddProductById(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 cursor-pointer"
              >
                <option value="">+ Tambah Produk Lain</option>
                {allProducts
                  .filter(p => !compareItems.some(c => String(c.id) === String(p.id)))
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {p.brand} - {p.title}
                    </option>
                  ))}
              </select>
            )}

            <button
              onClick={clearCompare}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>{locale === "id" ? "Hapus Semua" : "Clear All"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {compareItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200/90 dark:border-slate-700 shadow-xs flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <Scale size={36} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1">
            {locale === "id" ? "Belum Ada Produk yang Dibandingkan" : "No Products to Compare Yet"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            {locale === "id" 
              ? "Pilih hingga 4 produk dari katalog kami untuk melihat perbandingan mendalam spesifikasi bodi, layar, chipset, dan harga." 
              : "Select up to 4 products from our catalog to compare side-by-side."}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleQuickComparePreset}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles size={14} />
              <span>Bandingkan 3 Flagship Terlaris Cepat</span>
            </button>

            <Link
              to="/catalog"
              className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-colors"
            >
              Buka Semua Katalog
            </Link>
          </div>
        </div>
      ) : (
        /* Comparison Table Matrix */
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-850">
                  <th className="p-4 sm:p-5 w-48 text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
                    Spesifikasi
                  </th>
                  {compareItems.map(item => (
                    <th key={item.id} className="p-4 sm:p-5 min-w-[220px] max-w-[260px] align-top">
                      <div className="flex flex-col h-full justify-between gap-3">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => removeFromCompare(item.id)}
                            className="absolute -top-1 -right-1 p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus dari perbandingan"
                          >
                            <Trash2 size={13} />
                          </button>

                          <div className="w-24 h-24 mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 p-2 flex items-center justify-center">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-contain"
                              onError={(e) => { e.target.src = "/terlaris/1.jpg"; }}
                            />
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md uppercase">
                            {item.brand}
                          </span>
                          <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm mt-1 line-clamp-2">
                            {item.title}
                          </h3>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => addToCart(item.id)}
                            className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingBag size={13} />
                            <span>Tambah Keranjang</span>
                          </button>
                          <Link
                            to={`/products/${item.id}`}
                            className="w-full py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-center font-bold text-[11px] transition-colors"
                          >
                            Lihat Detail
                          </Link>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                {/* Row: Harga */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/40 dark:bg-slate-850/40">
                    Harga Jual Resmi
                  </td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 sm:p-5">
                      <span className="text-sm sm:text-base font-black text-blue-600 dark:text-blue-400 block">
                        Rp {item.price?.toLocaleString("id-ID")}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-[11px] text-slate-400 line-through">
                          Rp {item.originalPrice.toLocaleString("id-ID")}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Row: Rating */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/40 dark:bg-slate-850/40">
                    Rating & Ulasan
                  </td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 sm:p-5">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star size={14} className="fill-amber-400" />
                        <span>{item.rating || 5.0}</span>
                        <span className="text-slate-400 font-normal">
                          ({item.reviewsCount || 40}+ ulasan)
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Row: Kategori */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/40 dark:bg-slate-850/40">
                    Kategori Produk
                  </td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 sm:p-5 capitalize font-medium text-slate-700 dark:text-slate-300">
                      {item.category || "Smartphone"}
                    </td>
                  ))}
                </tr>

                {/* Row: Layar */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/40 dark:bg-slate-850/40 flex items-center gap-1.5">
                    <Monitor size={15} className="text-blue-500" />
                    <span>Layar & Panel</span>
                  </td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 sm:p-5 font-medium text-slate-700 dark:text-slate-300">
                      {item.specs?.layar || "Dynamic AMOLED 120Hz Ultra HD"}
                    </td>
                  ))}
                </tr>

                {/* Row: Chipset */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/40 dark:bg-slate-850/40 flex items-center gap-1.5">
                    <Cpu size={15} className="text-purple-500" />
                    <span>Chipset / Prosesor</span>
                  </td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 sm:p-5 font-medium text-slate-700 dark:text-slate-300">
                      {item.specs?.chipset || "Flagship Octa-core Processor"}
                    </td>
                  ))}
                </tr>

                {/* Row: RAM & Storage */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/40 dark:bg-slate-850/40 flex items-center gap-1.5">
                    <HardDrive size={15} className="text-emerald-500" />
                    <span>RAM & Penyimpanan</span>
                  </td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 sm:p-5 font-medium text-slate-700 dark:text-slate-300">
                      {item.specs?.ram ? `${item.specs.ram} • ${item.specs.storage || "256GB"}` : "12GB RAM • 256GB UFS 4.0"}
                    </td>
                  ))}
                </tr>

                {/* Row: Baterai */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/40 dark:bg-slate-850/40 flex items-center gap-1.5">
                    <BatteryCharging size={15} className="text-amber-500" />
                    <span>Baterai & Charging</span>
                  </td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 sm:p-5 font-medium text-slate-700 dark:text-slate-300">
                      {item.specs?.baterai || "5000 mAh (Fast Charge)"}
                    </td>
                  ))}
                </tr>

                {/* Row: Garansi */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/40 dark:bg-slate-850/40 flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-emerald-600" />
                    <span>Status Garansi</span>
                  </td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 sm:p-5 text-emerald-600 dark:text-emerald-400 font-bold">
                      100% Original PT. TRIO (Garansi 1 Tahun)
                    </td>
                  ))}
                </tr>

                {/* Row: Ketersediaan Stok */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/40 dark:bg-slate-850/40">
                    Ketersediaan Stok
                  </td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 sm:p-5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {item.stock > 0 ? `Tersedia (${item.stock} unit di gudang)` : "Habis Terjual"}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <FooterSection />
    </div>
  );
}

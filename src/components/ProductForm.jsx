import React, { useState } from "react";
import { useLocale } from "../contexts/LocaleContext";
import { 
  Tag, 
  DollarSign, 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  Box, 
  Upload, 
  Globe, 
  CheckCircle2, 
  X, 
  Sparkles,
  Cpu,
  Monitor,
  BatteryCharging,
  HardDrive
} from "lucide-react";

function ProductForm({ onSubmit, loading }) {
  const { locale } = useLocale();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("smartphone");
  const [brand, setBrand] = useState("Samsung");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("20");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  // Image source modes: 'upload' | 'url' | 'preset'
  const [imageMode, setImageMode] = useState("upload");
  const [image, setImage] = useState("/terlaris/1.jpg");
  const [webUrlInput, setWebUrlInput] = useState("");
  const [localFileName, setLocalFileName] = useState("");
  const [imageSourceLabel, setImageSourceLabel] = useState("Preset Katalog");

  // Specifications state for rich comparisons
  const [specs, setSpecs] = useState({
    layar: "6.7 inch AMOLED 120Hz",
    chipset: "Snapdragon 8 Gen 3 Flagship",
    ram: "12GB LPDDR5X",
    storage: "256GB / 512GB UFS 4.0",
    baterai: "5000 mAh (Fast Charge 67W)"
  });

  const sampleImages = [
    { label: "Galaxy S25", url: "/terlaris/1.jpg" },
    { label: "Xiaomi 14", url: "/terlaris/2.jpg" },
    { label: "iPhone 16", url: "/terlaris/3.jpg" },
    { label: "Z Fold 6", url: "/terlaris/4.jpg" },
    { label: "iPhone 15", url: "/terlaris/5.jpg" },
    { label: "Earbuds ANC", url: "/gulir/gambar 1.jpg" },
    { label: "Smartwatch", url: "/gulir/gambar 2.jpg" },
    { label: "Outdoor Speaker", url: "/gulir/gambar 3.jpg" },
    { label: "Tablet S-Pen", url: "/gulir/gambar 4.jpg" },
    { label: "Magic Mouse", url: "/gulir/gambar 5.jpg" },
  ];

  // Handle local file selection
  const handleLocalFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "File harus berupa gambar (JPG, PNG, WebP)" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Ukuran file maksimal 5MB" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target.result;
      setImage(base64Data);
      setLocalFileName(file.name);
      setImageSourceLabel(`File Lokal: ${file.name}`);
      setErrors((prev) => ({ ...prev, image: null }));
    };
    reader.readAsDataURL(file);
  };

  // Handle web URL image
  const handleApplyWebUrl = () => {
    if (!webUrlInput.trim()) {
      setErrors((prev) => ({ ...prev, image: "Masukkan URL gambar web yang valid" }));
      return;
    }
    setImage(webUrlInput.trim());
    setImageSourceLabel("Link Gambar Web Online");
    setErrors((prev) => ({ ...prev, image: null }));
  };

  const validate = () => {
    const err = {};
    if (!title || title.length < 3) {
      err.title = locale === "id" ? "Nama produk minimal 3 karakter" : "Title at least 3 chars";
    }
    if (!price || parseFloat(price) <= 0) {
      err.price = locale === "id" ? "Harga harus angka positif" : "Price must be positive";
    }
    if (!description || description.length < 10) {
      err.description = locale === "id" ? "Deskripsi minimal 10 karakter" : "Description at least 10 chars";
    }
    if (!image) {
      err.image = locale === "id" ? "Gambar produk wajib ditentukan" : "Product image is required";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        title,
        category,
        brand,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price) * 1.1,
        stock: parseInt(stock, 10) || 15,
        image,
        description,
        specs
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Input Judul */}
      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
          {locale === "id" ? "Nama / Judul Produk Resmi" : "Product Title"}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Tag size={17} />
          </div>
          <input
            type="text"
            placeholder={locale === "id" ? "Cth: Samsung Galaxy S25 Ultra 5G Resmi" : "e.g. Samsung Galaxy S25 Ultra"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 focus:bg-white text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none transition-all"
            required
          />
        </div>
        {errors.title && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.title}</p>}
      </div>

      {/* Kategori & Brand Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            {locale === "id" ? "Kategori Produk" : "Category"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Layers size={17} />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 focus:bg-white text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
            >
              <option value="smartphone">Smartphone</option>
              <option value="tablet">Tablet & iPad</option>
              <option value="audio">Audio & TWS</option>
              <option value="accessories">Aksesori & Wearable</option>
              <option value="laptop">Komputer & Laptop</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            Brand Manufaktur
          </label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 focus:bg-white text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
          >
            <option value="Samsung">Samsung</option>
            <option value="Apple">Apple</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Realme">Realme</option>
            <option value="Vivo">Vivo</option>
            <option value="Oppo">Oppo</option>
            <option value="Huawei">Huawei</option>
            <option value="Asus">Asus</option>
          </select>
        </div>
      </div>

      {/* Harga Jual, Harga Asli, dan Stok */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            {locale === "id" ? "Harga Jual (Rp)" : "Selling Price (IDR)"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <DollarSign size={17} />
            </div>
            <input
              type="number"
              placeholder="12000000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 focus:bg-white text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none transition-all"
              required
            />
          </div>
          {errors.price && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.price}</p>}
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            {locale === "id" ? "Harga Coret (Opsional)" : "Strike Price"}
          </label>
          <input
            type="number"
            placeholder="13500000"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 focus:bg-white text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            {locale === "id" ? "Jumlah Stok Gudang" : "Stock Quantity"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Box size={17} />
            </div>
            <input
              type="number"
              placeholder="25"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 focus:bg-white text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FITUR INPUT GAMBAR (UPLOAD FILE LOKAL vs LINK WEB vs PRESET) */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ImageIcon size={17} className="text-blue-600 dark:text-blue-400" />
              <span>Gambar Produk (Upload File Lokal atau Link Web)</span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Pilih metode input gambar produk yang paling nyaman untuk Anda
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => setImageMode("upload")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                imageMode === "upload" 
                  ? "bg-blue-600 text-white shadow-2xs" 
                  : "text-slate-600 dark:text-slate-300 hover:text-blue-600"
              }`}
            >
              <Upload size={13} />
              <span>Upload Lokal</span>
            </button>
            <button
              type="button"
              onClick={() => setImageMode("url")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                imageMode === "url" 
                  ? "bg-blue-600 text-white shadow-2xs" 
                  : "text-slate-600 dark:text-slate-300 hover:text-blue-600"
              }`}
            >
              <Globe size={13} />
              <span>Link Web URL</span>
            </button>
            <button
              type="button"
              onClick={() => setImageMode("preset")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                imageMode === "preset" 
                  ? "bg-blue-600 text-white shadow-2xs" 
                  : "text-slate-600 dark:text-slate-300 hover:text-blue-600"
              }`}
            >
              <Sparkles size={13} />
              <span>Preset Katalog</span>
            </button>
          </div>
        </div>

        {/* Option 1: Upload File Lokal */}
        {imageMode === "upload" && (
          <div className="animate-in fade-in duration-150">
            <label className="border-2 border-dashed border-blue-300 dark:border-blue-900/60 rounded-2xl p-6 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Upload size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Klik untuk pilih file gambar dari perangkat Anda
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Mendukung JPG, PNG, WebP (Maksimal 5MB)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLocalFileUpload}
                className="hidden"
              />
            </label>
            {localFileName && (
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>File terpilih: {localFileName}</span>
              </p>
            )}
          </div>
        )}

        {/* Option 2: Link Web URL */}
        {imageMode === "url" && (
          <div className="space-y-2 animate-in fade-in duration-150">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Globe size={16} />
                </div>
                <input
                  type="url"
                  value={webUrlInput}
                  onChange={(e) => setWebUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyWebUrl}
                className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                Terapkan URL
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Masukkan tautan gambar langsung dari internet (Unsplash, Imgur, CDN resmi)
            </p>
          </div>
        )}

        {/* Option 3: Preset Katalog */}
        {imageMode === "preset" && (
          <div className="animate-in fade-in duration-150">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              Pilih dari preset resmi katalog PT. TRIO Distribusi:
            </p>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setImage(s.url);
                    setImageSourceLabel(`Preset: ${s.label}`);
                    setErrors((prev) => ({ ...prev, image: null }));
                  }}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer aspect-square flex items-center justify-center bg-white dark:bg-slate-800 ${
                    image === s.url 
                      ? "border-blue-600 ring-2 ring-blue-500/30 bg-blue-50/50" 
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  }`}
                  title={s.label}
                >
                  <img src={s.url} alt={s.label} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Image Preview Card */}
        {image && (
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 shrink-0 flex items-center justify-center shadow-xs">
              <img 
                src={image} 
                alt="Preview Produk" 
                className="w-full h-full object-contain"
                onError={(e) => { e.target.src = "/terlaris/1.jpg"; }}
              />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md inline-block mb-1 border border-emerald-200 dark:border-emerald-800">
                Gambar Siap Digunakan
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md">
                {imageSourceLabel}
              </p>
              <p className="text-[11px] text-slate-400">
                Gambar akan otomatis tampil tajam di katalog marketplace dan halaman detail produk.
              </p>
            </div>
          </div>
        )}
        {errors.image && <p className="text-[11px] text-rose-500 font-medium">{errors.image}</p>}
      </div>

      {/* ========================================================================= */}
      {/* SPESIFIKASI UNTUK FITUR PERBANDINGAN / COMPARE */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 space-y-3">
        <label className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Monitor size={17} className="text-purple-600 dark:text-purple-400" />
          <span>Spesifikasi Produk (Untuk Fitur Bandingkan / Compare)</span>
        </label>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Spesifikasi ini akan digunakan pembeli saat membandingkan gadget di fitur Compare.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Spesifikasi Layar:
            </span>
            <input
              type="text"
              value={specs.layar}
              onChange={(e) => setSpecs({ ...specs, layar: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              placeholder="Cth: 6.8 inch Dynamic AMOLED 120Hz"
            />
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Chipset / Prosesor:
            </span>
            <input
              type="text"
              value={specs.chipset}
              onChange={(e) => setSpecs({ ...specs, chipset: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              placeholder="Cth: Snapdragon 8 Gen 3 for Galaxy"
            />
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              RAM & Memori Penyimpanan:
            </span>
            <input
              type="text"
              value={specs.ram}
              onChange={(e) => setSpecs({ ...specs, ram: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              placeholder="Cth: 12GB / 16GB LPDDR5X"
            />
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Kapasitas Baterai & Pengisian:
            </span>
            <input
              type="text"
              value={specs.baterai}
              onChange={(e) => setSpecs({ ...specs, baterai: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              placeholder="Cth: 5000 mAh (Fast Charge 45W)"
            />
          </div>
        </div>
      </div>

      {/* Input Deskripsi */}
      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
          {locale === "id" ? "Deskripsi & Keunggulan Produk" : "Product Description"}
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
            <FileText size={17} />
          </div>
          <textarea
            placeholder={locale === "id" ? "Tuliskan fitur unggulan, garansi resmi distributor 1 tahun, kelengkapan kotak, dan isi paket penjualan..." : "Write product highlights..."}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows={4}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 focus:bg-white text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none transition-all"
            required
          />
        </div>
        {errors.description && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.description}</p>}
      </div>

      {/* Tombol Simpan */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <span>{loading ? "Menyimpan ke Marketplace..." : "Publikasikan Produk Resmi ke Marketplace"}</span>
      </button>
    </form>
  );
}

export default ProductForm;
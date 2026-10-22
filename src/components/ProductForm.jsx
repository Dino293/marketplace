import React, { useState } from "react";
import { useLocale } from "../contexts/LocaleContext";
import { Tag, DollarSign, FileText, Layers, Image as ImageIcon, Box } from "lucide-react";

function ProductForm({ onSubmit, loading }) {
  const { locale } = useLocale();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("smartphone");
  const [brand, setBrand] = useState("Samsung");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("20");
  const [image, setImage] = useState("/terlaris/1.jpg");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const sampleImages = [
    { label: "Smartphone 1", url: "/terlaris/1.jpg" },
    { label: "Smartphone 2", url: "/terlaris/2.jpg" },
    { label: "Smartphone 3", url: "/terlaris/3.jpg" },
    { label: "Audio Earbuds", url: "/gulir/gambar 1.jpg" },
    { label: "Smartwatch", url: "/gulir/gambar 2.jpg" },
    { label: "Outdoor Speaker", url: "/gulir/gambar 3.jpg" },
    { label: "Tablet S-Pen", url: "/gulir/gambar 4.jpg" },
    { label: "Magic Mouse", url: "/gulir/gambar 5.jpg" },
  ];

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
        description
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Input Judul */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">
          {locale === "id" ? "Nama / Judul Produk" : "Product Title"}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Tag size={17} />
          </div>
          <input
            type="text"
            placeholder={locale === "id" ? "Cth: Samsung Galaxy S25 Ultra 5G" : "e.g. Samsung Galaxy S25 Ultra"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-900 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
            required
          />
        </div>
        {errors.title && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.title}</p>}
      </div>

      {/* Kategori & Brand Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
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
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-900 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
            >
              <option value="smartphone">Smartphone</option>
              <option value="tablet">Tablet</option>
              <option value="audio">Audio & TWS</option>
              <option value="accessories">Aksesori & Wearable</option>
              <option value="laptop">Komputer & Laptop</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Brand Manufaktur
          </label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-900 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
          >
            <option value="Samsung">Samsung</option>
            <option value="Apple">Apple</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Realme">Realme</option>
            <option value="Vivo">Vivo</option>
            <option value="Oppo">Oppo</option>
            <option value="Huawei">Huawei</option>
          </select>
        </div>
      </div>

      {/* Harga Jual, Harga Asli, dan Stok */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
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
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-900 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
              required
            />
          </div>
          {errors.price && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.price}</p>}
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            {locale === "id" ? "Harga Coret (Opsional)" : "Strike Price"}
          </label>
          <input
            type="number"
            placeholder="13500000"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-900 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            {locale === "id" ? "Jumlah Stok" : "Stock Quantity"}
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
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-900 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Preset Image Picker */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
          <ImageIcon size={16} className="text-blue-600" />
          <span>Pilih Gambar Katalog (Preset Resmi)</span>
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-2">
          {sampleImages.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setImage(s.url)}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer aspect-square flex items-center justify-center bg-slate-50 ${
                image === s.url ? "border-blue-600 ring-2 ring-blue-500/20 bg-blue-50" : "border-slate-200 hover:border-slate-300"
              }`}
              title={s.label}
            >
              <img src={s.url} alt={s.label} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Atau masukkan URL gambar kustom"
          className="w-full px-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-700"
        />
      </div>

      {/* Input Deskripsi */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">
          {locale === "id" ? "Deskripsi & Keunggulan Produk" : "Product Description"}
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
            <FileText size={17} />
          </div>
          <textarea
            placeholder={locale === "id" ? "Tuliskan fitur unggulan, garansi, kelengkapan kotak, dan spesifikasi penting produk..." : "Write product highlights..."}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows={4}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-900 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
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
        <span>{loading ? "Menyimpan ke Katalog..." : "Publikasikan Produk ke Marketplace"}</span>
      </button>
    </form>
  );
}

export default ProductForm;
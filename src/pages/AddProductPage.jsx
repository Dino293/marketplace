import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { addProduct } from "../utils/api";
import { useToast } from "../contexts/ToastContext";
import { useLocale } from "../contexts/LocaleContext";
import ProductForm from "../components/ProductForm";
import FooterSection from "../components/FooterSection";
import { ArrowLeft, PackagePlus, ShieldCheck } from "lucide-react";

export default function AddProductPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { locale } = useLocale();
  const [saving, setSaving] = useState(false);

  const handleAddProduct = async (productData) => {
    setSaving(true);
    try {
      const result = await addProduct(productData);

      if (result.error) {
        showToast(
          result.message || (locale === "id" ? "Gagal menambah produk" : "Failed to add product"),
          "error"
        );
        return;
      }

      showToast(
        locale === "id" ? "Produk baru berhasil didaftarkan ke katalog!" : "Product added successfully",
        "success"
      );
      navigate("/catalog");
    } catch (err) {
      showToast(
        err?.message || (locale === "id" ? "Terjadi kesalahan sistem" : "System error"),
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link 
        to="/" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>{locale === "id" ? "Kembali ke Beranda" : "Back to Home"}</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-3.5 mb-6 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
              <PackagePlus size={24} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {locale === "id" ? "Tambah Produk Baru" : "Add New Product"}
              </h1>
              <p className="text-xs text-slate-500">
                {locale === "id" 
                  ? "Daftarkan inventaris gadget baru ke dalam inventaris PT. TRIO Distribusi" 
                  : "Register a new gadget item to the inventory"}
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            <ShieldCheck size={13} />
            Portal Distributor
          </span>
        </div>

        <ProductForm onSubmit={handleAddProduct} loading={saving} />
      </div>

      <FooterSection />
    </div>
  );
}
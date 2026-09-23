// src/pages/AddProductPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../utils/api";
import { useToast } from "../contexts/ToastContext";
import { useLocale } from "../contexts/LocaleContext";
import ProductForm from "../components/ProductForm";

export default function AddProductPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { locale } = useLocale();
  const [saving, setSaving] = useState(false);

  const handleAddProduct = async ({ title, description, price }) => {
    setSaving(true);
    try {
      const result = await addProduct({ 
        title, 
        body: description, // Tetap menggunakan 'body' untuk konsistensi dengan API lama
        price: parseFloat(price)
      });

      if (result.error) {
        showToast(
          result.message ||
            (locale === "id"
              ? "Gagal menambah produk"
              : "Failed to add product"),
          "error"
        );
        return;
      }

      showToast(
        locale === "id"
          ? "Produk berhasil ditambahkan"
          : "Product added successfully",
        "success"
      );
      navigate("/");
    } catch (err) {
      if (err.name === "TypeError") {
        showToast(
          locale === "id"
            ? "Terjadi kesalahan jaringan, silakan coba lagi"
            : "Network error, please try again",
          "error"
        );
      } else {
        showToast(
          err?.message ||
            (locale === "id"
              ? "Gagal menambah produk"
              : "Failed to add product"),
          "error"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {locale === "id" ? "Tambah Produk" : "Add Product"}
      </h2>
      <ProductForm onSubmit={handleAddProduct} loading={saving} />
    </section>
  );
}
import React, { useState } from "react";
import { useLocale } from "../contexts/LocaleContext";

function ProductForm({ onSubmit, loading }) {
  const { locale } = useLocale();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});

  // Validasi input
  const validate = (field, value) => {
    let message = "";

    if (field === "title") {
      if (!value) message = locale === "id" ? "Judul wajib diisi" : "Title is required";
      else if (value.length < 3) message = locale === "id" ? "Judul minimal 3 karakter" : "Title must be at least 3 characters";
    }

    if (field === "description") {
      if (!value) message = locale === "id" ? "Deskripsi tidak boleh kosong" : "Description is required";
    }

    if (field === "price") {
      if (!value) message = locale === "id" ? "Harga wajib diisi" : "Price is required";
      else if (isNaN(value) || parseFloat(value) <= 0) message = locale === "id" ? "Harga harus angka positif" : "Price must be a positive number";
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
    return message === "";
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const validTitle = validate("title", title);
    const validDescription = validate("description", description);
    const validPrice = validate("price", price);

    if (validTitle && validDescription && validPrice) {
      onSubmit({ title, description, price });
      setTitle("");
      setDescription("");
      setPrice("");
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {/* Input Judul */}
      <div>
        <input
          type="text"
          placeholder={locale === "id" ? "Judul Produk" : "Product Title"}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            validate("title", e.target.value);
          }}
          disabled={loading}
          className={errors.title ? "input-error" : ""}
        />
        {errors.title && <p className="error-message">{errors.title}</p>}
      </div>

      {/* Input Harga */}
      <div>
        <input
          type="number"
          placeholder={locale === "id" ? "Harga Produk" : "Product Price"}
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            validate("price", e.target.value);
          }}
          disabled={loading}
          className={errors.price ? "input-error" : ""}
        />
        {errors.price && <p className="error-message">{errors.price}</p>}
      </div>

      {/* Input Deskripsi */}
      <div>
        <textarea
          placeholder={locale === "id" ? "Deskripsi Produk..." : "Product Description..."}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            validate("description", e.target.value);
          }}
          disabled={loading}
          className={errors.description ? "input-error" : ""}
        />
        {errors.description && <p className="error-message">{errors.description}</p>}
      </div>

      {/* Tombol Submit */}
      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 
            (locale === "id" ? "Menyimpan..." : "Saving...") : 
            (locale === "id" ? "Tambah Produk" : "Add Product")
          }
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
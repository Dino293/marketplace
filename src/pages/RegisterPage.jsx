import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../utils/api";
import { useToast } from "../contexts/ToastContext";
import { useLocale } from "../contexts/LocaleContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { locale } = useLocale();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = (field, value) => {
    let message = "";
    if (field === "name" && !value.trim()) message = locale === "id" ? "Nama wajib diisi" : "Name is required";
    if (field === "email") {
      if (!value.trim()) message = locale === "id" ? "Email wajib diisi" : "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) message = locale === "id" ? "Email tidak valid" : "Invalid email";
    }
    if (field === "password") {
      if (!value) message = locale === "id" ? "Password wajib diisi" : "Password is required";
      else if (value.length < 6) message = locale === "id" ? "Password minimal 6 karakter" : "Password must be at least 6 characters";
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
    return message === "";
  };

  const validateForm = () => ["name", "email", "password"].every((field) => validate(field, form[field]));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await register(form);
      if (result.error) {
        setError(result.message || (locale === "id" ? "Registrasi gagal" : "Registration failed"));
        showToast(result.message || (locale === "id" ? "Registrasi gagal" : "Registration failed"), "error");
        return;
      }

      showToast(locale === "id" ? "Registrasi berhasil. Silakan login." : "Registration successful. Please login.", "success");
      navigate("/login");
    } catch (err) {
      setError(err?.message || (locale === "id" ? "Registrasi gagal" : "Registration failed"));
      showToast(err?.message || (locale === "id" ? "Registrasi gagal" : "Registration failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <h2>{locale === "id" ? "Daftar" : "Register"}</h2>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <input type="text" name="name" placeholder={locale === "id" ? "Nama" : "Name"} value={form.name} onChange={handleChange} required />
        {errors.name && <p className="error-text">{errors.name}</p>}

        <input type="email" name="email" placeholder={locale === "id" ? "Email" : "Email"} value={form.email} onChange={handleChange} required />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <input type="password" name="password" placeholder={locale === "id" ? "Kata Sandi" : "Password"} value={form.password} onChange={handleChange} required />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (locale === "id" ? "Mendaftar..." : "Registering...") : (locale === "id" ? "Daftar" : "Register")}
        </button>
      </form>

      <p>
        {locale === "id" ? "Sudah punya akun?" : "Already have an account?"} <Link to="/login">{locale === "id" ? "Masuk" : "Login"}</Link>
      </p>
    </section>
  );
}

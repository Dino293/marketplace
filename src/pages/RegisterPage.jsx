import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../utils/api";
import { useToast } from "../contexts/ToastContext";
import { useLocale } from "../contexts/LocaleContext";
import { User, Mail, Lock, UserPlus } from "lucide-react";

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
    if (field === "name" && !value.trim()) {
      message = locale === "id" ? "Nama lengkap wajib diisi" : "Name is required";
    }
    if (field === "email") {
      if (!value.trim()) message = locale === "id" ? "Email wajib diisi" : "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) message = locale === "id" ? "Format email tidak valid" : "Invalid email";
    }
    if (field === "password") {
      if (!value) message = locale === "id" ? "Kata sandi wajib diisi" : "Password is required";
      else if (value.length < 6) message = locale === "id" ? "Kata sandi minimal 6 karakter" : "Password must be at least 6 characters";
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

      showToast(locale === "id" ? "Registrasi berhasil! Silakan masuk dengan akun baru." : "Registration successful! Please login.", "success");
      navigate("/login");
    } catch (err) {
      setError(err?.message || (locale === "id" ? "Registrasi gagal" : "Registration failed"));
      showToast(err?.message || (locale === "id" ? "Registrasi gagal" : "Registration failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-4 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
            <UserPlus size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {locale === "id" ? "Buat Akun Baru" : "Create Account"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {locale === "id" 
              ? "Daftar untuk menikmati promo gadget eksklusif" 
              : "Register to enjoy exclusive distributor deals"}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl p-3 mb-5 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {locale === "id" ? "Nama Lengkap" : "Full Name"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                name="name"
                placeholder={locale === "id" ? "Nama lengkap Anda" : "Your full name"}
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
              />
            </div>
            {errors.name && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="nama@email.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {locale === "id" ? "Kata Sandi (Min. 6 Karakter)" : "Password (Min. 6 Characters)"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
              />
            </div>
            {errors.password && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>{locale === "id" ? "Mendaftarkan..." : "Registering..."}</span>
            ) : (
              <span>{locale === "id" ? "Daftar Akun Baru" : "Create Account"}</span>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500">
          <span>{locale === "id" ? "Sudah memiliki akun?" : "Already have an account?"} </span>
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            {locale === "id" ? "Masuk di Sini" : "Login here"}
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../utils/api";
import { useToast } from "../contexts/ToastContext";
import { useLocale } from "../contexts/LocaleContext";
import { 
  User, 
  Mail, 
  Lock, 
  UserPlus, 
  Phone, 
  Store, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowLeft 
} from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { locale } = useLocale();

  const [role, setRole] = useState("buyer"); // 'buyer' | 'seller'
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    phone: "",
    storeName: "",
    enable2FA: true
  });
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
    if (field === "storeName" && role === "seller" && !value.trim()) {
      message = locale === "id" ? "Nama toko wajib diisi untuk akun penjual" : "Store name is required for seller accounts";
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
    return message === "";
  };

  const validateForm = () => {
    const fieldsToValidate = ["name", "email", "password"];
    if (role === "seller") fieldsToValidate.push("storeName");
    return fieldsToValidate.every((field) => validate(field, form[field]));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
    validate(name, val);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role,
        storeName: form.storeName,
        enable2FA: form.enable2FA
      });

      if (result.error) {
        setError(result.message || (locale === "id" ? "Registrasi gagal" : "Registration failed"));
        showToast(result.message || (locale === "id" ? "Registrasi gagal" : "Registration failed"), "error");
        return;
      }

      showToast(
        locale === "id" 
          ? `Registrasi akun ${role === "seller" ? "Penjual Mitra" : "Pembeli"} berhasil! Silakan masuk.` 
          : "Registration successful! Please login.", 
        "success"
      );
      navigate("/login");
    } catch (err) {
      setError(err?.message || (locale === "id" ? "Registrasi gagal" : "Registration failed"));
      showToast(err?.message || (locale === "id" ? "Registrasi gagal" : "Registration failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-8">
      <Link 
        to="/" 
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>{locale === "id" ? "Kembali ke Beranda" : "Back to Home"}</span>
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-700 shadow-xl max-w-lg w-full transition-colors">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
            <UserPlus size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {locale === "id" ? "Daftar Akun Baru" : "Create Account"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {locale === "id" 
              ? "Bergabunglah dengan ekosistem resmi distributor PT. TRIO Distribusi" 
              : "Join our official gadget distributor ecosystem"}
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="mb-6 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => setRole("buyer")}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === "buyer"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <ShoppingBag size={15} />
            <span>Sebagai Pembeli</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("seller")}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === "seller"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Store size={15} />
            <span>Sebagai Penjual (Mitra)</span>
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs rounded-xl p-3 mb-5 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              {role === "seller" ? "Nama Lengkap Pemilik Toko" : (locale === "id" ? "Nama Lengkap" : "Full Name")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                name="name"
                placeholder={role === "seller" ? "Contoh: Hendra Kusuma" : "Contoh: Budi Santoso"}
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Store Name (Seller only) */}
          {role === "seller" && (
            <div className="animate-in fade-in slide-in-from-top-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Nama Toko / Usaha Mitra
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Store size={18} />
                </div>
                <input
                  type="text"
                  name="storeName"
                  placeholder="Contoh: TRIO Gadget Surabaya Official"
                  value={form.storeName}
                  onChange={handleChange}
                  required={role === "seller"}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
              </div>
              {errors.storeName && <p className="text-[11px] text-rose-500 mt-1">{errors.storeName}</p>}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
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
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              {locale === "id" ? "Nomor Telepon / WhatsApp" : "Phone Number"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="0812-3456-7890"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              {locale === "id" ? "Kata Sandi" : "Password"}
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
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
            {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
          </div>

          {/* 2FA Checkbox option */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="enable2FA"
                checked={form.enable2FA}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-blue-600" />
                  Aktifkan Verifikasi 2 Langkah (Google Authenticator)
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Setiap login akan meminta token 6-digit rolling untuk melindungi saldo dan akun Anda.
                </p>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
              role === "seller"
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25"
            }`}
          >
            {loading 
              ? "Mendaftarkan Akun..." 
              : (locale === "id" 
                  ? `Daftar Akun ${role === "seller" ? "Penjual Mitra" : "Pembeli"}` 
                  : "Register Account")}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          {locale === "id" ? "Sudah memiliki akun?" : "Already have an account?"}{" "}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
            {locale === "id" ? "Masuk Sekarang" : "Sign In"}
          </Link>
        </div>
      </div>
    </div>
  );
}

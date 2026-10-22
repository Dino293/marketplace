import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login, getUserLogged, putAccessToken } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useLocale } from "../contexts/LocaleContext";
import { Lock, Mail, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthUser } = useAuth();
  const { showToast } = useToast();
  const { locale } = useLocale();

  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get("redirect") || "/";

  const [form, setForm] = useState({ email: "demo@example.com", password: "password123" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await login(form);

      if (result.error) {
        setError(result.message || (locale === "id" ? "Login gagal" : "Failed to login"));
        showToast(result.message || (locale === "id" ? "Login gagal" : "Failed to login"), "error");
        return;
      }

      putAccessToken(result.data.accessToken);

      const userResult = await getUserLogged();
      if (userResult.error) {
        setError(userResult.message || (locale === "id" ? "Gagal mengambil data user" : "Failed to fetch user"));
        showToast(userResult.message || (locale === "id" ? "Gagal mengambil data user" : "Failed to fetch user"), "error");
        return;
      }

      setAuthUser(userResult.data);
      showToast(locale === "id" ? "Login berhasil! Selamat datang kembali" : "Login successful! Welcome back", "success");
      navigate(redirectUrl);
    } catch (err) {
      setError(err?.message || (locale === "id" ? "Terjadi kesalahan saat login" : "An error occurred during login"));
      showToast(err?.message || (locale === "id" ? "Terjadi kesalahan saat login" : "An error occurred during login"), "error");
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
        <span>{locale === "id" ? "Kembali ke Beranda (Lanjut Browsing Bebas)" : "Back to Home"}</span>
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-700 shadow-xl max-w-md w-full transition-colors">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
            <LogIn size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {locale === "id" ? "Selamat Datang" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {locale === "id" 
              ? "Masuk untuk menyelesaikan transaksi pembelian atau mengelola toko" 
              : "Login to complete transactions or manage inventory"}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs rounded-xl p-3 mb-5 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Hint */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300">
            <strong>Akun Demo Cepat:</strong> demo@example.com | Pass: password123
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? "Memproses..." : (locale === "id" ? "Masuk ke Akun" : "Sign In")}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          {locale === "id" ? "Belum punya akun?" : "Don't have an account?"}{" "}
          <Link to={`/register${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
            {locale === "id" ? "Daftar Sekarang" : "Register Now"}
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { 
  login, 
  getUserLogged, 
  putAccessToken, 
  generateTotpCode,
  DEMO_BUYER,
  DEMO_SELLER
} from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useLocale } from "../contexts/LocaleContext";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  LogIn, 
  ArrowLeft, 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  Store, 
  ShoppingBag, 
  CheckCircle2, 
  Copy, 
  Clock, 
  RefreshCw,
  QrCode
} from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthUser } = useAuth();
  const { showToast } = useToast();
  const { locale } = useLocale();

  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get("redirect") || "/";

  // State: step 1 ('credentials') | step 2 ('2fa')
  const [step, setStep] = useState("credentials");
  const [activeRole, setActiveRole] = useState("buyer"); // 'buyer' | 'seller'

  const [form, setForm] = useState({ 
    email: DEMO_BUYER.email, 
    password: DEMO_BUYER.password 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2FA state
  const [twoFactorData, setTwoFactorData] = useState(null);
  const [otpCode, setOtpCode] = useState("");
  const [liveToken, setLiveToken] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(30);

  // Live countdown timer for TOTP Google Authenticator token
  useEffect(() => {
    if (step === "2fa" && twoFactorData?.secretKey) {
      const updateToken = () => {
        const sec = 30 - (Math.floor(Date.now() / 1000) % 30);
        setSecondsRemaining(sec);
        setLiveToken(generateTotpCode(twoFactorData.secretKey));
      };

      updateToken();
      const interval = setInterval(updateToken, 1000);
      return () => clearInterval(interval);
    }
  }, [step, twoFactorData]);

  // Switch demo account role
  const handleSelectRole = (role) => {
    setActiveRole(role);
    if (role === "seller") {
      setForm({ email: DEMO_SELLER.email, password: DEMO_SELLER.password });
    } else {
      setForm({ email: DEMO_BUYER.email, password: DEMO_BUYER.password });
    }
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Step 1: Submit email & password
  const handleSubmitCredentials = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await login({ email: form.email, password: form.password });

      if (result.error) {
        setError(result.message || (locale === "id" ? "Login gagal" : "Failed to login"));
        showToast(result.message || (locale === "id" ? "Login gagal" : "Failed to login"), "error");
        return;
      }

      // Check if 2FA verification step is required
      if (result.requires2FA) {
        setTwoFactorData(result.data);
        const secret = result.data?.secretKey || "TRIOAUTH";
        setLiveToken(generateTotpCode(secret));
        setStep("2fa");
        showToast(
          locale === "id" 
            ? "Masukkan kode verifikasi 2 Langkah (Google Authenticator)" 
            : "Enter 2-Factor Authentication code", 
          "info"
        );
        return;
      }

      // If 2FA not enabled, complete login directly
      await finalizeLogin(result.data.accessToken);
    } catch (err) {
      setError(err?.message || (locale === "id" ? "Terjadi kesalahan saat login" : "An error occurred during login"));
      showToast(err?.message || (locale === "id" ? "Terjadi kesalahan saat login" : "An error occurred during login"), "error");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit 2FA OTP code
  const handleSubmit2FA = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setError(locale === "id" ? "Masukkan 6 digit kode token verifikasi" : "Enter 6 digit verification code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await login({
        email: form.email,
        password: form.password,
        otpCode: otpCode.trim()
      });

      if (result.error) {
        setError(result.message || "Kode 2FA tidak valid");
        showToast(result.message || "Kode 2FA tidak valid", "error");
        return;
      }

      await finalizeLogin(result.data.accessToken);
    } catch (err) {
      setError(err?.message || "Gagal memverifikasi 2FA");
      showToast(err?.message || "Gagal memverifikasi 2FA", "error");
    } finally {
      setLoading(false);
    }
  };

  const finalizeLogin = async (token) => {
    putAccessToken(token);
    const userResult = await getUserLogged();
    if (userResult.error) {
      setError(userResult.message || "Gagal mengambil data user");
      showToast(userResult.message || "Gagal mengambil data user", "error");
      return;
    }

    setAuthUser(userResult.data);
    const roleText = userResult.data.role === "seller" ? "Penjual Mitra" : "Pembeli";
    showToast(
      locale === "id" 
        ? `Verifikasi berhasil! Selamat datang, ${userResult.data.name} (${roleText})` 
        : `Verified! Welcome back, ${userResult.data.name}`, 
      "success"
    );
    navigate(redirectUrl);
  };

  const handleAutoFillToken = () => {
    if (liveToken) {
      setOtpCode(liveToken);
      showToast(locale === "id" ? "Kode token aktif otomatis disalin!" : "Token auto-filled!", "success");
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

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-700 shadow-xl max-w-lg w-full transition-colors">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
            {step === "2fa" ? <ShieldCheck size={28} /> : <LogIn size={28} />}
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {step === "2fa" 
              ? (locale === "id" ? "Verifikasi 2 Langkah (2FA)" : "Two-Factor Verification")
              : (locale === "id" ? "Selamat Datang di PT. TRIO" : "Welcome Back")}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {step === "2fa" 
              ? (locale === "id" 
                  ? "Lindungi akun Anda dengan token keamanan Google Authenticator" 
                  : "Secure your account with Google Authenticator token")
              : (locale === "id" 
                  ? "Pilih tipe akun dan masuk untuk bertransaksi atau mengelola toko" 
                  : "Choose account type to complete orders or manage inventory")}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs rounded-xl p-3 mb-5 font-semibold text-center animate-in fade-in">
            {error}
          </div>
        )}

        {/* STEP 1: CREDENTIALS (EMAIL & PASSWORD) */}
        {step === "credentials" && (
          <>
            {/* Quick 1-Click Demo Account Selector */}
            <div className="mb-6 space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Pilih Akun Demo 1-Klik:
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSelectRole("buyer")}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    activeRole === "buyer"
                      ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 ring-2 ring-blue-500/20"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs">
                    <ShoppingBag size={15} />
                    <span>Akun Pembeli</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate">
                    pembeli@trio.com
                  </p>
                  <span className="text-[10px] text-slate-400">Budi Santoso</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole("seller")}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    activeRole === "seller"
                      ? "border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/50 ring-2 ring-emerald-500/20"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    <Store size={15} />
                    <span>Akun Penjual (Mitra)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate">
                    penjual@trio.com
                  </p>
                  <span className="text-[10px] text-slate-400">PT. TRIO Store</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitCredentials} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Email Akun {activeRole === "seller" ? "Penjual" : "Pembeli"}
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

              {/* 2FA Notice Badge */}
              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40 flex items-center gap-2.5 text-[11px] text-blue-800 dark:text-blue-300">
                <ShieldCheck size={18} className="text-blue-600 shrink-0" />
                <span>
                  Akun ini dilengkapi <strong>Verifikasi 2 Langkah (Google Authenticator)</strong> untuk keamanan maksimal.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? "Memverifikasi Kredensial..." : (locale === "id" ? "Lanjut ke Verifikasi 2x →" : "Proceed to 2FA Step →")}
              </button>
            </form>
          </>
        )}

        {/* STEP 2: TWO-FACTOR AUTHENTICATION (GOOGLE AUTHENTICATOR / OTP) */}
        {step === "2fa" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* User Target Card */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {twoFactorData?.name || form.email}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {form.email} • {twoFactorData?.role === "seller" ? "🏪 Penjual Mitra" : "🛒 Pembeli"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep("credentials")}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Ganti Akun
              </button>
            </div>

            {/* Google Authenticator Simulation Display Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-900 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-800/60 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                    G
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">Google Authenticator TOTP</h4>
                    <span className="text-[10px] text-blue-300">Simulasi Token 30 Detik</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md">
                  <Clock size={12} />
                  <span>{secondsRemaining}s</span>
                </div>
              </div>

              {/* Rolling 6-digit code */}
              <div className="text-center py-2">
                <p className="text-[11px] text-indigo-300 mb-1">Kode Token Keamanan Saat Ini:</p>
                <div className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-emerald-400 drop-shadow-md">
                  {liveToken || "123456"}
                </div>
                {/* 30s visual progress bar */}
                <div className="w-full bg-indigo-950/80 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${(secondsRemaining / 30) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick auto-fill button */}
              <div className="mt-3 pt-3 border-t border-indigo-800/60 flex items-center justify-between gap-2">
                <span className="text-[10px] text-indigo-300 truncate">
                  Kunci Rahasia: <code className="text-white">{twoFactorData?.secretKey || "TRIOAUTH"}</code>
                </span>
                <button
                  type="button"
                  onClick={handleAutoFillToken}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1 shadow-xs"
                >
                  <Copy size={12} />
                  <span>Pasang Token</span>
                </button>
              </div>
            </div>

            {/* OTP Input Form */}
            <form onSubmit={handleSubmit2FA} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Masukkan 6-Digit Kode Token:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound size={18} />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Contoh: 123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 text-base sm:text-lg font-mono tracking-widest text-center font-bold bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 text-center">
                  Bisa menggunakan token di atas atau token uji cepat: <strong className="text-slate-800 dark:text-slate-200 font-mono">123456</strong>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep("credentials")}
                  className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || otpCode.length < 6}
                  className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? "Memverifikasi Token..." : "Verifikasi & Masuk ke Akun"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          {locale === "id" ? "Belum punya akun?" : "Don't have an account?"}{" "}
          <Link to={`/register${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
            {locale === "id" ? "Daftar Akun Pembeli / Penjual" : "Register Now"}
          </Link>
        </div>
      </div>
    </div>
  );
}

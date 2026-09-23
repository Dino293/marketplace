import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, getUserLogged, putAccessToken } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useLocale } from "../contexts/LocaleContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const { showToast } = useToast();
  const { locale } = useLocale();

  const [form, setForm] = useState({ email: "", password: "" });
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
      showToast(locale === "id" ? "Login berhasil" : "Login successful", "success");
      navigate("/");
    } catch (err) {
      setError(err?.message || (locale === "id" ? "Terjadi kesalahan saat login" : "An error occurred during login"));
      showToast(err?.message || (locale === "id" ? "Terjadi kesalahan saat login" : "An error occurred during login"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <h2>{locale === "id" ? "Masuk" : "Login"}</h2>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <input
          type="email"
          name="email"
          placeholder={locale === "id" ? "Email" : "Email"}
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder={locale === "id" ? "Kata Sandi" : "Password"}
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (locale === "id" ? "Sedang login..." : "Logging in...") : (locale === "id" ? "Masuk" : "Login")}
        </button>
      </form>

      <p>
        {locale === "id" ? "Belum punya akun?" : "Don't have an account?"} <Link to="/register">{locale === "id" ? "Daftar" : "Register"}</Link>
      </p>
    </section>
  );
}

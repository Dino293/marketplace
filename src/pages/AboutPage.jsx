import React from "react";
import { useLocale } from "../contexts/LocaleContext";
import FooterSection from "../components/FooterSection";
import { 
  Building2, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  Award, 
  CheckCircle2, 
  MapPin, 
  Mail, 
  Phone 
} from "lucide-react";

export default function AboutPage() {
  const { locale } = useLocale();

  const values = [
    {
      icon: <ShieldCheck size={28} className="text-blue-600" />,
      title: locale === "id" ? "100% Produk Original & Resmi" : "100% Official & Authentic",
      desc: locale === "id" 
        ? "Setiap barang bergaransi resmi dari pabrikan ternama (SEIN, TAM, iBox, dll)." 
        : "Every item backed by official manufacturer warranty."
    },
    {
      icon: <Award size={28} className="text-amber-600" />,
      title: locale === "id" ? "Distributor Utama Terpercaya" : "Authorized Tier-1 Distributor",
      desc: locale === "id" 
        ? "Melayani pasokan gadget dan elektronik retail maupun corporate di seluruh Indonesia." 
        : "Supplying retail and corporate electronic gadgets across Indonesia."
    },
    {
      icon: <Truck size={28} className="text-emerald-600" />,
      title: locale === "id" ? "Logistik Cepat & Aman" : "Safe & Fast Logistics",
      desc: locale === "id" 
        ? "Pengemasan berstandar proteksi tinggi dengan asuransi pengiriman terjamin." 
        : "High protection standard packaging with guaranteed shipping insurance."
    },
    {
      icon: <Headphones size={28} className="text-indigo-600" />,
      title: locale === "id" ? "Layanan Bantuan 24/7" : "24/7 Support Service",
      desc: locale === "id" 
        ? "Tim customer care kami siap membantu klaim garansi dan konsultasi produk." 
        : "Dedicated customer support ready for claims and product consultations."
    }
  ];

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <div className="bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-xl">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Building2 size={14} />
            <span>Tentang PT. TRIO Distribusi</span>
          </div>
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight leading-tight">
            Menghubungkan Inovasi Teknologi Terbaik untuk Indonesia
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            PT. TRIO Distribusi adalah pelopor jaringan distribusi gadget, smartphone, dan perangkat komputasi terkemuka yang mengutamakan integritas, keaslian produk, dan kepuasan pelanggan.
          </p>
        </div>
      </div>

      {/* Corporate Values */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {values.map((v, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="p-3 rounded-2xl bg-slate-50 w-fit">
              {v.icon}
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{v.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </section>

      {/* Office & Contact Info */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block mb-1">
              Kantor Pusat & Gudang Distribusi
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              PT. TRIO Distribusi Indonesia
            </h2>
          </div>

          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Alamat Kantor:</strong>
                <span>Gedung TRIO Plaza Lantai 5, Jl. Jend. Sudirman Kav. 21, Jakarta Selatan 12920, Indonesia</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Email Layanan:</strong>
                <span>support@triodistribusi.co.id / sales@triodistribusi.co.id</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Hotline Layanan:</strong>
                <span>(021) 5098-7654 / WhatsApp: +62 812-3456-7890</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Jaminan Garansi Resmi 1 Tahun</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Semua produk yang didistribusikan oleh PT. TRIO Distribusi dilengkapi kartu garansi resmi. Jika terdapat cacat pabrik dalam kurun waktu 14 hari pertama, kami menyediakan program penggantian unit baru <em>(1-to-1 replacement)</em> sesuai ketentuan yang berlaku.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full">
              ✓ Garansi SEIN
            </span>
            <span className="bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full">
              ✓ Garansi iBox / TAM
            </span>
            <span className="bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full">
              ✓ Garansi Resmi Xiaomi
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

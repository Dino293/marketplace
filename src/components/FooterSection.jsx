import React from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Headphones, 
  Truck, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Scale, 
  Bot, 
  ExternalLink,
  Clock,
  Sparkles
} from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="mt-14 rounded-3xl bg-slate-900 text-slate-300 border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Value Badges */}
      <div className="border-b border-slate-800/80 px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Original</h4>
              <p className="text-xs text-slate-400">Garansi resmi distributor 1 tahun</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Pengiriman Cepat</h4>
              <p className="text-xs text-slate-400">SiCepat, JNE, GoSend Instant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <CreditCard size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Pembayaran Aman</h4>
              <p className="text-xs text-slate-400">QRIS Dinamis & Virtual Account</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 shrink-0">
              <Headphones size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Layanan CS 24/7</h4>
              <p className="text-xs text-slate-400">Dukungan AI Chatbot & WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Topic Footer Links */}
      <div className="px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Kolom 1: Profil Perusahaan */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              T
            </div>
            <div>
              <span className="font-black text-lg text-white tracking-tight">PT. TRIO Distribusi</span>
              <p className="text-xs text-blue-400 font-semibold">Authorized Technology Partner Indonesia</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mt-1">
            Pusat distribusi dan marketplace ritel resmi terpercaya untuk smartphone flagship, tablet, audio nirkabel, dan ekosistem gadget bergaransi pabrikan di Indonesia.
          </p>
          <div className="text-xs text-slate-400 mt-2 space-y-1">
            <p className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock size={13} className="text-blue-400" />
              <span>Jam Operasional Layanan:</span>
            </p>
            <p className="text-slate-400 pl-5">Senin - Minggu: 08.00 - 22.00 WIB (Online CS 24 Jam)</p>
          </div>
        </div>

        {/* Kolom 2: Tentang Saya & Pengembang */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3 tracking-wide flex items-center gap-1.5">
            <User size={15} className="text-blue-400" />
            <span>Tentang Saya</span>
          </h4>
          <div className="text-xs text-slate-400 space-y-2">
            <p className="font-bold text-slate-200">Muhammad Indra</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Full-Stack Developer & Author aplikasi MarketPlace PT. TRIO Distribusi.
            </p>
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <a 
                href="mailto:muhindra293@gmail.com" 
                className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-blue-400"
              >
                <Mail size={12} />
                <span>muhindra293@gmail.com</span>
              </a>
              <a 
                href="https://wa.me/628971419924" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400"
              >
                <Phone size={12} />
                <span>+62 897-1419-924</span>
              </a>
            </div>
          </div>
        </div>

        {/* Kolom 3: Lokasi Perusahaan & Gudang */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3 tracking-wide flex items-center gap-1.5">
            <MapPin size={15} className="text-rose-400" />
            <span>Lokasi Perusahaan</span>
          </h4>
          <div className="text-xs text-slate-400 space-y-2">
            <div>
              <p className="font-bold text-slate-200">Kantor Pusat:</p>
              <p className="leading-relaxed">
                Gedung TRIO Plaza Lt. 5, Jl. Jend. Sudirman Kav. 21, Jakarta Selatan 12920.
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-200">Pusat Distribusi (Gudang):</p>
              <p className="leading-relaxed">
                Pusat Logistik Berikat Blok B7, Cakung, Jakarta Timur 13910.
              </p>
            </div>
            <a 
              href="https://maps.google.com/?q=Sudirman+Jakarta" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold pt-1"
            >
              <span>Buka di Google Maps</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Kolom 4: Kontak & Fitur Baru */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3 tracking-wide flex items-center gap-1.5">
            <Phone size={15} className="text-emerald-400" />
            <span>Kontak & Fitur</span>
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <a 
                href="https://wa.me/628971419924" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>WhatsApp: 08971419924</span>
              </a>
            </li>
            <li>
              <a 
                href="mailto:muhindra293@gmail.com" 
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>muhindra293@gmail.com</span>
              </a>
            </li>
            <li>
              <Link to="/compare" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <Scale size={13} className="text-blue-400" />
                <span>Fitur Bandingkan Barang (Compare)</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-amber-400" />
                <span>Garansi Resmi & Keaslian</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>© 2025 PT. TRIO Distribusi MarketPlace. Dikelola oleh Muhammad Indra (muhindra293@gmail.com).</p>
        <p className="text-slate-400 flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-400" />
          <span>React • Tailwind CSS • PWA Ready</span>
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;

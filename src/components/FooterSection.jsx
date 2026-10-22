import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Headphones, Truck, CreditCard } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="mt-14 rounded-3xl bg-slate-900 text-slate-300 border border-slate-800 overflow-hidden shadow-2xl">
      {/* Value Badges */}
      <div className="border-b border-slate-800/80 px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Original</h4>
              <p className="text-xs text-slate-400">Garansi resmi distributor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Pengiriman Cepat</h4>
              <p className="text-xs text-slate-400">Jangkauan seluruh Indonesia</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <CreditCard size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Pembayaran Aman</h4>
              <p className="text-xs text-slate-400">QRIS, VA & Kartu Kredit</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 shrink-0">
              <Headphones size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Layanan CS 24/7</h4>
              <p className="text-xs text-slate-400">Dukungan teknis responsif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="px-6 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand info */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xl flex items-center justify-center">
              T
            </div>
            <div>
              <span className="font-black text-lg text-white tracking-tight">PT. TRIO Distribusi</span>
              <p className="text-xs text-blue-400 font-semibold">Authorized Technology Partner</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mt-1">
            Pusat distribusi dan ritel resmi terpercaya untuk smartphone, laptop, audio, dan ekosistem gadget bergaransi resmi di Indonesia sejak 1996.
          </p>
          <div className="text-xs text-slate-400 mt-2">
            <p className="font-semibold text-slate-300">Jam Operasional Layanan:</p>
            <p>Senin - Minggu: 08.00 - 22.00 WIB</p>
          </div>
        </div>

        {/* Belanja */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3 tracking-wide">Kategori Produk</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/catalog" className="hover:text-blue-400 transition-colors">Smartphone & Tablet</Link></li>
            <li><Link to="/catalog" className="hover:text-blue-400 transition-colors">Laptop & Komputer</Link></li>
            <li><Link to="/catalog" className="hover:text-blue-400 transition-colors">Audio & Smartwatch</Link></li>
            <li><Link to="/catalog" className="hover:text-blue-400 transition-colors">Aksesoris & Gaming</Link></li>
          </ul>
        </div>

        {/* Bantuan */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3 tracking-wide">Pusat Bantuan</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/about" className="hover:text-blue-400 transition-colors">FAQ & Tanya Jawab</Link></li>
            <li><Link to="/profile" className="hover:text-blue-400 transition-colors">Status & Lacak Pesanan</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition-colors">Klaim Garansi Resmi</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition-colors">Syarat & Ketentuan</Link></li>
          </ul>
        </div>

        {/* Media Sosial */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3 tracking-wide">Hubungi Kami</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>support@triodistribusi.co.id</li>
            <li>WhatsApp: 0812-3456-7890</li>
            <li>Telepon: (021) 5098-7654</li>
            <li><Link to="/about" className="hover:text-blue-400 text-blue-400 transition-colors">Kunjungi Kantor Pusat →</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>© 2025 PT. TRIO Distribusi MarketPlace. Seluruh hak cipta dilindungi.</p>
        <p className="text-slate-400">Dibuat dengan React & Tailwind CSS</p>
      </div>
    </footer>
  );
};

export default FooterSection;

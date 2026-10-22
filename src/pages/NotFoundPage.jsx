import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const { locale } = useLocale();

  return (
    <div className="flex items-center justify-center min-h-[65vh] px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Compass size={40} className="animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <h1 className="text-6xl font-black text-slate-900 tracking-tight mb-2">404</h1>
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
          {locale === 'id' ? 'Halaman Tidak Ditemukan' : 'Page Not Found'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-8 max-w-sm mx-auto">
          {locale === 'id' 
            ? 'Maaf, halaman atau produk yang Anda tuju mungkin sudah dipindahkan atau tidak tersedia.' 
            : 'Sorry, the page you are looking for does not exist or has been moved.'}
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-105"
        >
          <ArrowLeft size={16} />
          <span>{locale === 'id' ? 'Kembali ke Beranda Utama' : 'Back to Home'}</span>
        </Link>
      </div>
    </div>
  );
}
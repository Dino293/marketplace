import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

export default function NotFoundPage() {
  const { locale } = useLocale();

  return (
    <section className="p-6 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">
          {locale === 'id' ? 'Halaman Tidak Ditemukan' : 'Page Not Found'}
        </h2>
        <p className="text-gray-600 mb-8">
          {locale === 'id' 
            ? 'Maaf, halaman yang Anda cari tidak ditemukan.' 
            : 'Sorry, the page you are looking for does not exist.'
          }
        </p>
        <Link to="/" className="btn-primary">
          {locale === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
        </Link>
      </div>
    </section>
  );
}
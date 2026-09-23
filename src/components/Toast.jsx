import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

export default function Toast({ message, type = 'info', onClose }) {
  const { locale } = useLocale();

  if (!message) return null;

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white'
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`${typeStyles[type]} rounded-lg shadow-lg p-4 flex items-center justify-between`}>
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-lg font-semibold hover:opacity-70"
          aria-label={locale === 'id' ? 'Tutup' : 'Close'}
        >
          ×
        </button>
      </div>
    </div>
  );
}
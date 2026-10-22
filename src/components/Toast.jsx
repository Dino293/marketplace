import React from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  const { locale } = useLocale();

  if (!message) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-600 text-white shadow-emerald-500/25',
      icon: <CheckCircle2 size={18} className="shrink-0" />
    },
    error: {
      bg: 'bg-rose-600 text-white shadow-rose-500/25',
      icon: <AlertCircle size={18} className="shrink-0" />
    },
    warning: {
      bg: 'bg-amber-500 text-slate-950 shadow-amber-500/25',
      icon: <AlertTriangle size={18} className="shrink-0" />
    },
    info: {
      bg: 'bg-blue-600 text-white shadow-blue-500/25',
      icon: <Info size={18} className="shrink-0" />
    }
  };

  const current = typeConfig[type] || typeConfig.info;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-top-3 fade-in duration-200">
      <div className={`${current.bg} rounded-2xl shadow-xl p-3.5 flex items-center justify-between gap-3 border border-white/20 backdrop-blur-md`}>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {current.icon}
          <span className="text-xs sm:text-sm font-semibold truncate leading-tight">
            {message}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/10 transition-colors cursor-pointer shrink-0"
          aria-label={locale === 'id' ? 'Tutup notifikasi' : 'Close notification'}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
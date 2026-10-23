import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCompare } from "../contexts/CompareContext";
import { useLocale } from "../contexts/LocaleContext";
import { Scale, X, ArrowRight, Trash2 } from "lucide-react";

export default function CompareFloatingBar() {
  const { compareItems, compareCount, removeFromCompare, clearCompare } = useCompare();
  const { locale } = useLocale();
  const location = useLocation();

  // Hide on compare page itself
  if (compareCount === 0 || location.pathname === "/compare") {
    return null;
  }

  return (
    <aside aria-label="Bilah perbandingan produk" className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92%] sm:w-auto bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md text-white rounded-2xl sm:rounded-full p-2.5 sm:px-4 sm:py-2.5 shadow-2xl border border-slate-700/80 animate-in slide-in-from-bottom-3 duration-200">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Info & Thumbnails */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Scale size={16} />
            </div>
            <div>
              <span className="text-xs font-black block leading-none">
                {locale === "id" ? "Bandingkan Barang" : "Compare Products"}
              </span>
              <span className="text-[10px] text-slate-400">
                {compareCount}/4 {locale === "id" ? "produk dipilih" : "selected"}
              </span>
            </div>
          </div>

          {/* Mini Thumbnails */}
          <div className="flex items-center -space-x-2">
            {compareItems.map(item => (
              <div 
                key={item.id} 
                className="relative group w-8 h-8 rounded-full bg-white p-1 border-2 border-slate-800 shadow-xs shrink-0 overflow-hidden"
                title={item.title}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = "/terlaris/1.jpg"; }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFromCompare(item.id);
                  }}
                  className="absolute inset-0 bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Hapus"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
          <button
            type="button"
            onClick={clearCompare}
            className="text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-1.5 transition-colors cursor-pointer"
          >
            {locale === "id" ? "Batal" : "Clear"}
          </button>

          <Link
            to="/compare"
            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>{locale === "id" ? "Bandingkan Sekarang" : "Compare Now"}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </aside>
  );
}

import React from "react";
import { X, Package, Clock, CheckCircle2, Truck, ExternalLink } from "lucide-react";
import { useLocale } from "../contexts/LocaleContext";
import { Link } from "react-router-dom";

export default function OrderModal({ isOpen, onClose, orders }) {
  const { locale } = useLocale();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Package size={22} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {locale === "id" ? "Riwayat Pesanan Anda" : "Your Orders"}
              </h3>
              <p className="text-xs text-slate-500">
                {orders.length} {locale === "id" ? "transaksi tercatat di sistem" : "recorded orders"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {orders.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="p-4 rounded-full bg-slate-100 text-slate-400 mb-3">
                <Clock size={32} />
              </div>
              <p className="text-sm font-bold text-slate-800">
                {locale === "id" ? "Belum Ada Riwayat Pesanan" : "No Orders Yet"}
              </p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                {locale === "id" 
                  ? "Yuk mulai belanja gadget impian Anda di katalog resmi PT. TRIO Distribusi!" 
                  : "Start exploring our official distributor catalog!"}
              </p>
            </div>
          ) : (
            orders.map((ord, idx) => (
              <div 
                key={ord.id || idx} 
                className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-blue-200 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div>
                    <span className="text-xs font-black text-slate-900 tracking-tight block">
                      {ord.id}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(ord.date).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                    ord.status === "Selesai" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : ord.status === "Dalam Perjalanan"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {ord.status === "Selesai" ? <CheckCircle2 size={13} /> : <Truck size={13} />}
                    {ord.status || "Diproses"}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {ord.items?.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                        <img 
                          src={item.image || "/terlaris/1.jpg"} 
                          alt={item.title} 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span>{item.quantity || 1}x</span>
                          {item.variant && <span>• {item.variant}</span>}
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900 shrink-0">
                        Rp {((item.price || 0) * (item.quantity || 1)).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <div className="text-slate-500 text-[11px]">
                    Kurir: <strong className="text-slate-700">{ord.courier || "SiCepat"}</strong>
                    {ord.trackingNumber && (
                      <span className="ml-2 font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {ord.trackingNumber}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500 mr-2">Total Belanja:</span>
                    <strong className="text-blue-600 font-extrabold text-sm">
                      Rp {(ord.total || ord.subtotal || 0).toLocaleString("id-ID")}
                    </strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <Link
            to="/profile"
            onClick={onClose}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            {locale === "id" ? "Buka Dashboard Profil Lengkap" : "Open Full Profile"}
            <ExternalLink size={14} />
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            {locale === "id" ? "Tutup" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

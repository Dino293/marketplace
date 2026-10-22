import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export default function NewProductCarousel({ items = [] }) {
  const [index, setIndex] = useState(0);
  const hoverRef = useRef(false);
  const autoplayRef = useRef(null);

  useEffect(() => {
    if (!items.length) return;
    autoplayRef.current = setInterval(() => {
      if (!hoverRef.current) {
        setIndex((prev) => (prev + 1) % items.length);
      }
    }, 4500);
    return () => clearInterval(autoplayRef.current);
  }, [items.length]);

  if (!items.length) return null;

  const currentItem = items[index];

  const next = () => setIndex((prev) => (prev + 1) % items.length);
  const prev = () => setIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div 
      className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white shadow-xl min-h-[220px] sm:min-h-[300px] flex items-center group"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center p-6 sm:p-10 gap-6">
        {/* Left Content */}
        <div className="z-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold w-fit mb-3 border border-blue-400/30">
            <Sparkles size={14} className="text-amber-400" />
            <span>Produk Unggulan Terbaru 2025</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white line-clamp-2">
            {currentItem?.title || "Smartphone & Gadget Flagship"}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 mt-2 max-w-md">
            {currentItem?.description || "Dapatkan teknologi termutakhir dengan garansi resmi dan performa terbaik di kelasnya."}
          </p>

          <div className="mt-4 flex items-center gap-3">
            {currentItem && (
              <span className="text-lg sm:text-2xl font-black text-amber-400">
                Rp {currentItem.price?.toLocaleString("id-ID")}
              </span>
            )}
            <Link
              to={currentItem ? `/products/${currentItem.id}` : "/"}
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              Lihat Detail
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative flex items-center justify-center h-48 sm:h-64">
          {currentItem && (
            <img 
              src={currentItem.image} 
              alt={currentItem.title}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-105"
              onError={(e) => {
                e.target.src = '/images/placeholder.jpg';
              }}
            />
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prev}
        className="absolute left-3 p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={next}
        className="absolute right-3 p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              index === i ? "w-6 bg-blue-500" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

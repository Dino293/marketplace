import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../contexts/LocaleContext";
import { Clock, Zap, ArrowRight, Flame } from "lucide-react";

export default function FlashSaleCarousel({ items = [] }) {
  const { locale } = useLocale();
  const [timeLeft, setTimeLeft] = useState({
    hours: "04",
    minutes: "48", 
    seconds: "22"
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        let sec = parseInt(seconds);
        let min = parseInt(minutes);
        let hr = parseInt(hours);
        
        sec--;
        if (sec < 0) {
          sec = 59;
          min--;
          if (min < 0) {
            min = 59;
            hr--;
            if (hr < 0) {
              hr = 23;
            }
          }
        }
        
        return {
          hours: hr.toString().padStart(2, '0'),
          minutes: min.toString().padStart(2, '0'),
          seconds: sec.toString().padStart(2, '0')
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.jpg';
  };

  const calculateDiscount = (currentPrice, originalPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-red-600 to-amber-600 p-5 sm:p-7 text-white shadow-xl">
      {/* Background Decor */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header & Countdown */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-amber-300 shadow-inner flex items-center justify-center">
            <Zap size={24} className="fill-amber-300 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                Flash Sale
              </h2>
              <span className="flex items-center gap-1 bg-amber-400 text-rose-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                <Flame size={12} className="fill-rose-900" /> Hot
              </span>
            </div>
            <p className="text-xs sm:text-sm text-rose-100 font-medium">
              {locale === "id" 
                ? "Diskon eksklusif terbatas hari ini, jangan sampai kehabisan!" 
                : "Limited-time deals, grab yours before it ends!"}
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-3 bg-black/25 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 self-start md:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-rose-200 font-medium">
            <Clock size={15} />
            <span>{locale === "id" ? "Berakhir:" : "Ends in:"}</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-extrabold">
            <span className="bg-slate-900/90 text-amber-300 px-2 py-1 rounded-lg shadow-inner">
              {timeLeft.hours}
            </span>
            <span className="text-amber-300 font-black">:</span>
            <span className="bg-slate-900/90 text-amber-300 px-2 py-1 rounded-lg shadow-inner">
              {timeLeft.minutes}
            </span>
            <span className="text-amber-300 font-black">:</span>
            <span className="bg-slate-900/90 text-amber-300 px-2 py-1 rounded-lg shadow-inner animate-pulse">
              {timeLeft.seconds}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Cards Scroll */}
      <div className="flex items-stretch gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {items.map((item, index) => {
          const originalPrice = (item.price || 0) * 1.35;
          const discountPercent = calculateDiscount(item.price, originalPrice);
          const soldPercentage = Math.min(60 + (index * 6), 94);
          const stockLeft = Math.max(16 - (index * 2), 3);
          
          return (
            <Link 
              key={item.id} 
              to={`/products/${item.id}`}
              className="group shrink-0 w-44 sm:w-52 bg-white rounded-2xl p-3 text-slate-800 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Product Image */}
                <div className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden p-2 flex items-center justify-center mb-2.5">
                  <span className="absolute top-2 left-2 z-10 bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                    -{discountPercent}%
                  </span>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    onError={handleImageError}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                  />
                </div>

                {/* Brand & Title */}
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600">
                  {item.brand || "Gadget"}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 group-hover:text-rose-600 transition-colors">
                  {item.title}
                </h3>

                {/* Prices */}
                <div className="mt-1">
                  <div className="text-sm sm:text-base font-extrabold text-rose-600">
                    Rp {item.price?.toLocaleString("id-ID") || '0'}
                  </div>
                  <div className="text-[11px] text-slate-400 line-through">
                    Rp {Math.round(originalPrice).toLocaleString("id-ID")}
                  </div>
                </div>
              </div>

              {/* Stock Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                  <span>Terjual {soldPercentage}%</span>
                  <span className="text-rose-600 font-bold">Sisa {stockLeft}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-rose-600 rounded-full transition-all duration-500"
                    style={{ width: `${soldPercentage}%` }}
                  ></div>
                </div>

                <div className="mt-3 w-full py-1.5 rounded-xl bg-rose-50 group-hover:bg-rose-600 group-hover:text-white text-rose-600 text-xs font-bold text-center transition-colors">
                  {locale === "id" ? "Ambil Promo" : "Claim Deal"}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
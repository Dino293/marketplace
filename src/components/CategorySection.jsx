import React from "react";
import { useSearch } from "../contexts/SearchContext";
import { useLocale } from "../contexts/LocaleContext";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";

export default function CategorySection() {
  const { selectCategory, selectedCategory, clearFilters } = useSearch();
  const { locale } = useLocale();
  const scrollContainerRef = React.useRef(null);

  const categories = [
    { 
      name: "Smartphone", 
      image: "/kategori/smartphone.jpg", 
      value: "smartphone",
      description: locale === "id" ? "Ponsel & Tablet" : "Phones & Tablets"
    },
    { 
      name: "Laptop", 
      image: "/kategori/laptop.jpg", 
      value: "laptop",
      description: locale === "id" ? "Komputer & Laptop" : "Computers & Laptops"
    },
    { 
      name: "Smartwatch", 
      image: "/kategori/smartwatch.jpg", 
      value: "smartwatch",
      description: locale === "id" ? "Wearable & Smartwatch" : "Wearables & Smartwatches"
    },
    { 
      name: "Earphone", 
      image: "/kategori/earphone.jpg", 
      value: "audio",
      description: locale === "id" ? "Audio & Headphone" : "Audio & Headphones"
    },
    { 
      name: "Kamera", 
      image: "/kategori/kamera.jpg", 
      value: "camera",
      description: locale === "id" ? "Fotografi & Kamera" : "Photography & Cameras"
    },
    { 
      name: "Gaming", 
      image: "/kategori/gaming.jpg", 
      value: "gaming",
      description: locale === "id" ? "Console & Aksesori" : "Consoles & Accessories"
    },
    { 
      name: "TV", 
      image: "/kategori/TV.jpg", 
      value: "tv",
      description: locale === "id" ? "Televisi & Home Theater" : "TV & Home Theater"
    },
    { 
      name: "Smart Home", 
      image: "/kategori/Smarthome.jpg", 
      value: "smart-home",
      description: locale === "id" ? "Perangkat Rumah Pintar" : "Smart Home Devices"
    },
  ];

  const handleCategoryClick = (categoryValue) => {
    if (selectedCategory === categoryValue) {
      clearFilters();
    } else {
      selectCategory(categoryValue);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <LayoutGrid size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {locale === "id" ? "Kategori Pilihan" : "Popular Categories"}
            </h2>
            <p className="text-xs text-slate-500">
              {locale === "id" ? "Jelajahi berbagai perangkat teknologi unggulan" : "Explore top gadgets and tech devices"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedCategory && (
            <button 
              onClick={clearFilters} 
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer mr-2"
            >
              {locale === "id" ? "Hapus Filter" : "Clear Filter"}
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5">
            <button 
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer" 
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer" 
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Horizontal Carousel */}
      <div 
        className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
        ref={scrollContainerRef}
      >
        {categories.map((cat, index) => {
          const isActive = selectedCategory === cat.value;
          return (
            <div 
              key={index}
              onClick={() => handleCategoryClick(cat.value)}
              className={`shrink-0 w-32 sm:w-36 p-3 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all duration-200 border ${
                isActive 
                  ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-sm" 
                  : "bg-slate-50/70 hover:bg-white border-slate-200/70 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2.5 rounded-xl overflow-hidden bg-white p-1.5 shadow-2xs flex items-center justify-center">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
              <h3 className={`text-xs sm:text-sm font-bold truncate w-full ${isActive ? "text-blue-700" : "text-slate-800"}`}>
                {cat.name}
              </h3>
              <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                {cat.description}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
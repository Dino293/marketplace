import React from "react";
import { useSearch } from "../contexts/SearchContext";
import { useLocale } from "../contexts/LocaleContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/style.css";

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
    // 3 kategori baru
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
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="category-section">
      <div className="category-header">
        <h2 className="category-title">
          {locale === "id" ? "Kategori Populer" : "Popular Categories"}
        </h2>
        {selectedCategory && (
          <button onClick={clearFilters} className="clear-categories-btn">
            {locale === "id" ? "Hapus Filter" : "Clear Filter"}
          </button>
        )}
      </div>
      
      <div className="category-scroll-container">
        <button 
          className="scroll-button scroll-left" 
          onClick={scrollLeft}
          aria-label={locale === "id" ? "Gulir kiri" : "Scroll left"}
        >
          <ChevronLeft size={20} />
        </button>
        
        <div 
          className="category-scroll-wrapper"
          ref={scrollContainerRef}
        >
          {categories.map((cat, index) => (
            <div 
              className={`category-item ${selectedCategory === cat.value ? 'active' : ''}`}
              key={index}
              onClick={() => handleCategoryClick(cat.value)}
            >
              <div className="category-image-container">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="category-image"
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                    e.target.className = 'image-error';
                  }}
                />
                {selectedCategory === cat.value && (
                  <div className="category-active-indicator">
                    <div className="active-dot"></div>
                  </div>
                )}
              </div>
              <div className="category-info">
                <p className="category-name">{cat.name}</p>
                <span className="category-description">{cat.description}</span>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="scroll-button scroll-right" 
          onClick={scrollRight}
          aria-label={locale === "id" ? "Gulir kanan" : "Scroll right"}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/style.css";

export default function NewProductCarousel({ items }) {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(window.innerWidth <= 768 ? 1 : 2);
  const hoverRef = useRef(false);
  const autoplayRef = useRef(null);

  // Responsif
  useEffect(() => {
    const handleResize = () => setVisibleCount(window.innerWidth <= 768 ? 1 : 2);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide setiap 4 detik
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      if (!hoverRef.current) setIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(autoplayRef.current);
  }, [items.length]);

  const next = () => setIndex((prev) => (prev + 1) % items.length);
  const prev = () => setIndex((prev) => (prev - 1 + items.length) % items.length);

  const visibleItems = items.slice(index, index + visibleCount);
  if (visibleItems.length < visibleCount) {
    visibleItems.push(...items.slice(0, visibleCount - visibleItems.length));
  }

  return (
    <section
      className="new-product-carousel"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      <button className="arrow left" onClick={prev}>
        <ChevronLeft />
      </button>

      <div className="carousel-content">
        {visibleItems.map((item, i) => (
          <div key={i} className="product-slide">
            {/* Hanya menampilkan gambar, tanpa overlay */}
            <img src={item.image} alt="Produk" className="slide-image" />
          </div>
        ))}
      </div>

      <button className="arrow right" onClick={next}>
        <ChevronRight />
      </button>
    </section>
  );
}

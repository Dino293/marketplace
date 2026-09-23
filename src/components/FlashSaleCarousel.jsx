import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../contexts/LocaleContext";
import { Clock, ArrowRight } from "lucide-react";
import "../styles/style.css";

export default function FlashSaleCarousel({ items = [] }) {
  const { locale } = useLocale();
  const [timeLeft, setTimeLeft] = useState({
    hours: "05",
    minutes: "32", 
    seconds: "15"
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
    e.target.className = 'image-error';
  };

  const calculateDiscount = (currentPrice, originalPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <div className="flash-sale-section-wrapper">
      <div className="flash-sale-section">
        <div className="flash-sale-header">
          <div className="flash-sale-title">
            <h2>⚡ {locale === "id" ? "Flash Sale" : "Flash Sale"}</h2>
            <div className="flash-sale-subtitle">
              {locale === "id" 
                ? "Diskon spesial untuk waktu terbatas - Jangan sampai kehabisan!" 
                : "Special discounts for limited time - Don't miss out!"
              }
            </div>
          </div>
          <div className="flash-sale-controls">
            <div className="countdown-timer">
              <div className="countdown-label">
                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {locale === "id" ? "Berakhir dalam:" : "Ends in:"}
              </div>
              <div className="countdown-display">
                <span className="time-unit">{timeLeft.hours}</span>
                <span className="time-separator">:</span>
                <span className="time-unit">{timeLeft.minutes}</span>
                <span className="time-separator">:</span>
                <span className="time-unit">{timeLeft.seconds}</span>
              </div>
            </div>
            <Link to="/flash-sale" className="see-all-btn">
              {locale === "id" ? "Lihat Semua" : "See All"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="flash-sale-container">
          <div className="flash-sale-grid">
            {items.map((item, index) => {
              const originalPrice = (item.price || 0) * 1.25;
              const discountPercent = calculateDiscount(item.price, originalPrice);
              const soldPercentage = Math.min(65 + (index * 5), 95); // Dynamic untuk demo
              const stockLeft = Math.max(15 - index, 5); // Dynamic untuk demo
              
              return (
                <Link 
                  key={item.id} 
                  to={`/products/${item.id}`}
                  className="flash-sale-card"
                >
                  <div className="card-badge-container">
                    <div className="flash-sale-badge">
                      -{discountPercent}%
                    </div>
                    {index < 3 && <div className="hot-badge">HOT</div>}
                  </div>
                  
                  <div className="card-image-wrapper">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      onError={handleImageError}
                      loading="lazy"
                      className="product-image"
                    />
                  </div>
                  
                  <div className="card-content">
                    <h3 className="product-title">{item.title}</h3>
                    <div className="brand-name">{item.brand || "Brand"}</div>
                    
                    <div className="price-section">
                      <div className="current-price">
                        Rp {item.price?.toLocaleString("id-ID") || '0'}
                      </div>
                      <div className="original-price">
                        Rp {originalPrice.toLocaleString("id-ID")}
                      </div>
                      <div className="discount-percent">
                        -{discountPercent}%
                      </div>
                    </div>

                    <div className="progress-section">
                      <div className="progress-info">
                        <span className="sold-text">
                          {locale === "id" ? "Terjual" : "Sold"}: {soldPercentage}%
                        </span>
                        <span className="stock-text">
                          {locale === "id" ? "Tersisa" : "Left"}: {stockLeft}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${soldPercentage}%`}}
                        ></div>
                      </div>
                    </div>

                    <button className="action-button">
                      {locale === "id" ? "Beli Sekarang" : "Buy Now"}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
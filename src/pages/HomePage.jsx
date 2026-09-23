import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import CategorySection from "../components/CategorySection";
import NewProductCarousel from "../components/NewProductCarousel";
import FlashSaleCarousel from "../components/FlashSaleCarousel";
import FooterSection from "../components/FooterSection";
import ProductCard from "../components/ProductCard";
import { Shield, PackageCheck, Truck, Tag, X, Filter, Sparkles } from "lucide-react";
import { getProducts } from "../utils/api";
import { useLocale } from "../contexts/LocaleContext";
import { useSearch } from "../contexts/SearchContext";
import "../styles/style.css";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistUpdate, setWishlistUpdate] = useState(0);
  const { locale } = useLocale();
  const { searchKeyword, selectedCategory, clearFilters } = useSearch();

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await getProducts();
        if (!res.error) {
          setProducts(res.data || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [wishlistUpdate]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search keyword
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(keyword) ||
        (product.brand && product.brand.toLowerCase().includes(keyword)) ||
        (product.category && product.category.toLowerCase().includes(keyword)) ||
        (product.description && product.description.toLowerCase().includes(keyword))
      );
    }

    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    return filtered;
  }, [products, searchKeyword, selectedCategory]);

  const handleWishlistUpdate = () => {
    setWishlistUpdate(prev => prev + 1);
  };

  const features = [
    { icon: <Shield size={28} />, label: locale === "id" ? "Transaksi Aman" : "Secure Transaction" },
    { icon: <PackageCheck size={28} />, label: locale === "id" ? "Garansi Resmi" : "Official Warranty" },
    { icon: <Truck size={28} />, label: locale === "id" ? "Pengiriman Cepat" : "Fast Shipping" },
    { icon: <Tag size={28} />, label: locale === "id" ? "Promo Menarik" : "Great Deals" },
  ];

  const brands = [
    { name: "Apple", image: "/produk/Apple.jpg" },
    { name: "Samsung", image: "/produk/Samsung.png" },
    { name: "Xiaomi", image: "/produk/Xiaomi.png" },
    { name: "Realme", image: "/produk/Realme.png" },
    { name: "Vivo", image: "/produk/Vivo.jpg" },
    { name: "Huawei", image: "/produk/Huawei.png" },
    { name: "Oppo", image: "/produk/Oppo.png" },
    { name: "Infinix", image: "/produk/Infinix.png" },
  ];

  const promoImages = ["/promo/1.jpg", "/promo/2.jpg", "/promo/3.jpg", "/promo/4.jpg"];

  // Data untuk komponen khusus
  const flashSaleItems = products.slice(0, 7);
  const newProducts = products.slice(7, 12);
  const bestSellers = products.slice(0, 8);
  const latestProducts = products.slice(4, 12);

  if (loading) return <div className="loading">{locale === "id" ? "Memuat produk..." : "Loading products..."}</div>;

  return (
    <main className="main-container">
      {/* Search Results Header */}
      {(searchKeyword || selectedCategory) && (
        <div className="search-results-header">
          <div className="search-results-info">
            <h2>
              <Filter size={24} />
              {locale === "id" ? "Hasil Pencarian" : "Search Results"} 
              <span className="results-count"> ({filteredProducts.length} {locale === "id" ? "produk ditemukan" : "products found"})</span>
            </h2>
            {(searchKeyword || selectedCategory) && (
              <div className="active-search-filters">
                {searchKeyword && (
                  <span className="search-keyword">
                    {locale === "id" ? "Kata kunci:" : "Keyword:"} "{searchKeyword}"
                  </span>
                )}
                {selectedCategory && (
                  <span className="search-category">
                    {locale === "id" ? "Kategori:" : "Category:"} {selectedCategory}
                  </span>
                )}
                <button 
                  onClick={clearFilters}
                  className="clear-search-btn"
                >
                  <X size={16} />
                  {locale === "id" ? "Hapus Filter" : "Clear Filters"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tampilkan hasil pencarian jika ada */}
      {(searchKeyword || selectedCategory) ? (
        <section className="section-box">
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <div className="no-results-content">
                <Filter size={48} className="no-results-icon" />
                <h3>{locale === "id" ? "Tidak ada hasil ditemukan" : "No results found"}</h3>
                <p>
                  {locale === "id" 
                    ? `Maaf, tidak ada produk yang sesuai dengan "${searchKeyword}"${selectedCategory ? ` dalam kategori "${selectedCategory}"` : ''}. Coba kata kunci lain atau lihat semua produk.`
                    : `Sorry, no products match "${searchKeyword}"${selectedCategory ? ` in category "${selectedCategory}"` : ''}. Try different keywords or browse all products.`
                  }
                </p>
                <button 
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  {locale === "id" ? "Lihat Semua Produk" : "View All Products"}
                </button>
              </div>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  onWishlistUpdate={handleWishlistUpdate}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Konten normal hanya ditampilkan jika tidak ada pencarian */
        <>
          {/* New Products Carousel */}
          <section className="section-box">
            <NewProductCarousel items={newProducts} />
          </section>

          {/* Features Section */}
          <section className="feature-section">
            {features.map((f, i) => (
              <div key={i} className="feature-item">
                <div className="feature-icon">{f.icon}</div>
                <p>{f.label}</p>
              </div>
            ))}
          </section>

          {/* Categories */}
          <section className="section-box">
            <CategorySection />
          </section>

          {/* Flash Sale */}
          <section className="flash-sale-section-wrapper">
            <FlashSaleCarousel items={flashSaleItems} />
          </section>
          {/* Brand Selection */}
          <section className="section-box">
            <h2 className="section-title">
              <Sparkles size={24} />
              {locale === "id" ? "Brand Pilihan" : "Featured Brands"}
            </h2>
            <div className="brand-grid">
              {brands.map((b, i) => (
                <div
                  key={i}
                  className="brand-item"
                >
                  <img 
                    src={b.image} 
                    alt={b.name} 
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                      e.target.className = 'image-error';
                    }}
                  />
                  <span className="brand-name">{b.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Best Sellers */}
          <section className="section-box">
            <h2 className="section-title">🔥 {locale === "id" ? "Produk Terlaris" : "Best Sellers"}</h2>
            <div className="product-grid">
              {bestSellers.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  onWishlistUpdate={handleWishlistUpdate}
                />
              ))}
            </div>
          </section>

          {/* Promo Banner */}
          <section className="section-box">
            <h2 className="section-title">🎉 {locale === "id" ? "Nikmati Berbagai Promo" : "Enjoy Various Promos"}</h2>
            <div className="promo-grid">
              {promoImages.map((src, i) => (
                <img 
                  key={i} 
                  src={src} 
                  alt={`Promo ${i + 1}`} 
                  className="promo-banner" 
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                    e.target.className = 'image-error';
                  }} 
                />
              ))}
            </div>
          </section>

          {/* Latest Products */}
          <section className="section-box">
            <h2 className="section-title">🆕 {locale === "id" ? "Produk Terbaru" : "New Arrivals"}</h2>
            <div className="product-grid">
              {latestProducts.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  onWishlistUpdate={handleWishlistUpdate}
                />
              ))}
            </div>
          </section>
        </>
      )}

      <FooterSection />
    </main>
  );
}
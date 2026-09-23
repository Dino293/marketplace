import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById, getProducts, addToCart, addToWishlist, removeFromWishlist } from "../utils/api";
import FooterSection from "../components/FooterSection";
import ProductCard from "../components/ProductCard";
import { Heart, ShoppingCart } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { useLocale } from "../contexts/LocaleContext";
import "../styles/style.css";

export default function DetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [flashSaleItems, setFlashSaleItems] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [wishlistUpdate, setWishlistUpdate] = useState(0);
  const { showToast } = useToast();
  const { locale } = useLocale();

  const fallbackImage = "https://via.placeholder.com/400x400/007bff/ffffff?text=Product+Image";

  const handleImageError = (e) => {
    if (e.target.src !== fallbackImage) {
      e.target.src = fallbackImage;
    }
  };

  useEffect(() => {
    async function loadAllData() {
      try {
        // Load product details
        const productRes = await getProductById(id);
        if (!productRes.error && productRes.data) {
          setProduct(productRes.data);
          setMainImage(productRes.data.image || fallbackImage);
        } else {
          setProduct(null);
        }

        // Load all products for recommendations
        const productsRes = await getProducts();
        if (!productsRes.error) {
          const allProducts = productsRes.data;
          const currentProduct = allProducts.find(p => p.id === id);
          
          // Related products (same category)
          const related = allProducts
            .filter(p => p.category === currentProduct?.category && p.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
          
          // Best sellers
          setBestSellers(allProducts.slice(0, 4));
          
          // Flash sale items
          setFlashSaleItems(allProducts.slice(1, 5));
          
          // New arrivals
          const newProducts = [...allProducts]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4);
          setNewArrivals(newProducts);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, [id, wishlistUpdate]);

  const toggleWishlist = async () => {
    if (!product) return;
    
    try {
      if (product.inWishlist) {
        await removeFromWishlist(product.id);
        showToast(
          locale === "id" ? "Produk dihapus dari wishlist" : "Product removed from wishlist", 
          "success"
        );
      } else {
        await addToWishlist(product.id);
        showToast(
          locale === "id" ? "Produk ditambahkan ke wishlist" : "Product added to wishlist", 
          "success"
        );
      }
      // Reload product data
      const productRes = await getProductById(id);
      if (!productRes.error && productRes.data) {
        setProduct(productRes.data);
      }
      setWishlistUpdate(prev => prev + 1);
    } catch (error) {
      showToast(
        locale === "id" ? "Gagal mengupdate wishlist" : "Failed to update wishlist", 
        "error"
      );
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    // Cek stok tersedia
    if (product.stock < quantity) {
      showToast(
        locale === "id" ? "Stok tidak mencukupi!" : "Insufficient stock!",
        "error"
      );
      return;
    }

    try {
      await addToCart(product.id);
      showToast(
        locale === "id" ? "Produk berhasil ditambahkan ke keranjang!" : "Product added to cart successfully!",
        "success"
      );
    } catch (error) {
      showToast(
        locale === "id" ? "Error menambahkan produk ke keranjang" : "Error adding product to cart",
        "error"
      );
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    // Cek stok tersedia
    if (product.stock < quantity) {
      showToast(
        locale === "id" ? "Stok tidak mencukupi!" : "Insufficient stock!",
        "error"
      );
      return;
    }

    // Konfirmasi pembelian
    const confirmMessage = locale === "id" 
      ? `Apakah Anda yakin ingin membeli ${product.title} sebanyak ${quantity} buah?\nTotal: Rp ${(product.price * quantity).toLocaleString("id-ID")}`
      : `Are you sure you want to buy ${product.title} (${quantity} items)?\nTotal: Rp ${(product.price * quantity).toLocaleString("id-ID")}`;

    if (window.confirm(confirmMessage)) {
      try {
        // Simulasikan proses pembelian
        await addToCart(product.id);
        
        // Kurangi stok produk
        const updatedProduct = {
          ...product,
          stock: product.stock - quantity
        };
        setProduct(updatedProduct);

        showToast(
          locale === "id" 
            ? `Pembelian berhasil! Stok tersisa: ${updatedProduct.stock}` 
            : `Purchase successful! Remaining stock: ${updatedProduct.stock}`,
          "success"
        );

        // Redirect ke halaman keranjang atau checkout (opsional)
        // window.location.href = '/cart';
        
      } catch (error) {
        showToast(
          locale === "id" ? "Error dalam proses pembelian" : "Error during purchase process",
          "error"
        );
      }
    }
  };

  const handleWishlistUpdate = () => {
    setWishlistUpdate(prev => prev + 1);
  };

  // Generate product images array
  const productImages = product ? [
    product.image || fallbackImage,
    fallbackImage,
    fallbackImage
  ] : [];

  if (loading) return <div className="loading">{locale === "id" ? "Memuat produk..." : "Loading product..."}</div>;
  if (!product) return <div className="error">{locale === "id" ? "Produk tidak ditemukan!" : "Product not found!"}</div>;

  return (
    <main className="detail-page">
      <p className="breadcrumb">
        {locale === "id" ? "Beranda" : "Home"} &gt; {product.category} &gt; {product.title}
      </p>

      <div className="detail-grid">
        {/* Images Section */}
        <div className="images-section">
          <img 
            src={mainImage} 
            alt={product.title} 
            className="main-image"
            onError={handleImageError}
          />
          <div className="thumbnail-list vertical-thumbnails">
            {productImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.title}-${i + 1}`}
                className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                onClick={() => setMainImage(img)}
                onError={handleImageError}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="info-section">
          <div className="product-header">
            <h1 className="product-title">{product.title}</h1>
            <button 
              className={`wishlist-btn-lg ${product.inWishlist ? 'in-wishlist' : ''}`}
              onClick={toggleWishlist}
              aria-label={product.inWishlist ? 
                (locale === "id" ? "Hapus dari wishlist" : "Remove from wishlist") : 
                (locale === "id" ? "Tambahkan ke wishlist" : "Add to wishlist")
              }
            >
              {product.inWishlist ? (
                <Heart size={24} fill="currentColor" />
              ) : (
                <Heart size={24} />
              )}
            </button>
          </div>

          <p className="brand">{locale === "id" ? "Merek" : "Brand"}: {product.brand}</p>
          <p className="price">Rp {product.price.toLocaleString("id-ID")}</p>
          <p className={`stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>
            {locale === "id" ? "Stok tersedia" : "Available stock"}: {product.stock}
          </p>

          {/* Product Features */}
          <div className="folder-section">
            <h3>{locale === "id" ? "Folder" : "Folder"}</h3>
            <div className="folder-tags">
              {["Gradbox", "Wave", "Hardware", "Windows Server", "Linux"].map((tag, i) => (
                <span key={i} className="folder-tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="feature-card">
            <h3>{locale === "id" ? "Brief Baru dengan Galaxy AI" : "New Brief with Galaxy AI"}</h3>
            <p>{locale === "id" ? "Ringkasan yang dipersonalisasi untuk hari Anda" : "Personalized briefings for your day"}</p>
          </div>

          <div className="performance-section">
            <h3>{locale === "id" ? "Kinerja Kuat" : "Powerful Performance"}</h3>
            <div className="spec-table">
              <div className="spec-row">
                <div className="spec-cell">
                  <strong>{locale === "id" ? "Kamera" : "Camera"}</strong>
                  <p>{locale === "id" ? "Pada bidang jarak asli" : "On the original distance plane"}</p>
                  <p>0/0/10</p>
                </div>
                <div className="spec-cell">
                  <strong>{locale === "id" ? "Prosesor" : "Processor"}</strong>
                  <p>18%</p>
                  <p>16%</p>
                  <p>11%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="battery-section">
            <h3>{locale === "id" ? "Baterai" : "Battery"}</h3>
            <div className="spec-table">
              <div className="spec-row">
                <div className="spec-cell">
                  <strong>{locale === "id" ? "Layar" : "Display"}</strong>
                  <p>4x20mTalk</p>
                  <p>4x20mTalk</p>
                </div>
                <div className="spec-cell">
                  <strong>{locale === "id" ? "Layar" : "Display"}</strong>
                  <p>24 mm</p>
                  <p>25 mm</p>
                </div>
              </div>
            </div>
          </div>

          <div className="quantity-section">
            <label>{locale === "id" ? "Jumlah" : "Quantity"}:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={e => {
                const value = Math.max(1, parseInt(e.target.value) || 1);
                setQuantity(Math.min(value, product.stock));
              }}
              disabled={product.stock === 0}
            />
            {product.stock > 0 && (
              <span className="quantity-note">
                {locale === "id" ? "Maksimal" : "Maximum"} {product.stock}
              </span>
            )}
          </div>

          <div className="action-buttons">
            <button 
              onClick={handleAddToCart} 
              className="btn-add-cart"
              disabled={product.stock === 0}
            >
              <ShoppingCart size={18} />
              {locale === "id" ? "Tambahkan ke Keranjang" : "Add to Cart"}
            </button>
            <button 
              onClick={handleBuyNow} 
              className="btn-buy-now"
              disabled={product.stock === 0}
            >
              {locale === "id" ? "Beli Sekarang" : "Buy Now"}
            </button>
          </div>

          {product.stock === 0 && (
            <div className="out-of-stock-message">
              <p>⚠️ {locale === "id" ? "Produk sedang habis" : "Product is out of stock"}</p>
            </div>
          )}

          <div className="external-product">
            <h3>{locale === "id" ? "Produk Eksternal" : "External Product"}</h3>
            <div className="external-links">
              <span>{locale === "id" ? "Promosikan Parameter" : "Promote Parameters"}</span>
              <span>{locale === "id" ? "Lisensi Khusus" : "Specifically License"}</span>
              <span>{locale === "id" ? "Jelaskan & Bantuan Izin" : "Describe & Help Permits"}</span>
            </div>
          </div>

          <div className="product-listings">
            <h3>{locale === "id" ? "Penggunaan Daftar Produk" : "Use of Product Listings"}</h3>
            <ul className="feature-list">
              {[
                "Powerful Battery / TAP",
                "Light Phone / Windows XP 2.0 SIDE", 
                "Accessing 1.5V VISA",
                "Open Time (IP) 15 Hz, 14-bit USB",
                "Hooker 50/100/400Hz, 12-bit WIFI"
              ].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="tabs-section">
        <div className="tab-headers">
          {[
            { id: 'description', label: locale === "id" ? 'Deskripsi Produk' : 'Product Description' },
            { id: 'promo', label: locale === "id" ? 'Promo & Penawaran' : 'Promo & Offers' },
            { id: 'specs', label: locale === "id" ? 'Spesifikasi Utama' : 'Main Specifications' },
            { id: 'design', label: locale === "id" ? 'Desain & Ketahanan' : 'Design & Durability' }
          ].map(tab => (
            <button 
              key={tab.id}
              className={`tab-header ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'description' && <p>{product.description}</p>}
          {activeTab === 'promo' && (
            <p>{locale === "id" ? "Lihat promo menarik untuk produk ini." : "See exciting promotions for this product."}</p>
          )}
          {activeTab === 'specs' && (
            <p>{locale === "id" ? "CPU, RAM, Kamera, Layar, dll." : "CPU, RAM, Camera, Display, etc."}</p>
          )}
          {activeTab === 'design' && (
            <p>{locale === "id" ? "Ramping, elegan, tahan gores dan debu." : "Slim, elegant, scratch and dust resistant."}</p>
          )}
        </div>
      </div>

      {/* Product Recommendations dengan ProductCard */}
      <div className="recommendations-section">
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="recommendation-category">
            <h2>🛍️ {locale === "id" ? "Produk Terkait" : "Related Products"}</h2>
            <div className="product-grid horizontal-scroll">
              {relatedProducts.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  onWishlistUpdate={handleWishlistUpdate}
                />
              ))}
            </div>
          </div>
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <div className="recommendation-category">
            <div className="section-header">
              <h2>🔥 {locale === "id" ? "Produk Terlaris" : "Best Sellers"}</h2>
              <div className="best-seller-badge">
                {locale === "id" ? "TERLARIS" : "BEST SELLER"}
              </div>
            </div>
            <div className="product-grid horizontal-scroll">
              {bestSellers.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  onWishlistUpdate={handleWishlistUpdate}
                />
              ))}
            </div>
          </div>
        )}

        {/* Flash Sale */}
        {flashSaleItems.length > 0 && (
          <div className="recommendation-category flash-sale">
            <div className="section-header">
              <h2>⚡ {locale === "id" ? "Flash Sale" : "Flash Sale"}</h2>
              <div className="countdown-timer">
                {locale === "id" ? "Berakhir dalam" : "Ends in"}: 05:32:15
              </div>
            </div>
            <div className="product-grid horizontal-scroll">
              {flashSaleItems.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  showDiscount={true}
                  onWishlistUpdate={handleWishlistUpdate}
                />
              ))}
            </div>
          </div>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <div className="recommendation-category">
            <div className="section-header">
              <h2>🆕 {locale === "id" ? "Produk Terbaru" : "New Arrivals"}</h2>
              <div className="new-badge">
                {locale === "id" ? "BARU" : "NEW"}
              </div>
            </div>
            <div className="product-grid horizontal-scroll">
              {newArrivals.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  onWishlistUpdate={handleWishlistUpdate}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <FooterSection />
    </main>
  );
}
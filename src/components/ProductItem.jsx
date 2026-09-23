import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts, addToCart } from "../utils/api";
import FooterSection from "../components/FooterSection";
import "../styles/style.css";

export default function DetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    async function fetchProduct() {
      const res = await getProducts();
      if (!res.error) {
        const found = res.data.find(p => p.id === id);
        setProduct(found || null);
        if (found && found.image) setMainImage(found.image);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id);
    alert("Produk berhasil ditambahkan ke keranjang!");
  };

  if (loading) return <p>Memuat produk...</p>;
  if (!product) return <p>Produk tidak ditemukan!</p>;

  return (
    <main className="detail-page">
      {/* Breadcrumb */}
      <p className="breadcrumb">Home &gt; {product.title}</p>

      <div className="detail-grid">
        {/* Gambar produk */}
        <div className="images-section">
          <img src={mainImage} alt={product.title} className="main-image" />
          <div className="thumbnail-list vertical-thumbnails">
            {[product.image, product.image, product.image].map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.title}-${i}`}
                className="thumbnail"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Info produk */}
        <div className="info-section">
          <h1 className="product-title">Samsung Galaxy 7 Fd67</h1>
          <p className="price">Rp 28.499.000</p>
          
          {/* Folder Section */}
          <div className="folder-section">
            <h3>Folder</h3>
            <div className="folder-tags">
              <span className="folder-tag">Gradbox</span>
              <span className="folder-tag">Wave</span>
              <span className="folder-tag">Hardware</span>
              <span className="folder-tag">Windows Server</span>
              <span className="folder-tag">Linux</span>
            </div>
          </div>

          {/* Galaxy AI Feature */}
          <div className="feature-card">
            <h3>New Brief with Galaxy AI</h3>
            <p>Personalized briefings for your day</p>
          </div>

          {/* Powerful Performance */}
          <div className="performance-section">
            <h3>Powerful Performance</h3>
            <div className="spec-table">
              <div className="spec-row">
                <div className="spec-cell">
                  <strong>Camera</strong>
                  <p>On the original distance plane</p>
                  <p>0/0/10</p>
                </div>
                <div className="spec-cell">
                  <strong>Processor</strong>
                  <p>18%</p>
                  <p>16%</p>
                  <p>11%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Battery Section */}
          <div className="battery-section">
            <h3>Battery</h3>
            <div className="spec-table">
              <div className="spec-row">
                <div className="spec-cell">
                  <strong>Display</strong>
                  <p>4x20mTalk</p>
                  <p>4x20mTalk</p>
                </div>
                <div className="spec-cell">
                  <strong>Display</strong>
                  <p>24 mm</p>
                  <p>25 mm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Section */}
          <div className="quantity-section">
            <label>Jumlah:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleAddToCart} className="btn-add-cart">
              Tambahkan ke Keranjang
            </button>
            <button className="btn-buy-now">Beli Sekarang</button>
          </div>

          {/* External Product */}
          <div className="external-product">
            <h3>External Product</h3>
            <div className="external-links">
              <span>Promote Parameters</span>
              <span>Specifically License</span>
              <span>Describe & Help Permits</span>
            </div>
          </div>

          {/* Product Listings */}
          <div className="product-listings">
            <h3>Use of Product Listings</h3>
            <ul className="feature-list">
              <li>Powerful Battery / TAP</li>
              <li>Light Phone / Windows XP 2.0 SIDE</li>
              <li>Accessing 1.5V VISA</li>
              <li>Open Time (IP) 15 Hz, 14-bit USB</li>
              <li>Hooker 50/100/400Hz, 12-bit WIFI</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="tabs-section">
        <div className="tab-headers">
          <button 
            className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Deskripsi Produk
          </button>
          <button 
            className={`tab-header ${activeTab === 'promo' ? 'active' : ''}`}
            onClick={() => setActiveTab('promo')}
          >
            Promo & Penawaran
          </button>
          <button 
            className={`tab-header ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Spesifikasi Utama
          </button>
          <button 
            className={`tab-header ${activeTab === 'design' ? 'active' : ''}`}
            onClick={() => setActiveTab('design')}
          >
            Desain & Ketahanan
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div>
              <p>{product.description}</p>
            </div>
          )}
          {activeTab === 'promo' && (
            <div>
              <p>Lihat promo menarik untuk produk ini.</p>
            </div>
          )}
          {activeTab === 'specs' && (
            <div>
              <p>CPU, RAM, Kamera, Layar, dll.</p>
            </div>
          )}
          {activeTab === 'design' && (
            <div>
              <p>Ramping, elegan, tahan gores dan debu.</p>
            </div>
          )}
        </div>
      </div>

      {/* Produk Lainnya */}
      <div className="related-products">
        <h2>Produk Lainnya</h2>
        <div className="product-grid">
          {/* Bisa loop dari produk mock lainnya */}
          <p>Produk lain di sini...</p>
        </div>
      </div>

      <FooterSection />
    </main>
  );
}
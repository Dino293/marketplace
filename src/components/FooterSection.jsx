import React from "react";
import "../styles/style.css";

const FooterSection = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <h2 className="footer-title">Bantuan & Layanan</h2>
        <ul className="footer-links">
          <li>Customer Service Chat</li>
          <li>FAQ</li>
          <li>Status Pesanan</li>
          <li>Panduan Garansi</li>
        </ul>
      </div>

      <div className="footer-bottom">
        <div className="footer-left">
          <img src="/produk/logo.jpg" alt="OkeShop Logo" className="footer-logo" />
          <p className="footer-desc">
            Okeshop adalah jaringan ritel terkemuka di Indonesia yang menyediakan produk
            telekomunikasi berkualitas dengan layanan terbaik sejak 1996. Okeshop dikenal
            sebagai pilihan terpercaya bagi pelanggan.
          </p>
          <p className="footer-hours">Senin - Minggu 09.00 - 22.00</p>
        </div>

        <div className="footer-center">
          <div>
            <h4>Belanja</h4>
            <ul>
              <li>Ponsel & Tablet</li>
              <li>Audio & Wearable</li>
              <li>Komputer & Gaming</li>
              <li>Aksesoris</li>
            </ul>
          </div>

          <div>
            <h4>Informasi</h4>
            <ul>
              <li>Syarat & Ketentuan</li>
              <li>Kebijakan Privasi</li>
              <li>Metode Pembayaran</li>
            </ul>
          </div>

          <div>
            <h4>Sosial Media</h4>
            <ul>
              <li>@okeshop_official</li>
              <li>@okeshopofficial</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-copy">
        <p>© 2025 Okeshop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FooterSection;

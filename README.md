# PT. TRIO Distribusi - MarketPlace Gadget & Elektronik Resmi

Platform e-commerce marketplace modern berbasis **React 18**, **Tailwind CSS v4**, dan **Vite** untuk distribusi smartphone, tablet, perangkat audio, serta aksesori original bergaransi resmi di Indonesia.

---

## 🌟 Fitur Utama Aplikasi

### 1. Katalog & Eksplorasi Produk
- **Katalog Terlengkap (`/catalog`)**: Pencarian instan, filter kategori multi-tier, filter brand manufaktur resmi, dan filter stok ready.
- **Pengurutan Pintar (Smart Sorting)**: Urutkan produk berdasarkan *Terbaru*, *Harga Terendah*, *Harga Tertinggi*, atau *Rating Tertinggi*.
- **Detail Produk Komprehensif (`/products/:id`)**:
  - Galeri gambar interaktif.
  - Pemilihan varian (warna & kapasitas storage) dengan kalkulasi harga dinamis.
  - Indikator urgensi stok (*"Sisa X unit! Stok Terbatas"*).
  - Tab deskripsi, spesifikasi teknis lengkap, dan sistem ulasan pembeli terverifikasi.
  - Formulir ulasan interaktif dengan pilihan rating bintang (1-5).

### 2. Transaksi & Keranjang Belanja (`/cart`)
- **Keranjang Belanja Persistent**: Jumlah kuantitas barang tersimpan permanen di penyimpanan lokal (`localStorage`).
- **Sistem Kupon Promo & Voucher**:
  - `TRIOBARU` — Diskon 10% (s.d Rp 500.000) untuk pengguna baru.
  - `ONGKIRGRATIS` — Potongan ongkos kirim Rp 20.000.
  - `HEMAT50` — Potongan langsung Rp 50.000.
- **Multi-Kurir Logistik**: Simulasi pilihan kurir (SiCepat Best, JNE Reguler, GoSend Instant 3 jam).
- **Multi-Metode Pembayaran**: QRIS Dinamis terintegrasi, Virtual Account BCA, Mandiri VA.
- **Asuransi Pengiriman**: Proteksi gratis dari PT. TRIO Distribusi.

### 3. Dashboard Profil & Riwayat Pesanan (`/profile`)
- **Manajemen Akun**: Ubah nama, email, nomor kontak WhatsApp, dan informasi pribadi.
- **Buku Alamat Pengiriman**: Simpan dan kelola banyak alamat (Rumah, Kantor) serta set alamat utama.
- **Pelacakan Status Pesanan Real-time**: Lacak milestone pesanan (*Pesanan Dibuat -> Dikemas -> Dalam Perjalanan -> Terkirim*).
- **Cetak Bukti Transaksi (Invoice)**: Modal invoice lengkap siap cetak (`Printable PDF`) dengan barcode, NPWP perusahaan, dan rincian pajak/diskon.

### 4. Wishlist & Favorit (`/wishlist`)
- Simpan produk incaran dalam satu klik.
- Fitur pindahkan seluruh barang wishlist ke keranjang belanja sekaligus (*"Beli Semua"*).

### 5. Multi-Bahasa & Aksesibilitas
- Toggle instan Bahasa Indonesia (`ID`) dan Bahasa Inggris (`EN`).
- *Bottom Navigation Bar* responsif untuk pengalaman pengguna mobile.
- Error boundary untuk penanganan galat aman.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan `@tailwindcss/postcss`
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Storage**: React Context API (`Auth`, `Cart`, `Wishlist`, `Search`, `Locale`, `Toast`) + Isolated Persistent Storage

---

## 🚀 Panduan Menjalankan Proyek

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

### 3. Membangun Bundle Produksi (Build)
```bash
npm run build
```

---

## 🔐 Akun Demo Siap Pakai

- **Email**: `demo@example.com` atau `budi.santoso@triodistribusi.co.id`
- **Password**: `password123`
- **Role**: `VIP Member`

---

© 2025 PT. TRIO Distribusi Indonesia. All rights reserved.

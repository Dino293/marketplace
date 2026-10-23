# 🛒 PT. TRIO Distribusi - Enterprise E-Commerce & Marketplace Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-4.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-CloudAMQP-FF6600?logo=rabbitmq&logoColor=white)](https://www.cloudamqp.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Platform *enterprise marketplace & e-commerce* resmi untuk distribusi gadget, smartphone flagship, audio, dan aksesori original bergaransi di Indonesia. Dibangun dengan fokus pada performa tinggi, keamanan berlapis (2FA Authentication), arsitektur *event-driven* menggunakan **CloudAMQP RabbitMQ**, dan basis data cloud **Supabase PostgreSQL**.

---

## 👨‍💻 Developer & Portfolio Profile

Proyek ini dirancang, dikembangkan, dan dioptimalkan secara komprehensif oleh:

- **Nama**: Muhammad Indra
- **LinkedIn**: [linkedin.com/in/muhammad-indra-92198a36b](https://www.linkedin.com/in/muhammad-indra-92198a36b/)
- **GitHub**: [@Dino293](https://github.com/Dino293) | [Repository Marketplace](https://github.com/Dino293/marketplace)
- **Email**: [muhindra293@gmail.com](mailto:muhindra293@gmail.com)
- **WhatsApp / Kontak**: [+62 897-1419-924](https://wa.me/628971419924)
- **Peran**: Full Stack Web Developer & Software Engineer

---

## 🏗️ Arsitektur Sistem & Alur Event-Driven

```
+---------------------------------------------------------------------------------+
|                                 CLIENT TIER                                     |
|               React 18 SPA + Vite + Tailwind CSS v4 (Full Responsive)           |
+---------------------------------------------------------------------------------+
          |                                      |                          |
          v                                      v                          v
+--------------------+                 +--------------------+     +-------------------+
|  Supabase Client   |                 | Vercel Serverless  |     |  In-App Realtime  |
|  (PostgreSQL RLS)  |                 | Functions (Proxy)  |     | Notification Bell |
+--------------------+                 +--------------------+     +-------------------+
          |                                      |                          |
          v                                      v                          |
+--------------------+                 +--------------------+               |
| Cloud PostgreSQL   |                 | CloudAMQP RabbitMQ |               |
| - profiles         |                 | - Cluster (AWS ap) |               |
| - products         |                 | - trio_order_queue |<--------------+
| - orders           |                 | - Exchange default | (Live Peek & Monitor)
| - notifications    |                 +--------------------+
+--------------------+
```

---

## ✨ Fitur-Fitur Utama

### 1. ⚡ Keranjang Belanja Pintar & Seleksi Fleksibel
- **Batas Kuantitas Aman (Ngestack di 1)**: Ketika menekan tombol kurang (`-`) pada nominal batas 1, kuantitas tetap bertahan di angka 1 (tidak terhapus sengaja). Barang hanya dapat dihapus melalui ikon tong sampah/hapus.
- **Checkbox Seleksi Pembelian**: Pembeli dapat mencentang barang mana saja yang ingin di-*checkout* saat ini, dengan kalkulasi subtotal dan diskon yang menyesuaikan secara dinamis.

### 2. 🔐 Autentikasi Ganda (2FA) & Multi-Role Demo
- **Sistem Role Ganda**:
  - 👤 **Akun Pembeli Demo**: `pembeli@trio.com` / `password123`
  - 🏪 **Akun Penjual Mitra Demo**: `penjual@trio.com` / `password123` (dilengkapi dashboard seller & toko resmi).
- **Two-Factor Authentication (2FA)**:
  - Dukungan integrasi kode OTP berbasis TOTP 6-digit (kompatibel dengan Google Authenticator / Microsoft Authenticator).
  - Dilengkapi fitur *Simulator Generator Token & Copy Token Instant* untuk mempermudah demonstrasi dan *review* proyek.

### 3. 📦 Tambah Produk (Sell Portal) dengan Dual Image Source
- Penjual dapat mengunggah gambar produk langsung dari file penyimpanan lokal (`Upload Local File`) atau memasukkan tautan gambar web eksternal (`Image Web URL`).
- Fitur live preview gambar interaktif sebelum produk disimpan ke katalog.

### 4. 🤖 AI Chatbot Assistant Pintar
- Asisten virtual interaktif untuk konsultasi spesifikasi gadget, rekomendasi smartphone terbaik, pengecekan garansi resmi, promo diskon, dan pelacakan status pesanan.
- Mendukung respons cerdas berbasis kata kunci produk dan aksi cepat (*quick suggestions*).

### 5. 🐇 Integrasi CloudAMQP RabbitMQ (Event Message Broker)
- **Cluster**: Hosted on AWS ap-southeast-1 (`armadillo.rmq.cloudamqp.com`).
- **Antrean (`trio_order_queue`)**: Setiap kali pembeli melakukan checkout pesanan, payload event pesanan dipublikasikan secara asinkron ke antrean RabbitMQ.
- **Vercel Serverless Function Proxy (`/api/rabbitmq`)**: Memastikan komunikasi aman dan bebas kendala CORS antara browser dengan cluster RabbitMQ.
- **Live Monitor di Navbar**: Ikon lonceng notifikasi dilengkapi tab inspektor RabbitMQ yang menampilkan status koneksi live, total pesan antrean, dan tombol uji kirim pesan (*Test Publish*).

### 6. 🗄️ Basis Data Cloud Supabase PostgreSQL
- Dilengkapi skrip skema komprehensif (`supabase/schema.sql`) mencakup tabel `profiles`, `products`, `orders`, dan `notifications`.
- Dilindungi dengan **Row Level Security (RLS)** dan kebijakan *granular access*.
- Mendukung *graceful fallback* ke penyimpanan lokal persisten jika koneksi internet atau environment key offline.

### 7. 📱 Responsivitas Sempurna di Semua Perangkat
- Tata letak teroptimasi untuk layar **Mobile (360px - 480px)**, **Tablet (768px - 1024px)**, hingga **Desktop Ultra-wide**.
- Bottom Navigation Bar khusus perangkat mobile dan slide drawer filter yang halus.

---

## 🛠️ Tech Stack & Dependensi

| Layer | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) | Library UI berbasis komponen reaktif |
| **Build Tool** | [Vite 4.x](https://vitejs.dev/) | Bundler modern berkecepatan tinggi |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utilitas CSS modern dan responsif |
| **Database** | [Supabase PostgreSQL](https://supabase.com/) | Cloud relational database dengan RESTful API & RLS |
| **Message Broker** | [CloudAMQP RabbitMQ](https://www.cloudamqp.com/) | Message broker untuk arsitektur event-driven |
| **Serverless Backend** | [Vercel Serverless Functions](https://vercel.com/docs/functions) | Proxy endpoint serverless dengan dukungan CORS |
| **Icons** | [Lucide React](https://lucide.dev/) | Paket ikon vektor modern |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) | Navigasi SPA multi-halaman |

---

## 🚀 Panduan Menjalankan Proyek Secara Lokal

### 1. Clone Repositori
```bash
git clone https://github.com/Dino293/marketplace.git
cd marketplace
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env` lalu sesuaikan isinya:
```env
VITE_SUPABASE_URL=https://uovedtkvvgtyxkuaekzx.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_RABBITMQ_HOST=armadillo.rmq.cloudamqp.com
VITE_RABBITMQ_VHOST=daksbgyw
VITE_RABBITMQ_USER=daksbgyw
VITE_RABBITMQ_PASS=your_rabbitmq_password_here
```

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban di [http://localhost:5173](http://localhost:5173).

### 5. Build Produksi
```bash
npm run build
```

---

## 🔑 Kredensial Akun Uji Coba (Demo Credentials)

| Role Akun | Email | Password | Fitur Utama |
| :--- | :--- | :--- | :--- |
| **Pembeli (Buyer)** | `pembeli@trio.com` | `password123` | Keranjang, Wishlist, Checkout, 2FA OTP, Riwayat Pesanan |
| **Penjual (Seller)** | `penjual@trio.com` | `password123` | Portal Tambah Barang, Kelola Stok, Profil Toko Resmi |

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah lisensi **MIT**. Bebas digunakan sebagai materi referensi, pembelajaran, dan portofolio profesional.

---
© 2026 **Muhammad Indra** — Dikembangkan untuk Portofolio Profesional PT. TRIO Distribusi Marketplace.

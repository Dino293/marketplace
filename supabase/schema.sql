-- ==============================================================================
-- PT. TRIO DISTRIBUSI - DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Project Reference: uovedtkvvgtyxkuaekzx
-- How to apply:
-- 1. Buka https://supabase.com/dashboard/project/uovedtkvvgtyxkuaekzx/sql/new
-- 2. Salin seluruh isi SQL ini ke editor tersebut
-- 3. Klik tombol "RUN" (hijau) di pojok kanan bawah editor
-- ==============================================================================

-- 1. PROFILES TABLE (Pengguna / Akun Pembeli & Penjual)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'buyer', -- 'buyer' | 'seller'
  store_name TEXT,
  two_factor_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PRODUCTS TABLE (Katalog Gadget & Aksesori Resmi)
CREATE TABLE IF NOT EXISTS public.products (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  price BIGINT NOT NULL,
  original_price BIGINT,
  stock INT NOT NULL DEFAULT 10,
  image TEXT NOT NULL,
  description TEXT,
  rating NUMERIC(2, 1) DEFAULT 4.9,
  reviews_count INT DEFAULT 40,
  specs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ORDERS TABLE (Transaksi & Pengiriman)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  total_price BIGINT NOT NULL,
  shipping_fee BIGINT DEFAULT 0,
  discount_amount BIGINT DEFAULT 0,
  courier TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Diproses',
  tracking_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. NOTIFICATIONS TABLE (Notifikasi Transaksi Realtime)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'order',
  channel TEXT DEFAULT 'rabbitmq',
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Membuka akses baca dan tulis agar aplikasi front-end web dapat beroperasi lancar
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow Public / Anon Select
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update products" ON public.products FOR UPDATE USING (true);

CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA (DATA AWAL PRODUK RESMI PT. TRIO DISTRIBUSI)
-- ==============================================================================
INSERT INTO public.profiles (email, name, phone, role, store_name) VALUES
('pembeli@trio.com', 'Budi Santoso (Pembeli Demo)', '0812-3456-7890', 'buyer', NULL),
('penjual@trio.com', 'Hendrawan Mitra (Penjual Demo)', '0897-1419-924', 'seller', 'TRIO Official Gadget Store')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.products (title, brand, category, price, original_price, stock, image, description, rating, reviews_count, specs) VALUES
(
  'Samsung Galaxy S25 Ultra 5G', 'Samsung', 'smartphone', 21999000, 23999000, 12, '/terlaris/1.jpg',
  'Smartphone flagship terdepan dengan Galaxy AI cerdas terintegrasi, quad kamera 200MP, bodi titanium grade 5, dan S-Pen bawaan responsif.',
  4.9, 128,
  '{"layar": "6.8 inch Dynamic AMOLED 2X 120Hz", "chipset": "Snapdragon 8 Gen 3 for Galaxy", "ram": "12GB / 16GB", "storage": "256GB / 512GB", "baterai": "5000 mAh (Fast Charge 45W)"}'::jsonb
),
(
  'Xiaomi 14 Pro Leica Optic', 'Xiaomi', 'smartphone', 12999000, 13999000, 8, '/terlaris/2.jpg',
  'Smartphone fotografi profesional berkolaborasi dengan Leica Summilux lens, didukung Snapdragon 8 Gen 3 dan pengisian ultra cepat 120W.',
  4.8, 85,
  '{"layar": "6.73 inch LTPO AMOLED 120Hz", "chipset": "Snapdragon 8 Gen 3", "ram": "12GB LPDDR5X", "storage": "256GB / 512GB", "baterai": "4880 mAh (HyperCharge 120W)"}'::jsonb
),
(
  'iPhone 16 Pro Max 256GB', 'Apple', 'smartphone', 24999000, 26499000, 4, '/terlaris/3.jpg',
  'Generasi iPhone tercanggih berbalut titanium ringan, chip Apple A18 Pro generasi terbaru, sistem Camera Control sentuh kapasitif.',
  4.9, 210,
  '{"layar": "6.9 inch Super Retina XDR OLED 120Hz", "chipset": "Apple A18 Pro (3nm)", "ram": "8GB Unified Memory", "storage": "256GB / 512GB", "baterai": "Ketahanan video hingga 33 jam"}'::jsonb
),
(
  'Samsung Galaxy Z Fold 6', 'Samsung', 'smartphone', 26499000, 28499000, 6, '/terlaris/4.jpg',
  'Ponsel lipat masa depan dengan layar Dynamic AMOLED 2X lipat fleksibel, engsel Dual-Rail kokoh, dan optimalisasi multitasking layar lebar.',
  4.7, 64,
  '{"layar": "7.6 inch Utama & 6.3 inch Cover 120Hz", "chipset": "Snapdragon 8 Gen 3 for Galaxy", "ram": "12GB", "storage": "256GB / 512GB", "baterai": "4400 mAh"}'::jsonb
),
(
  'iPhone 15 Plus 128GB', 'Apple', 'smartphone', 15499000, 16999000, 15, '/terlaris/5.jpg',
  'iPhone dengan layar besar Super Retina XDR 6.7 inci, Dynamic Island interaktif, kamera utama 48MP beresolusi super tinggi.',
  4.8, 142,
  '{"layar": "6.7 inch Super Retina XDR OLED", "chipset": "Apple A16 Bionic", "ram": "6GB", "storage": "128GB / 256GB", "baterai": "Hingga 26 jam pemutaran video"}'::jsonb
),
(
  'Sony WH-1000XM5 Noise Cancelling', 'Sony', 'audio', 4799000, 5999000, 10, '/gulir/gambar 1.jpg',
  'Headphone wireless premium dengan peredam bising aktif terdepan di industri, driver 30mm berkarbon serat, dan audio Hi-Res LDAC.',
  4.9, 96,
  '{"tipe": "Over-Ear Wireless", "anc": "Industry Leading Noise Cancellation", "baterai": "30 Jam Playtime", "konektivitas": "Bluetooth 5.2 / 3.5mm"}'::jsonb
),
(
  'Apple Watch Series 10 Titanium', 'Apple', 'smartwatch', 9499000, 10299000, 7, '/gulir/gambar 2.jpg',
  'Smartwatch generasi terbaru dengan layar terluas dan bodi tertipis dari Apple, sensor elektrokardiogram ECG, dan pengisian daya kilat.',
  4.8, 54,
  '{"layar": "Always-On Retina OLED", "material": "Titanium Grade Dirgantara", "sensor": "ECG, SpO2, Suhu Tubuh", "ketahanan": "Water Resistant 50m"}'::jsonb
),
(
  'JBL Boombox 3 Wi-Fi Portable Speaker', 'JBL', 'audio', 7299000, 7999000, 5, '/gulir/gambar 3.jpg',
  'Speaker outdoor berkekuatan dahsyat dengan suara JBL Original Pro Sound, subwoofer bertenaga, dan ketahanan air/debu IP67.',
  4.7, 38,
  '{"daya": "180W RMS (AC mode)", "baterai": "24 Jam Playtime", "fitur": "Powerbank Terintegrasi, Wi-Fi Dolby Atmos", "sertifikasi": "IP67 Tahan Air & Debu"}'::jsonb
)
ON CONFLICT DO NOTHING;

-- Initial Order Seed
INSERT INTO public.orders (id, customer_name, customer_email, customer_phone, shipping_address, items, total_price, courier, payment_method, status, tracking_number) VALUES
(
  'INV-TRIO-784210',
  'Budi Santoso',
  'pembeli@trio.com',
  '0812-3456-7890',
  '{"name": "Budi Santoso", "phone": "0812-3456-7890", "street": "Gedung TRIO Plaza Lantai 5, Jl. Jend. Sudirman Kav. 21", "city": "Jakarta Selatan, DKI Jakarta 12920"}'::jsonb,
  '[{"id": "1", "title": "Samsung Galaxy S25 Ultra 5G", "price": 21999000, "quantity": 1, "image": "/terlaris/1.jpg"}]'::jsonb,
  21499000,
  'SiCepat Best (1-2 Hari)',
  'QRIS BCA',
  'Dalam Perjalanan',
  'SCP-TRIO-98231294'
)
ON CONFLICT (id) DO NOTHING;

// src/utils/api.js - Persistent Multi-Entity Data Layer for PT. TRIO Distribusi MarketPlace

const initialProducts = [
  {
    id: '1',
    title: 'Samsung Galaxy S25 Ultra 5G',
    description: 'Smartphone flagship terdepan dengan Galaxy AI cerdas terintegrasi, quad kamera 200MP, bodi titanium grade 5, dan S-Pen bawaan responsif untuk produktivitas maksimal.',
    price: 21999000,
    originalPrice: 23999000,
    createdAt: '2024-01-15T10:30:00.000Z',
    category: 'smartphone',
    brand: 'Samsung',
    image: '/terlaris/1.jpg',
    stock: 12,
    rating: 4.9,
    reviewsCount: 128,
    specs: {
      layar: '6.8 inch Dynamic AMOLED 2X 120Hz',
      chipset: 'Snapdragon 8 Gen 3 for Galaxy',
      ram: '12GB / 16GB LPDDR5X',
      storage: '256GB / 512GB / 1TB',
      baterai: '5000 mAh (Fast Charge 45W)'
    }
  },
  {
    id: '2',
    title: 'Xiaomi 14 Pro Leica Optic',
    description: 'Smartphone fotografi profesional berkolaborasi dengan Leica Summilux lens, didukung Snapdragon 8 Gen 3 dan pengisian ultra cepat 120W HyperCharge.',
    price: 12999000,
    originalPrice: 13999000,
    createdAt: '2024-01-14T14:20:00.000Z',
    category: 'smartphone',
    brand: 'Xiaomi',
    image: '/terlaris/2.jpg',
    stock: 8,
    rating: 4.8,
    reviewsCount: 85,
    specs: {
      layar: '6.73 inch LTPO AMOLED 120Hz',
      chipset: 'Snapdragon 8 Gen 3',
      ram: '12GB LPDDR5X',
      storage: '256GB / 512GB UFS 4.0',
      baterai: '4880 mAh (HyperCharge 120W)'
    }
  },
  {
    id: '3',
    title: 'iPhone 16 Pro Max 256GB',
    description: 'Generasi iPhone tercanggih berbalut titanium ringan, chip Apple A18 Pro generasi terbaru, sistem Camera Control sentuh kapasitif, dan perekaman 4K 120fps Dolby Vision.',
    price: 24999000,
    originalPrice: 26499000,
    createdAt: '2024-01-13T09:15:00.000Z',
    category: 'smartphone',
    brand: 'Apple',
    image: '/terlaris/3.jpg',
    stock: 4, // low stock warning
    rating: 4.9,
    reviewsCount: 210,
    specs: {
      layar: '6.9 inch Super Retina XDR OLED 120Hz',
      chipset: 'Apple A18 Pro (3nm)',
      ram: '8GB Unified Memory',
      storage: '256GB / 512GB / 1TB',
      baterai: 'Ketahanan video hingga 33 jam'
    }
  },
  {
    id: '4',
    title: 'Samsung Galaxy Z Fold 6',
    description: 'Ponsel lipat masa depan dengan layar Dynamic AMOLED 2X lipat fleksibel, engsel Dual-Rail kokoh, dan optimalisasi multitasking layar lebar sekelas tablet mini.',
    price: 26499000,
    originalPrice: 28499000,
    createdAt: '2024-01-12T16:45:00.000Z',
    category: 'smartphone',
    brand: 'Samsung',
    image: '/terlaris/4.jpg',
    stock: 6,
    rating: 4.7,
    reviewsCount: 64,
    specs: {
      layar: '7.6 inch Utama & 6.3 inch Cover Screen 120Hz',
      chipset: 'Snapdragon 8 Gen 3 for Galaxy',
      ram: '12GB',
      storage: '256GB / 512GB / 1TB',
      baterai: '4400 mAh'
    }
  },
  {
    id: '5',
    title: 'iPhone 15 Plus 128GB',
    description: 'iPhone dengan layar besar Super Retina XDR 6.7 inci, Dynamic Island interaktif, kamera utama 48MP beresolusi super tinggi, dan daya tahan baterai terpanjang.',
    price: 15499000,
    originalPrice: 16999000,
    createdAt: '2024-01-11T11:20:00.000Z',
    category: 'smartphone',
    brand: 'Apple',
    image: '/terlaris/5.jpg',
    stock: 15,
    rating: 4.8,
    reviewsCount: 142,
    specs: {
      layar: '6.7 inch Super Retina XDR OLED',
      chipset: 'Apple A16 Bionic',
      ram: '6GB',
      storage: '128GB / 256GB / 512GB',
      baterai: 'Ketahanan video hingga 26 jam'
    }
  },
  {
    id: '6',
    title: 'Samsung Galaxy A55 5G',
    description: 'Smartphone kelas menengah dengan bingkai logam premium, proteksi air dan debu IP67, kamera 50MP OIS jernih, dan layar Super AMOLED 120Hz.',
    price: 5999000,
    originalPrice: 6499000,
    createdAt: '2024-01-10T13:45:00.000Z',
    category: 'smartphone',
    brand: 'Samsung',
    image: '/terlaris/6.jpg',
    stock: 20,
    rating: 4.7,
    reviewsCount: 310,
    specs: {
      layar: '6.6 inch Super AMOLED 120Hz FHD+',
      chipset: 'Exynos 1480 (4nm)',
      ram: '8GB / 12GB',
      storage: '128GB / 256GB',
      baterai: '5000 mAh (25W)'
    }
  },
  {
    id: '7',
    title: 'Realme Buds Air 6 Pro',
    description: 'TWS audio nirkabel dengan arsitektur koaksial ganda, sertifikasi Hi-Res Audio nirkabel, peredam kebisingan aktif 50dB ANC, dan bass sangat bertenaga.',
    price: 1299000,
    originalPrice: 1499000,
    createdAt: '2024-01-09T08:30:00.000Z',
    category: 'audio',
    brand: 'Realme',
    image: '/gulir/gambar 1.jpg',
    stock: 25,
    rating: 4.8,
    reviewsCount: 95,
    specs: {
      driver: '11mm Bass Driver + 6mm Micro-planar Tweeter',
      anc: '50dB Active Noise Cancellation',
      latensi: '55ms Super Low Latency',
      baterai: 'Total 40 jam pemakaian'
    }
  },
  {
    id: '8',
    title: 'Vivo Watch GT Active',
    description: 'Smartwatch layar lengkung 2.5D AMOLED 1.85 inci, mendukung panggilan telepon Bluetooth, sensor detak jantung 24/7, SpO2, GPS presisi, dan baterai hingga 21 hari.',
    price: 1899000,
    originalPrice: 2199000,
    createdAt: '2024-01-08T12:15:00.000Z',
    category: 'accessories',
    brand: 'Vivo',
    image: '/gulir/gambar 2.jpg',
    stock: 14,
    rating: 4.6,
    reviewsCount: 47,
    specs: {
      layar: '1.85 inch AMOLED 390x450 piksel',
      konektivitas: 'Bluetooth 5.3 + eSIM (optional)',
      tahanAir: '2ATM / IP68',
      baterai: 'Daya tahan hingga 21 hari'
    }
  },
  {
    id: '9',
    title: 'Xiaomi Sound Outdoor 30W',
    description: 'Speaker nirkabel portabel tahan air dan debu dengan standar IP67, output suara bertenaga 30W, koneksi stereo ganda, dan baterai awet 12 jam nonstop.',
    price: 749000,
    originalPrice: 899000,
    createdAt: '2024-01-07T15:45:00.000Z',
    category: 'audio',
    brand: 'Xiaomi',
    image: '/gulir/gambar 3.jpg',
    stock: 18,
    rating: 4.7,
    reviewsCount: 78,
    specs: {
      daya: 'Output 30W Peak Power',
      waterproof: 'IP67 Dust & Water Resistant',
      bluetooth: 'Bluetooth 5.4 Low Latency',
      baterai: '2600 mAh (hingga 12 jam)'
    }
  },
  {
    id: '10',
    title: 'Samsung Galaxy Tab S9 FE',
    description: 'Tablet produktivitas dan kreativitas dengan layar 10.9 inci 90Hz jernih, tahan air dan debu IP68, serta sudah include pena digital S-Pen presisi di dalam kotak.',
    price: 6499000,
    originalPrice: 7199000,
    createdAt: '2024-01-06T10:20:00.000Z',
    category: 'tablet',
    brand: 'Samsung',
    image: '/gulir/gambar 4.jpg',
    stock: 9,
    rating: 4.8,
    reviewsCount: 112,
    specs: {
      layar: '10.9 inch WQXGA 90Hz',
      chipset: 'Exynos 1380 Octa-core',
      ram: '6GB / 8GB',
      storage: '128GB / 256GB MicroSD up to 1TB',
      baterai: '8000 mAh (45W fast charge)'
    }
  },
  {
    id: '11',
    title: 'Apple Magic Mouse Wireless',
    description: 'Mouse nirkabel dengan desain ergonomis minimalis dan permukaan Multi-Touch terpadu untuk gestur usap dan gulir halus di macOS dan iPadOS.',
    price: 1399000,
    originalPrice: 1599000,
    createdAt: '2024-01-05T14:30:00.000Z',
    category: 'accessories',
    brand: 'Apple',
    image: '/gulir/gambar 5.jpg',
    stock: 16,
    rating: 4.5,
    reviewsCount: 68,
    specs: {
      konektivitas: 'Bluetooth & Port USB-C',
      sensor: 'Laser Multi-Touch Trackpad Sensor',
      kompatibilitas: 'Mac dengan OS X 10.11 ke atas / iPadOS',
      berat: '99 gram'
    }
  }
];

const initialReviews = [
  {
    id: 'rev-1',
    productId: '1',
    userName: 'Andi Pratama',
    userRole: 'Verified Buyer',
    rating: 5,
    date: '2024-02-10',
    comment: 'Barang original resmi TRIO Distribusi, segel aman, garansi SEIN aktif. Performa kamera Galaxy S25 Ultra luar biasa jernih!',
  },
  {
    id: 'rev-2',
    productId: '1',
    userName: 'Rina Wijaya',
    userRole: 'Verified Buyer',
    rating: 5,
    date: '2024-02-14',
    comment: 'Pengiriman via SiCepat sangat aman pakai packing kayu. S-Pen bawaannya sangat responsif untuk kerja kantoran.',
  },
  {
    id: 'rev-3',
    productId: '3',
    userName: 'Bambang Sutrisno',
    userRole: 'Verified Buyer',
    rating: 5,
    date: '2024-02-20',
    comment: 'Titaniumnya terasa sangat premium dan ringan. Tombol Camera Control baru sangat memudahkan potret cepat.',
  }
];

const defaultUser = {
  id: 'usr-1',
  name: 'Budi Santoso',
  email: 'budi.santoso@triodistribusi.co.id',
  phone: '0812-3456-7890',
  role: 'VIP Member',
  addresses: [
    {
      id: 'addr-1',
      label: 'Kantor / Utama',
      name: 'Budi Santoso',
      phone: '0812-3456-7890',
      street: 'Gedung TRIO Plaza Lantai 5, Jl. Jend. Sudirman Kav. 21',
      city: 'Jakarta Selatan, DKI Jakarta 12920',
      isDefault: true
    },
    {
      id: 'addr-2',
      label: 'Rumah',
      name: 'Budi Santoso',
      phone: '0812-3456-7890',
      street: 'Komplek Permata Hijau Blok C No. 12',
      city: 'Jakarta Barat, DKI Jakarta 11560',
      isDefault: false
    }
  ]
};

// Available Promo Vouchers
export const VOUCHERS = [
  {
    code: 'TRIOBARU',
    discountPercent: 10,
    maxDiscount: 500000,
    minPurchase: 1000000,
    description: 'Diskon 10% s.d Rp 500.000 untuk pengguna baru'
  },
  {
    code: 'ONGKIRGRATIS',
    discountAmount: 20000,
    minPurchase: 500000,
    description: 'Potongan ongkos kirim Rp 20.000'
  },
  {
    code: 'HEMAT50',
    discountAmount: 50000,
    minPurchase: 500000,
    description: 'Potongan belanja langsung Rp 50.000'
  }
];

// Helper: Safely load from localStorage
function getStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to read ${key} from localStorage`, e);
  }
  return fallback;
}

// Helper: Safely save to localStorage
function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
}

// -----------------------------------------------------------------------------
// Products API
// -----------------------------------------------------------------------------
export async function getProducts({ category, brand, search, sortBy, minPrice, maxPrice } = {}) {
  await new Promise(r => setTimeout(r, 80));
  let list = getStorage('trio_products', initialProducts);

  // Filter Search
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Filter Category
  if (category && category !== 'all') {
    list = list.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  }

  // Filter Brand
  if (brand && brand !== 'all') {
    list = list.filter(p => p.brand?.toLowerCase() === brand.toLowerCase());
  }

  // Filter Price
  if (minPrice !== undefined && minPrice > 0) {
    list = list.filter(p => p.price >= minPrice);
  }
  if (maxPrice !== undefined && maxPrice > 0) {
    list = list.filter(p => p.price <= maxPrice);
  }

  // Sorting
  if (sortBy) {
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'latest':
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
  }

  return { error: false, data: list, total: list.length, message: 'Success' };
}

export async function getProductById(id) {
  await new Promise(r => setTimeout(r, 60));
  const list = getStorage('trio_products', initialProducts);
  const item = list.find(p => String(p.id) === String(id));
  return {
    error: !item,
    data: item || null,
    message: item ? 'Success' : 'Product not found'
  };
}

export async function addProduct({ title, description, price, originalPrice, category = 'smartphone', brand = 'Samsung', image, stock = 20, specs = {} }) {
  await new Promise(r => setTimeout(r, 120));
  const list = getStorage('trio_products', initialProducts);
  const numPrice = parseFloat(price) || 0;
  const newProduct = {
    id: `prod-${Date.now()}`,
    title,
    description,
    price: numPrice,
    originalPrice: parseFloat(originalPrice) || Math.round(numPrice * 1.1),
    category,
    brand,
    image: image || '/terlaris/1.jpg',
    stock: parseInt(stock, 10) || 10,
    rating: 5.0,
    reviewsCount: 0,
    specs: specs || {},
    createdAt: new Date().toISOString()
  };
  list.unshift(newProduct);
  setStorage('trio_products', list);
  return { error: false, data: newProduct, message: 'Product created successfully' };
}

export async function deleteProduct(id) {
  await new Promise(r => setTimeout(r, 80));
  let list = getStorage('trio_products', initialProducts);
  list = list.filter(p => String(p.id) !== String(id));
  setStorage('trio_products', list);
  return { error: false, data: null, message: 'Product deleted' };
}

// -----------------------------------------------------------------------------
// Cart API (Decoupled & Isolated with Quantities & Variants)
// -----------------------------------------------------------------------------
export async function getCart() {
  await new Promise(r => setTimeout(r, 50));
  const cart = getStorage('trio_cart', []);
  return { error: false, data: cart };
}

export async function addToCart(productId, variantDetails = null, quantity = 1) {
  await new Promise(r => setTimeout(r, 80));
  const productRes = await getProductById(productId);
  if (productRes.error || !productRes.data) {
    throw new Error('Product not found');
  }
  const product = productRes.data;
  const cart = getStorage('trio_cart', []);

  const variantKey = variantDetails 
    ? `${variantDetails.color || ''}-${variantDetails.storage || ''}` 
    : 'default';
  const cartItemId = `${productId}-${variantKey}`;

  const existingIndex = cart.findIndex(c => c.cartItemId === cartItemId);
  const itemPrice = variantDetails?.price || product.price;

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.unshift({
      cartItemId,
      productId: product.id,
      title: product.title,
      price: itemPrice,
      originalPrice: product.originalPrice,
      image: product.image,
      brand: product.brand,
      category: product.category,
      selectedVariant: variantDetails,
      quantity: Math.max(1, quantity),
      stock: product.stock
    });
  }

  setStorage('trio_cart', cart);
  return { error: false, data: cart, message: 'Added to cart' };
}

export async function updateCartQuantity(cartItemId, newQuantity) {
  await new Promise(r => setTimeout(r, 40));
  let cart = getStorage('trio_cart', []);
  if (newQuantity <= 0) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
  } else {
    cart = cart.map(item => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
  }
  setStorage('trio_cart', cart);
  return { error: false, data: cart };
}

export async function removeFromCart(cartItemId) {
  await new Promise(r => setTimeout(r, 40));
  let cart = getStorage('trio_cart', []);
  cart = cart.filter(item => item.cartItemId !== cartItemId && item.productId !== cartItemId);
  setStorage('trio_cart', cart);
  return { error: false, data: cart, message: 'Removed from cart' };
}

export async function clearCart() {
  setStorage('trio_cart', []);
  return { error: false, data: [] };
}

// -----------------------------------------------------------------------------
// Wishlist API (Independent List of Product IDs)
// -----------------------------------------------------------------------------
export async function getWishlistProducts() {
  await new Promise(r => setTimeout(r, 60));
  const wishlistIds = getStorage('trio_wishlist', ['1']);
  const allProducts = getStorage('trio_products', initialProducts);
  const wishlistItems = allProducts.filter(p => wishlistIds.includes(String(p.id)));
  return { error: false, data: wishlistItems };
}

export async function toggleWishlistApi(productId) {
  await new Promise(r => setTimeout(r, 50));
  const strId = String(productId);
  let wishlistIds = getStorage('trio_wishlist', ['1']);
  const exists = wishlistIds.includes(strId);
  if (exists) {
    wishlistIds = wishlistIds.filter(id => id !== strId);
  } else {
    wishlistIds.push(strId);
  }
  setStorage('trio_wishlist', wishlistIds);
  return { error: false, inWishlist: !exists };
}

// -----------------------------------------------------------------------------
// Voucher API
// -----------------------------------------------------------------------------
export function validateVoucher(code, subtotal) {
  if (!code) return { valid: false, message: 'Kode kupon kosong' };
  const cleanCode = code.trim().toUpperCase();
  const voucher = VOUCHERS.find(v => v.code === cleanCode);
  if (!voucher) {
    return { valid: false, message: 'Kode kupon tidak valid' };
  }
  if (voucher.minPurchase && subtotal < voucher.minPurchase) {
    return { 
      valid: false, 
      message: `Minimal belanja Rp ${voucher.minPurchase.toLocaleString('id-ID')} untuk menggunakan kupon ini` 
    };
  }

  let discount = 0;
  if (voucher.discountPercent) {
    discount = (subtotal * voucher.discountPercent) / 100;
    if (voucher.maxDiscount && discount > voucher.maxDiscount) {
      discount = voucher.maxDiscount;
    }
  } else if (voucher.discountAmount) {
    discount = voucher.discountAmount;
  }

  return {
    valid: true,
    code: voucher.code,
    discount,
    description: voucher.description
  };
}

// -----------------------------------------------------------------------------
// Order & Tracking API
// -----------------------------------------------------------------------------
export function getStoredOrders() {
  return getStorage('trio_orders', [
    {
      id: 'INV-TRIO-784210',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      items: [
        {
          id: '1',
          title: 'Samsung Galaxy S25 Ultra 5G',
          price: 21999000,
          quantity: 1,
          variant: 'Titanium Gray • 256GB',
          image: '/terlaris/1.jpg'
        }
      ],
      subtotal: 21999000,
      shippingFee: 0,
      discount: 500000,
      total: 21499000,
      courier: 'SiCepat Best (1-2 Hari)',
      trackingNumber: 'SCP-TRIO-98231294',
      status: 'Dalam Perjalanan',
      paymentMethod: 'QRIS BCA',
      address: {
        name: 'Budi Santoso',
        phone: '0812-3456-7890',
        street: 'Gedung TRIO Plaza Lantai 5, Jl. Jend. Sudirman Kav. 21',
        city: 'Jakarta Selatan, DKI Jakarta 12920'
      },
      timeline: [
        { time: '14:20, 20 Feb', status: 'Pesanan Dikonfirmasi', desc: 'Pembayaran telah diverifikasi secara otomatis' },
        { time: '16:00, 20 Feb', status: 'Barang Dikemas', desc: 'Pesanan telah dipacking dengan aman di gudang distributor' },
        { time: '09:15, 21 Feb', status: 'Dalam Perjalanan', desc: 'Kurir SiCepat sedang membawa pesanan menuju alamat tujuan' }
      ]
    }
  ]);
}

export async function checkout(orderDetails) {
  await new Promise(r => setTimeout(r, 200));
  const orders = getStoredOrders();
  const newOrder = {
    ...orderDetails,
    id: orderDetails.id || `INV-TRIO-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString(),
    status: 'Diproses',
    trackingNumber: `EXP-TRIO-${Math.floor(10000000 + Math.random() * 90000000)}`,
    timeline: [
      { time: 'Baru saja', status: 'Pesanan Diterima', desc: 'Pesanan telah masuk ke sistem distributor PT. TRIO Distribusi' },
      { time: 'Menunggu', status: 'Sedang Dikemas', desc: 'Tim gudang sedang memproses inventaris Anda' }
    ]
  };
  orders.unshift(newOrder);
  setStorage('trio_orders', orders);
  await clearCart();
  return { error: false, data: newOrder, message: 'Order created successfully' };
}

// -----------------------------------------------------------------------------
// Reviews API
// -----------------------------------------------------------------------------
export async function getProductReviews(productId) {
  await new Promise(r => setTimeout(r, 50));
  const reviews = getStorage('trio_reviews', initialReviews);
  const filtered = reviews.filter(r => String(r.productId) === String(productId));
  return { error: false, data: filtered };
}

export async function addProductReview(productId, { rating, comment, userName }) {
  await new Promise(r => setTimeout(r, 80));
  const reviews = getStorage('trio_reviews', initialReviews);
  const newRev = {
    id: `rev-${Date.now()}`,
    productId: String(productId),
    userName: userName || 'Pelanggan Setia',
    userRole: 'Verified Buyer',
    rating: parseInt(rating, 10) || 5,
    date: new Date().toISOString().split('T')[0],
    comment
  };
  reviews.unshift(newRev);
  setStorage('trio_reviews', reviews);
  return { error: false, data: newRev, message: 'Review added' };
}

// -----------------------------------------------------------------------------
// User & Auth API
// -----------------------------------------------------------------------------
export async function login({ email, password }) {
  await new Promise(r => setTimeout(r, 120));
  const users = getStorage('trio_registered_users', [defaultUser]);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  const token = `jwt-trio-${Date.now()}`;
  localStorage.setItem('accessToken', token);

  const activeUser = user || {
    ...defaultUser,
    email
  };
  setStorage('trio_active_user', activeUser);

  return {
    error: false,
    data: { accessToken: token, user: activeUser },
    message: 'Login successful'
  };
}

export async function register({ name, email, password, phone }) {
  await new Promise(r => setTimeout(r, 150));
  const users = getStorage('trio_registered_users', [defaultUser]);
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: true, message: 'Email sudah terdaftar. Silakan gunakan email lain.' };
  }
  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    phone: phone || '0812-0000-0000',
    role: 'Member',
    addresses: [
      {
        id: `addr-${Date.now()}`,
        label: 'Alamat Utama',
        name,
        phone: phone || '0812-0000-0000',
        street: 'Jl. Merdeka No. 10',
        city: 'DKI Jakarta 10110',
        isDefault: true
      }
    ]
  };
  users.push(newUser);
  setStorage('trio_registered_users', users);
  return { error: false, data: newUser, message: 'Pendaftaran berhasil' };
}

export async function getUserLogged() {
  await new Promise(r => setTimeout(r, 40));
  const user = getStorage('trio_active_user', defaultUser);
  return { error: false, data: user, message: 'Success' };
}

export async function updateUserProfile(updatedFields) {
  await new Promise(r => setTimeout(r, 60));
  let user = getStorage('trio_active_user', defaultUser);
  user = { ...user, ...updatedFields };
  setStorage('trio_active_user', user);

  // Update in registered users list as well
  const users = getStorage('trio_registered_users', [defaultUser]);
  const idx = users.findIndex(u => u.id === user.id);
  if (idx > -1) {
    users[idx] = user;
    setStorage('trio_registered_users', users);
  }
  return { error: false, data: user, message: 'Profil berhasil diperbarui' };
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('trio_active_user');
  return { error: false, message: 'Logout successful' };
}

export function putAccessToken(token) {
  localStorage.setItem('accessToken', token);
}

export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function removeAccessToken() {
  localStorage.removeItem('accessToken');
}

// Deprecated alias compatibility
export const addToWishlist = toggleWishlistApi;
export const removeFromWishlist = toggleWishlistApi;
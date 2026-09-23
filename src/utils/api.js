// Data mock terpusat untuk semua produk
let products = [
  {
    id: '1',
    title: 'Samsung Galaxy 7 Fd67',
    description: 'Smartphone flagship dengan Galaxy AI, kamera canggih, dan baterai tahan lama',
    price: 28499000,
    inWishlist: true,
    inCart: false,
    createdAt: '2024-01-15T10:30:00.000Z',
    category: 'smartphone',
    brand: 'Samsung',
    image: '/terlaris/1.jpg',
    stock: 50
  },
  {
    id: '2',
    title: 'Xiaomi MI 25',
    description: 'Smartphone dengan baterai tahan lama dan desain elegan',
    price: 799000,
    inWishlist: true,
    inCart: false,
    createdAt: '2024-01-14T14:20:00.000Z',
    category: 'smartphone',
    brand: 'Xiaomi',
    image: '/terlaris/2.jpg',
        stock: 50
  },
  {
    id: '3',
    title: 'Iphone 17',
    description: 'iPhone terbaru dengan teknologi terkini',
    price: 1199000,
    inWishlist: true,
    inCart: false,
    createdAt: '2024-01-13T09:15:00.000Z',
    category: 'smartphone',
    brand: 'Apple',
    image: '/terlaris/3.jpg',
    stock: 50
  },
  {
    id: '4',
    title: 'Samsung Galaxy 25 Ultra',
    description: 'Samsung Galaxy dengan layar super amoled dan kamera 200MP',
    price: 13999000,
    inWishlist: true,
    inCart: false,
    createdAt: '2024-01-12T16:45:00.000Z',
    category: 'smartphone',
    brand: 'Samsung',
    image: '/terlaris/4.jpg',
    stock: 50
  },
  {
    id: '5',
    title: 'Iphone 16',
    description: 'iPhone dengan desain klasik dan performa terbaik',
    price: 299000,
    inWishlist: true,
    inCart: false,
    createdAt: '2024-01-11T11:20:00.000Z',
    category: 'smartphone',
    brand: 'Apple',
    image: '/terlaris/5.jpg',
    stock: 50
  },
  {
    id: '6',
    title: 'Samsung Galaxy 25',
    description: 'Samsung Galaxy dengan harga terjangkau dan fitur lengkap',
    price: 299000,
    inWishlist: true,
    inCart: false,
    createdAt: '2024-01-10T13:45:00.000Z',
    category: 'smartphone',
    brand: 'Samsung',
    image: '/terlaris/6.jpg',
    stock: 50
  },
  {
    id: '7',
    title: 'Wireless Earbuds Z5',
    description: 'Wireless earbuds dengan suara jernih dan bass yang dalam',
    price: 329000,
    inWishlist: true,
    inCart: false,
    createdAt: '2024-01-09T08:30:00.000Z',
    category: 'audio',
    brand: 'Realme',
    image: '/gulir/gambar 1.jpg',
    stock: 50
  },
  {
    id: '8',
    title: 'Smartwatch Fit Mini',
    description: 'Smartwatch dengan fitur kesehatan dan olahraga',
    price: 699000,
    inWishlist: true,
    inCart: false,
    createdAt: '2024-01-08T12:15:00.000Z',
    category: 'accessories',
    brand: 'Vivo',
    image: '/gulir/gambar 2.jpg',
    stock: 50
  },
  {
    id: '9',
    title: 'Bluetooth Speaker S20',
    description: 'Bluetooth speaker dengan suara powerful dan baterai tahan lama',
    price: 499000,
    inWishlist: true,
    inCart: false,
    createdAt: '2024-01-07T15:45:00.000Z',
    category: 'audio',
    brand: 'Xiaomi',
    image: '/gulir/gambar 3.jpg',
    stock: 50
  },
  {
    id: '10',
    title: 'Tablet NoteTab 10',
    description: 'Tablet dengan layar besar dan stylus untuk produktivitas',
    price: 2899000,
    inWishlist: true,
    inCart: false,
    createdAt: '2024-01-06T10:20:00.000Z',
    category: 'tablet',
    brand: 'Samsung',
    image: '/gulir/gambar 4.jpg',
    stock: 50
  },
  {
    id: '11',
    title: 'Gaming Mouse Pro',
    description: 'Gaming mouse dengan sensor presisi dan desain ergonomis',
    price: 249000,
    inWishlist: true,
    inCart: false,
    createdAt: '2024-01-05T14:30:00.000Z',
    category: 'accessories',
    brand: 'Apple',
    image: '/gulir/gambar 5.jpg',
    stock: 50
  }
];

// Simulasikan delay API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi untuk mendapatkan semua produk
export async function getProducts() {
  await delay(500);
  return {
    error: false,
    data: products,
    message: 'Success'
  };
}

// Fungsi untuk mendapatkan produk by ID
export async function getProductById(id) {
  await delay(300);
  const product = products.find(p => p.id === id);
  return {
    error: !product,
    data: product || null,
    message: product ? 'Success' : 'Product not found'
  };
}

// Fungsi untuk menambah produk
export async function addProduct({ title, body, price, category = 'smartphone', brand = 'Unknown' }) {
  await delay(300);
  const newProduct = {
    id: `product-${Date.now()}`,
    title,
    description: body,
    price: parseFloat(price),
    category,
    brand,
    inWishlist: true,
    inCart: false,
    createdAt: new Date().toISOString(),
    image: '/images/placeholder.jpg'
  };
  products.push(newProduct);
  return {
    error: false,
    data: newProduct,
    message: 'Product added successfully'
  };
}

// Fungsi untuk menghapus produk
export async function deleteProduct(id) {
  await delay(300);
  products = products.filter(product => product.id !== id);
  return {
    error: false,
    data: null,
    message: 'Product deleted successfully'
  };
}

// ✅ NEW: Fungsi untuk menambahkan produk ke wishlist
// src/utils/api.js - Tambahan error handling
export async function addToWishlist(id) {
  await delay(300);
  products = products.map(product => {
    if (product.id === id) {
      return { ...product, inWishlist: true };
    }
    return product;
  });
  return {
    error: false,
    data: null,
    message: 'Product added to wishlist'
  };
}

export async function removeFromWishlist(id) {
  await delay(300);
  products = products.map(product => {
    if (product.id === id) {
      return { ...product, inWishlist: false };
    }
    return product;
  });
  return {
    error: false,
    data: null,
    message: 'Product removed from wishlist'
  };
}

// ✅ NEW: Fungsi untuk mendapatkan wishlist products
export async function getWishlistProducts() {
  await delay(300);
  const wishlistProducts = products.filter(p => p.inWishlist);
  return {
    error: false,
    data: wishlistProducts,
    message: 'Wishlist products retrieved successfully'
  };
}

// Fungsi untuk menambahkan produk ke keranjang
export async function addToCart(id) {
  await delay(300);
  products = products.map(product => {
    if (product.id === id) {
      return { ...product, inCart: true, inWishlist: false };
    }
    return product;
  });
  return {
    error: false,
    data: null,
    message: 'Product added to cart'
  };
}
// Fungsi untuk menghapus produk dari keranjang
export async function removeFromCart(id) {
  await delay(300);
  products = products.map(product => {
    if (product.id === id) {
      return { ...product, inCart: false };
    }
    return product;
  });
  return {
    error: false,
    data: null,
    message: 'Product removed from cart'
  };
}

// Fungsi untuk checkout
export async function checkout() {
  await delay(1000);
  products = products.map(product => ({
    ...product,
    inCart: false
  }));
  return {
    error: false,
    data: null,
    message: 'Checkout successful'
  };
}

// Fungsi autentikasi
export async function login({ email, password }) {
  await delay(800);
  const dummyToken = 'dummy-token-' + Date.now();
  localStorage.setItem('accessToken', dummyToken);
  return {
    error: false,
    data: { accessToken: dummyToken },
    message: 'Login successful'
  };
}

export async function register({ name, email, password }) {
  await delay(800);
  return {
    error: false,
    data: null,
    message: 'Registration successful'
  };
}

export async function getUserLogged() {
  await delay(300);
  return {
    error: false,
    data: {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com'
    },
    message: 'Success'
  };
}

export function logout() {
  localStorage.removeItem('accessToken');
  return {
    error: false,
    message: 'Logout successful'
  };
}

// Token management functions
export function putAccessToken(token) {
  localStorage.setItem('accessToken', token);
}

export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function removeAccessToken() {
  localStorage.removeItem('accessToken');
}
// src/utils/supabaseClient.js - Supabase Client & Realtime Layer
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://uovedtkvvgtyxkuaekzx.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.trim().length > 20);
};

export const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

/**
 * Fetch products from Supabase
 */
export async function fetchSupabaseProducts() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch products notice:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Supabase fetch products error:', err);
    return null;
  }
}

/**
 * Insert new product to Supabase
 */
export async function insertSupabaseProduct(productData) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        title: productData.title,
        brand: productData.brand,
        category: productData.category,
        price: productData.price,
        original_price: productData.originalPrice,
        stock: productData.stock,
        image: productData.image,
        description: productData.description,
        rating: productData.rating || 5.0,
        reviews_count: productData.reviewsCount || 0,
        specs: productData.specs || {}
      }])
      .select()
      .single();

    if (error) {
      console.warn('Supabase insert product notice:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Supabase insert product error:', err);
    return null;
  }
}

/**
 * Fetch orders from Supabase
 */
export async function fetchSupabaseOrders() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch orders notice:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Supabase fetch orders error:', err);
    return null;
  }
}

/**
 * Insert order to Supabase
 */
export async function insertSupabaseOrder(orderData) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        id: orderData.id,
        customer_name: orderData.address?.name || 'Pelanggan Setia',
        customer_phone: orderData.address?.phone || '-',
        customer_email: orderData.customerEmail || 'pelanggan@trio.com',
        shipping_address: orderData.address || {},
        items: orderData.items || [],
        total_price: orderData.total || orderData.totalPrice || 0,
        shipping_fee: orderData.shippingFee || 0,
        discount_amount: orderData.discount || 0,
        courier: orderData.courier || 'SiCepat Best',
        payment_method: orderData.paymentMethod || 'QRIS Dinamis',
        status: orderData.status || 'Diterima',
        tracking_number: orderData.trackingNumber || `TRX-${Date.now()}`
      }])
      .select()
      .single();

    if (error) {
      console.warn('Supabase insert order notice:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Supabase insert order error:', err);
    return null;
  }
}

/**
 * Subscribe to realtime orders via Supabase Channels
 */
export function subscribeToRealtimeOrders(onNewOrder) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('public:orders')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => {
        console.log('🔔 [Supabase Realtime] New order received:', payload.new);
        if (onNewOrder) onNewOrder(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

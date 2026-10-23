import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useLocale } from "../contexts/LocaleContext";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";
import { validateVoucher } from "../utils/api";
import FooterSection from "../components/FooterSection";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  ShoppingBag, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  X,
  MapPin,
  Tag,
  Check,
  AlertCircle
} from "lucide-react";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, checkout, loading: cartLoading } = useCart();
  const { locale } = useLocale();
  const { showToast } = useToast();
  const { authUser } = useAuth();
  const navigate = useNavigate();

  // Selection state for items in cart (default select all)
  const [selectedItemIds, setSelectedItemIds] = useState(() => cartItems.map(item => item.cartItemId));

  // Sync selectedItemIds when cartItems change (auto-select new items, clean deleted)
  useEffect(() => {
    setSelectedItemIds(prev => {
      const validIds = cartItems.map(i => i.cartItemId);
      const filtered = prev.filter(id => validIds.includes(id));
      // If newly added or initial load with empty selection, select all valid items
      if (filtered.length === 0 && validIds.length > 0 && prev.length === 0) {
        return validIds;
      }
      return filtered.length > 0 ? filtered : validIds;
    });
  }, [cartItems]);

  const handleToggleSelectItem = (cartItemId) => {
    setSelectedItemIds(prev => {
      if (prev.includes(cartItemId)) {
        return prev.filter(id => id !== cartItemId);
      } else {
        return [...prev, cartItemId];
      }
    });
  };

  const allSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cartItems.map(i => i.cartItemId));
    }
  };

  // Checkout modal & state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("form"); // 'form' | 'success'
  const [selectedCourier, setSelectedCourier] = useState("sicepat");
  const [selectedPayment, setSelectedPayment] = useState("qris");
  const [orderNumber, setOrderNumber] = useState("");

  // Voucher state
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  // Address
  const defaultAddress = authUser?.addresses?.find(a => a.isDefault) || {
    name: authUser?.name || "Budi Santoso",
    phone: authUser?.phone || "0812-3456-7890",
    street: "Gedung TRIO Plaza Lantai 5, Jl. Jend. Sudirman Kav. 21",
    city: "Jakarta Selatan, DKI Jakarta 12920"
  };
  const [address, setAddress] = useState(defaultAddress);

  // Filter items by user selection
  const selectedItems = cartItems.filter(item => selectedItemIds.includes(item.cartItemId));

  // Subtotal calculation - ONLY for selected items
  const subtotal = selectedItems.reduce((total, item) => {
    const itemPrice = item.price || 0;
    const qty = item.quantity || 1;
    return total + (itemPrice * qty);
  }, 0);

  // Shipping
  const courierFees = {
    sicepat: 15000,
    jne: 22000,
    gosend: 35000
  };
  const rawShippingFee = courierFees[selectedCourier] || 15000;
  let shippingFee = subtotal > 1000000 || subtotal === 0 ? 0 : rawShippingFee;

  // Voucher discount calculation
  let voucherDiscount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.code === "ONGKIRGRATIS") {
      shippingFee = Math.max(0, shippingFee - appliedVoucher.discount);
    } else {
      voucherDiscount = appliedVoucher.discount;
    }
  }

  const grandTotal = Math.max(0, subtotal + shippingFee - voucherDiscount);

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (subtotal === 0) {
      showToast(
        locale === "id" ? "Pilih minimal 1 barang untuk menggunakan kupon promo" : "Select at least 1 item to apply coupon",
        "warning"
      );
      return;
    }
    const result = validateVoucher(voucherInput, subtotal);
    if (!result.valid) {
      showToast(result.message, "error");
      return;
    }
    setAppliedVoucher(result);
    showToast(`Kupon ${result.code} berhasil dipasang!`, "success");
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput("");
    showToast("Kupon diskon dihapus", "info");
  };

  const handleDecreaseQuantity = (item) => {
    const currentQty = item.quantity || 1;
    if (currentQty > 1) {
      updateQuantity(item.cartItemId, currentQty - 1);
    } else {
      // Nominal batas 1: tetap ngestack di 1, tidak hilang kecuali tombol sampah ditekan
      showToast(
        locale === "id" 
          ? "Jumlah minimal adalah 1. Tekan ikon tempat sampah merah jika ingin menghapus barang ini." 
          : "Minimum quantity is 1. Click trash icon if you want to remove this item.",
        "info"
      );
    }
  };

  const handleOpenCheckout = () => {
    if (selectedItems.length === 0) {
      showToast(
        locale === "id"
          ? "Silakan centang/pilih minimal 1 barang di keranjang untuk dibeli."
          : "Please select at least 1 item to proceed to checkout.",
        "warning"
      );
      return;
    }

    if (!authUser) {
      showToast(
        locale === "id"
          ? "Silakan masuk ke akun Anda terlebih dahulu untuk menyelesaikan transaksi pembayaran."
          : "Please log in to your account to complete your purchase.",
        "info"
      );
      navigate("/login?redirect=/cart");
      return;
    }
    setCheckoutStep("form");
    setIsCheckoutModalOpen(true);
  };

  const handleCompleteOrder = async () => {
    if (selectedItems.length === 0) return;
    try {
      const randomInv = "INV-TRIO-" + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(randomInv);
      const orderPayload = {
        id: randomInv,
        date: new Date().toISOString(),
        items: selectedItems.map(p => ({
          id: p.productId,
          cartItemId: p.cartItemId,
          title: p.title,
          price: p.price,
          variant: p.selectedVariant ? `${p.selectedVariant.color} • ${p.selectedVariant.storage}` : null,
          quantity: p.quantity || 1,
          image: p.image
        })),
        subtotal,
        shippingFee,
        discount: voucherDiscount,
        total: grandTotal,
        courier: selectedCourier === "sicepat" ? "SiCepat Best (1-2 Hari)" : selectedCourier === "jne" ? "JNE Reguler" : "GoSend Instant",
        paymentMethod: selectedPayment === "qris" ? "QRIS Dinamis" : selectedPayment === "bca" ? "BCA Virtual Account" : "Mandiri VA",
        address
      };
      await checkout(orderPayload);
      setCheckoutStep("success");
      showToast(
        locale === "id" ? "Pesanan berhasil dibuat!" : "Order placed successfully!",
        "success"
      );
    } catch {
      showToast(
        locale === "id" ? "Gagal memproses pesanan" : "Failed to process order",
        "error"
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {locale === "id" ? "Keranjang Belanja" : "Shopping Cart"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {cartItems.length} {locale === "id" ? "item terpilih siap diproses" : "items ready for checkout"}
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
          <ShoppingBag size={24} />
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
            <ShoppingBag size={36} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
            {locale === "id" ? "Keranjang Belanja Masih Kosong" : "Your Cart is Empty"}
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mb-6">
            {locale === "id" 
              ? "Temukan gadget, audio, dan aksesori resmi di katalog PT. TRIO Distribusi." 
              : "Explore our gadget catalog to add your desired items."}
          </p>
          <Link 
            to="/catalog" 
            className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            {locale === "id" ? "Mulai Belanja Sekarang" : "Start Shopping"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Select All Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <span className="text-xs font-bold text-slate-800">
                  {locale === "id" ? `Pilih Semua (${cartItems.length} barang)` : `Select All (${cartItems.length} items)`}
                </span>
              </label>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {selectedItems.length} {locale === "id" ? "dari" : "of"} {cartItems.length} {locale === "id" ? "barang dicentang" : "items selected"}
              </span>
            </div>

            <div className="bg-white rounded-3xl p-4 sm:p-7 border border-slate-200/90 shadow-xs divide-y divide-slate-100">
              {cartItems.map((item) => {
                const isSelected = selectedItemIds.includes(item.cartItemId);
                const qty = item.quantity || 1;
                return (
                  <div key={item.cartItemId} className="py-3.5 sm:py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    {/* Checkbox + Image & Title */}
                    <div className="flex items-center gap-2.5 sm:gap-4 flex-1 w-full sm:w-auto">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectItem(item.cartItemId)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600 shrink-0"
                        title={locale === "id" ? "Centang untuk membeli barang ini" : "Select to purchase"}
                      />
                      <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80 p-1.5 sm:p-2 shrink-0 flex items-center justify-center">
                        <img 
                          src={item.image || "/terlaris/1.jpg"} 
                          alt={item.title} 
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = "/terlaris/1.jpg"; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block mb-1">
                          {item.brand || "TRIO"}
                        </span>
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2">
                          {item.title}
                        </h3>
                        {item.selectedVariant && (
                          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                            {item.selectedVariant.color} • {item.selectedVariant.storage}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm font-extrabold text-blue-600 mt-0.5">
                          Rp {item.price?.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                      <span className="text-xs font-bold text-slate-700 sm:hidden">
                        Total: <span className="text-blue-600 font-extrabold">Rp {(item.price * qty).toLocaleString("id-ID")}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                          <button
                            type="button"
                            onClick={() => handleDecreaseQuantity(item)}
                            disabled={qty <= 1}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                              qty <= 1
                                ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                                : "bg-white text-slate-700 hover:bg-slate-200 shadow-2xs cursor-pointer active:scale-95"
                            }`}
                            title={qty <= 1 ? "Batas minimal 1 barang (tetap ngestack, tekan ikon sampah merah untuk hapus)" : "Kurang"}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-800">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, qty + 1)}
                            className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 shadow-2xs cursor-pointer active:scale-95 transition-all"
                            title="Tambah"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Tombol Logo Sampah / Hapus */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="p-2 rounded-xl text-rose-500 hover:text-white hover:bg-rose-600 bg-rose-50 border border-rose-200 transition-all cursor-pointer"
                          title={locale === "id" ? "Hapus barang dari keranjang" : "Remove item from cart"}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Voucher Section */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={17} className="text-blue-600" />
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Kupon Promo Diskon
                </h3>
              </div>

              {appliedVoucher ? (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <div>
                      <span className="text-xs font-black text-emerald-800 font-mono">
                        {appliedVoucher.code}
                      </span>
                      <p className="text-[11px] text-emerald-700">{appliedVoucher.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveVoucher}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    placeholder="Masukkan kode kupon (Cth: TRIOBARU, HEMAT50)"
                    className="flex-1 px-4 py-2.5 text-xs bg-slate-50 uppercase rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Pakai
                  </button>
                </form>
              )}

              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
                <span>Rekomendasi Kupon:</span>
                <button
                  type="button"
                  onClick={() => { setVoucherInput("TRIOBARU"); }}
                  className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md hover:bg-blue-100 cursor-pointer"
                >
                  TRIOBARU
                </button>
                <button
                  type="button"
                  onClick={() => { setVoucherInput("ONGKIRGRATIS"); }}
                  className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md hover:bg-blue-100 cursor-pointer"
                >
                  ONGKIRGRATIS
                </button>
                <button
                  type="button"
                  onClick={() => { setVoucherInput("HEMAT50"); }}
                  className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md hover:bg-blue-100 cursor-pointer"
                >
                  HEMAT50
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5 sticky top-28">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Ringkasan Belanja
            </h2>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{locale === "id" ? `Total Harga (${selectedItems.length} barang dipilih)` : `Total Price (${selectedItems.length} items)`}</span>
                <span className="font-bold text-slate-900">Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>

              {voucherDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Diskon Kupon ({appliedVoucher?.code})</span>
                  <span>-Rp {voucherDiscount.toLocaleString("id-ID")}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimasi Ongkos Kirim</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-[11px]">Gratis Ongkir</span>
                  ) : (
                    <span className="font-bold text-slate-900">Rp {shippingFee.toLocaleString("id-ID")}</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Biaya Asuransi Pengiriman</span>
                <span className="text-emerald-600 font-bold uppercase text-[11px]">Gratis Ditanggung PT. TRIO</span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-baseline justify-between">
                <span className="text-sm font-extrabold text-slate-900">Total Tagihan</span>
                <span className="text-lg font-black text-blue-600">
                  Rp {grandTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              onClick={handleOpenCheckout}
              disabled={selectedItems.length === 0}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                selectedItems.length === 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 cursor-pointer active:scale-98"
              }`}
            >
              <span>
                {selectedItems.length === 0
                  ? (locale === "id" ? "Pilih Barang Terlebih Dahulu" : "Select Items First")
                  : (locale === "id" ? `Lanjut ke Pembayaran (${selectedItems.length})` : `Proceed to Checkout (${selectedItems.length})`)}
              </span>
              <ArrowRight size={16} />
            </button>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <ShieldCheck size={14} className="text-blue-600" />
                <span>Transaksi 100% Aman & Terenkripsi</span>
              </div>
              <p>Produk didistribusikan langsung dari gudang resmi bergaransi 1 tahun.</p>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {checkoutStep === "form" ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-blue-600" />
                    <h3 className="text-base font-extrabold text-slate-900">
                      Konfirmasi Checkout & Pembayaran
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="p-1 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Step 1: Address */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <MapPin size={14} className="text-blue-600" />
                    Alamat Pengiriman Penerima
                  </span>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                    <p className="font-bold text-slate-900">{address.name} ({address.phone})</p>
                    <p className="text-slate-600 mt-0.5">{address.street}</p>
                    <p className="text-slate-500">{address.city}</p>
                  </div>
                </div>

                {/* Step 2: Courier */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Truck size={14} className="text-blue-600" />
                    Pilih Layanan Kurir
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: "sicepat", name: "SiCepat Best", price: 15000, time: "1-2 Hari" },
                      { id: "jne", name: "JNE Reguler", price: 22000, time: "2-3 Hari" },
                      { id: "gosend", name: "GoSend Instant", price: 35000, time: "3 Jam Tiba" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCourier(c.id)}
                        className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer flex sm:flex-col justify-between sm:justify-start items-center sm:items-start ${
                          selectedCourier === c.id
                            ? "border-blue-600 bg-blue-50/60 shadow-xs"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div>
                          <strong className="block text-slate-900">{c.name}</strong>
                          <span className="text-[10px] text-slate-400">{c.time}</span>
                        </div>
                        <span className="font-bold text-blue-600 sm:mt-1">
                          Rp {c.price.toLocaleString("id-ID")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Payment */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <CreditCard size={14} className="text-blue-600" />
                    Metode Pembayaran
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: "qris", name: "QRIS Dinamis", icon: <QrCode size={18} /> },
                      { id: "bca", name: "BCA Virtual Account", icon: <CreditCard size={18} /> },
                      { id: "mandiri", name: "Mandiri VA", icon: <CreditCard size={18} /> },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPayment(p.id)}
                        className={`p-3 rounded-2xl border text-xs flex sm:flex-col items-center justify-start sm:justify-center gap-2.5 sm:gap-1.5 cursor-pointer transition-all ${
                          selectedPayment === p.id
                            ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                            : "border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        <div className="text-blue-600 shrink-0">{p.icon}</div>
                        <span className="text-xs sm:text-[11px]">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total Info */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block">Total Tagihan Final:</span>
                    <strong className="text-lg font-black text-blue-700">
                      Rp {grandTotal.toLocaleString("id-ID")}
                    </strong>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Siap Diproses
                  </span>
                </div>

                <button
                  onClick={handleCompleteOrder}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/25 cursor-pointer transition-all"
                >
                  Bayar & Selesaikan Pesanan
                </button>
              </>
            ) : (
              /* Success Screen */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Pesanan Berhasil Dibuat!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Nomor Invoice: <strong className="font-mono text-slate-900">{orderNumber}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Metode Bayar:</span>
                    <strong className="text-slate-800">{selectedPayment.toUpperCase()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Dibayar:</span>
                    <strong className="text-blue-600 font-extrabold">Rp {grandTotal.toLocaleString("id-ID")}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status Pengiriman:</span>
                    <span className="text-emerald-600 font-bold">Sedang Diproses Gudang</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsCheckoutModalOpen(false);
                      navigate("/profile");
                    }}
                    className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Buka Riwayat & Invoice
                  </button>
                  <button
                    onClick={() => {
                      setIsCheckoutModalOpen(false);
                      navigate("/");
                    }}
                    className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Kembali Belanja
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
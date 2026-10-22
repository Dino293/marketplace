import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocale } from "../contexts/LocaleContext";
import { useToast } from "../contexts/ToastContext";
import { getStoredOrders } from "../utils/api";
import FooterSection from "../components/FooterSection";
import {
  User,
  Package,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Clock,
  Printer,
  ChevronRight,
  Plus,
  Edit2,
  Save,
  LogOut,
  ExternalLink,
  Barcode
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { authUser, logout, updateProfile } = useAuth();
  const { locale } = useLocale();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'orders' | 'addresses'
  const [orders, setOrders] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Edit Profile state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: authUser?.name || "Budi Santoso",
    email: authUser?.email || "budi.santoso@triodistribusi.co.id",
    phone: authUser?.phone || "0812-3456-7890"
  });

  // Addresses
  const [addresses, setAddresses] = useState(authUser?.addresses || [
    {
      id: "addr-1",
      label: "Kantor / Utama",
      name: "Budi Santoso",
      phone: "0812-3456-7890",
      street: "Gedung TRIO Plaza Lantai 5, Jl. Jend. Sudirman Kav. 21",
      city: "Jakarta Selatan, DKI Jakarta 12920",
      isDefault: true
    }
  ]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Rumah",
    name: authUser?.name || "Budi Santoso",
    phone: authUser?.phone || "0812-3456-7890",
    street: "",
    city: ""
  });

  useEffect(() => {
    setOrders(getStoredOrders());
    if (authUser) {
      setFormData({
        name: authUser.name || "Budi Santoso",
        email: authUser.email || "",
        phone: authUser.phone || "0812-3456-7890"
      });
      if (authUser.addresses) {
        setAddresses(authUser.addresses);
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [authUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setEditMode(false);
      showToast(
        locale === "id" ? "Profil berhasil diperbarui!" : "Profile updated!",
        "success"
      );
    } catch {
      showToast(locale === "id" ? "Gagal memperbarui profil" : "Failed to update profile", "error");
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city) {
      showToast(locale === "id" ? "Lengkapi alamat terlebih dahulu" : "Fill address details", "error");
      return;
    }
    const updated = [
      ...addresses,
      {
        ...newAddress,
        id: `addr-${Date.now()}`,
        isDefault: addresses.length === 0
      }
    ];
    setAddresses(updated);
    updateProfile({ addresses: updated });
    setShowAddressModal(false);
    setNewAddress({
      label: "Rumah",
      name: authUser?.name || "Budi Santoso",
      phone: authUser?.phone || "0812-3456-7890",
      street: "",
      city: ""
    });
    showToast(locale === "id" ? "Alamat baru berhasil ditambahkan" : "Address added", "success");
  };

  const handleSetDefaultAddress = (id) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setAddresses(updated);
    updateProfile({ addresses: updated });
    showToast(locale === "id" ? "Alamat utama diperbarui" : "Default address set", "success");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            {authUser?.name ? authUser.name.charAt(0) : "B"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {authUser?.name || "Budi Santoso"}
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {authUser?.role || "VIP Member"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{authUser?.email}</p>
            <p className="text-xs text-slate-500">{authUser?.phone || "0812-3456-7890"}</p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold text-xs transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          <span>{locale === "id" ? "Keluar Akun" : "Logout"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <User size={16} />
          <span>{locale === "id" ? "Profil Saya" : "My Profile"}</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Package size={16} />
          <span>{locale === "id" ? "Riwayat Pesanan" : "Orders"}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "orders" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "addresses"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <MapPin size={16} />
          <span>{locale === "id" ? "Daftar Alamat" : "Addresses"}</span>
        </button>
      </div>

      {/* Tab 1: Profile Form */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs max-w-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {locale === "id" ? "Data Pribadi Pengguna" : "Personal Information"}
              </h2>
              <p className="text-xs text-slate-500">
                {locale === "id" ? "Kelola informasi kontak dan akun terdaftar" : "Manage your registered profile details"}
              </p>
            </div>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs transition-colors cursor-pointer"
              >
                <Edit2 size={13} />
                <span>{locale === "id" ? "Ubah" : "Edit"}</span>
              </button>
            ) : (
              <button
                onClick={() => setEditMode(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                {locale === "id" ? "Batal" : "Cancel"}
              </button>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {locale === "id" ? "Nama Lengkap" : "Full Name"}
              </label>
              <input
                type="text"
                value={formData.name}
                disabled={!editMode}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 disabled:bg-slate-100 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled={!editMode}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 disabled:bg-slate-100 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {locale === "id" ? "Nomor WhatsApp / HP" : "Phone Number"}
              </label>
              <input
                type="text"
                value={formData.phone}
                disabled={!editMode}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 disabled:bg-slate-100 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {editMode && (
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Save size={15} />
                <span>{locale === "id" ? "Simpan Perubahan" : "Save Changes"}</span>
              </button>
            )}
          </form>
        </div>
      )}

      {/* Tab 2: Orders List */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 flex flex-col items-center">
              <Clock size={36} className="text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">Belum ada transaksi</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">{ord.id}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(ord.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Metode: <strong className="text-slate-700">{ord.paymentMethod || "QRIS"}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                      ord.status === "Selesai" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {ord.status === "Selesai" ? <CheckCircle2 size={13} /> : <Truck size={13} />}
                      {ord.status || "Diproses"}
                    </span>

                    <button
                      onClick={() => setSelectedInvoice(ord)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Printer size={13} />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100">
                  {ord.items?.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image || "/terlaris/1.jpg"} 
                          alt={item.title} 
                          className="w-12 h-12 object-contain rounded-xl bg-slate-50 p-1 border border-slate-200/80" 
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                          <p className="text-[11px] text-slate-500">{item.quantity}x {item.variant && `• ${item.variant}`}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900">
                        Rp {((item.price || 0) * (item.quantity || 1)).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tracking Milestones */}
                {ord.timeline && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Lacak Pengiriman ({ord.courier || "SiCepat"} • {ord.trackingNumber || "SCP-TRIO-001"})
                    </span>
                    <div className="space-y-2">
                      {ord.timeline.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2.5 text-xs">
                          <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0"></span>
                          <div>
                            <span className="font-bold text-slate-800">{step.status}</span>
                            <span className="text-slate-400 text-[11px] ml-2">{step.time}</span>
                            <p className="text-[11px] text-slate-500">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Addresses */}
      {activeTab === "addresses" && (
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-800">
              {locale === "id" ? "Alamat Pengiriman Tersimpan" : "Saved Addresses"}
            </h2>
            <button
              onClick={() => setShowAddressModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>{locale === "id" ? "Tambah Alamat" : "Add Address"}</span>
            </button>
          </div>

          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  addr.isDefault 
                    ? "bg-blue-50/40 border-blue-300 shadow-xs" 
                    : "bg-white border-slate-200/90"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        Utama
                      </span>
                    )}
                  </div>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefaultAddress(addr.id)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Jadikan Utama
                    </button>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-800">{addr.name} ({addr.phone})</p>
                <p className="text-xs text-slate-600 mt-1">{addr.street}</p>
                <p className="text-xs text-slate-500">{addr.city}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150 print:p-0 print:border-none print:shadow-none">
            {/* Invoice Top */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">PT. TRIO DISTRIBUSI</h3>
                <p className="text-[11px] text-slate-500">Official Gadget & Electronics Marketplace</p>
                <p className="text-[11px] text-slate-500">NPWP: 01.234.567.8-901.000</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-blue-600 block">{selectedInvoice.id}</span>
                <span className="text-[11px] text-slate-400">
                  {new Date(selectedInvoice.date).toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-2xl">
              <div>
                <span className="font-bold text-slate-400 text-[10px] uppercase">Tujuan Pengiriman:</span>
                <p className="font-bold text-slate-800">{selectedInvoice.address?.name || "Budi Santoso"}</p>
                <p className="text-slate-600 text-[11px]">{selectedInvoice.address?.street}</p>
                <p className="text-slate-500 text-[11px]">{selectedInvoice.address?.city}</p>
              </div>
              <div>
                <span className="font-bold text-slate-400 text-[10px] uppercase">Metode & Kurir:</span>
                <p className="font-bold text-slate-800">{selectedInvoice.courier || "SiCepat Best"}</p>
                <p className="text-slate-500 text-[11px]">Resi: {selectedInvoice.trackingNumber || "SCP-001"}</p>
                <p className="text-slate-500 text-[11px]">Bayar: {selectedInvoice.paymentMethod || "QRIS"}</p>
              </div>
            </div>

            {/* Table */}
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-bold">
                  <tr>
                    <th className="p-2.5">Produk</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Harga</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.items?.map((it, i) => (
                    <tr key={i}>
                      <td className="p-2.5 font-bold text-slate-800">
                        {it.title}
                        {it.variant && <span className="block text-[10px] text-slate-400 font-normal">{it.variant}</span>}
                      </td>
                      <td className="p-2.5 text-center text-slate-600">{it.quantity || 1}</td>
                      <td className="p-2.5 text-right text-slate-600">Rp {it.price?.toLocaleString("id-ID")}</td>
                      <td className="p-2.5 text-right font-extrabold text-slate-900">
                        Rp {((it.price || 0) * (it.quantity || 1)).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations */}
            <div className="space-y-1 text-xs text-right border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal Produk:</span>
                <span>Rp {(selectedInvoice.subtotal || selectedInvoice.total || 0).toLocaleString("id-ID")}</span>
              </div>
              {selectedInvoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Diskon Kupon:</span>
                  <span>-Rp {selectedInvoice.discount.toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Ongkos Kirim:</span>
                <span>Rp {(selectedInvoice.shippingFee || 0).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="text-blue-600">Rp {(selectedInvoice.total || 0).toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Printer size={15} />
                <span>{locale === "id" ? "Cetak Invoice" : "Print"}</span>
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition-colors cursor-pointer"
              >
                {locale === "id" ? "Tutup" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-extrabold text-slate-900">
              {locale === "id" ? "Tambah Alamat Baru" : "Add New Address"}
            </h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Label Alamat (Rumah / Kantor)</label>
                <input
                  type="text"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Jalan & No Rumah</label>
                <textarea
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kota / Provinsi / Kode Pos</label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
                >
                  Simpan Alamat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

// src/components/NotificationBell.jsx - Live Transaction Notification Center & CloudAMQP RabbitMQ Monitor
import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  Radio, 
  Send, 
  RefreshCw, 
  ExternalLink, 
  Layers, 
  Sparkles,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { 
  getStoredNotifications, 
  markNotificationsAsRead, 
  clearNotifications 
} from '../utils/api';
import { 
  getRabbitMqQueueStatus, 
  publishOrderEvent, 
  peekRabbitMqMessages 
} from '../utils/rabbitmq';
import { isSupabaseConfigured } from '../utils/supabaseClient';
import { useLocale } from '../contexts/LocaleContext';

export default function NotificationBell() {
  const { locale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications'); // 'notifications' | 'rabbitmq'
  const [notifications, setNotifications] = useState([]);
  const [rmqStatus, setRmqStatus] = useState(null);
  const [rmqMessages, setRmqMessages] = useState([]);
  const [loadingAction, setLoadingAction] = useState(false);
  const [testResult, setTestResult] = useState(null);
  
  const dropdownRef = useRef(null);

  // Load notifications from storage
  const loadNotifications = () => {
    setNotifications(getStoredNotifications());
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener('trio:new_notification', loadNotifications);
    window.addEventListener('trio:order_created', loadNotifications);

    // Initial RMQ status check
    getRabbitMqQueueStatus().then(status => {
      setRmqStatus(status);
    });

    return () => {
      window.removeEventListener('trio:new_notification', loadNotifications);
      window.removeEventListener('trio:order_created', loadNotifications);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleOpenDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      refreshRmqData();
    }
  };

  const handleMarkAllRead = () => {
    const updated = markNotificationsAsRead();
    setNotifications(updated);
  };

  const handleClearAll = () => {
    clearNotifications();
    setNotifications([]);
  };

  const refreshRmqData = async () => {
    setLoadingAction(true);
    try {
      const [status, msgs] = await Promise.all([
        getRabbitMqQueueStatus(),
        peekRabbitMqMessages(5)
      ]);
      setRmqStatus(status);
      setRmqMessages(msgs || []);
    } catch (e) {
      console.warn('Refresh RMQ data warning:', e);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSendTestMessage = async () => {
    setLoadingAction(true);
    setTestResult(null);
    try {
      const testOrder = {
        id: `TRX-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: 'Muhammad Indra (Tester Proyek)',
        customerPhone: '0897-1419-924',
        total: 21999000,
        items: [{ title: 'Samsung Galaxy S25 Ultra 5G (Demo Test)', quantity: 1 }],
        courier: 'SiCepat Best (Realtime Dispatch)',
        paymentMethod: 'QRIS Dinamis Otomatis'
      };

      const result = await publishOrderEvent(testOrder);
      setTestResult({
        success: true,
        message: `Pesan uji coba berhasil dikirim ke antrean 'trio_order_queue' (${result.via || 'AMQP'})!`,
        time: new Date().toLocaleTimeString()
      });
      await refreshRmqData();
      loadNotifications();
    } catch (e) {
      setTestResult({
        success: false,
        message: 'Gagal mengirim pesan: ' + (e.message || 'Network error')
      });
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleOpenDropdown}
        className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Pemberitahuan Transaksi dan Antrean RabbitMQ"
        title="Notifikasi & CloudAMQP RabbitMQ"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Dropdown Modal */}
      {isOpen && (
        <div className="fixed sm:absolute inset-x-2 sm:inset-x-auto right-auto sm:right-0 top-16 sm:top-full mt-2 w-auto sm:w-96 max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight">Notifikasi Realtime</span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  RabbitMQ Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cluster: <span className="font-mono text-slate-200">armadillo.rmq.cloudamqp.com</span>
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-xl text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Subheader Tabs */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-2 pt-1 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 py-2 font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'notifications'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ShoppingBag size={14} />
              <span>Transaksi ({notifications.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rabbitmq')}
              className={`flex-1 py-2 font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'rabbitmq'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Radio size={14} className="text-amber-500" />
              <span>Monitor Queue RabbitMQ</span>
            </button>
          </div>

          {/* TAB 1: NOTIFICATIONS LIST */}
          {activeTab === 'notifications' && (
            <div className="flex flex-col flex-1 overflow-y-auto">
              {/* Quick Actions */}
              <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between text-[11px] border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">
                  {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}
                </span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Check size={12} />
                      <span>Tandai Dibaca</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-rose-500 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      <span>Bersihkan</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Items */}
              <div className="p-3 space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <p>Belum ada notifikasi pesanan terbaru.</p>
                    <p className="text-[10px] text-slate-500 mt-1">Lakukan checkout untuk melihat antrean RabbitMQ!</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-2xl transition-all ${
                        n.unread 
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40' 
                          : 'bg-white dark:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                          <span>{n.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 pl-3.5 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="mt-1.5 pl-3.5 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-300 font-semibold">
                          Queue: trio_order_queue
                        </span>
                        <span>{n.channel || 'CloudAMQP'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: RABBITMQ LIVE MONITOR */}
          {activeTab === 'rabbitmq' && (
            <div className="p-4 space-y-3.5 flex-1 overflow-y-auto text-xs">
              {/* Cluster Card */}
              <div className="p-3 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-400 flex items-center gap-1.5">
                    <Radio size={14} className="animate-pulse text-emerald-400" />
                    CloudAMQP Little Lemur
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    Connected
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Queue Name:</span>
                    <strong className="font-mono text-white">trio_order_queue</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Virtual Host:</span>
                    <strong className="font-mono text-white">daksbgyw</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Exchange:</span>
                    <strong className="font-mono text-white">amq.default</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Pesan Antrean:</span>
                    <strong className="text-emerald-400 font-bold">{rmqStatus?.messages || 0} pesan</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendTestMessage}
                  disabled={loadingAction}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Send size={13} />
                  <span>Kirim Pesan Tes</span>
                </button>

                <button
                  type="button"
                  onClick={refreshRmqData}
                  disabled={loadingAction}
                  className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Refresh status antrean"
                >
                  <RefreshCw size={13} className={loadingAction ? 'animate-spin' : ''} />
                  <span>Cek Queue</span>
                </button>
              </div>

              {testResult && (
                <div className={`p-2.5 rounded-xl text-[11px] flex items-center gap-2 ${
                  testResult.success 
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  <CheckCircle2 size={15} className="shrink-0" />
                  <span>{testResult.message} ({testResult.time})</span>
                </div>
              )}

              {/* Peek Recent Messages */}
              <div>
                <span className="font-extrabold text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                  Pesan Terakhir di Antrean RabbitMQ:
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {rmqMessages.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-slate-400 text-center text-[11px]">
                      Antrean kosong atau belum ada pesan baru. Klik 'Kirim Pesan Tes' di atas!
                    </div>
                  ) : (
                    rmqMessages.map((m, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
                          <span>ID: {m.id?.slice(0, 16)}...</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">ROUTED</span>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {m.payload?.orderId || 'TRX-ORDER'}: {m.payload?.customer || 'Customer'}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 text-[10px]">
                          {m.payload?.itemsSummary || `Total: Rp ${(m.payload?.totalPrice || 0).toLocaleString('id-ID')}`}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Supabase Status Notice */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Database Supabase:</span>
                <span className={`font-bold ${isSupabaseConfigured() ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {isSupabaseConfigured() ? '● Terhubung (PostgreSQL)' : '● Hybrid Local (Tersedia SQL Schema)'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

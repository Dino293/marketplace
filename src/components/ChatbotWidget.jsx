import React, { useState, useRef, useEffect } from "react";
import dataset from "../data/chatbotDataset.json";
import { useLocale } from "../contexts/LocaleContext";
import { useCompare } from "../contexts/CompareContext";
import { 
  Bot, 
  X, 
  Send, 
  Paperclip, 
  Download, 
  MessageSquare, 
  Phone, 
  Mail, 
  Sparkles, 
  ExternalLink, 
  Image as ImageIcon, 
  FileText, 
  Video as VideoIcon, 
  CornerDownRight,
  HelpCircle,
  CheckCircle2,
  Trash2
} from "lucide-react";

export default function ChatbotWidget() {
  const { locale } = useLocale();
  const { compareCount } = useCompare();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [activeSheet, setActiveSheet] = useState("all");
  const [inputValue, setInputValue] = useState("");
  const [attachedMedia, setAttachedMedia] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Chat message history
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Halo! Selamat datang di Layanan Bantuan PT. TRIO Distribusi. Saya Asisten Virtual AI Anda siap membantu informasi seputar produk, pemesanan, pengiriman, garansi, atau kontak langsung.",
      timestamp: "Baru saja",
      isWelcome: true
    }
  ]);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Open chatbot
  const handleOpenChat = () => {
    setIsOpen(true);
    setHasUnread(false);
  };

  // Download Dataset in JSON format
  const handleDownloadDataset = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataset, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "Dataset_Chatbot_PT_TRIO_Distribusi.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Get recommendations based on activeSheet
  const getRecommendedFaqs = () => {
    if (activeSheet === "all") {
      return dataset.sheets.flatMap(s => s.faqs).slice(0, 6);
    }
    const foundSheet = dataset.sheets.find(s => s.id === activeSheet);
    return foundSheet ? foundSheet.faqs : [];
  };

  // Smart Query Matcher across all sheets and queries
  const findAnswer = (queryText) => {
    const lowerQuery = queryText.toLowerCase().trim();
    const allFaqs = dataset.sheets.flatMap(s => s.faqs);

    // 1. Direct match with query phrases
    let bestMatch = null;
    let highestScore = 0;

    for (const faq of allFaqs) {
      let score = 0;
      // Match query list keywords
      for (const phrase of faq.query) {
        if (lowerQuery.includes(phrase.toLowerCase())) {
          score += 5;
        }
      }
      // Match question words
      const questionWords = faq.question.toLowerCase().split(/\s+/);
      for (const word of questionWords) {
        if (word.length > 3 && lowerQuery.includes(word)) {
          score += 2;
        }
      }
      // Match tags
      for (const tag of faq.tags) {
        if (lowerQuery.includes(tag.toLowerCase())) {
          score += 3;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = faq;
      }
    }

    if (bestMatch && highestScore >= 3) {
      return {
        found: true,
        answer: bestMatch.answer,
        question: bestMatch.question
      };
    }

    // Fallback if no specific answer matched
    return {
      found: false,
      answer: `Maaf, saya belum menemukan jawaban otomatis untuk pertanyaan "${queryText}".\n\nNamun Anda dapat langsung terhubung dengan tim pengelola PT. TRIO Distribusi:\n• WhatsApp / Telp: +62 897-1419-924 (08971419924)\n• Email / Gmail: muhindra293@gmail.com\n\nKami siap melayani kebutuhan Anda secara langsung!`
    };
  };

  // Handle send message
  const handleSendMessage = (textToSend = null) => {
    const query = (textToSend || inputValue).trim();
    if (!query && !attachedMedia) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query || (attachedMedia ? `Mengirim file: ${attachedMedia.name}` : ""),
      media: attachedMedia,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setAttachedMedia(null);
    setIsTyping(true);

    // Simulate AI thinking and reply
    setTimeout(() => {
      let replyText = "";
      if (userMsg.media && !query) {
        replyText = `File dan lampiran media "${userMsg.media.name}" telah berhasil diterima oleh sistem PT. TRIO Distribusi.\n\nTim kami sedang meninjau dokumen atau gambar tersebut. Jika ada hal mendesak, silakan hubungi WhatsApp kami di +62 897-1419-924.`;
      } else {
        const result = findAnswer(query);
        replyText = result.answer;
      }

      const botReply = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 700);
  };

  // Handle file / media upload in chat
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    reader.onload = (uploadEvent) => {
      setAttachedMedia({
        name: file.name,
        type: isImage ? "image" : isVideo ? "video" : "file",
        size: (file.size / 1024).toFixed(1) + " KB",
        url: uploadEvent.target.result
      });
    };

    reader.readAsDataURL(file);
    e.target.value = null; // reset
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className={`fixed ${compareCount > 0 ? "bottom-36 md:bottom-6" : "bottom-20 md:bottom-6"} right-3 sm:right-6 z-40 transition-all duration-300`}>
        <button
          onClick={handleOpenChat}
          className="group relative p-3.5 sm:p-4 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl hover:scale-108 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer border-2 border-white/40"
          aria-label="Buka Chatbot Asisten AI"
          title="Tanya AI PT. TRIO Distribusi"
        >
          <Bot size={24} className="group-hover:rotate-12 transition-transform" />
          
          {/* Status Indicator */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>

          {/* Quick Greeting Popup (only when closed) */}
          {!isOpen && hasUnread && (
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold py-1.5 px-3 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 whitespace-nowrap animate-bounce hidden sm:flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              <span>Ada yang bisa kami bantu?</span>
            </div>
          )}
        </button>
      </div>

      {/* Chatbot Window / Drawer */}
      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 sm:hidden animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:right-6 sm:bottom-6 z-50 sm:max-w-md w-full bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 h-[88vh] sm:h-[620px] max-h-[88vh] sm:max-h-[620px]">
            
            {/* Header */}
            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex flex-col shrink-0 shadow-md">
              <div className="w-10 h-1 rounded-full bg-white/40 mx-auto mb-2 sm:hidden" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    <Bot size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-xs sm:text-sm tracking-tight">TRIO Assistant AI</h3>
                      <span className="text-[9px] sm:text-[10px] bg-emerald-400/30 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                        Online
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-blue-100">Bantuan Resmi & Dataset Terstruktur</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
              {/* Download Dataset Button */}
              <button
                type="button"
                onClick={handleDownloadDataset}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Unduh Dataset Tanya Jawab (JSON/Excel)"
              >
                <Download size={17} />
              </button>
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Tutup Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

          {/* Sheet / Category Filter Tabs */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 overflow-x-auto flex gap-1.5 scrollbar-none shrink-0 text-xs">
            <button
              onClick={() => setActiveSheet("all")}
              className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeSheet === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700"
              }`}
            >
              Semua Topik
            </button>
            {dataset.sheets.map(sheet => (
              <button
                key={sheet.id}
                onClick={() => setActiveSheet(sheet.id)}
                className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeSheet === sheet.id
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {sheet.sheetName}
              </button>
            ))}
          </div>

          {/* Chat Messages Conversation Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs whitespace-pre-line leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-xs"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700 rounded-tl-xs"
                  }`}
                >
                  {/* Media Preview Attachment if any */}
                  {msg.media && (
                    <div className="mb-2 p-1.5 rounded-xl bg-black/10 overflow-hidden">
                      {msg.media.type === "image" && (
                        <img 
                          src={msg.media.url} 
                          alt="Lampiran" 
                          className="max-h-48 w-full object-contain rounded-lg"
                        />
                      )}
                      {msg.media.type === "video" && (
                        <video 
                          src={msg.media.url} 
                          controls 
                          className="max-h-48 w-full rounded-lg"
                        />
                      )}
                      {msg.media.type === "file" && (
                        <div className="flex items-center gap-2 text-xs font-semibold p-2">
                          <FileText size={16} />
                          <span className="truncate">{msg.media.name}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <p>{msg.text}</p>
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-fit text-slate-400 text-xs animate-pulse">
                <Bot size={14} className="text-blue-600 animate-spin" />
                <span>Asisten sedang mengetik jawaban...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Rekomendasi Pertanyaan (FAQ Recommendation Chips) */}
          <div className="px-3.5 py-2.5 bg-slate-100/70 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5 flex items-center gap-1">
              <Sparkles size={12} className="text-blue-500" />
              Rekomendasi Pertanyaan Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {getRecommendedFaqs().map(faq => (
                <button
                  key={faq.id}
                  onClick={() => handleSendMessage(faq.question)}
                  className="text-[11px] font-semibold py-1 px-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all cursor-pointer flex items-center gap-1 shadow-2xs text-left"
                >
                  <CornerDownRight size={10} className="text-blue-500 shrink-0" />
                  <span className="truncate max-w-[220px]">{faq.question}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Contact Quick Action Bar */}
          <div className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/40 border-t border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-[11px] shrink-0">
            <span className="font-bold text-blue-800 dark:text-blue-300">Hubungi Langsung:</span>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/628971419924?text=Halo%20PT.%20TRIO%20Distribusi,%20saya%20ingin%20bertanya%20seputar%20produk"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                <Phone size={11} />
                <span>WA: 08971419924</span>
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="mailto:muhindra293@gmail.com"
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                <Mail size={11} />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Attached Media Preview (Draft before send) */}
          {attachedMedia && (
            <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <ImageIcon size={15} className="text-blue-600 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {attachedMedia.name} ({attachedMedia.size})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAttachedMedia(null)}
                className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                title="Hapus lampiran"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
            {/* File Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Lampirkan File, Foto, atau Video"
            >
              <Paperclip size={18} />
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Tulis pertanyaan Anda di sini..."
              className="flex-1 px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() && !attachedMedia}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white transition-all cursor-pointer shadow-xs"
              title="Kirim Pesan"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </>
    )}
    </>
  );
}

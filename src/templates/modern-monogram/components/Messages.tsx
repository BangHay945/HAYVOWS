"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Check, Heart, Lock } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

export function MonogramMessages({ context }: TemplateComponentProps) {
  const { wedding, guest, messages: initialMessages } = context;

  const [messagesList, setMessagesList] = useState(
    initialMessages.length > 0
      ? initialMessages
      : [
          {
            id: "msg-1",
            guest: { name: "Budi Santoso & Keluarga" },
            guestName: "Budi Santoso & Keluarga",
            message: "Selamat menempuh hidup baru Alex & Sara! Semoga sakinah, mawaddah, warahmah.",
            isPinned: true,
            createdAt: new Date(),
          },
          {
            id: "msg-2",
            guest: { name: "Dr. Hendra Wijaya" },
            guestName: "Dr. Hendra Wijaya",
            message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fii khoir. Turut berbahagia untuk kedua mempelai.",
            isPinned: false,
            createdAt: new Date(),
          },
        ]
  );

  const [name, setName] = useState(guest?.name || "");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wedding.isDemo) return;
    setErrorMessage(null);
    if (!name.trim() || !message.trim()) return;

    if (!guest?.id) {
      setErrorMessage("Pengiriman ucapan hanya dapat dilakukan melalui tautan undangan resmi yang diberikan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weddingId: wedding.id,
          guestId: guest.id,
          message: message.trim(),
          website_url: honeypot,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessagesList((prev: any) => [data, ...prev]);
        setMessage("");
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 4000);
      } else {
        setErrorMessage(data.error || "Gagal mengirimkan ucapan.");
      }
    } catch {
      setErrorMessage("Koneksi gagal. Silakan coba beberapa saat lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-md mx-auto">
      <div className="text-center mb-10 space-y-2">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-[#8c7e72] uppercase block">
          UNTUK KEDUA MEMPELAI
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Untaian Doa &amp; Ucapan
        </h2>
        <div className="w-12 h-0.5 bg-[#c5a880] mx-auto rounded-full mt-2" />
        <p className="text-xs sm:text-sm text-slate-500 font-light max-w-md mx-auto pt-1">
          Kirimkan doa dan ucapan terbaik Anda untuk mengiringi langkah awal kehidupan rumah tangga kami.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        {/* Form Input Ucapan */}
        {wedding.isDemo && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center space-y-1">
            <span className="text-[10px] font-bold text-[#2d4a3e] uppercase tracking-wider block">
              Mode Pratinjau Demo
            </span>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Halaman pratinjau demo. Pengisian ucapan dan doa restu dinonaktifkan.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Nama Anda
              </label>
              {guest?.name && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2d4a3e] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                  <Lock className="w-2.5 h-2.5 text-[#2d4a3e]" />
                  <span>Tamu Terdaftar</span>
                </span>
              )}
            </div>
            <input
              type="text"
              required
              readOnly
              disabled={Boolean(wedding.isDemo || guest?.name)}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda..."
              className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors ${
                wedding.isDemo || guest?.name
                  ? "bg-slate-100/90 border-slate-200 text-slate-700 cursor-not-allowed select-none"
                  : "bg-[#faf8f5] border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Doa &amp; Ucapan Restu
            </label>
            <textarea
              required
              rows={3}
              disabled={Boolean(wedding.isDemo)}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                wedding.isDemo
                  ? "Pengisian ucapan dan doa restu dinonaktifkan pada mode demo."
                  : "Tuliskan ucapan selamat dan untaian doa restu..."
              }
              className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm transition-colors resize-none ${
                wedding.isDemo
                  ? "bg-slate-100/80 text-slate-500 cursor-not-allowed"
                  : "bg-[#faf8f5] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              }`}
            />
          </div>

          {/* Honeypot field for anti-bot trap (hidden from real users) */}
          <input
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-in fade-in">
              {errorMessage}
            </div>
          )}

          {!guest?.id && !wedding.isDemo && (
            <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-2.5 rounded-xl">
              Perhatian: Pengiriman ucapan &amp; doa restu hanya dapat dilakukan melalui tautan undangan resmi yang Anda terima.
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              disabled={Boolean(wedding.isDemo) || isSubmitting || !guest?.id}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold transition-all ${
                wedding.isDemo || isSubmitting || !guest?.id
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300"
                  : "bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-xs hover:shadow-md cursor-pointer active:scale-98"
              }`}
            >
              {wedding.isDemo ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pengisian Dinonaktifkan (Mode Demo)</span>
                </>
              ) : isSubmitting ? (
                <span>Mengirimkan...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Doa Restu</span>
                </>
              )}
            </button>

            {isSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 animate-in fade-in duration-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Doa restu terkirim!</span>
              </span>
            )}
          </div>
        </form>

        {/* List of Messages */}
        <div className="border-t border-slate-100 pt-6 space-y-3 max-h-80 overflow-y-auto pr-1">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Doa Restu dari Para Sahabat ({messagesList.length})
          </p>

          {messagesList.map((item: any) => {
            const senderName = item.guest?.name || item.guestName || "Tamu Undangan";
            const initial = senderName.trim().charAt(0).toUpperCase() || "T";
            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#faf8f5] border border-slate-200/70 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2d4a3e] to-[#4c7361] text-[#fef08a] font-bold text-xs flex items-center justify-center shrink-0">
                      {initial}
                    </div>
                    <span className="font-semibold text-xs text-slate-900">
                      {senderName}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-light leading-relaxed pl-9">
                  &ldquo;{item.message}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

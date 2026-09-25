"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Send, Check } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

export function NoirMessages({ context }: TemplateComponentProps) {
  const { wedding, guest, messages: initialMessages } = context;

  const [messagesList, setMessagesList] = useState(
    initialMessages.length > 0
      ? initialMessages
      : [
          {
            id: "msg-1",
            guest: { name: "Budi Santoso & Keluarga" },
            guestName: "Budi Santoso & Keluarga",
            message:
              "Selamat menempuh hidup baru! Semoga cinta kalian abadi dan rumah tangga kalian dipenuhi berkah.",
            isPinned: true,
            createdAt: new Date(),
          },
          {
            id: "msg-2",
            guest: { name: "Dr. Hendra Wijaya" },
            guestName: "Dr. Hendra Wijaya",
            message:
              "Barakallahu lakuma wa baraka alaikuma. Turut berbahagia atas pernikahan yang penuh cinta ini.",
            isPinned: false,
            createdAt: new Date(),
          },
        ]
  );

  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!message.trim()) return;

    if (!guest?.id) {
      setErrorMessage(
        "Pengiriman ucapan hanya dapat dilakukan melalui tautan undangan resmi."
      );
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
    <section className="relative w-full min-h-[100dvh] bg-[#111111] flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
        }}
      />

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Eyebrow */}
        <div className="text-center mb-10">
          <p className="font-noir-sans text-[9px] tracking-[0.45em] uppercase text-[#555555] mb-3">
            Doa Restu
          </p>
          <h2 className="font-noir-serif text-3xl sm:text-4xl font-light text-[#fafafa] tracking-wide">
            Ucapan & Doa
          </h2>
          <div className="w-8 h-px bg-[#c9a84c] mx-auto mt-4" />
        </div>

        {/* Form */}
        <div className="border border-[#222222] p-6 sm:p-8 bg-[#0a0a0a] mb-6">
          {wedding.isDemo ? (
            <div className="text-center py-4 space-y-2">
              <p className="font-noir-sans text-[9px] tracking-[0.3em] uppercase text-[#555555]">
                Mode Demo
              </p>
              <p className="font-noir-sans text-xs text-[#444444] leading-relaxed">
                Kolom ucapan dinonaktifkan pada halaman demo untuk mencegah spam.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Sender name — locked */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-noir-sans text-[9px] tracking-[0.3em] uppercase text-[#555555]">
                    Dari
                  </p>
                  {guest?.name && (
                    <span className="flex items-center gap-1 font-noir-sans text-[8px] tracking-[0.2em] uppercase text-[#c9a84c]">
                      <Lock className="w-2.5 h-2.5" />
                      Tamu Terdaftar
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={guest?.name || ""}
                  placeholder="Nama tamu..."
                  className="w-full bg-transparent border-b border-[#222222] text-[#888888] font-noir-serif text-sm italic py-2 focus:outline-none cursor-not-allowed"
                />
              </div>

              {/* Message */}
              <div>
                <p className="font-noir-sans text-[9px] tracking-[0.3em] uppercase text-[#555555] mb-2">
                  Ucapan
                </p>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan ucapan dan doa restu terbaik Anda..."
                  className="w-full bg-transparent border-b border-[#333333] focus:border-[#c9a84c] text-[#cccccc] font-noir-sans text-xs py-2 focus:outline-none resize-none placeholder:text-[#444444] transition-colors"
                />
              </div>

              {/* Honeypot */}
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
                <p className="font-noir-sans text-[10px] text-red-400 leading-relaxed">
                  {errorMessage}
                </p>
              )}

              {!guest?.id && (
                <p className="font-noir-sans text-[10px] text-[#555555] leading-relaxed">
                  Pengiriman ucapan hanya tersedia melalui tautan undangan resmi.
                </p>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting || !guest?.id}
                  className="flex items-center gap-2 border border-[#fafafa]/20 hover:border-[#c9a84c] text-[#888888] hover:text-[#c9a84c] font-noir-sans text-[9px] tracking-[0.3em] uppercase px-6 py-2.5 transition-all duration-300 cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-3 h-3" />
                  {isSubmitting ? "Mengirim..." : "Kirim"}
                </button>
                {isSuccess && (
                  <span className="flex items-center gap-1.5 font-noir-sans text-[9px] text-[#c9a84c] tracking-wider">
                    <Check className="w-3 h-3" />
                    Terkirim
                  </span>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Messages list */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {messagesList.map((item: any) => {
            const senderName =
              item.guest?.name || item.guestName || "Tamu Undangan";
            const initial = senderName.trim().charAt(0).toUpperCase() || "T";
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-[#1d1d1d] p-4 bg-[#0d0d0d]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 bg-[#1a1a1a] border border-[#c9a84c]/30 flex items-center justify-center shrink-0">
                    <span className="font-noir-serif text-[10px] text-[#c9a84c]">
                      {initial}
                    </span>
                  </div>
                  <span className="font-noir-sans text-[10px] tracking-wider text-[#888888]">
                    {senderName}
                  </span>
                </div>
                <p className="font-noir-serif text-sm font-light text-[#cccccc] italic leading-relaxed pl-9">
                  &ldquo;{item.message}&rdquo;
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

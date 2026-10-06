"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Send, Check, MessageSquare } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

const ease = [0.22, 1, 0.36, 1] as const;

export function CinematicIvoryMessages({ context }: TemplateComponentProps) {
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
              "Selamat menempuh hidup baru! Semoga cinta kalian abadi dan mahligai rumah tangga dipenuhi berkah dan kebahagiaan.",
            isPinned: true,
            createdAt: new Date(),
          },
          {
            id: "msg-2",
            guest: { name: "Dr. Hendra Wijaya" },
            guestName: "Dr. Hendra Wijaya",
            message:
              "Barakallahu lakuma wa baraka alaikuma. Turut berbahagia atas pernikahan sakral yang penuh kemuliaan ini.",
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
    <section className="relative w-full bg-[#121316] flex flex-col items-center justify-center px-6 py-24 sm:py-28 overflow-hidden text-[#f5f3ef]">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Eyebrow & Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-12"
        >
          <p className="font-ci-sans text-[8px] tracking-[0.5em] uppercase text-[#8a8b90] mb-3">
            BUKU TAMU &amp; DOA RESTU
          </p>
          <h2 className="font-ci-serif text-3xl sm:text-4xl font-light text-[#f5f3ef]">
            Untaian Doa &amp; Ucapan
          </h2>
          <div className="w-8 h-px bg-[#d4c4b0] mx-auto mt-4" />
        </motion.div>

        {/* ── Form Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="mb-12 bg-[#18191d] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
        >
          {wedding.isDemo ? (
            <div className="text-center py-4 border-b border-white/10">
              <p className="font-ci-sans text-[8px] tracking-[0.4em] uppercase text-[#8a8b90] mb-1">
                Mode Demo
              </p>
              <p className="font-ci-sans text-xs text-[#8a8b90] leading-relaxed">
                Pengiriman ucapan baru dinonaktifkan pada halaman demo untuk mencegah spam.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sender name — locked */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-ci-sans text-[8px] tracking-[0.4em] uppercase text-[#8a8b90]">
                    Pengirim
                  </p>
                  {guest?.name && (
                    <span className="flex items-center gap-1 font-ci-sans text-[8px] tracking-[0.2em] uppercase text-[#d4c4b0]">
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
                  className="w-full bg-transparent border-b border-white/15 text-[#dcd8cf] font-ci-serif text-base italic py-2 focus:outline-none cursor-not-allowed"
                />
              </div>

              {/* Message textarea */}
              <div>
                <p className="font-ci-sans text-[8px] tracking-[0.4em] uppercase text-[#8a8b90] mb-1.5">
                  Pesan &amp; Doa Restu
                </p>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan ucapan dan doa restu terbaik Anda untuk kedua mempelai..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl focus:border-[#d4c4b0] text-[#f5f3ef] font-ci-sans text-xs p-3.5 focus:outline-none resize-none placeholder:text-[#52535a] transition-colors"
                />
              </div>

              {/* Honeypot anti-spam */}
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {/* Error */}
              {errorMessage && (
                <p className="font-ci-sans text-[10px] text-red-400 leading-relaxed">
                  {errorMessage}
                </p>
              )}

              {/* Success */}
              {isSuccess && (
                <div className="flex items-center gap-2 text-[#d4c4b0] font-ci-sans text-[10px] tracking-wider">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Doa restu Anda telah berhasil dikirimkan. Terima kasih!</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !guest?.id}
                className={`w-full flex items-center justify-center gap-2 font-ci-sans text-[8.5px] tracking-[0.3em] uppercase py-3.5 rounded-full border transition-all duration-300 group ${
                  isSubmitting || !guest?.id
                    ? "border-white/10 text-[#72737a] cursor-not-allowed opacity-60 bg-white/[0.02]"
                    : "border-[#d4c4b0]/60 text-[#f5f3ef] bg-white/[0.06] hover:bg-[#d4c4b0] hover:text-[#0c0d0e] cursor-pointer shadow-sm"
                }`}
              >
                <Send className="w-3 h-3 group-hover:text-[#0c0d0e] transition-colors duration-300" />
                <span className="group-hover:text-[#0c0d0e] transition-colors duration-300">{isSubmitting ? "Mengirimkan..." : "Kirim Doa Restu"}</span>
              </button>
            </form>
          )}
        </motion.div>

        {/* ── Prayer / Messages Feed ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="w-full bg-[#18191d]/60 border border-white/10 rounded-2xl p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#d4c4b0]" />
              <p className="font-ci-sans text-[8.5px] tracking-[0.4em] uppercase text-[#d4c4b0] font-medium">
                Buku Doa Tamu
              </p>
            </div>
            <span className="font-ci-sans text-[8.5px] tracking-widest text-[#8a8b90]">
              {messagesList.length} Doa
            </span>
          </div>

          {/* List */}
          <div className="divide-y divide-white/[0.08] max-h-[460px] overflow-y-auto pr-1">
            {messagesList.map((item: any) => {
              const senderName =
                item.guest?.name || item.guestName || "Tamu Undangan";
              return (
                <div key={item.id} className="py-4 first:pt-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-ci-sans text-[10px] tracking-wider text-[#d4c4b0] font-medium">
                      {senderName}
                    </p>
                    {item.isPinned && (
                      <span className="font-ci-sans text-[7.5px] tracking-[0.2em] uppercase text-[#d4c4b0] bg-white/[0.06] border border-white/10 px-2 py-0.5 rounded-full">
                        Disematkan
                      </span>
                    )}
                  </div>
                  <p className="font-ci-serif text-sm italic font-light text-[#f5f3ef] leading-relaxed">
                    &ldquo;{item.message}&rdquo;
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}

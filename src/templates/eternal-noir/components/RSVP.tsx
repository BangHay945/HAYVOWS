"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Send, Check, MessageSquare } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

export function NoirRSVP({ context, onRSVPSubmit, onTrack }: TemplateComponentProps) {
  const { guest, wedding, messages: initialMessages } = context;

  const [attendance, setAttendance] = useState<"attending" | "not_attending">("attending");
  const [count, setCount] = useState(guest?.guestCount ?? 1);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isDemo = Boolean(wedding?.isDemo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo || !guest) return;
    setErrorMessage(null);
    setLoading(true);

    try {
      // 1. Submit RSVP
      await onRSVPSubmit?.({
        guestId: guest.id,
        weddingId: wedding.id,
        attendanceStatus: attendance,
        guestCount: count,
        message: message.trim() || undefined,
      });
      onTrack?.("rsvp_submit");

      // 2. Submit Message if present
      if (message.trim()) {
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
          }
        } catch {
          // Non-blocking error for message
        }
      }

      setRsvpSuccess(true);
      setTimeout(() => setRsvpSuccess(false), 5000);
    } catch (err: any) {
      setErrorMessage(err?.message || "Konfirmasi kehadiran gagal dikirim. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full bg-[#f4efe6] flex flex-col items-center justify-center px-6 py-20 sm:py-28 overflow-hidden">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b38e36]/35 to-transparent" />

      {/* Eyebrow & Title */}
      <div className="text-center mb-14">
        <p className="font-noir-sans text-[9px] tracking-[0.45em] uppercase text-[#7d7568] mb-3">
          Konfirmasi &amp; Doa Restu
        </p>
        <h2 className="font-noir-serif text-3xl sm:text-4xl font-light text-[#171717] tracking-wide">
          Kehadiran &amp; Ucapan
        </h2>
        <div className="w-8 h-px bg-[#b38e36] mx-auto mt-4" />
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col gap-8 items-stretch">
        {/* RSVP & Message Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full bg-[#fbf9f4] border border-[#ded7c8] p-6 sm:p-8 shadow-xs"
        >
          {/* Guest name */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-noir-sans text-[9px] tracking-[0.3em] uppercase text-[#7d7568]">
                Tamu Undangan
              </p>
              {guest?.name && (
                <span className="flex items-center gap-1 font-noir-sans text-[8px] tracking-[0.2em] uppercase text-[#9a792c] font-medium">
                  <Lock className="w-2.5 h-2.5" />
                  Terdaftar
                </span>
              )}
            </div>
            <p className="font-noir-serif text-lg font-light text-[#171717] italic">
              {guest?.name || "Tamu Terhormat"}
            </p>
            <div className="w-full h-px bg-[#ded7c8] mt-3" />
          </div>

          {isDemo && (
            <div className="p-3.5 border border-[#b38e36]/40 bg-[#b38e36]/10 text-center space-y-1 mb-5">
              <span className="font-noir-sans text-[9px] tracking-[0.3em] uppercase text-[#9a792c] font-semibold block">
                Mode Pratinjau Demo
              </span>
              <p className="font-noir-sans text-xs text-[#666666] leading-relaxed">
                Halaman pratinjau demo. Pengisian konfirmasi kehadiran dan ucapan dinonaktifkan.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Attendance Options */}
            <div>
              <p className="font-noir-sans text-[9px] tracking-[0.3em] uppercase text-[#7d7568] mb-2.5">
                Rencana Kehadiran
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(["attending", "not_attending"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    disabled={isDemo}
                    onClick={() => !isDemo && setAttendance(opt)}
                    className={`py-2.5 border font-noir-sans text-[9px] tracking-[0.2em] uppercase transition-all duration-200 ${
                      isDemo ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                    } ${
                      attendance === opt
                        ? "border-[#b38e36] text-[#9a792c] bg-[#b38e36]/10 font-medium"
                        : "border-[#ded7c8] text-[#666666] hover:border-[#b38e36]"
                    }`}
                  >
                    {opt === "attending" ? "Hadir" : "Tidak Hadir"}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Count (if attending) */}
            {attendance === "attending" && (
              <div>
                <p className="font-noir-sans text-[9px] tracking-[0.3em] uppercase text-[#7d7568] mb-2">
                  Jumlah Tamu Hadir
                </p>
                <select
                  disabled={isDemo}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className={`w-full bg-[#eee8dc] border border-[#ded7c8] text-[#171717] font-noir-sans text-xs px-3 py-2.5 focus:border-[#b38e36] focus:outline-none transition-colors ${
                    isDemo ? "cursor-not-allowed opacity-75" : ""
                  }`}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Orang
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Message / Prayer Input */}
            <div>
              <p className="font-noir-sans text-[9px] tracking-[0.3em] uppercase text-[#7d7568] mb-2">
                Ucapan &amp; Doa Restu
              </p>
              <textarea
                rows={3}
                disabled={isDemo}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isDemo
                    ? "Pengisian ucapan dan doa restu dinonaktifkan pada mode demo."
                    : "Tuliskan ucapan dan doa terbaik Anda untuk kedua mempelai..."
                }
                className={`w-full bg-transparent border-b border-[#ded7c8] focus:border-[#b38e36] text-[#171717] font-noir-sans text-xs py-2 focus:outline-none resize-none placeholder:text-[#888888] transition-colors ${
                  isDemo ? "cursor-not-allowed opacity-75" : ""
                }`}
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

            {errorMessage && (
              <p className="font-noir-sans text-[10px] text-red-500 leading-relaxed">
                {errorMessage}
              </p>
            )}

            {rsvpSuccess && (
              <div className="flex items-center gap-2 p-3 bg-[#b38e36]/15 border border-[#b38e36]/40 text-[#9a792c] text-[10px] font-noir-sans tracking-wide">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Terima kasih! Konfirmasi &amp; doa restu Anda telah kami terima.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isDemo || loading || !guest}
              className={`w-full flex items-center justify-center gap-2 font-noir-sans text-[9px] tracking-[0.3em] uppercase py-3.5 transition-all duration-300 shadow-sm ${
                isDemo || loading || !guest
                  ? "bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed"
                  : "bg-[#171717] hover:bg-[#9a792c] text-[#fbf9f4] cursor-pointer"
              }`}
            >
              {isDemo ? (
                <>
                  <Lock className="w-3 h-3" />
                  <span>Pengisian Dinonaktifkan (Mode Demo)</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  <span>{loading ? "Menyimpan..." : "Kirim Konfirmasi & Doa"}</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Messages / Wishes Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="w-full flex flex-col"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#ded7c8]">
            <div className="flex items-center gap-2 text-[#171717]">
              <MessageSquare className="w-3.5 h-3.5 text-[#9a792c]" />
              <span className="font-noir-sans text-[10px] tracking-[0.25em] uppercase text-[#7d7568] font-medium">
                Buku Doa Tamu
              </span>
            </div>
            <span className="font-noir-sans text-[9px] text-[#7d7568] tracking-wider">
              {messagesList.length} Doa Terkirim
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {messagesList.map((item: any) => {
              const senderName =
                item.guest?.name || item.guestName || "Tamu Undangan";
              const initial = senderName.trim().charAt(0).toUpperCase() || "T";
              return (
                <div
                  key={item.id}
                  className="border border-[#ded7c8] p-4 bg-[#fbf9f4] shadow-2xs hover:border-[#b38e36]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 bg-[#eee8dc] border border-[#b38e36]/40 flex items-center justify-center shrink-0">
                      <span className="font-noir-serif text-[10px] text-[#9a792c]">
                        {initial}
                      </span>
                    </div>
                    <span className="font-noir-sans text-[10px] tracking-wider text-[#333333] font-medium">
                      {senderName}
                    </span>
                  </div>
                  <p className="font-noir-serif text-sm font-light text-[#4a4a4a] italic leading-relaxed pl-9">
                    &ldquo;{item.message}&rdquo;
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

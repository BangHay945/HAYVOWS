"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Send, Check, UserCheck, UserX, MessageSquare } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

const ease = [0.22, 1, 0.36, 1] as const;

export function CinematicIvoryRSVP({
  context,
  onRSVPSubmit,
  onTrack,
}: TemplateComponentProps) {
  const { guest, wedding, messages: initialMessages } = context;

  const [attendance, setAttendance] = useState<"attending" | "not_attending">(
    "attending"
  );
  const initialCount = guest?.guestCount ?? 1;
  const [count, setCount] = useState<number | string>(initialCount);
  const [isManualCount, setIsManualCount] = useState<boolean>(initialCount > 4);

  const handleCountDropdownChange = (val: string) => {
    if (val === "manual") {
      setIsManualCount(true);
      if (typeof count === "number" && count <= 4) {
        setCount(5);
      }
    } else {
      setIsManualCount(false);
      setCount(Number(val));
    }
  };

  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [messagesList, setMessagesList] = useState(
    initialMessages && initialMessages.length > 0
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

  const isDemo = Boolean(wedding?.isDemo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo || !guest) return;
    setErrorMessage(null);
    setLoading(true);

    try {
      const trimmedMessage = message.trim();

      const finalCount =
        attendance === "attending"
          ? Math.min(20, Math.max(1, Number(count) || 1))
          : 0;

      // 1. Submit unified RSVP + Ucapan via /api/rsvp (which persists both attendance and message)
      await onRSVPSubmit?.({
        guestId: guest.id,
        weddingId: wedding.id,
        attendanceStatus: attendance,
        guestCount: finalCount,
        message: trimmedMessage || undefined,
      });
      onTrack?.("rsvp_submit");

      // 2. Instantly display the new wish in the "Buku Doa Tamu" feed
      if (trimmedMessage) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          guest: { name: guest.name },
          guestName: guest.name,
          message: trimmedMessage,
          isPinned: false,
          createdAt: new Date(),
        };
        setMessagesList((prev: any) => [newMsg, ...prev]);
        setMessage("");
      }

      setRsvpSuccess(true);
      setTimeout(() => setRsvpSuccess(false), 5000);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Konfirmasi kehadiran gagal dikirim. Silakan coba kembali."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full bg-[#0c0d0e] flex flex-col items-center justify-center px-6 py-24 sm:py-28 overflow-hidden text-[#f5f3ef] z-10">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Eyebrow & Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease }}
        className="text-center mb-12 sm:mb-14"
      >
        <p className="font-ci-sans text-[8px] tracking-[0.5em] uppercase text-[#8a8b90] mb-3">
          RESERVASI &amp; DOA RESTU
        </p>
        <h2 className="font-ci-serif text-3xl sm:text-4xl font-light text-[#f5f3ef]">
          Kehadiran &amp; Doa Restu
        </h2>
        <div className="w-8 h-px bg-[#d4c4b0] mx-auto mt-4" />
      </motion.div>

      <div className="w-full max-w-lg mx-auto space-y-12">
        {/* ── Unified RSVP & Wishes Form Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="w-full bg-[#121316] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
        >
          {/* Guest name */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-ci-sans text-[8px] tracking-[0.4em] uppercase text-[#8a8b90]">
                Tamu Undangan
              </p>
              {guest?.name && (
                <span className="flex items-center gap-1 font-ci-sans text-[8px] tracking-[0.2em] uppercase text-[#d4c4b0]">
                  <Lock className="w-2.5 h-2.5" />
                  Terdaftar
                </span>
              )}
            </div>
            <p className="font-ci-serif text-xl font-light text-[#f5f3ef] italic">
              {guest?.name || "Tamu Terhormat"}
            </p>
            <div className="w-full h-px bg-white/10 mt-3" />
          </div>

          {/* Demo banner */}
          {isDemo && (
            <div className="text-center py-3 mb-6 border-b border-white/10">
              <p className="font-ci-sans text-[8px] tracking-[0.4em] uppercase text-[#8a8b90] mb-1">
                Mode Pratinjau Demo
              </p>
              <p className="font-ci-sans text-xs text-[#8a8b90] leading-relaxed">
                Pengisian konfirmasi kehadiran dan ucapan dinonaktifkan pada mode demo.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Attendance Options */}
            <div>
              <p className="font-ci-sans text-[8px] tracking-[0.4em] uppercase text-[#8a8b90] mb-3">
                Apakah Anda Berkenan Hadir?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isDemo}
                  onClick={() => !isDemo && setAttendance("attending")}
                  className={`py-3.5 px-4 rounded-xl border font-ci-sans text-[9px] tracking-[0.25em] uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                    isDemo ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                  } ${
                    attendance === "attending"
                      ? "border-[#d4c4b0] bg-[#d4c4b0] text-[#0c0d0e] font-medium shadow-sm"
                      : "border-white/10 text-[#b0b0b8] bg-white/[0.04] hover:border-white/30 hover:text-[#f5f3ef]"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Hadir</span>
                </button>

                <button
                  type="button"
                  disabled={isDemo}
                  onClick={() => !isDemo && setAttendance("not_attending")}
                  className={`py-3.5 px-4 rounded-xl border font-ci-sans text-[9px] tracking-[0.25em] uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                    isDemo ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                  } ${
                    attendance === "not_attending"
                      ? "border-[#d4c4b0] bg-[#d4c4b0] text-[#0c0d0e] font-medium shadow-sm"
                      : "border-white/10 text-[#b0b0b8] bg-white/[0.04] hover:border-white/30 hover:text-[#f5f3ef]"
                  }`}
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Berhalangan</span>
                </button>
              </div>
            </div>

            {/* Guest Count */}
            {attendance === "attending" && (
              <div className="space-y-3">
                <div>
                  <p className="font-ci-sans text-[8px] tracking-[0.4em] uppercase text-[#8a8b90] mb-2">
                    Jumlah Tamu yang Hadir
                  </p>
                  <select
                    disabled={isDemo}
                    value={isManualCount ? "manual" : String(count)}
                    onChange={(e) => handleCountDropdownChange(e.target.value)}
                    className={`w-full bg-white/[0.05] border border-white/10 rounded-xl focus:border-[#d4c4b0] text-[#f5f3ef] font-ci-sans text-xs px-3.5 py-2.5 focus:outline-none transition-colors appearance-none cursor-pointer ${
                      isDemo ? "cursor-not-allowed opacity-60" : ""
                    }`}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={String(n)} className="bg-[#121316] text-[#f5f3ef]">
                        {n} Orang
                      </option>
                    ))}
                    <option value="manual" className="bg-[#121316] text-[#d4c4b0]">
                      Lebih dari 4 Orang (Input Manual)
                    </option>
                  </select>
                </div>

                {isManualCount && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="font-ci-sans text-[8px] tracking-[0.4em] uppercase text-[#d4c4b0] mb-1.5">
                      Tuliskan Jumlah Tamu (&gt; 4 Orang)
                    </p>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={20}
                        disabled={isDemo}
                        value={count}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCount(val === "" ? "" : Math.max(1, parseInt(val) || 1));
                        }}
                        placeholder="Masukkan jumlah tamu (misal: 5)"
                        className={`w-full bg-white/[0.05] border border-[#d4c4b0]/40 rounded-xl focus:border-[#d4c4b0] text-[#f5f3ef] font-ci-sans text-xs px-3.5 py-2.5 focus:outline-none transition-colors ${
                          isDemo ? "cursor-not-allowed opacity-60" : ""
                        }`}
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-ci-sans text-[9px] uppercase tracking-wider text-[#8a8b90] pointer-events-none">
                        Orang
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Ucapan & Doa Restu (Integrated!) */}
            <div>
              <p className="font-ci-sans text-[8px] tracking-[0.4em] uppercase text-[#8a8b90] mb-2">
                Untaian Doa &amp; Ucapan Selamat
              </p>
              <textarea
                disabled={isDemo}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isDemo
                    ? "Ucapan dinonaktifkan pada mode demo."
                    : "Tuliskan ucapan dan doa restu terbaik Anda untuk kedua mempelai..."
                }
                className={`w-full bg-white/[0.04] border border-white/10 rounded-xl focus:border-[#d4c4b0] text-[#f5f3ef] font-ci-sans text-xs p-3.5 focus:outline-none resize-none placeholder:text-[#52535a] transition-colors ${
                  isDemo ? "cursor-not-allowed opacity-60" : ""
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

            {/* Error */}
            {errorMessage && (
              <p className="font-ci-sans text-[10px] text-red-400 leading-relaxed">
                {errorMessage}
              </p>
            )}

            {/* Success */}
            {rsvpSuccess && (
              <div className="flex items-center gap-2 text-[#d4c4b0] font-ci-sans text-[10px] tracking-wider">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Terima kasih! Konfirmasi kehadiran dan doa restu Anda telah kami terima.</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isDemo || loading || !guest}
              className={`w-full flex items-center justify-center gap-2 font-ci-sans text-[8.5px] tracking-[0.3em] uppercase py-3.5 rounded-full border transition-all duration-300 group ${
                isDemo || loading || !guest
                  ? "border-white/10 text-[#72737a] cursor-not-allowed opacity-60 bg-white/[0.02]"
                  : "border-[#d4c4b0]/60 text-[#f5f3ef] bg-white/[0.06] hover:bg-[#d4c4b0] hover:text-[#0c0d0e] cursor-pointer shadow-sm"
              }`}
            >
              {isDemo ? (
                <>
                  <Lock className="w-3 h-3 flex-shrink-0" />
                  <span>Pengisian Dinonaktifkan (Mode Demo)</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3 flex-shrink-0 text-[#d4c4b0] group-hover:text-[#0c0d0e] transition-colors duration-300" />
                  <span>{loading ? "Menyimpan..." : "Kirim Konfirmasi & Doa Restu"}</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* ── Guestbook Feed (Buku Doa Tamu) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="w-full bg-[#121316]/70 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
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

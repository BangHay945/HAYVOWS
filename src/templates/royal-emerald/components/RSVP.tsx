"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { TemplateComponentProps, RSVPSubmitData } from "@/types/template";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import { RoyalDivider, RoyalCrown } from "./Ornaments";

export function RoyalRSVP({ context, onRSVPSubmit }: TemplateComponentProps) {
  const { guest } = context;

  const [name, setName] = useState(guest?.name || "");
  const [attendance, setAttendance] = useState<"attending" | "declined">("attending");
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const data: RSVPSubmitData = {
        guestId: guest?.id || "",
        weddingId: context.wedding.id,
        attendanceStatus: attendance === "attending" ? "attending" : "not_attending",
        guestCount: attendance === "attending" ? guestCount : 0,
        message: message.trim() || undefined,
      };

      if (onRSVPSubmit) {
        await onRSVPSubmit(data);
      } else {
        // Fallback default API call
        await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weddingId: context.wedding.id,
            guestId: guest?.id,
            status: data.attendanceStatus,
            guestCount: data.guestCount,
            message: data.message,
          }),
        });
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("[ROYAL_RSVP_ERROR]", err);
      alert("Gagal mengirim konfirmasi. Silakan coba kembali.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full py-24 px-6 overflow-hidden bg-[#02241b] text-[#fdfbf7]">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <RoyalCrown className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#d4af37] font-semibold">
            Konfirmasi Kehadiran
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-normal tracking-wide mt-1">
            Reservasi Tamu
          </h2>
          <RoyalDivider className="max-w-[180px] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-[#b8c9c1] max-w-md mx-auto font-light leading-relaxed">
            Kehadiran serta doa restu Bapak/Ibu/Saudara/i merupakan kehormatan terbesar bagi kami.
          </p>
        </motion.div>

        {/* Form / Success Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full p-8 rounded-3xl bg-[#063c2f]/50 backdrop-blur-md border border-[#d4af37]/40 shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
        >
          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#064e3b] border border-[#d4af37] flex items-center justify-center mb-4 text-[#ffd700] shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-[#fdfbf7] font-semibold">
                Konfirmasi Berhasil
              </h3>
              <p className="text-xs sm:text-sm text-[#b8c9c1] mt-2 max-w-xs leading-relaxed">
                Terima kasih atas konfirmasi dan doa tulus yang Anda kirimkan. Sampai jumpa di hari bahagia kami!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-2">
                  Nama Anda
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso &amp; Partner"
                  className="w-full px-4 py-3 rounded-xl bg-[#02241b]/80 border border-[#d4af37]/35 text-[#fdfbf7] placeholder-[#b8c9c1]/40 text-sm focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
                />
              </div>

              {/* Attendance Choice */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-2">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttendance("attending")}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-serif tracking-wider font-semibold border transition-all cursor-pointer ${
                      attendance === "attending"
                        ? "border-[#d4af37] bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#02241b] shadow-md"
                        : "border-[#d4af37]/30 bg-[#02241b]/50 text-[#fdfbf7] hover:border-[#d4af37]/60"
                    }`}
                  >
                    Hadir
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance("declined")}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-serif tracking-wider font-semibold border transition-all cursor-pointer ${
                      attendance === "declined"
                        ? "border-[#d4af37] bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#02241b] shadow-md"
                        : "border-[#d4af37]/30 bg-[#02241b]/50 text-[#fdfbf7] hover:border-[#d4af37]/60"
                    }`}
                  >
                    Berhalangan
                  </button>
                </div>
              </div>

              {/* Guest Count (if attending) */}
              {attendance === "attending" && (
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-2">
                    Jumlah Tamu
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-[#02241b]/80 border border-[#d4af37]/35 text-[#fdfbf7] text-sm focus:outline-none focus:border-[#d4af37] transition-all cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num} className="bg-[#02241b] text-[#fdfbf7]">
                        {num} Orang
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Prayer Message */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-2">
                  Untaian Doa &amp; Harapan
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan doa restu dan ucapan selamat untuk kedua mempelai..."
                  className="w-full px-4 py-3 rounded-xl bg-[#02241b]/80 border border-[#d4af37]/35 text-[#fdfbf7] placeholder-[#b8c9c1]/40 text-sm focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-serif text-sm tracking-[0.2em] uppercase font-bold text-[#02241b] shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.6)] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #fff2cc 0%, #e5c158 50%, #aa820a 100%)",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#02241b]" />
                    <span>Mengirim Reservasi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#02241b]" />
                    <span>Kirim Konfirmasi</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

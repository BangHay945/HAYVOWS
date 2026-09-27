"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { TemplateComponentProps, RSVPSubmitData } from "@/types/template";
import { CheckCircle2, Send, Sparkles, UserCheck, UserX, Users } from "lucide-react";

export function EditorialRSVP({ context, onRSVPSubmit }: TemplateComponentProps) {
  const { wedding, guest } = context;

  const [status, setStatus] = useState<"attending" | "not_attending">("attending");
  const [pax, setPax] = useState(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onRSVPSubmit) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const data: RSVPSubmitData = {
        guestId: guest?.id || "guest-public",
        weddingId: wedding.id,
        attendanceStatus: status,
        guestCount: status === "attending" ? pax : 0,
        message: message.trim() || undefined,
      };

      await onRSVPSubmit(data);
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengirim konfirmasi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Foto background dinamis dari galeri
  const galleryPhotos = (wedding.galleries || []).map((g) => g.imageUrl);
  const rsvpBg =
    galleryPhotos[0] ||
    wedding.couple?.couplePhoto ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="relative w-full py-20 px-5 sm:px-6 overflow-hidden bg-[#0a0a0c] text-[#fdfbf7]">
      {/* ── AMBIENT PHOTO BACKGROUND DARI GALERI ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={rsvpBg}
          alt="Ambient RSVP"
          className="w-full h-full object-cover object-center opacity-25 filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-black/85 to-[#0a0a0c]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto space-y-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] tracking-[0.3em] uppercase font-mono text-[#e8d5b5]">
            <Sparkles className="w-3 h-3" />
            <span>ATTENDANCE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-light tracking-wide">
            Konfirmasi Kehadiran
          </h2>
          <p className="text-xs text-neutral-400 font-sans max-w-xs mx-auto">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
          </p>
        </motion.div>

        {/* RSVP Card / Form */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl space-y-5"
        >
          {isSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#fdfbf7]">
                Terima Kasih Banyak!
              </h3>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                Konfirmasi kehadiran &amp; untaian doa Anda telah berhasil kami simpan. Sampai jumpa di hari bahagia kami!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {guest && (
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
                  <span className="text-neutral-400 block text-[10px] uppercase font-mono tracking-wider">
                    Nama Tamu Terdaftar:
                  </span>
                  <span className="font-bold text-[#e8d5b5] text-sm block truncate">
                    {guest.name}
                  </span>
                </div>
              )}

              {/* Attendance Options */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono tracking-wider uppercase text-neutral-300">
                  Kepastian Hadir:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("attending")}
                    className={`py-3 px-3 rounded-xl text-xs font-mono tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      status === "attending"
                        ? "bg-[#e8d5b5] text-neutral-950 font-bold border-[#e8d5b5] shadow-md"
                        : "bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]"
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Hadir</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("not_attending")}
                    className={`py-3 px-3 rounded-xl text-xs font-mono tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      status === "not_attending"
                        ? "bg-neutral-800 text-white font-bold border-neutral-600 shadow-md"
                        : "bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]"
                    }`}
                  >
                    <UserX className="w-4 h-4" />
                    <span>Berhalangan</span>
                  </button>
                </div>
              </div>

              {/* Guest Count Pax (Jika Hadir) */}
              {status === "attending" && (
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-mono tracking-wider uppercase text-neutral-300">
                    Jumlah Orang yang Hadir:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPax(num)}
                        className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                          pax === num
                            ? "bg-[#e8d5b5] text-neutral-950 border-[#e8d5b5]"
                            : "bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]"
                        }`}
                      >
                        {num} Orang
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Prayer Message */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-mono tracking-wider uppercase text-neutral-300">
                  Untaian Doa &amp; Harapan:
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan ucapan dan doa restu untuk kedua mempelai..."
                  className="w-full rounded-xl bg-white/[0.04] border border-white/15 p-3 text-xs text-[#fdfbf7] placeholder:text-neutral-500 focus:outline-none focus:border-[#e8d5b5] transition-colors resize-none font-sans"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  {errorMsg}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#e8d5b5] hover:bg-[#f3e7cf] active:scale-[0.98] text-[#111115] font-bold text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-[#111115]" />
                <span>{isSubmitting ? "Mengirim..." : "Kirim Konfirmasi Kehadiran"}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

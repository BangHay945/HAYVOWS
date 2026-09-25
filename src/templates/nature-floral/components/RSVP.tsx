"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { Lock } from "lucide-react";
import { playFloralSound } from "../sound";

export function FloralRSVP({ context, onRSVPSubmit, onTrack }: TemplateComponentProps) {
  const { guest, wedding } = context;
  const isDemo = Boolean(wedding?.isDemo);
  const [attendance, setAttendance] = useState<"attending" | "not_attending">("attending");
  const [count, setCount] = useState(guest?.guestCount ?? 1);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo || !guest) return;
    setErrorMessage(null);
    setLoading(true);
    try {
      await onRSVPSubmit?.({
        guestId: guest.id,
        weddingId: wedding.id,
        attendanceStatus: attendance,
        guestCount: count,
        message,
      });
      onTrack?.("rsvp_submit");
      playFloralSound("success");
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err?.message || "Konfirmasi kehadiran gagal dikirim. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="section-rsvp" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#fbf8f3]">
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl bg-white p-8 text-center border border-[#c5a880] shadow-sm">
            <span className="text-4xl block mb-3">🌿</span>
            <h3 className="font-serif-floral text-2xl font-bold text-[#2d4a3e]">
              Terima Kasih!
            </h3>
            <p className="text-sm text-[#63756b] mt-2 leading-relaxed">
              Konfirmasi kehadiran Anda telah berhasil kami catat. Merupakan suatu kehormatan dan kebahagiaan bagi kami atas kehadiran Anda.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="section-rsvp" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#fbf8f3]">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-white p-7 sm:p-9 border border-[#d8cfc4] shadow-xs"
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-[#5a7263] mb-1">
              <span className="text-sm">💌</span>
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase">
                RSVP ONLINE
              </span>
              <span className="text-sm">💌</span>
            </div>
            <h2 className="font-serif-floral text-2xl font-bold text-[#2d4a3e]">
              Konfirmasi Kehadiran
            </h2>
            <p className="text-xs text-[#63756b] mt-1.5 leading-relaxed">
              Mohon konfirmasi kehadiran Anda untuk membantu kami mempersiapkan jamuan terbaik.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {isDemo && (
              <div className="p-3.5 rounded-xl bg-[#fcfaf7] border border-[#e8ded1] text-center space-y-1 mb-2">
                <span className="text-[10px] font-bold text-[#2d4a3e] uppercase tracking-wider block">
                  Mode Pratinjau Demo
                </span>
                <p className="text-[11px] text-[#63756b] leading-relaxed">
                  Halaman pratinjau demo. Pengisian konfirmasi kehadiran dan ucapan dinonaktifkan.
                </p>
              </div>
            )}

            <div>
              <label className="block text-[#4a5e52] font-semibold mb-1">
                Nama Tamu
              </label>
              <input
                type="text"
                disabled
                value={guest?.name || "Tamu Undangan"}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcfaf7] border border-[#e8ded1] text-[#2d4a3e] font-medium opacity-90 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[#4a5e52] font-semibold mb-1.5">
                Rencana Kehadiran
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isDemo}
                  onClick={() => !isDemo && setAttendance("attending")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isDemo ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                  } ${
                    attendance === "attending"
                      ? "bg-[#2d4a3e] text-white border-[#2d4a3e] shadow-2xs"
                      : "bg-[#fcfaf7] text-[#4a5e52] border-[#e8ded1] hover:bg-[#e8eee5]"
                  }`}
                >
                  <span>✓</span>
                  <span>Hadir</span>
                </button>
                <button
                  type="button"
                  disabled={isDemo}
                  onClick={() => !isDemo && setAttendance("not_attending")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isDemo ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                  } ${
                    attendance === "not_attending"
                      ? "bg-[#8a4239] text-white border-[#8a4239] shadow-2xs"
                      : "bg-[#fcfaf7] text-[#4a5e52] border-[#e8ded1] hover:bg-[#f7ecea]"
                  }`}
                >
                  <span>✕</span>
                  <span>Tidak Hadir</span>
                </button>
              </div>
            </div>

            {attendance === "attending" && (
              <div>
                <label className="block text-[#4a5e52] font-semibold mb-1">
                  Jumlah Tamu
                </label>
                <select
                  disabled={isDemo}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-[#e8ded1] text-[#2d4a3e] font-medium ${
                    isDemo ? "bg-slate-100/90 cursor-not-allowed opacity-75" : "bg-[#fcfaf7]"
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

            <div>
              <label className="block text-[#4a5e52] font-semibold mb-1">
                Pesan Ucapan &amp; Doa Restu
              </label>
              <textarea
                rows={3}
                disabled={isDemo}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isDemo
                    ? "Pengisian ucapan dan doa restu dinonaktifkan pada mode demo."
                    : "Tuliskan ucapan selamat dan doa untuk kedua mempelai..."
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border border-[#e8ded1] text-xs transition-colors resize-none ${
                  isDemo
                    ? "bg-slate-100/80 text-slate-500 cursor-not-allowed"
                    : "bg-[#fcfaf7] text-[#2d4a3e] placeholder-[#9ca3af] focus:outline-[#2d4a3e] focus:bg-white"
                }`}
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center animate-in fade-in">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isDemo || loading || !guest}
              className={`w-full mt-2 py-3.5 px-6 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 ${
                isDemo || loading || !guest
                  ? "bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed"
                  : "bg-[#2d4a3e] hover:bg-[#233a30] text-[#fbf8f3] cursor-pointer"
              }`}
            >
              {isDemo ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pengisian Dinonaktifkan (Mode Demo)</span>
                </>
              ) : loading ? (
                <span>Mengirim Konfirmasi...</span>
              ) : (
                <span>Kirim Konfirmasi Kehadiran</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

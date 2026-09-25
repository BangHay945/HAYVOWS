"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Users,
  Send,
  Sparkles,
  QrCode,
  ExternalLink,
  MessageSquareHeart,
  Phone,
  User,
} from "lucide-react";
import { GuestTicketModal } from "@/components/invitation/GuestTicketModal";

interface PublicRSVPClientProps {
  weddingId: string;
  weddingSlug: string;
  coupleTitle: string;
  groomName: string;
  brideName: string;
  couplePhoto: string | null;
  eventDate: string;
  eventVenue: string;
  eventAddress: string;
  templateSlug: string;
}

export default function PublicRSVPClient({
  weddingId,
  weddingSlug,
  coupleTitle,
  groomName,
  brideName,
  couplePhoto,
  eventDate,
  eventVenue,
  eventAddress,
  templateSlug,
}: PublicRSVPClientProps) {
  const [guestName, setGuestName] = useState("");
  const [guestAddress, setGuestAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<"attending" | "not_attending">("attending");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedGuest, setSubmittedGuest] = useState<any | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Restore previous submission from localStorage on this device
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`hvw_public_rsvp_${weddingSlug}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          setSubmittedGuest(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [weddingSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMessage("Mohon masukkan nama lengkap Anda.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weddingId,
          guestName: guestName.trim(),
          guestAddress: guestAddress.trim() || undefined,
          phone: phone.trim() || undefined,
          attendanceStatus,
          guestCount: attendanceStatus === "attending" ? guestCount : 1,
          message: message.trim() || undefined,
          source: "printed_qr",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim konfirmasi kehadiran.");
      }

      setSubmittedGuest(data.guest);

      // Save to localStorage for instant recall when scanning again
      try {
        localStorage.setItem(`hvw_public_rsvp_${weddingSlug}`, JSON.stringify(data.guest));
      } catch {
        // ignore
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kendala saat mengirim RSVP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedGuest(null);
    setGuestName("");
    setGuestAddress("");
    setPhone("");
    setMessage("");
    try {
      localStorage.removeItem(`hvw_public_rsvp_${weddingSlug}`);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 relative overflow-hidden font-sans select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto w-full space-y-6 my-auto">
        {/* Header Branding Card */}
        <div className="text-center space-y-3 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md shadow-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#fef08a] text-[11px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RSVP &bull; Undangan Pernikahan</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-wide">
            {coupleTitle}
          </h1>

          {(eventDate || eventVenue) && (
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/70 pt-1">
              {eventDate && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#c9a84c]" />
                  <span>{eventDate}</span>
                </span>
              )}
              {eventVenue && (
                <>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#c9a84c]" />
                    <span>{eventVenue}</span>
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {submittedGuest ? (
            /* ──────── Success State: Digital Pass Ready ──────── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/95 border-2 border-emerald-500/60 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-xl text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                  Konfirmasi Berhasil Diterima!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Terima kasih, <strong>{submittedGuest.name}</strong>. Respon kehadiran Anda telah tercatat pada buku tamu mempelai.
                </p>
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200/90 leading-relaxed text-left flex items-start gap-2 mt-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Tips Tamu:</strong> Silakan buka dan unduh tiket QR di bawah ini atau ambil tangkapan layar (<em>screenshot</em>) untuk ditunjukkan kepada penerima tamu di lokasi resepsi.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(true)}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Buka &amp; Simpan Tiket Presensi QR</span>
                </button>

                <Link
                  href={`/invitation/${weddingSlug}`}
                  className="w-full py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-[#fef08a]" />
                  <span>Buka Undangan Web Lengkap</span>
                </Link>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2.5 px-4 text-slate-400 hover:text-white text-xs underline cursor-pointer transition-colors"
                >
                  Ubah Konfirmasi Kehadiran / Isi Tamu Lain
                </button>
              </div>
            </motion.div>
          ) : (
            /* ──────── Form State ──────── */
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleSubmit}
              className="bg-slate-900/90 border border-white/15 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-xl space-y-5"
            >
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 font-serif">
                  <MessageSquareHeart className="w-5 h-5 text-[#c9a84c]" />
                  <span>Formulir Konfirmasi Kehadiran</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mohon lengkapi data di bawah ini untuk rekap kehadiran dan estimasi katering.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#c9a84c]" />
                  <span>Nama Lengkap <strong className="text-rose-400">*</strong></span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bapak Ir. Hartono &amp; Keluarga"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                />
              </div>

              {/* Asal Domisili / Hubungan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c9a84c]" />
                  <span>Asal Domisili / Hubungan (Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Keluarga Semarang / Rekan Kantor"
                  value={guestAddress}
                  onChange={(e) => setGuestAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                />
              </div>

              {/* No WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#c9a84c]" />
                  <span>Nomor WhatsApp (Opsional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                />
              </div>

              {/* Status Kehadiran Radio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Konfirmasi Kehadiran:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttendanceStatus("attending")}
                    className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      attendanceStatus === "attending"
                        ? "bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-md"
                        : "bg-white/5 border-white/15 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Akan Hadir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttendanceStatus("not_attending")}
                    className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      attendanceStatus === "not_attending"
                        ? "bg-rose-600/30 border-rose-400 text-rose-300 shadow-md"
                        : "bg-white/5 border-white/15 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tidak Hadir</span>
                  </button>
                </div>
              </div>

              {/* Jumlah Pax (Jika Hadir) */}
              {attendanceStatus === "attending" && (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#c9a84c]" />
                      <span>Jumlah Orang Hadir (Pax):</span>
                    </span>
                    <span className="font-bold text-[#fef08a]">{guestCount} Orang</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestCount(num)}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          guestCount === num
                            ? "bg-[#c9a84c] text-slate-950 border-[#c9a84c] shadow-md"
                            : "bg-white/5 border-white/15 text-white/80 hover:bg-white/15"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ucapan Doa Restu */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Untaian Doa &amp; Harapan:
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Mengirim Respon..." : "Kirim Konfirmasi Kehadiran"}</span>
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="text-center text-[11px] text-white/50">
          <p>Powered by Hayvows Wedding Experience</p>
        </div>
      </div>

      {/* Interactive Ticket Modal on Demand */}
      {submittedGuest && (
        <GuestTicketModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          guestName={submittedGuest.name}
          guestSlug={submittedGuest.slug}
          guestAddress={submittedGuest.address}
          guestCategory={submittedGuest.category}
          guestCount={submittedGuest.guestCount}
          tableNumber={submittedGuest.tableNumber}
          sessionName={submittedGuest.sessionName}
          coupleTitle={coupleTitle}
          eventDate={eventDate}
          venueName={eventVenue}
          qrCode={submittedGuest.qrCode}
          weddingSlug={weddingSlug}
          templateSlug={templateSlug}
        />
      )}
    </div>
  );
}

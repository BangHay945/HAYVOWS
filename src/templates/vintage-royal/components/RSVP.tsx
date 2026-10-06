"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send, UserCheck, UserX, Lock } from "lucide-react";
import type { TemplateComponentProps, RSVPSubmitData } from "@/types/template";
import type { GuestMessage } from "@/types/wedding";
import { isDemoWedding } from "@/lib/demo";

const EASE = [0.22, 1, 0.36, 1] as const;

type AttendanceStatus = "attending" | "not_attending";

export function VintageRoyalRSVP({ context, onRSVPSubmit }: TemplateComponentProps) {
  const { wedding, guest } = context;
  const isDemo = Boolean(wedding?.isDemo || isDemoWedding(wedding?.slug));

  const [status, setStatus] = useState<AttendanceStatus>("attending");
  const initialPax = guest?.guestCount ?? 1;
  const [pax, setPax] = useState<number | string>(initialPax);
  const [isManualPax, setIsManualPax] = useState<boolean>(initialPax > 4);
  const [phone, setPhone] = useState(guest?.phone || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [localMessages, setLocalMessages] = useState<GuestMessage[]>(context.messages ?? []);

  const handlePaxChange = (val: string) => {
    if (val === "manual") {
      setIsManualPax(true);
      if (typeof pax === "number" && pax <= 4) setPax(5);
    } else {
      setIsManualPax(false);
      setPax(Number(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const finalPax =
        status === "attending" ? Math.min(20, Math.max(1, Number(pax) || 1)) : 0;

      if (onRSVPSubmit) {
        const data: RSVPSubmitData = {
          guestId: guest?.id ?? "",
          weddingId: wedding.id,
          attendanceStatus: status,
          guestCount: finalPax,
          phone: phone.trim() || undefined,
          message: message.trim() || undefined,
        };
        await onRSVPSubmit(data);
      }

      if (message.trim()) {
        const newMsg: GuestMessage = {
          id: "msg-" + Date.now(),
          weddingId: wedding?.id || "",
          guestId: guest?.id || "",
          guest: { name: guest?.name || "Tamu Undangan" },
          message: message.trim(),
          status: "approved",
          isPinned: false,
          createdAt: new Date(),
        };
        setLocalMessages((prev) => [newMsg, ...prev]);
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err?.message || "Konfirmasi gagal dikirim. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const inputClass = `w-full px-4 py-2.5 rounded-xl bg-[#141517] border border-white/10 text-xs text-[#f8f6f0] placeholder:text-[#7c7970] focus:outline-none focus:border-[#d5be9b] transition-colors ${
    isDemo ? "cursor-not-allowed opacity-70" : ""
  }`;

  return (
    <section className="relative w-full px-5 sm:px-8 py-16 sm:py-24 bg-[#141517]/90 backdrop-blur-md border-b border-white/5">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center mb-12 space-y-3"
      >
        <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.3em] text-[#d5be9b] uppercase">
          Konfirmasi Kehadiran
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#f8f6f0] tracking-wide">
          RSVP &amp; Doa Restu
        </h2>
        <div className="w-10 h-px bg-[#d5be9b]/40 mx-auto mt-2" />
        <p className="max-w-md mx-auto text-xs sm:text-sm text-[#b8b5ad] font-serif italic pt-1">
          Merupakan suatu kehormatan bagi kami atas kehadiran serta untaian doa restu Bapak/Ibu/Saudara/i.
        </p>
      </motion.div>

      <div className="max-w-md mx-auto">
        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="bg-[#1c1e22]/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl"
        >
          {/* Guest identity */}
          <div className="pb-4 mb-5 border-b border-white/10">
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#7c7970] uppercase block">
              Tamu Undangan
            </span>
            <span className="text-lg font-serif text-[#f8f6f0]">
              {guest?.name || "Tamu Undangan"}
            </span>
          </div>

          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#d5be9b]/15 text-[#d5be9b] border border-[#d5be9b]/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif text-[#f8f6f0]">Terima Kasih</h3>
              <p className="text-xs text-[#b8b5ad] leading-relaxed max-w-xs mx-auto">
                Konfirmasi kehadiran &amp; doa restu Anda telah kami terima dengan penuh syukur.
              </p>
              {phone.trim() && status === "attending" && (
                <div className="p-3.5 rounded-xl bg-[#141517] border border-[#d5be9b]/25 text-xs text-[#b8b5ad] text-left mt-3">
                  <p className="font-semibold text-[#f8f6f0]">E-Tiket QR Terkirim ke WhatsApp</p>
                  <p className="text-[11px] mt-0.5">
                    Barcode QR kehadiran telah dikirim ke nomor <strong className="text-[#d5be9b]">{phone}</strong>.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {isDemo && (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#141517] border border-[#d5be9b]/30 text-xs">
                  <span className="font-mono font-bold text-[9px] uppercase tracking-wider bg-[#d5be9b]/15 border border-[#d5be9b]/40 text-[#d5be9b] px-2 py-0.5 rounded-full shrink-0">
                    Mode Demo
                  </span>
                  <span className="text-[#b8b5ad] leading-snug">
                    Pengisian RSVP &amp; doa restu dinonaktifkan pada pratinjau demo.
                  </span>
                </div>
              )}

              {/* Attendance */}
              <div className="space-y-2">
                <label className="text-[11px] font-sans tracking-wider text-[#d5be9b] uppercase block">
                  Kehadiran
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(
                    [
                      { val: "attending", label: "Hadir", Icon: UserCheck },
                      { val: "not_attending", label: "Berhalangan", Icon: UserX },
                    ] as const
                  ).map(({ val, label, Icon }) => (
                    <button
                      key={val}
                      type="button"
                      disabled={isDemo}
                      onClick={() => setStatus(val)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                        isDemo ? "cursor-not-allowed opacity-70" : "cursor-pointer"
                      } ${
                        status === val
                          ? "bg-[#d5be9b] text-[#141517] border-[#d5be9b] font-semibold shadow-[0_8px_30px_rgba(213,190,155,0.25)]"
                          : "bg-[#141517] text-[#b8b5ad] border-white/10 hover:border-[#d5be9b]/40"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pax */}
              {status === "attending" && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans tracking-wider text-[#d5be9b] uppercase block">
                      Jumlah Tamu
                    </label>
                    <select
                      disabled={isDemo}
                      value={isManualPax ? "manual" : String(pax)}
                      onChange={(e) => handlePaxChange(e.target.value)}
                      className={`${inputClass} cursor-pointer`}
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={String(n)} className="bg-[#1c1e22]">
                          {n} Orang
                        </option>
                      ))}
                      <option value="manual" className="bg-[#1c1e22]">
                        Lebih dari 4 Orang (Input Manual)
                      </option>
                    </select>
                  </div>
                  {isManualPax && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="relative"
                    >
                      <input
                        type="number"
                        min={1}
                        max={20}
                        disabled={isDemo}
                        value={pax}
                        onChange={(e) => {
                          const v = e.target.value;
                          setPax(v === "" ? "" : Math.max(1, parseInt(v) || 1));
                        }}
                        className={inputClass}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-[#7c7970] pointer-events-none">
                        Orang
                      </span>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans tracking-wider text-[#d5be9b] uppercase block">
                  Nomor WhatsApp (Opsional)
                </label>
                <input
                  type="tel"
                  disabled={isDemo}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx — untuk menerima e-tiket QR"
                  className={inputClass}
                />
              </div>

              {/* Wishes */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans tracking-wider text-[#d5be9b] uppercase block">
                  Ucapan &amp; Doa Restu
                </label>
                <textarea
                  rows={3}
                  disabled={isDemo}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isDemo
                      ? "Pengisian ucapan dinonaktifkan pada mode demo."
                      : "Tuliskan ucapan dan doa restu untuk kedua mempelai..."
                  }
                  className={`${inputClass} resize-none`}
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200">
                  {errorMsg}
                </div>
              )}

              {/* Submit — charcoal default, accent on hover */}
              <button
                type="submit"
                disabled={isDemo || loading}
                className={`w-full h-12 rounded-xl border text-xs font-sans font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 group ${
                  isDemo
                    ? "bg-[#141517] border-white/10 text-[#7c7970] cursor-not-allowed"
                    : "bg-[#18191d] hover:bg-[#d5be9b] border-[#d5be9b]/40 hover:border-[#d5be9b] text-[#f8f6f0] hover:text-[#141517] hover:shadow-[0_8px_30px_rgba(213,190,155,0.35)] cursor-pointer active:scale-[0.98] disabled:opacity-60"
                }`}
              >
                {isDemo ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Dinonaktifkan (Mode Demo)</span>
                  </>
                ) : loading ? (
                  <span>Mengirim...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#d5be9b] group-hover:text-[#141517] transition-colors" />
                    <span className="group-hover:text-[#141517] transition-colors">Kirim Konfirmasi</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Guest Wishes List */}
        {localMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="mt-14"
          >
            <div className="text-center mb-6 space-y-2">
              <div className="w-8 h-px bg-[#d5be9b]/40 mx-auto" />
              <h3 className="text-xl sm:text-2xl font-serif text-[#f8f6f0] tracking-wide">
                Untaian Doa Tamu
              </h3>
              <p className="text-[11px] font-sans tracking-[0.2em] text-[#7c7970] uppercase">
                {localMessages.length} Ucapan
              </p>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 [scrollbar-width:thin]">
              {localMessages.map((msg, idx) => {
                const name = msg.guest?.name ?? "Tamu Undangan";
                return (
                  <motion.div
                    key={msg.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3), ease: EASE }}
                    className="flex gap-3.5 items-start p-4 rounded-2xl bg-[#1c1e22]/80 border border-white/10"
                  >
                    <div className="shrink-0 w-9 h-9 rounded-full bg-[#141517] border border-[#d5be9b]/40 text-[#d5be9b] flex items-center justify-center text-[11px] font-serif">
                      {getInitials(name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-serif text-[#f8f6f0] truncate">{name}</p>
                        {msg.createdAt && (
                          <span className="text-[10px] text-[#7c7970] font-mono shrink-0">
                            {new Date(msg.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#b8b5ad] italic leading-relaxed font-serif">
                        &ldquo;{msg.message}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

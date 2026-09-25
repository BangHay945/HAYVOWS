"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

export function PixelRSVP({ context, onRSVPSubmit, onTrack }: TemplateComponentProps) {
  const { guest, wedding } = context;
  const [attendance, setAttendance] = useState<"attending" | "not_attending">("attending");
  const [count, setCount] = useState(guest?.guestCount ?? 1);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest) return;
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
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="bg-[#F2F2F2] py-16 px-6">
        <div className="max-w-md mx-auto">
          <div className="border-4 border-[#111] bg-white p-8 text-center shadow-[8px_8px_0px_#FFD700]">
            <p className="font-mono text-4xl mb-4">✅</p>
            <h3 className="font-mono text-xl font-bold">RESPONSE SAVED!</h3>
            <p className="font-mono text-sm text-[#555] mt-2">Terima kasih, {guest?.name}!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F2F2F2] py-16 px-6">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-4 border-[#111111] bg-white shadow-[8px_8px_0px_#111111]"
        >
          <div className="bg-[#111111] text-[#FFD700] font-mono text-center p-4 text-sm">
            ╔══════════════════╗<br />
            ║  JOIN THE PARTY  ║<br />
            ╚══════════════════╝
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="font-mono text-xs text-[#888] block mb-1">PLAYER NAME</label>
              <div className="border-4 border-[#111] bg-[#F2F2F2] p-3 font-mono text-sm">
                {guest?.name ?? "Guest (Preview)"}
              </div>
            </div>
            <div>
              <label className="font-mono text-xs text-[#888] block mb-2">ATTENDANCE</label>
              <div className="space-y-2">
                {(["attending", "not_attending"] as const).map((val) => (
                  <label key={val} className="flex items-center gap-3 cursor-pointer font-mono text-sm">
                    <input
                      type="radio"
                      value={val}
                      checked={attendance === val}
                      onChange={() => setAttendance(val)}
                      className="w-4 h-4"
                    />
                    {val === "attending" ? "✅ I'M IN!" : "❌ CAN'T JOIN"}
                  </label>
                ))}
              </div>
            </div>
            {attendance === "attending" && (
              <div>
                <label className="font-mono text-xs text-[#888] block mb-1">PARTY SIZE</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCount(Math.max(1, count - 1))}
                    className="border-4 border-[#111] w-10 h-10 font-mono font-bold hover:bg-[#FFD700] transition-colors"
                  >
                    -
                  </button>
                  <span className="font-mono text-xl font-bold w-8 text-center">{count}</span>
                  <button
                    type="button"
                    onClick={() => setCount(Math.min(10, count + 1))}
                    className="border-4 border-[#111] w-10 h-10 font-mono font-bold hover:bg-[#FFD700] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            <div>
              <label className="font-mono text-xs text-[#888] block mb-1">MESSAGE</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis ucapan..."
                rows={3}
                className="w-full border-4 border-[#111] p-3 font-mono text-sm resize-none focus:outline-none focus:border-[#FFD700]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFD700] text-[#111] font-mono font-bold py-4 border-b-4 border-[#B8860B] hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? "SENDING..." : "[ SEND MESSAGE ]"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function FloralCountdown({ context }: TemplateComponentProps) {
  const events = context.wedding.events ?? [];
  const firstEvent = events[0];
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!firstEvent?.date) return;
    const target = new Date(firstEvent.date + "T" + (firstEvent.startTime || "00:00"));
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [firstEvent]);

  const boxes = [
    { label: "Hari", value: time.days },
    { label: "Jam", value: time.hours },
    { label: "Menit", value: time.minutes },
    { label: "Detik", value: time.seconds },
  ];

  const handleCalendar = () => {
    if (!firstEvent?.date) return;
    const title = encodeURIComponent(
      `Pernikahan ${context.wedding.couple?.groomNickname || "Alex"} & ${context.wedding.couple?.brideNickname || "Sara"}`
    );
    const details = encodeURIComponent("Undangan Pernikahan - Mohon Doa Restu");
    const location = encodeURIComponent(firstEvent.venue || "");
    const dateFormatted = firstEvent.date.replace(/-/g, "");
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateFormatted}T090000Z/${dateFormatted}T140000Z`;
    window.open(googleCalUrl, "_blank");
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#fbf8f3] text-center">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-center gap-2 text-[#5a7263]">
            <span className="text-sm">⏳</span>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase">
              SAVE THE DATE
            </span>
            <span className="text-sm">⏳</span>
          </div>

          <h2 className="font-serif-floral text-2xl sm:text-3xl font-semibold text-[#2d4a3e]">
            Menghitung Hari Bahagia
          </h2>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 pt-2">
            {boxes.map(({ label, value }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-3 sm:p-4 border border-[#d8cfc4] shadow-xs flex flex-col items-center justify-center"
              >
                <p className="font-serif-floral text-2xl sm:text-3xl font-bold text-[#2d4a3e]">
                  {pad(value)}
                </p>
                <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#7a8c7e] uppercase mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {firstEvent?.date && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCalendar}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#2d4a3e] hover:text-[#fbf8f3] text-[#2d4a3e] text-xs font-semibold border border-[#c5a880] shadow-xs transition-all cursor-pointer"
              >
                <span>📅</span>
                <span>Ingatkan di Google Calendar</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

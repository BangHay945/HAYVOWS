"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Calendar } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function useCountdown(targetDate: string) {
  const [diff, setDiff] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    passed: false,
  });

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();
    const update = () => {
      const now = Date.now();
      const delta = target - now;
      if (delta <= 0) {
        setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: true });
        return;
      }
      setDiff({
        days: Math.floor(delta / 86400000),
        hours: Math.floor((delta % 86400000) / 3600000),
        minutes: Math.floor((delta % 3600000) / 60000),
        seconds: Math.floor((delta % 60000) / 1000),
        passed: false,
      });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return diff;
}

export function NoirEvent({ context }: TemplateComponentProps) {
  const events = context.wedding.events ?? [];
  const mainEvent = events[0];
  const { days, hours, minutes, seconds, passed } = useCountdown(
    mainEvent?.date || ""
  );

  const countdownUnits = [
    { label: "Hari", value: days },
    { label: "Jam", value: hours },
    { label: "Menit", value: minutes },
    { label: "Detik", value: seconds },
  ];

  if (events.length === 0) return null;

  return (
    <section className="relative w-full bg-[#f4efe6] flex flex-col items-center justify-center px-6 py-20 sm:py-28 overflow-hidden">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b38e36]/35 to-transparent" />

      {/* Eyebrow & Title */}
      <div className="text-center mb-12">
        <p className="font-noir-sans text-[9px] tracking-[0.45em] uppercase text-[#7d7568] mb-3">
          Waktu &amp; Tempat
        </p>
        <h2 className="font-noir-serif text-3xl sm:text-4xl font-light text-[#171717] tracking-wide">
          Hari Pernikahan
        </h2>
        <div className="w-8 h-px bg-[#b38e36] mx-auto mt-4" />
      </div>

      {/* Countdown Timer Block */}
      {mainEvent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-2xl mx-auto mb-6 bg-[#fbf9f4] border border-[#ded7c8] p-6 sm:p-8 text-center shadow-xs"
        >
          <p className="font-noir-sans text-[9px] tracking-[0.35em] uppercase text-[#9a792c] mb-6 font-medium">
            {passed ? "Hari Bahagia Telah Tiba" : "Menuju Hari Istimewa"}
          </p>

          {!passed && (
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto mb-6">
              {countdownUnits.map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-[#eee8dc] border border-[#ded7c8] py-3 sm:py-4 px-2 flex flex-col items-center justify-center shadow-2xs"
                >
                  <span className="font-noir-serif text-2xl sm:text-4xl font-light text-[#171717] leading-none tabular-nums">
                    {pad(value)}
                  </span>
                  <span className="font-noir-sans text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-[#7d7568] mt-2 font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <p className="font-noir-serif text-sm sm:text-base italic text-[#2d2d2d] font-light">
              {new Date(mainEvent.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <span className="hidden sm:inline-block text-[#b38e36]">•</span>
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                `Pernikahan ${context.wedding.couple?.groomNickname || ""} & ${context.wedding.couple?.brideNickname || ""}`
              )}&dates=${mainEvent.date.replace(/-/g, "")}T080000Z/${mainEvent.date.replace(/-/g, "")}T150000Z&details=${encodeURIComponent(mainEvent.venue)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#222222] hover:border-[#b38e36] text-[#222222] hover:text-[#9a792c] font-noir-sans text-[9px] tracking-[0.25em] uppercase px-5 py-2.5 transition-all duration-300 shadow-2xs"
            >
              <Calendar className="w-3 h-3 text-[#9a792c]" />
              Simpan ke Kalender
            </a>
          </div>
        </motion.div>
      )}

      {/* Event Cards */}
      <div className="w-full max-w-md mx-auto flex flex-col gap-6">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.7 }}
            className="border border-[#ded7c8] p-7 flex flex-col gap-4 bg-[#fbf9f4] shadow-xs group hover:border-[#b38e36]/50 transition-colors duration-300"
          >
            {/* Event number */}
            <div className="flex items-start justify-between">
              <span className="font-noir-serif text-5xl sm:text-6xl font-light text-[#e5dfd2] leading-none select-none">
                0{i + 1}
              </span>
              <div className="w-6 h-px bg-[#b38e36] mt-4" />
            </div>

            {/* Event title */}
            <h3 className="font-noir-serif text-xl sm:text-2xl font-light text-[#171717] tracking-wide -mt-2">
              {event.title}
            </h3>

            {/* Date */}
            <p className="font-noir-sans text-[10px] tracking-[0.25em] uppercase text-[#9a792c] font-medium">
              {new Date(event.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            {/* Time */}
            <div className="flex items-center gap-2 text-[#444444]">
              <Clock className="w-3.5 h-3.5 shrink-0 text-[#9a792c]" />
              <span className="font-noir-sans text-[10px] tracking-wider text-[#444444]">
                {event.startTime}
                {event.endTime ? ` — ${event.endTime}` : ""} WIB
              </span>
            </div>

            {/* Venue */}
            <div className="flex items-start gap-2 text-[#444444]">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#9a792c]" />
              <div>
                <p className="font-noir-sans text-xs text-[#222222] font-medium leading-snug">
                  {event.venue}
                </p>
                {event.address && (
                  <p className="font-noir-sans text-[10px] text-[#666666] mt-0.5 leading-relaxed">
                    {event.address}
                  </p>
                )}
              </div>
            </div>

            {/* Maps link */}
            {event.mapsUrl && (
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto border border-[#ded7c8] hover:border-[#b38e36] text-[#444444] hover:text-[#9a792c] font-noir-sans text-[9px] tracking-[0.3em] uppercase px-4 py-2.5 text-center transition-all duration-300"
              >
                Petunjuk Arah
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

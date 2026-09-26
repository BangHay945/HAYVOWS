"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { Calendar, Clock, MapPin, Navigation, CalendarPlus } from "lucide-react";
import { RoyalDivider, RoyalCorner, RoyalCrown } from "./Ornaments";

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

export function RoyalEvent({ context }: TemplateComponentProps) {
  const events = context.wedding.events ?? [];
  const mainEvent = events[0];
  const { days, hours, minutes, seconds, passed } = useCountdown(mainEvent?.date || "");

  const countdownUnits = [
    { label: "Hari", value: days },
    { label: "Jam", value: hours },
    { label: "Menit", value: minutes },
    { label: "Detik", value: seconds },
  ];

  const groom = context.wedding.couple?.groomNickname || context.wedding.couple?.groomName || "Mempelai Pria";
  const bride = context.wedding.couple?.brideNickname || context.wedding.couple?.brideName || "Mempelai Wanita";
  const mainTitleEncoded = encodeURIComponent(`The Wedding of ${groom} & ${bride}`);
  const mainLocationEncoded = encodeURIComponent(
    `${mainEvent?.venue || ""} ${mainEvent?.address || ""}`.trim()
  );
  const mainDateClean = mainEvent?.date ? mainEvent.date.replace(/-/g, "") : "";
  const mainCalUrl = mainEvent
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${mainTitleEncoded}&dates=${mainDateClean}T010000Z/${mainDateClean}T140000Z&location=${mainLocationEncoded}`
    : "#";

  if (events.length === 0) return null;

  return (
    <section className="relative w-full py-24 px-6 overflow-hidden bg-[#022c22] text-[#fdfbf7]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,78,59,0.3)_0%,rgba(2,44,34,0.95)_70%,rgba(2,20,15,1)_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <RoyalCrown className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#d4af37] font-semibold">
            Rangkaian Acara
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-normal tracking-wide mt-1">
            Waktu &amp; Tempat
          </h2>
          <RoyalDivider className="max-w-[200px] mx-auto my-3" />
        </motion.div>

        {/* Countdown Timer Block */}
        {mainEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-md mx-auto mb-10 p-5 sm:p-6 rounded-3xl bg-[#063c2f]/45 backdrop-blur-md border border-[#d4af37]/35 shadow-[0_8px_30px_rgba(0,0,0,0.4)] text-center relative group"
          >
            <p className="text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-[#d4af37] font-semibold mb-4">
              {passed ? "Hari Bahagia Telah Tiba" : "Menuju Hari Sakral"}
            </p>

            {!passed && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto mb-4">
                {countdownUnits.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center py-3 px-1 rounded-2xl bg-[#02241b]/80 border border-[#d4af37]/30 shadow-inner group-hover:border-[#d4af37]/60 transition-colors"
                  >
                    <span className="font-serif text-2xl sm:text-3xl font-normal text-[#ffd700] tracking-wider leading-none tabular-nums">
                      {String(value).padStart(2, "0")}
                    </span>
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#d4af37] font-medium mt-1.5">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <p className="font-serif text-xs sm:text-sm text-[#f4eedb] italic font-light mb-5">
              {new Date(mainEvent.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            {/* Simpan ke Kalender Button */}
            {mainEvent && (
              <a
                href={mainCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-full border border-[#d4af37]/60 bg-[#02241b]/90 hover:bg-[#d4af37] hover:text-[#02241b] text-xs font-serif tracking-wider uppercase font-semibold text-[#d4af37] transition-all duration-300 shadow-[0_2px_12px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.45)] cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4 text-[#ffd700] shrink-0" />
                <span>Simpan ke Kalender</span>
              </a>
            )}
          </motion.div>
        )}

        {/* Events Cards - Stacked vertically for pristine 500px frame responsiveness */}
        <div className="w-full max-w-md mx-auto flex flex-col gap-8">
          {events.map((evt, idx) => {
            const eventDate = new Date(evt.date);
            const dateFormatted = eventDate.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            const mapLink =
              evt.mapsUrl ||
              (evt.venue
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${evt.venue} ${evt.address || ""}`
                  )}`
                : null);

            return (
              <motion.div
                key={evt.id || idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className="relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#063c2f]/45 backdrop-blur-md border border-[#d4af37]/35 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group hover:border-[#d4af37]/70 transition-all duration-300"
              >
                {/* Decorative Corners */}
                <div className="absolute top-3 left-3 pointer-events-none opacity-40">
                  <RoyalCorner className="w-8 h-8 text-[#d4af37]" position="top-left" />
                </div>
                <div className="absolute top-3 right-3 pointer-events-none opacity-40">
                  <RoyalCorner className="w-8 h-8 text-[#d4af37]" position="top-right" />
                </div>

                <div>
                  {/* Event Title Badge */}
                  <div className="inline-block py-1.5 px-5 rounded-full border border-[#d4af37]/40 bg-[#02241b] text-xs font-serif uppercase tracking-[0.25em] text-[#d4af37] mb-6 shadow-sm">
                    {evt.title}
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-4 mb-6 text-sm text-[#fdfbf7]">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#fdfbf7] text-base font-serif">{dateFormatted}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" />
                      <p className="text-[#b8c9c1]">
                        Pukul {evt.startTime} {evt.endTime ? `- ${evt.endTime}` : "WIB"}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#fdfbf7]">{evt.venue}</p>
                        {evt.address && (
                          <p className="text-xs text-[#b8c9c1] mt-1 leading-relaxed font-light">
                            {evt.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions - Petunjuk Arah */}
                {mapLink && (
                  <div className="pt-5 border-t border-[#d4af37]/20">
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#d4af37]/50 bg-[#02241b]/90 hover:bg-[#d4af37] hover:text-[#02241b] text-xs font-serif tracking-wider uppercase font-semibold text-[#d4af37] transition-all cursor-pointer shadow-sm text-center"
                    >
                      <Navigation className="w-3.5 h-3.5 shrink-0" />
                      <span>Petunjuk Arah</span>
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

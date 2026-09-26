"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { Calendar, Clock, MapPin, Navigation, CalendarPlus } from "lucide-react";
import { RoyalDivider, RoyalCorner, RoyalCrown } from "./Ornaments";

export function RoyalEvent({ context }: TemplateComponentProps) {
  const events = context.wedding.events ?? [];
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
          className="text-center mb-16"
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

            // Google Calendar link builder
            const titleEncoded = encodeURIComponent(
              `${evt.title} — ${context.wedding.slug}`
            );
            const locationEncoded = encodeURIComponent(
              `${evt.venue || ""} ${evt.address || ""}`.trim()
            );
            const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEncoded}&location=${locationEncoded}`;

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

                {/* Actions - Clean 2-column grid that never overflows */}
                <div className="pt-5 border-t border-[#d4af37]/20 grid grid-cols-2 gap-3">
                  {mapLink ? (
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-[#d4af37]/50 bg-[#02241b]/90 hover:bg-[#d4af37] hover:text-[#02241b] text-[11px] sm:text-xs font-serif tracking-wider uppercase font-semibold text-[#d4af37] transition-all cursor-pointer shadow-sm text-center"
                    >
                      <Navigation className="w-3.5 h-3.5 shrink-0" />
                      <span>Petunjuk Arah</span>
                    </a>
                  ) : (
                    <div />
                  )}

                  <a
                    href={gCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-[#d4af37]/30 bg-white/5 hover:bg-white/10 text-[11px] sm:text-xs text-[#fdfbf7] tracking-wider transition-all cursor-pointer text-center"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                    <span>Simpan Kalender</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

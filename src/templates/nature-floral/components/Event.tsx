"use client";
import { motion } from "framer-motion";
import { formatDate, formatTime } from "@/lib/utils";
import type { TemplateComponentProps } from "@/types/template";

export function FloralEvent({ context, onTrack }: TemplateComponentProps) {
  const events = context.wedding.events ?? [];
  if (events.length === 0) return null;

  return (
    <section id="section-event" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#fbf8f3]">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-[#5a7263] mb-2">
            <span className="text-sm">🏛️</span>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase">
              RANGKAIAN ACARA
            </span>
            <span className="text-sm">🏛️</span>
          </div>
          <h2 className="font-serif-floral text-2xl sm:text-3xl font-semibold text-[#2d4a3e]">
            Waktu &amp; Tempat Pelaksanaan
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a880] mx-auto mt-3" />
        </div>

        <div className="space-y-6 sm:space-y-8">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative rounded-2xl bg-white p-6 sm:p-8 border border-[#d8cfc4] shadow-xs text-center"
            >
              {/* Event Badge */}
              <div className="inline-block px-3 py-1 rounded-full bg-[#e8eee5] text-[#2d4a3e] text-xs font-semibold tracking-wider uppercase mb-3">
                Acara {i + 1}
              </div>

              <h3 className="font-serif-floral text-xl sm:text-2xl font-bold text-[#2d4a3e]">
                {event.title}
              </h3>

              <div className="mt-4 pt-4 border-t border-[#e8ded1] space-y-2 text-xs sm:text-sm text-[#4a5e52]">
                <p className="flex items-center justify-center gap-2">
                  <span>📅</span>
                  <strong className="font-medium text-[#2d4a3e]">
                    {formatDate(event.date)}
                  </strong>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span>⏰</span>
                  <strong className="font-medium text-[#2d4a3e]">
                    {formatTime(event.startTime)}
                    {event.endTime ? ` - ${formatTime(event.endTime)}` : ""} WIB
                  </strong>
                </p>
                <p className="flex items-center justify-center gap-2 pt-2">
                  <span>📍</span>
                  <strong className="font-bold text-[#2d4a3e] text-base">
                    {event.venue}
                  </strong>
                </p>
                {event.address && (
                  <p className="text-xs text-[#63756b] max-w-sm mx-auto leading-relaxed">
                    {event.address}
                  </p>
                )}
              </div>

              {event.mapsUrl && (
                <div className="mt-6">
                  <a
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onTrack?.("map_click")}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2d4a3e] hover:bg-[#233a30] text-[#fbf8f3] text-xs font-semibold tracking-wider transition-all shadow-xs"
                  >
                    <span>🗺️</span>
                    <span>Buka Petunjuk Rute (Google Maps)</span>
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

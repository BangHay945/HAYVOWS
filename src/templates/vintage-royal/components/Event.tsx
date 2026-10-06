"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Navigation, Calendar } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

const EASE = [0.22, 1, 0.36, 1] as const;

function formatEventDayDate(dateStr?: string): { day: string; date: string } {
  if (!dateStr) return { day: "", date: "" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { day: "", date: dateStr };
  const day = d.toLocaleDateString("id-ID", { weekday: "long" }).toUpperCase();
  const date = d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return { day, date };
}

export function VintageRoyalEvent({ context }: TemplateComponentProps) {
  const events = context.wedding?.events ?? [];

  if (events.length === 0) return null;

  return (
    <section className="relative w-full px-5 sm:px-8 py-16 sm:py-24 bg-[#141517]/90 backdrop-blur-md border-b border-white/5">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center mb-12 sm:mb-16 space-y-3"
      >
        <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.3em] text-[#d5be9b] uppercase">
          Agenda Pernikahan
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#f8f6f0] tracking-wide">
          Wedding Events
        </h2>
        <div className="w-10 h-px bg-[#d5be9b]/40 mx-auto mt-2" />
        <p className="max-w-md mx-auto text-xs sm:text-sm text-[#b8b5ad] font-serif italic pt-1">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami atas kehadiran doa restu Anda.
        </p>
      </motion.div>

      {/* Events List */}
      <div className="flex flex-col gap-8 max-w-md mx-auto">
        {events.map((evt, idx) => {
          const { day, date } = formatEventDayDate(evt.date);
          const isAkad =
            evt.title?.toLowerCase().includes("akad") ||
            evt.title?.toLowerCase().includes("pemberkatan") ||
            evt.title?.toLowerCase().includes("ceremony");

          return (
            <motion.div
              key={evt.id || idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: EASE }}
              className="bg-[#1c1e22]/90 backdrop-blur-md border border-white/10 hover:border-[#d5be9b]/40 rounded-2xl p-6 sm:p-7 shadow-lg transition-all duration-300 relative group overflow-hidden"
            >
              {/* Top Accent Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d5be9b]/60 to-transparent" />

              {/* Sub-badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[10px] font-sans tracking-[0.25em] text-[#d5be9b] uppercase font-semibold">
                  {isAkad ? "Sacred Ceremony" : "Grand Celebration"}
                </span>
                <span className="text-[10px] font-mono text-[#b8b5ad] bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                  Acara #{idx + 1}
                </span>
              </div>

              {/* Event Title */}
              <h3 className="text-xl sm:text-2xl font-serif text-[#f8f6f0] tracking-wide mb-4">
                {evt.title}
              </h3>

              {/* Date & Time */}
              <div className="space-y-2.5 border-t border-b border-white/5 py-4 my-4">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#f8f6f0]">
                  <Calendar className="w-4 h-4 text-[#d5be9b] shrink-0" />
                  <span>
                    <strong className="font-semibold">{day}</strong>, {date}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#b8b5ad]">
                  <Clock className="w-4 h-4 text-[#d5be9b] shrink-0" />
                  <span>
                    {evt.startTime}
                    {evt.endTime ? ` – ${evt.endTime} WIB` : " WIB – Selesai"}
                  </span>
                </div>
              </div>

              {/* Venue & Location */}
              <div className="space-y-1.5 mb-6">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#d5be9b] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#f8f6f0]">
                      {evt.venue}
                    </h4>
                    {evt.address && (
                      <p className="text-xs text-[#b8b5ad] leading-relaxed mt-1">
                        {evt.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Maps Action Button */}
              {evt.mapsUrl && (
                <a
                  href={evt.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 rounded-xl bg-[#141517] hover:bg-[#d5be9b] border border-[#d5be9b]/40 hover:border-[#d5be9b] text-[#f8f6f0] hover:text-[#141517] text-xs font-sans font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-md group cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#d5be9b] group-hover:text-[#141517] transition-colors" />
                  <span className="group-hover:text-[#141517] transition-colors">Petunjuk Arah (Google Maps)</span>
                </a>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

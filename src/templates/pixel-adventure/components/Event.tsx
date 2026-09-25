"use client";
import { motion } from "framer-motion";
import { formatDate, formatTime } from "@/lib/utils";
import type { TemplateComponentProps } from "@/types/template";

export function PixelEvent({ context, onTrack }: TemplateComponentProps) {
  const events = context.wedding.events ?? [];
  if (events.length === 0) return null;

  return (
    <section className="bg-[#0c102a] py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <span className="text-[#c084fc] text-[10px] sm:text-xs uppercase tracking-widest block font-bold">
            🏛️ TEMPLE OF VOWS 🏛️
          </span>
          <h2 className="font-mono text-[#f6d776] text-2xl font-bold text-center mt-1 border-b-2 border-[#d4af37]/60 pb-3 drop-shadow">
            RANGKAIAN ACARA
          </h2>
        </div>

        <div className="space-y-6">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="border-2 sm:border-4 border-[#d4af37] bg-gradient-to-b from-[#161d42] to-[#0f1430] p-5 sm:p-6 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.7)] relative"
            >
              <div className="flex items-center justify-between border-b border-[#d4af37]/40 pb-2 mb-3">
                <span className="font-mono text-[#f6d776] text-xs font-bold tracking-widest">
                  STAGE {i + 1}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#c084fc]/20 text-[#c084fc] border border-[#c084fc]/40">
                  WIB
                </span>
              </div>

              <h3 className="font-mono text-white text-lg font-bold mb-3">{event.title}</h3>
              <div className="space-y-2 font-mono text-xs sm:text-sm text-[#cbd5e1]">
                <p>📅 <strong className="text-white">{formatDate(event.date)}</strong></p>
                <p>
                  ⏰ <strong className="text-white">
                    {formatTime(event.startTime)}
                    {event.endTime ? ` - ${formatTime(event.endTime)}` : ""} WIB
                  </strong>
                </p>
                <p>📍 <strong className="text-white">{event.venue}</strong></p>
                {event.address && <p className="text-[#94a3b8] text-xs leading-relaxed">{event.address}</p>}
              </div>

              {event.mapsUrl && (
                <a
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onTrack?.("map_click")}
                  className="mt-5 block w-full text-center bg-gradient-to-r from-[#d4af37] to-[#f6d776] text-[#0f172a] font-mono text-xs font-bold py-3 rounded border border-white hover:brightness-110 active:scale-95 transition-all shadow"
                >
                  🗺 PETUNJUK RUTE GOOGLE MAPS
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

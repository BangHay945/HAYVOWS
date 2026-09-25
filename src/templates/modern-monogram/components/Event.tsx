"use client";
import { motion } from "framer-motion";
import { MapPin, Clock, Calendar, ExternalLink } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

export function MonogramEvent({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const events = wedding.events || [];

  const defaultEvents = [
    {
      id: "ev-akad",
      title: "Akad Nikah",
      date: "2026-10-24",
      startTime: "08:00",
      endTime: "10:00",
      venue: "Masjid Raya Al-Ikhlas",
      address: "Jl. Melati No. 12, Jakarta Selatan",
      mapsUrl: "https://maps.google.com",
    },
    {
      id: "ev-resepsi",
      title: "Resepsi Pernikahan",
      date: "2026-10-24",
      startTime: "11:00",
      endTime: "14:00",
      venue: "Grand Ballroom Hotel Mulia",
      address: "Jl. Asia Afrika, Senayan, Jakarta Pusat",
      mapsUrl: "https://maps.google.com",
    },
  ];

  const displayEvents = events.length > 0 ? events : defaultEvents;

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12 space-y-2">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-[#8c7e72] uppercase block">
          AGENDA &amp; LOKASI ACARA
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Waktu &amp; Tempat
        </h2>
        <div className="w-12 h-0.5 bg-[#c5a880] mx-auto rounded-full mt-2" />
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto pt-1 font-light">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:gap-8 max-w-md mx-auto">
        {displayEvents.map((ev, idx) => {
          const formattedDate = ev.date
            ? new Date(ev.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Sabtu, 24 Oktober 2026";

          const timeText = ev.endTime
            ? `${ev.startTime} - ${ev.endTime} WIB`
            : `${ev.startTime} WIB - Selesai`;

          return (
            <motion.div
              key={ev.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-6 hover:border-[#c5a880]/60 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                    {ev.title}
                  </h3>
                  <span className="text-[10px] font-bold text-[#2d4a3e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    Acara {idx + 1}
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-[#2d4a3e] shrink-0 mt-0.5" />
                    <span>{formattedDate}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#2d4a3e] shrink-0 mt-0.5" />
                    <span>{timeText}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#2d4a3e] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">{ev.venue}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-light">
                        {ev.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={ev.mapsUrl || "https://maps.google.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-200 shadow-2xs hover:border-slate-300 transition-all hover:scale-[1.01]"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#2d4a3e]" />
                  <span>Buka Petunjuk Arah Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

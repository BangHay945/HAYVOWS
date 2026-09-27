"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { MapPin, Clock, Calendar, ExternalLink, Sparkles } from "lucide-react";

export function EditorialEvent({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const events = wedding.events ?? [];

  // Fallback default events jika kosong
  const displayEvents = events.length > 0 ? events : [
    {
      id: "ev-1",
      title: "Akad Nikah",
      date: "2026-10-18",
      startTime: "08:00",
      endTime: "10:00",
      venue: "Masjid Raya Al-Barkah",
      address: "Jl. Sudirman Kav. 21, Jakarta Selatan",
      mapsUrl: "https://maps.google.com",
    },
    {
      id: "ev-2",
      title: "Resepsi Pernikahan",
      date: "2026-10-18",
      startTime: "11:00",
      endTime: "14:00",
      venue: "Grand Ballroom The Westin",
      address: "Jl. H.R. Rasuna Said Kav. C-22, Jakarta Selatan",
      mapsUrl: "https://maps.google.com",
    },
  ];

  // Foto background dinamis dari galeri
  const galleryPhotos = (wedding.galleries || []).map((g) => g.imageUrl);
  const eventBg =
    galleryPhotos[4] ||
    wedding.couple?.couplePhoto ||
    galleryPhotos[1] ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="relative w-full py-20 px-5 sm:px-6 overflow-hidden bg-[#0a0a0c] text-[#fdfbf7]">
      {/* ── AMBIENT PHOTO BACKGROUND DARI GALERI ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={eventBg}
          alt="Ambient Event"
          className="w-full h-full object-cover object-center opacity-25 filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-black/85 to-[#0a0a0c]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] tracking-[0.3em] uppercase font-mono text-[#e8d5b5]">
            <Sparkles className="w-3 h-3" />
            <span>THE CEREMONIES</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-light tracking-wide">
            Agenda Acara
          </h2>
          <p className="text-xs text-neutral-400 font-sans max-w-xs mx-auto">
            Rangkaian momen sakral dan resepsi perayaan pernikahan kami.
          </p>
        </motion.div>

        {/* Event Cards */}
        <div className="space-y-6">
          {displayEvents.map((item, idx) => {
            const eventDate = item.date ? new Date(item.date) : new Date();
            const formattedDate = eventDate.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-5 shadow-2xl relative overflow-hidden group hover:border-[#e8d5b5]/40 transition-colors"
              >
                {/* Event Badge Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#e8d5b5] font-semibold">
                    SESSION {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#e8d5b5]/60" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-normal text-[#fdfbf7] tracking-wide">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#e8d5b5] pt-1">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-[#e8d5b5]" />
                    <span>
                      {item.startTime} {item.endTime ? `- ${item.endTime} WIB` : "WIB - Selesai"}
                    </span>
                  </div>
                </div>

                {/* Venue & Location */}
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <h4 className="text-sm font-bold text-[#fdfbf7] flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#e8d5b5] shrink-0 mt-0.5" />
                    <span>{item.venue}</span>
                  </h4>
                  {item.address && (
                    <p className="text-xs text-neutral-400 pl-6 leading-relaxed font-sans">
                      {item.address}
                    </p>
                  )}
                </div>

                {/* Maps Button */}
                {item.mapsUrl && (
                  <div className="pt-2">
                    <a
                      href={item.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs text-[#fdfbf7] font-mono tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#e8d5b5]" />
                      <span>Buka Petunjuk Arah Google Maps</span>
                      <ExternalLink className="w-3 h-3 text-neutral-400" />
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

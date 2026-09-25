"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { SulurDivider, UkiranCorner } from "./Ornaments";
import { MapPin, Clock, ExternalLink } from "lucide-react";

export function BatikJawaEvent({ context }: TemplateComponentProps) {
  const events = context.wedding.events ?? [];
  if (events.length === 0) return null;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <section
      className="relative w-full py-20 sm:py-28 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #3D2B1F 0%, #2D1B0E 100%)" }}
    >
      {/* Pola latar halus */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #D4A853 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p
            className="font-jawa-body text-[10px] tracking-[0.45em] uppercase text-[#8B6E5A] mb-3"
            style={{ fontStyle: "normal" }}
          >
            Rangkaian Acara
          </p>
          <h2 className="font-jawa-serif text-3xl sm:text-4xl text-[#EDE0C4]">
            Hari Bahagia
          </h2>
          <div className="mt-5">
            <SulurDivider color="#B8860B" height={22} />
          </div>
        </motion.div>

        {/* Kartu acara */}
        <div className="space-y-6">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: i * 0.12 }}
              className="relative p-6 sm:p-8"
              style={{
                background: "linear-gradient(135deg, #4A2C12 0%, #3D2B1F 100%)",
                border: "1px solid rgba(184,134,11,0.35)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(184,134,11,0.1)",
              }}
            >
              {/* Ornamen sudut */}
              <div className="absolute top-2 left-2"><UkiranCorner color="#B8860B" size={22} /></div>
              <div className="absolute top-2 right-2" style={{ transform: "scaleX(-1)" }}><UkiranCorner color="#B8860B" size={22} /></div>
              <div className="absolute bottom-2 left-2" style={{ transform: "scaleY(-1)" }}><UkiranCorner color="#B8860B" size={22} /></div>
              <div className="absolute bottom-2 right-2" style={{ transform: "scale(-1,-1)" }}><UkiranCorner color="#B8860B" size={22} /></div>

              {/* Judul acara */}
              <div className="text-center mb-5">
                <span
                  className="font-jawa-body text-[10px] tracking-[0.4em] uppercase text-[#B8860B] block mb-2"
                  style={{ fontStyle: "normal" }}
                >
                  Acara {i + 1}
                </span>
                <h3 className="font-jawa-serif text-2xl sm:text-3xl text-[#EDE0C4]">
                  {event.title}
                </h3>
              </div>

              {/* Garis pemisah */}
              <div
                className="w-24 h-px mx-auto mb-5"
                style={{ background: "linear-gradient(to right, transparent, #B8860B, transparent)" }}
              />

              {/* Detail acara */}
              <div className="space-y-3 text-sm">
                {/* Tanggal */}
                <div className="flex items-start gap-3">
                  <span className="text-[#B8860B] mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </span>
                  <span className="font-jawa-body text-[#EDE0C4]/85 text-sm" style={{ fontStyle: "normal" }}>
                    {formatDate(event.date)}
                  </span>
                </div>

                {/* Waktu */}
                <div className="flex items-center gap-3">
                  <Clock className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                  <span className="font-jawa-body text-[#EDE0C4]/85 text-sm" style={{ fontStyle: "normal" }}>
                    {event.startTime}{event.endTime ? ` — ${event.endTime}` : ""} WIB
                  </span>
                </div>

                {/* Lokasi */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-3.5 h-3.5 text-[#B8860B] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-jawa-body text-[#EDE0C4]/85 text-sm" style={{ fontStyle: "normal" }}>
                      {event.venue}
                    </p>
                    {event.address && (
                      <p className="font-jawa-body text-[#8B6E5A] text-xs mt-0.5" style={{ fontStyle: "normal" }}>
                        {event.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tombol Maps */}
              {event.mapsUrl && (
                <div className="mt-6 text-center">
                  <a
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-jawa-body border transition-all hover:bg-[#B8860B]/10"
                    style={{
                      borderColor: "rgba(184,134,11,0.5)",
                      color: "#D4A853",
                      fontStyle: "normal",
                      letterSpacing: "0.15em",
                    }}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Lihat Peta</span>
                    <ExternalLink className="w-3 h-3" />
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

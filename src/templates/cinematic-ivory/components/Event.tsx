"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Calendar } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface CountdownResult {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  passed: boolean;
}

function useCountdown(targetDate: string): CountdownResult {
  const calculate = (): CountdownResult => {
    const now = Date.now();
    const target = new Date(targetDate).getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00", passed: true };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days: pad(days),
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
      passed: false,
    };
  };

  const [state, setState] = useState<CountdownResult>(calculate);

  useEffect(() => {
    const id = setInterval(() => setState(calculate()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return state;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.9, ease: EASE, delay },
});

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface CountdownUnit {
  value: string;
  label: string;
}

function CountdownBlock({ targetDate }: { targetDate: string }) {
  const { days, hours, minutes, seconds, passed } = useCountdown(targetDate);

  const units: CountdownUnit[] = [
    { value: days, label: "Hari" },
    { value: hours, label: "Jam" },
    { value: minutes, label: "Menit" },
    { value: seconds, label: "Detik" },
  ];

  if (passed) {
    return (
      <motion.p
        {...fadeUp(0.2)}
        className="text-center font-ci-serif text-xl italic text-[#f5f3ef] tracking-wide"
      >
        Hari Bahagia Telah Tiba
      </motion.p>
    );
  }

  return (
    <motion.div {...fadeUp(0.1)} className="w-full">
      {/* Label */}
      <p className="text-center font-ci-sans text-[8px] tracking-[0.45em] uppercase text-[#d4c4b0] mb-8">
        Menuju Hari Istimewa
      </p>

      {/* Numbers */}
      <div className="grid grid-cols-4 gap-4 max-w-xs sm:max-w-sm mx-auto">
        {units.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <span className="font-ci-serif text-5xl sm:text-6xl font-light text-[#f5f3ef] tabular-nums leading-none">
              {value}
            </span>
            <span className="font-ci-sans text-[9px] tracking-[0.3em] uppercase text-[#8a8b90]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

interface EventCardProps {
  event: {
    id?: string;
    title?: string;
    name?: string;
    date?: string;
    startTime?: string;
    endTime?: string | null;
    venue?: string;
    venueName?: string;
    address?: string;
    venueAddress?: string;
    mapsUrl?: string | null;
  };
  index: number;
}

function EventCard({ event, index }: EventCardProps) {
  const num = String(index + 1).padStart(2, "0");
  const title = event.title ?? event.name ?? "Acara";

  // Format date
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).toUpperCase()
    : null;

  const timeLabel = [event.startTime, event.endTime].filter(Boolean).join(" — ");

  return (
    <motion.div
      {...fadeUp(index * 0.12)}
      className="relative p-6 sm:p-8 rounded-2xl bg-[#121316] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
    >
      {/* Large muted index number */}
      <span
        aria-hidden
        className="absolute top-4 right-6 font-ci-serif text-6xl font-light text-white/[0.05] select-none leading-none pointer-events-none"
      >
        {num}
      </span>

      <div className="relative">
        {/* Event title */}
        <h3 className="font-ci-serif text-2xl sm:text-3xl font-light text-[#f5f3ef] mb-3">
          {title}
        </h3>

        {/* Platinum hairline */}
        <div className="w-8 h-px bg-[#d4c4b0]/40 mb-4" />

        {/* Date */}
        {formattedDate && (
          <p className="font-ci-sans text-[10px] tracking-[0.3em] uppercase text-[#d4c4b0] mb-3 font-medium">
            {formattedDate}
          </p>
        )}

        {/* Time */}
        {timeLabel && (
          <div className="flex items-center gap-2 mb-3 text-[#b0b0b8]">
            <Clock size={12} className="text-[#d4c4b0] flex-shrink-0" />
            <span className="font-ci-sans text-xs">{timeLabel}</span>
          </div>
        )}

        {/* Venue name */}
        {(event.venue || event.venueName) && (
          <p className="font-ci-serif text-lg italic text-[#f5f3ef] mb-1">
            {event.venue || event.venueName}
          </p>
        )}

        {/* Venue address */}
        {(event.address || event.venueAddress) && (
          <p className="font-ci-sans text-xs text-[#8a8b90] mb-6 leading-relaxed">
            {event.address || event.venueAddress}
          </p>
        )}

        {/* Direction button */}
        {event.mapsUrl && (
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group
              inline-flex items-center gap-2
              border border-white/15 hover:border-[#d4c4b0]
              text-[#f5f3ef] hover:text-[#0c0d0e]
              bg-white/[0.05] hover:bg-[#d4c4b0]
              px-6 py-3 rounded-full
              font-ci-sans text-[9px] tracking-[0.3em] uppercase
              transition-all duration-300 shadow-sm
            "
          >
            <MapPin size={11} className="flex-shrink-0 text-[#d4c4b0] group-hover:text-[#0c0d0e] transition-colors duration-300" />
            Petunjuk Arah
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Add to Calendar helper
// ---------------------------------------------------------------------------

function buildGoogleCalUrl(event: EventCardProps["event"]): string {
  const title = encodeURIComponent(event.title ?? event.name ?? "Pernikahan");
  const loc = encodeURIComponent(
    [(event.venue || event.venueName), (event.address || event.venueAddress)]
      .filter(Boolean)
      .join(", ")
  );

  let startStr = "";
  let endStr = "";
  if (event.date) {
    const base = event.date.replace(/-/g, "");
    const start = event.startTime ? event.startTime.replace(":", "") + "00" : "000000";
    const end = event.endTime ? event.endTime.replace(":", "") + "00" : "235959";
    startStr = `${base}T${start}`;
    endStr = `${base}T${end}`;
  }

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${loc}&dates=${startStr}/${endStr}`;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CinematicIvoryEvent({ context }: TemplateComponentProps) {
  const events = context.wedding?.events ?? [];

  if (events.length === 0) return null;

  const countdownTarget = events[0]?.date ?? "";
  const calUrl = events[0] ? buildGoogleCalUrl(events[0]) : "#";

  return (
    <section className="relative bg-[#0c0d0e]/82 backdrop-blur-[2px] py-24 sm:py-28 px-6 text-[#f5f3ef]">
      {/* Translucent dark atmospheric wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,13,14,0.92) 0%, rgba(12,13,14,0.76) 50%, rgba(12,13,14,0.92) 100%)",
        }}
      />

      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-md mx-auto relative z-10">
        {/* ── Section header ── */}
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <p className="font-ci-sans text-[8px] tracking-[0.5em] uppercase text-[#8a8b90] mb-4">
            WAKTU &amp; TEMPAT
          </p>
          <h2 className="font-ci-serif text-3xl sm:text-4xl font-light text-[#f5f3ef]">
            Hari Pernikahan
          </h2>
          {/* Hairline */}
          <div className="w-8 h-px bg-[#d4c4b0] mx-auto mt-5" />
        </motion.div>

        {/* ── Countdown ── */}
        {countdownTarget && (
          <div className="mb-10">
            <CountdownBlock targetDate={countdownTarget} />
          </div>
        )}

        {/* ── Separator ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          style={{ originX: 0.5 }}
          className="w-[60px] h-px bg-white/15 mx-auto my-10"
        />

        {/* ── Add to Calendar ── */}
        {countdownTarget && (
          <motion.div {...fadeUp(0.15)} className="flex justify-center mb-14">
            <a
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                inline-flex items-center gap-2
                border border-white/15 hover:border-[#d4c4b0]
                text-[#f5f3ef] hover:text-[#0c0d0e]
                bg-white/[0.05] hover:bg-[#d4c4b0]
                px-6 py-3 rounded-full
                font-ci-sans text-[9px] tracking-[0.3em] uppercase
                transition-all duration-300 shadow-sm
              "
            >
              <Calendar size={11} className="flex-shrink-0 text-[#d4c4b0] group-hover:text-[#0c0d0e] transition-colors duration-300" />
              Simpan ke Kalender
            </a>
          </motion.div>
        )}

        {/* ── Event cards ── */}
        <div className="flex flex-col space-y-8">
          {events.map((event, i) => (
            <EventCard key={event.id ?? i} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

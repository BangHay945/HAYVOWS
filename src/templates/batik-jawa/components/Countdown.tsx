'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { TemplateComponentProps } from '@/types/template';
import { SulurDivider, KawungBorder, UkiranCorner } from './Ornaments';
import { Calendar, Clock } from 'lucide-react';

function pad(n: number) {
  return String(n).padStart(2, '0');
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

export function BatikJawaCountdown({ context }: TemplateComponentProps) {
  const events = context.wedding.events ?? [];
  const mainEvent = events[0];
  if (!mainEvent?.date) return null;

  const { days, hours, minutes, seconds, passed } = useCountdown(mainEvent.date);

  const units = [
    { label: 'Hari', value: days },
    { label: 'Jam', value: hours },
    { label: 'Menit', value: minutes },
    { label: 'Detik', value: seconds },
  ];

  // Google Calendar Link generator
  const createCalendarUrl = () => {
    try {
      const title = encodeURIComponent(
        `Pernikahan ${context.wedding.couple?.groomNickname || 'Prasetyo'} & ${context.wedding.couple?.brideNickname || 'Kinanti'}`
      );
      const dateStr = mainEvent.date.replace(/-/g, '');
      const dates = `${dateStr}T010000Z/${dateStr}T140000Z`;
      const location = encodeURIComponent(mainEvent.venue || mainEvent.address || 'Yogyakarta');
      const details = encodeURIComponent('Undangan Pernikahan Adat Jawa');
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&location=${location}&details=${details}`;
    } catch {
      return '#';
    }
  };

  return (
    <section
      className="relative w-full py-16 sm:py-20 px-4 sm:px-6 overflow-hidden"
      style={{ backgroundColor: '#2D1B0E' }}
    >
      {/* Top KawungBorder */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden">
        <KawungBorder color="#B8860B" height={16} />
      </div>

      <div className="relative z-10 max-w-xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8 sm:mb-10"
        >
          <p
            className="font-jawa-body text-[10px] tracking-[0.35em] uppercase font-bold mb-2"
            style={{ color: '#D4A853', fontStyle: 'normal' }}
          >
            Menghitung Waktu
          </p>
          <h2
            className="font-jawa-serif text-3xl sm:text-4xl text-[#EDE0C4]"
          >
            {passed ? 'Hari Bahagia Telah Tiba' : 'Menuju Hari Bahagia'}
          </h2>
          <div className="flex justify-center my-3">
            <SulurDivider color="#B8860B" width={180} height={20} />
          </div>
          <p
            className="font-jawa-body text-xs sm:text-sm text-[#D4A853] max-w-md mx-auto leading-relaxed"
            style={{ fontStyle: 'normal' }}
          >
            Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami menantikan detik-detik sakral ikatan janji suci kami.
          </p>
        </motion.div>

        {/* 4 Timer Boxes */}
        {!passed && (
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto mb-8 sm:mb-10">
            {units.map(({ label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative flex flex-col items-center justify-center py-4 sm:py-5 px-2 rounded-xl shadow-lg"
                style={{
                  background: 'linear-gradient(145deg, #3D2B1F 0%, #22140A 100%)',
                  border: '1px solid rgba(184, 134, 11, 0.45)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                {/* Corner ornament top-left */}
                <div className="absolute top-1 left-1 pointer-events-none opacity-50">
                  <UkiranCorner size={12} color="#B8860B" />
                </div>
                {/* Corner ornament bottom-right */}
                <div className="absolute bottom-1 right-1 pointer-events-none opacity-50 rotate-180">
                  <UkiranCorner size={12} color="#B8860B" />
                </div>

                {/* Number */}
                <span
                  className="font-jawa-serif text-3xl sm:text-5xl font-light text-[#D4A853] leading-none tabular-nums tracking-tight"
                >
                  {pad(value)}
                </span>
                {/* Label */}
                <span
                  className="font-jawa-body text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#EDE0C4] mt-2 font-medium"
                  style={{ fontStyle: 'normal' }}
                >
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Date Display & Save to Calendar Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-jawa-serif text-[#EDE0C4]">
            <Calendar size={15} className="text-[#B8860B]" />
            <span className="font-semibold tracking-wide">
              {new Date(mainEvent.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            {mainEvent.startTime && (
              <>
                <span className="text-[#B8860B]">&bull;</span>
                <Clock size={14} className="text-[#B8860B]" />
                <span>Pukul {mainEvent.startTime} WIB</span>
              </>
            )}
          </div>

          <div>
            <a
              href={createCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-jawa-body tracking-wider uppercase font-bold transition-all hover:scale-105 active:scale-98 shadow-md cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #E6C687 0%, #D4A853 50%, #B8860B 100%)',
                color: '#1A0F07',
                border: '1px solid rgba(253, 246, 227, 0.4)',
                fontStyle: 'normal',
                boxShadow: '0 4px 16px rgba(184,134,11,0.35)',
              }}
            >
              <Calendar size={13} />
              <span>Simpan ke Google Calendar</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom KawungBorder */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <KawungBorder color="#B8860B" height={16} />
      </div>
    </section>
  );
}

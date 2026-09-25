"use client";
import { useEffect, useState } from "react";
import type { TemplateComponentProps } from "@/types/template";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function PixelCountdown({ context }: TemplateComponentProps) {
  const events = context.wedding.events ?? [];
  const firstEvent = events[0];
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!firstEvent) return;
    const target = new Date(firstEvent.date + "T" + (firstEvent.startTime || "00:00"));
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [firstEvent]);

  const boxes = [
    { label: "DAYS", value: time.days },
    { label: "HRS", value: time.hours },
    { label: "MIN", value: time.minutes },
    { label: "SEC", value: time.seconds },
  ];

  return (
    <section className="bg-[#111111] py-16 px-6">
      <div className="max-w-md mx-auto text-center">
        <h2 className="font-mono text-[#FFD700] text-xl font-bold mb-8">⏱ COUNTDOWN TO D-DAY</h2>
        <div className="grid grid-cols-4 gap-3">
          {boxes.map(({ label, value }) => (
            <div key={label} className="border-4 border-[#FFD700] bg-[#1a1a1a] p-3">
              <p className="font-mono text-3xl font-bold text-white">{pad(value)}</p>
              <p className="font-mono text-xs text-[#FFD700] mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

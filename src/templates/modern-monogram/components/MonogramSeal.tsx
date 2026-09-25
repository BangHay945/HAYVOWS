"use client";
import React from "react";

interface MonogramSealProps {
  groomInitial: string;
  brideInitial: string;
  year?: string | number;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "crest" | "botanical" | "minimal";
  className?: string;
}

export function MonogramSeal({
  groomInitial,
  brideInitial,
  year,
  size = "lg",
  variant = "crest",
  className = "",
}: MonogramSealProps) {
  const sizeConfig = {
    sm: {
      box: "w-16 h-16",
      initialSize: "text-lg font-bold",
      ampSize: "text-xs",
      gap: "gap-1",
      yearSize: "text-[7px]",
      showYear: false,
    },
    md: {
      box: "w-24 h-24 sm:w-28 sm:h-28",
      initialSize: "text-2xl sm:text-3xl font-extrabold",
      ampSize: "text-base sm:text-lg",
      gap: "gap-1.5",
      yearSize: "text-[8px]",
      showYear: true,
    },
    lg: {
      box: "w-32 h-32 sm:w-36 sm:h-36",
      initialSize: "text-3xl sm:text-4xl font-extrabold",
      ampSize: "text-xl sm:text-2xl",
      gap: "gap-2",
      yearSize: "text-[9px]",
      showYear: true,
    },
    xl: {
      box: "w-40 h-40 sm:w-44 sm:h-44",
      initialSize: "text-4xl sm:text-5xl font-extrabold",
      ampSize: "text-2xl sm:text-3xl",
      gap: "gap-2.5",
      yearSize: "text-[10px]",
      showYear: true,
    },
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeConfig.box} ${className}`}
    >
      {/* SVG Background & Frames */}
      <svg
        viewBox="0 0 160 160"
        className="absolute inset-0 w-full h-full drop-shadow-[0_6px_20px_rgba(197,168,128,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sealBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#faf8f5" />
            <stop offset="100%" stopColor="#f3ede3" />
          </linearGradient>
          <linearGradient id="sealGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#deb887" />
            <stop offset="50%" stopColor="#c5a880" />
            <stop offset="100%" stopColor="#9e7b4f" />
          </linearGradient>
        </defs>

        {/* Outer Fine Gold Hairline Ring */}
        <circle cx="80" cy="80" r="76" stroke="url(#sealGoldGrad)" strokeWidth="1.2" />

        {/* Secondary Beaded/Dotted Concentric Ring */}
        <circle
          cx="80"
          cy="80"
          r="71"
          stroke="#c5a880"
          strokeWidth="0.9"
          strokeDasharray="2.5 3.5"
          opacity="0.85"
        />

        {/* Background Disc with Pearl Gradient */}
        <circle
          cx="80"
          cy="80"
          r="66"
          fill="url(#sealBgGrad)"
          stroke="#e8ded1"
          strokeWidth="0.8"
        />

        {/* Inner Delicate Hairline */}
        <circle cx="80" cy="80" r="62" stroke="#c5a880" strokeWidth="0.5" opacity="0.6" />

        {/* 4 Cardinal Diamond Accents */}
        <polygon points="80,5 82.5,9 80,13 77.5,9" fill="#c5a880" />
        <polygon points="80,147 82.5,151 80,155 77.5,151" fill="#c5a880" />
        <polygon points="5,80 9,77.5 13,80 9,82.5" fill="#c5a880" />
        <polygon points="147,80 151,77.5 155,80 151,82.5" fill="#c5a880" />

        {/* Botanical Leaves at top and bottom if variant is botanical */}
        {variant === "botanical" && (
          <g stroke="#c5a880" strokeWidth="0.8" fill="none" opacity="0.85">
            {/* Top sprigs */}
            <path d="M72 18 C70 14, 66 14, 65 17 C67 18, 71 18, 72 18 Z" fill="#c5a880" />
            <path d="M88 18 C90 14, 94 14, 95 17 C93 18, 89 18, 88 18 Z" fill="#c5a880" />
            {/* Bottom sprigs */}
            <path d="M72 142 C70 146, 66 146, 65 143 C67 142, 71 142, 72 142 Z" fill="#c5a880" />
            <path d="M88 142 C90 146, 94 146, 95 143 C93 142, 89 142, 88 142 Z" fill="#c5a880" />
          </g>
        )}
      </svg>

      {/* Center Initials & Typography */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
        <div
          className={`flex items-center justify-center whitespace-nowrap leading-none tracking-tight ${sizeConfig.gap}`}
        >
          {/* Groom Initial */}
          <span
            className={`font-serif-monogram text-[#2d4a3e] font-extrabold ${sizeConfig.initialSize}`}
            style={{
              textShadow: "0 1px 2px rgba(45,74,62,0.12)",
              letterSpacing: "-0.02em",
            }}
          >
            {groomInitial}
          </span>

          {/* Champagne Gold Ampersand */}
          <span
            className={`font-serif-monogram italic font-normal text-[#c5a880] select-none ${sizeConfig.ampSize}`}
            style={{
              transform: "translateY(-1px)",
              paddingLeft: "2px",
              paddingRight: "2px",
            }}
          >
            &amp;
          </span>

          {/* Bride Initial */}
          <span
            className={`font-serif-monogram text-[#2d4a3e] font-extrabold ${sizeConfig.initialSize}`}
            style={{
              textShadow: "0 1px 2px rgba(45,74,62,0.12)",
              letterSpacing: "-0.02em",
            }}
          >
            {brideInitial}
          </span>
        </div>

        {/* Year or Micro Divider */}
        {sizeConfig.showYear && (
          <div className="mt-1 sm:mt-1.5 flex items-center justify-center gap-1.5 opacity-85">
            <span className="w-2.5 sm:w-3 h-[0.5px] bg-[#c5a880]" />
            <span
              className={`font-sans font-semibold tracking-[0.22em] text-[#8c7e72] uppercase ${sizeConfig.yearSize}`}
            >
              {year || "EST. 2026"}
            </span>
            <span className="w-2.5 sm:w-3 h-[0.5px] bg-[#c5a880]" />
          </div>
        )}
      </div>
    </div>
  );
}

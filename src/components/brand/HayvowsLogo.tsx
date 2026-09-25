"use client";

import React from "react";

interface HayvowsLogoProps {
  variant?: "full" | "icon" | "horizontal";
  theme?: "light" | "dark" | "gold";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showTagline?: boolean;
}

export function HayvowsLogo({
  variant = "full",
  theme = "light",
  size = "md",
  className = "",
  showTagline = true,
}: HayvowsLogoProps) {
  // Dimension mapping
  const iconDimensions = {
    sm: { w: 26, h: 26 },
    md: { w: 34, h: 34 },
    lg: { w: 46, h: 46 },
    xl: { w: 60, h: 60 },
  }[size];

  // Theme color mapping
  const isDark = theme === "dark";
  const isGold = theme === "gold";

  const ringColor = isGold ? "#C9A84C" : isDark ? "#E6E6E6" : "#2D4A3E";
  const goldAccent = "#C9A84C";
  const textColor = isDark ? "text-white" : isGold ? "text-[#C9A84C]" : "text-slate-900";
  const subTextColor = isDark ? "text-slate-400" : "text-slate-500";

  const logoIcon = (
    <svg
      width={iconDimensions.w}
      height={iconDimensions.h}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      aria-label="Hayvows Logo Icon"
    >
      {/* Background soft glow for dark mode */}
      {isDark && (
        <circle cx="32" cy="32" r="28" fill="#C9A84C" fillOpacity="0.06" />
      )}

      {/* Left Wedding Ring (H-leg left & curve) */}
      <circle
        cx="25"
        cy="32"
        r="18"
        stroke={ringColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Left Ring Inner Accent Ring */}
      <circle
        cx="25"
        cy="32"
        r="14.5"
        stroke={goldAccent}
        strokeWidth="1"
        strokeOpacity="0.6"
      />

      {/* Right Wedding Ring (H-leg right & curve) */}
      <circle
        cx="39"
        cy="32"
        r="18"
        stroke={ringColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Right Ring Inner Accent Ring */}
      <circle
        cx="39"
        cy="32"
        r="14.5"
        stroke={goldAccent}
        strokeWidth="1"
        strokeOpacity="0.6"
      />

      {/* Interlocking Monogram HV: Vertical Left Pillar of 'H' */}
      <line
        x1="22"
        y1="21"
        x2="22"
        y2="43"
        stroke={ringColor}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Interlocking Monogram HV: Vertical Right Pillar of 'H' */}
      <line
        x1="42"
        y1="21"
        x2="42"
        y2="43"
        stroke={ringColor}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Center 'V' Cross / Vow Knot dipping elegantly */}
      <path
        d="M22 29L32 43L42 29"
        stroke={goldAccent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Diamond Sparkle at Top Apex */}
      <path
        d="M32 10L34 14L32 18L30 14Z"
        fill={goldAccent}
      />
      <circle cx="32" cy="14" r="1.5" fill="#FFFFFF" />
    </svg>
  );

  if (variant === "icon") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {logoIcon}
      </div>
    );
  }

  const textSizes = {
    sm: { title: "text-sm", sub: "text-[8px] tracking-[0.25em]" },
    md: { title: "text-lg", sub: "text-[9px] tracking-[0.28em]" },
    lg: { title: "text-2xl", sub: "text-[10px] tracking-[0.3em]" },
    xl: { title: "text-3xl", sub: "text-[12px] tracking-[0.32em]" },
  }[size];

  return (
    <div className={`group inline-flex items-center gap-2.5 select-none ${className}`}>
      {logoIcon}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1">
          <span
            className={`font-serif tracking-wider font-bold ${textColor} ${textSizes.title}`}
          >
            HAYVOWS
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A84C] mb-0.5" />
        </div>
        {showTagline && (
          <span
            className={`font-mono uppercase ${subTextColor} ${textSizes.sub} mt-1 font-medium`}
          >
            Digital Wedding
          </span>
        )}
      </div>
    </div>
  );
}

export default HayvowsLogo;

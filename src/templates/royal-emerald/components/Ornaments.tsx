import React from "react";

export function RoyalCrown({ className = "w-8 h-8 text-[#d4af37]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Crown base */}
      <path d="M12 48h40v4H12z" opacity="0.9" />
      <path d="M14 44h36v2H14z" opacity="0.7" />
      {/* Crown body with 5 peaks and jewels */}
      <path d="M10 22l8 18h28l8-18-12 8-10-18-10 18-12-8z" />
      {/* Top jewels */}
      <circle cx="10" cy="20" r="3" />
      <circle cx="22" cy="30" r="2.5" />
      <circle cx="32" cy="12" r="3.5" />
      <circle cx="42" cy="30" r="2.5" />
      <circle cx="54" cy="20" r="3" />
      {/* Base jewels */}
      <circle cx="20" cy="46" r="1.8" fill="#064e3b" />
      <circle cx="32" cy="46" r="2.2" fill="#064e3b" />
      <circle cx="44" cy="46" r="1.8" fill="#064e3b" />
    </svg>
  );
}

export function RoyalCorner({
  className = "w-12 h-12 text-[#d4af37]",
  position = "top-left",
}: {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const transform =
    position === "top-right"
      ? "scaleX(-1)"
      : position === "bottom-left"
      ? "scaleY(-1)"
      : position === "bottom-right"
      ? "scale(-1, -1)"
      : "none";

  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      style={{ transform }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M4 56V16a12 12 0 0 1 12-12h40" />
      <path d="M10 56V20a10 10 0 0 1 10-10h36" opacity="0.6" strokeDasharray="3 3" />
      <path d="M4 4l12 12M8 4l8 8M4 8l8 8" opacity="0.8" />
      <circle cx="16" cy="16" r="3" fill="currentColor" fillOpacity="0.3" />
      <circle cx="4" cy="4" r="2" fill="currentColor" />
    </svg>
  );
}

export function RoyalDivider({ className = "w-full max-w-xs text-[#d4af37]" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-4 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-[#d4af37]" />
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-1.5 h-1.5 rotate-45 border border-[#d4af37]/80 bg-[#064e3b]" />
        <span className="w-2.5 h-2.5 rotate-45 border border-[#ffd700] bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
        <span className="w-1.5 h-1.5 rotate-45 border border-[#d4af37]/80 bg-[#064e3b]" />
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#d4af37]/60 to-[#d4af37]" />
    </div>
  );
}

export function DiamondGem({ className = "w-5 h-5 text-[#d4af37]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2L2 9l10 13L22 9 12 2zm0 3.2L18.4 9H5.6L12 5.2zM4.6 10.5h4.6l2.8 8-7.4-8zm6.4 8.5l-2.6-7.5h7.2L12 19zm4.4-8.5h4.6l-7.4 8 2.8-8z" />
    </svg>
  );
}

export function RoyalSeal({
  initials = "H",
  className = "w-20 h-20",
}: {
  initials?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-full flex items-center justify-center p-1.5 shadow-[0_0_25px_rgba(212,175,55,0.35)] ${className}`}
      style={{
        background: "linear-gradient(135deg, #d4af37 0%, #064e3b 50%, #022c22 100%)",
      }}
    >
      <div className="w-full h-full rounded-full border border-[#f3e5ab]/60 bg-[#02241b] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle radial inner glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.25)_0%,transparent_70%)]" />
        <RoyalCrown className="w-4 h-4 text-[#ffd700] mb-0.5" />
        <span
          className="font-serif text-lg font-bold tracking-widest leading-none bg-gradient-to-b from-[#fff2cc] via-[#d4af37] to-[#aa820a] bg-clip-text text-transparent"
        >
          {initials}
        </span>
      </div>
    </div>
  );
}

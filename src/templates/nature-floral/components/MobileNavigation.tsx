"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Heart,
  Calendar,
  Image as ImageIcon,
  CheckSquare,
  MessageSquare,
} from "lucide-react";
import { playFloralSound } from "../sound";

const NAV_ITEMS = [
  { id: "section-hero", label: "Home", Icon: Home },
  { id: "section-couple", label: "Mempelai", Icon: Heart },
  { id: "section-event", label: "Acara", Icon: Calendar },
  { id: "section-gallery", label: "Galeri", Icon: ImageIcon },
  { id: "section-rsvp", label: "RSVP", Icon: CheckSquare },
  { id: "section-messages", label: "Doa", Icon: MessageSquare },
];

export function MobileNavigation() {
  const [activeSection, setActiveSection] = useState<string>("section-hero");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevSectionRef = useRef<string>("section-hero");

  const showBriefTooltip = (id: string) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setActiveTooltip(id);
    tooltipTimeoutRef.current = setTimeout(() => {
      setActiveTooltip(null);
    }, 1800);
  };

  const isNavigatingRef = useRef<boolean>(false);

  // Track active section on scroll and trigger brief tooltip when entering new section manually
  useEffect(() => {
    const handleScroll = () => {
      if (isNavigatingRef.current) return;
      const scrollPos = window.scrollY + 220;
      for (const item of [...NAV_ITEMS].reverse()) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPos) {
          if (prevSectionRef.current !== item.id) {
            prevSectionRef.current = item.id;
            setActiveSection(item.id);
            showBriefTooltip(item.id);
          }
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const handleNavClick = (id: string) => {
    playFloralSound("click");
    isNavigatingRef.current = true;
    setActiveSection(id);
    prevSectionRef.current = id;
    showBriefTooltip(id);

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "instant" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // Unblock scroll tracking after jump settles
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 150);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed bottom-3 sm:bottom-5 inset-x-0 lg:inset-x-auto lg:w-[500px] lg:right-0 lg:left-auto z-40 flex items-center justify-center px-4 pointer-events-none select-none"
      aria-label="Menu Navigasi Mobile"
    >
      {/* Dock Navigasi Utama: Jarak Antar Icon Lebih Rapat & Ringkas */}
      <div className="rounded-full bg-white/95 backdrop-blur-md border border-[#c5a880]/60 shadow-[0_8px_30px_rgba(45,74,62,0.18)] px-2 sm:px-3 py-1.5 flex items-center gap-1 sm:gap-1.5 pointer-events-auto">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeSection === id;
          const isTooltipVisible = activeTooltip === id;

          return (
            <div key={id} className="relative flex items-center justify-center">
              {/* Tooltip Nama Seksi: Diposisikan Tinggi di Atas Dock Menu */}
              <AnimatePresence>
                {isTooltipVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.85 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute -top-11 sm:-top-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#2d4a3e] text-[#fbf8f3] border border-[#c5a880] shadow-lg text-[10px] sm:text-[11px] font-semibold whitespace-nowrap pointer-events-none z-50 flex items-center justify-center"
                  >
                    <span>{label}</span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#2d4a3e] border-b border-r border-[#c5a880] rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tombol Navigasi Icon Saja dengan Jarak Rapat */}
              <button
                type="button"
                onClick={() => handleNavClick(id)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#2d4a3e] text-[#fef08a] shadow-xs scale-105"
                    : "text-[#5a7263] hover:bg-[#e8eee5] hover:text-[#2d4a3e]"
                }`}
                title={label}
                aria-label={label}
              >
                <Icon
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${
                    isActive ? "text-[#fef08a]" : "text-[#5a7263]"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </button>
            </div>
          );
        })}
      </div>
    </motion.nav>
  );
}

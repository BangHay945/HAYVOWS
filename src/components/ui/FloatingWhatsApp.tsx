"use client";

import { CONTACT_INFO, getWhatsAppUrl } from "@/lib/contact";

export function FloatingWhatsApp({
  message,
}: {
  message?: string;
}) {
  const href = getWhatsAppUrl(message);

  return (
    <aside aria-label="Kontak WhatsApp" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center group">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Hubungi kami via WhatsApp di ${CONTACT_INFO.phoneFormatted}`}
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
      >
        {/* WhatsApp SVG Icon */}
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 fill-current shrink-0"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.995.544 1.776.84 2.801.84 3.177 0 5.767-2.587 5.767-5.766.001-3.187-2.575-5.77-5.772-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.073-1.042-.058-.291-.093-.654-.23-1.16-.452-1.998-.874-3.324-2.883-3.424-3.018-.1-.135-.806-1.071-.806-2.044 0-.973.51-1.45.692-1.65.178-.198.39-.247.52-.247.13 0 .26.002.373.007.12.006.28-.046.438.334.16.386.548 1.336.596 1.434.048.099.08.214.015.344-.065.13-.098.212-.194.324-.098.113-.205.253-.293.34-.098.098-.201.205-.087.401.114.195.508.838 1.09 1.356.75.667 1.382.873 1.577.971.196.098.31.082.424-.049.115-.13.491-.57.622-.765.13-.195.26-.163.438-.098.178.065 1.13.533 1.325.63.195.098.325.146.373.228.048.082.048.47-.096.875zm-3.392-10.416c-4.417 0-8.031 3.614-8.031 8.031 0 1.408.366 2.784 1.062 4.004l-1.129 4.126 4.223-1.107c1.177.643 2.505.987 3.875.987 4.416 0 8.031-3.614 8.031-8.031 0-4.417-3.614-8.01-8.031-8.01z" />
        </svg>

        <span className="hidden sm:inline font-bold text-xs tracking-wide whitespace-nowrap">
          Chat WhatsApp
        </span>

        {/* Pulse active dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
      </a>
    </aside>
  );
}

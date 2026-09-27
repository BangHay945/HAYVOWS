"use client";

import Image from "next/image";
import { CONTACT_INFO, getWhatsAppUrl } from "@/lib/contact";

export function FloatingWhatsApp({
  message,
}: {
  message?: string;
}) {
  const href = getWhatsAppUrl(message);

  return (
    <aside
      aria-label="Kontak WhatsApp"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Hubungi kami via WhatsApp di ${CONTACT_INFO.phoneFormatted}`}
        className="relative block rounded-full transition-transform duration-300 hover:scale-110 active:scale-95 drop-shadow-xl hover:drop-shadow-2xl cursor-pointer group"
      >
        {/* WhatsApp Icon Image */}
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden flex items-center justify-center">
          <Image
            src="/whatsapp-icon.webp"
            alt="WhatsApp CS Hayvows"
            width={56}
            height={56}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Dot Nyala Merah di Kanan Atas Nempel ke Icon */}
        <span className="absolute top-1 right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3 pointer-events-none">
          {/* Efek Nyala / Ping Animasi */}
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          {/* Titik Merah Solid dengan Ring Putih & Glow */}
          <span className="relative inline-flex rounded-full h-full w-full bg-red-600 ring-[1.5px] ring-white shadow-[0_0_6px_rgba(239,68,68,0.9)]"></span>
        </span>
      </a>
    </aside>
  );
}

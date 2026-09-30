/**
 * Konfigurasi Kontak Resmi Hayvows
 */
export const CONTACT_INFO = {
  phone: "085855556433",
  phoneFormatted: "0858-5555-6433",
  whatsappNumber: "6285855556433",
  whatsappUrl: "https://wa.me/6285855556433",
  whatsappDefaultMessage:
    "Halo Admin Hayvows, saya ingin tanya seputar undangan pernikahan digital",
  email: "admin@hayvows.com",
} as const;

export function getWhatsAppUrl(customMessage?: string): string {
  const message = customMessage || CONTACT_INFO.whatsappDefaultMessage;
  return `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}

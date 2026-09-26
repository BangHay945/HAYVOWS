/**
 * Sistem Feature Flag & Admin Preview Hayvows
 * 
 * Mengatur visibilitas dan hak akses fitur baru:
 * - enabledForClients: false -> Fitur hanya bisa dilihat & diuji coba oleh Super Admin (userRole === "admin")
 * - enabledForClients: true  -> Fitur aktif secara luas untuk seluruh pengguna publik
 */

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabledForClients: boolean;
  category: "invitation" | "system" | "dashboard";
}

export const SYSTEM_FEATURES: Record<string, FeatureFlag> = {
  // 1. Fitur Amplop Digital & Konfirmasi Kado Tamu (Sudah Rilis Publik)
  guest_gift_confirmation: {
    id: "guest_gift_confirmation",
    name: "Konfirmasi Transfer Kado Tamu",
    description: "Formulir konfirmasi bukti transfer dan nominal kado dari amplop digital tamu.",
    enabledForClients: true,
    category: "invitation",
  },

  // 2. Pembaruan Sistem Langsung dari Dashboard (Mode Khusus Super Admin)
  dashboard_system_updater: {
    id: "dashboard_system_updater",
    name: "Updater Sistem Dashboard",
    description: "Panel kontrol status update Git dan sinkronisasi sistem bagi Super Admin.",
    enabledForClients: false, // Hanya Super Admin yang bisa akses
    category: "system",
  },

  // 3. Notifikasi Email RSVP & Ucapan Otomatis ke Email Mempelai (Tahap Uji Coba Beta)
  rsvp_email_notifications: {
    id: "rsvp_email_notifications",
    name: "Notifikasi Email RSVP & Ucapan",
    description: "Pengiriman email otomatis ke mempelai saat ada tamu mengisi formulir RSVP atau ucapan.",
    enabledForClients: false, // Super Admin preview
    category: "invitation",
  },

  // 4. Live Display & Proyektor QR Code Check-in Resepsi
  reception_display_mode: {
    id: "reception_display_mode",
    name: "Layar Proyektor Resepsi (Live Display)",
    description: "Halaman layar lebar untuk proyektor venue resepsi dengan ucapan live dan QR check-in.",
    enabledForClients: true,
    category: "dashboard",
  },
};

/**
 * Mengecek apakah suatu fitur dapat diakses oleh role pengguna saat ini.
 * Super Admin (role === "admin") selalu mendapatkan akses ke SEMUA fitur untuk keperluan pengujian internal.
 */
export function isFeatureAvailable(featureKey: keyof typeof SYSTEM_FEATURES | string, userRole?: string): boolean {
  if (userRole === "admin") {
    return true; // Super Admin memiliki akses penuh ke seluruh fitur (termasuk fitur beta/draft)
  }
  const feature = SYSTEM_FEATURES[featureKey];
  return feature ? feature.enabledForClients : false;
}

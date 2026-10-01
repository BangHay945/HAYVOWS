/**
 * Layanan Integrasi WhatsApp Gateway Fonnte (https://fonnte.com)
 * Digunakan untuk pengiriman otomatis pesan E-Tiket Presensi QR & notifikasi RSVP
 */

export interface SendFonnteOptions {
  target: string;
  message: string;
  url?: string;
  filename?: string;
}

export interface RSVPTicketWhatsAppPayload {
  phone: string;
  guestName: string;
  coupleTitle: string;
  weddingSlug: string;
  guestSlug: string;
  attendanceStatus: string;
  guestCount: number;
  eventDate?: string | Date;
  eventVenue?: string;
  qrCode: string;
}

/**
 * Normalisasi nomor HP Indonesia ke format standar internasional tanpa tanda plus
 * Contoh:
 * 0812-3456-7890 -> 6281234567890
 * +62 812 3456   -> 628123456
 * 628123456789   -> 628123456789
 */
export function normalizeIndonesianPhone(phone: string): string {
  if (!phone) return "";
  let clean = phone.replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  } else if (!clean.startsWith("62") && clean.length >= 8) {
    clean = "62" + clean;
  }
  return clean;
}

/**
 * Kirim pesan WhatsApp melalui Fonnte API
 */
export async function sendFonnteMessage({
  target,
  message,
  url,
  filename,
}: SendFonnteOptions): Promise<{ success: boolean; data?: any; error?: string }> {
  const token = process.env.FONNTE_TOKEN;

  if (!token || !token.trim()) {
    console.warn(
      "[Fonnte] FONNTE_TOKEN belum dikonfigurasi di file .env. Pesan WhatsApp tidak dikirim."
    );
    return {
      success: false,
      error: "FONNTE_TOKEN_NOT_CONFIGURED",
    };
  }

  const cleanTarget = normalizeIndonesianPhone(target);
  if (!cleanTarget || cleanTarget.length < 9) {
    return {
      success: false,
      error: "INVALID_PHONE_NUMBER",
    };
  }

  try {
    const payload: Record<string, any> = {
      target: cleanTarget,
      message,
      countryCode: "62",
    };

    if (url && url.trim()) {
      payload.url = url.trim();
      if (filename) payload.filename = filename;
    }

    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token.trim(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || (data && data.status === false)) {
      console.error("[Fonnte] Gagal mengirim pesan WhatsApp:", data);
      return {
        success: false,
        error: data?.reason || "FONNTE_API_ERROR",
        data,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("[Fonnte] Error saat memanggil API Fonnte:", error);
    return {
      success: false,
      error: error?.message || "NETWORK_ERROR",
    };
  }
}

/**
 * Kirim E-Tiket Presensi QR otomatis ke WhatsApp tamu setelah reservasi (RSVP)
 */
export async function sendRSVPTicketWhatsApp({
  phone,
  guestName,
  coupleTitle,
  weddingSlug,
  guestSlug,
  attendanceStatus,
  guestCount,
  eventDate,
  eventVenue,
  qrCode,
}: RSVPTicketWhatsAppPayload): Promise<{ success: boolean; data?: any; error?: string }> {
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "https://www.hayvows.com"
  ).replace(/\/+$/, "");
  const ticketUrl = `${appUrl}/invitation/${weddingSlug}/${guestSlug}`;
  const isAttending = attendanceStatus === "attending";

  let formattedDate: string | undefined;
  if (eventDate) {
    if (typeof eventDate === "string") {
      formattedDate = eventDate;
    } else {
      try {
        formattedDate = new Intl.DateTimeFormat("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(eventDate));
      } catch {
        formattedDate = String(eventDate);
      }
    }
  }

  // URL gambar QR Code dinamis resolusi tinggi (bisa langsung dipratinjau & disimpan tamu di WA)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encodeURIComponent(
    qrCode
  )}&format=png&margin=10`;

  const message = [
    `Halo Kak *${guestName}*,`,
    "",
    `Terima kasih telah melakukan konfirmasi kehadiran (RSVP) untuk pernikahan:`,
    `💍 *${coupleTitle}*`,
    "",
    `Berikut adalah *E-Tiket Presensi QR* resmi Anda:`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🎟️ *Kode Tiket:* \`${qrCode}\``,
    `👤 *Nama Tamu:* ${guestName}`,
    `📋 *Status:* ${isAttending ? "✓ Akan Hadir" : "✕ Berhalangan Hadir"}`,
    isAttending ? `👥 *Jumlah Kehadiran:* ${guestCount} Orang` : null,
    formattedDate ? `📅 *Tanggal:* ${formattedDate}` : null,
    eventVenue ? `📍 *Lokasi:* ${eventVenue}` : null,
    `━━━━━━━━━━━━━━━━━━━━`,
    "",
    `🔗 *Buka Tiket Digital & Undangan:*`,
    `${ticketUrl}`,
    "",
    `💡 *Petunjuk Presensi Hari H:*`,
    `Simpan gambar QR di atas dan tunjukkan kepada petugas penerima tamu saat tiba di lokasi resepsi untuk verifikasi kehadiran instan.`,
    "",
    `Sampai jumpa di hari bahagia kami! 🙏✨`,
    "",
    `_Pesan otomatis dari Hayvows Smart Wedding Ecosystem_`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return sendFonnteMessage({
    target: phone,
    message,
    url: qrImageUrl,
    filename: `Tiket-QR-${guestSlug}.png`,
  });
}

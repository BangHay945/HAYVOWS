import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const senderEmail = process.env.EMAIL_FROM || "Hayvows <noreply@hayvows.com>";

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Base email wrapper template with elegant Hayvows styling
function emailWrapper({ title, content }: { title: string; content: string }) {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f3ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f6f3ee; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2ded5;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #2d4a3e 0%, #1e332b 100%); padding: 32px 20px; text-align: center;">
              <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td align="center">
                    <div style="font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #ffffff; font-family: Georgia, serif;">
                      HAYVOWS<span style="color: #c9a84c;">.</span>
                    </div>
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #c9a84c; margin-top: 4px; font-weight: 600;">
                      Digital Wedding Platform
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px; font-size: 14px; line-height: 1.6; color: #334155;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fbf9f5; padding: 24px 30px; text-align: center; border-top: 1px solid #eee8df; font-size: 11px; color: #64748b;">
              <p style="margin: 0 0 6px 0;">&copy; ${new Date().getFullYear()} Hayvows. Ekosistem Resepsi Pernikahan Digital.</p>
              <p style="margin: 0; color: #94a3b8;">Email ini dikirim otomatis oleh sistem Hayvows. Jangan membalas langsung email ini.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * 1. Kirim Email Selamat Datang saat Pengguna Baru Mendaftar
 */
export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const subject = "Selamat Datang di Hayvows — Mulai Buat Undangan Pernikahan Anda";
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const dashboardUrl = `${appUrl}/dashboard`;

  const content = `
    <h2 style="font-size: 20px; font-weight: bold; color: #1e293b; margin-top: 0; margin-bottom: 16px;">
      Halo, ${name || "Calon Pengantin"}! 👋
    </h2>
    <p style="margin-bottom: 16px;">
      Selamat bergabung di <strong>Hayvows</strong>! Akun Anda telah berhasil dibuat. Sekarang Anda dapat mulai merancang undangan pernikahan impian yang elegan, interaktif, dan terhubung langsung ke meja resepsi.
    </p>

    <!-- Highlight Box -->
    <div style="background-color: #f4f8f6; border-left: 4px solid #2d4a3e; padding: 16px; border-radius: 8px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; font-weight: bold; color: #2d4a3e; font-size: 13px;">Langkah Selanjutnya:</p>
      <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #334155;">
        <li style="margin-bottom: 4px;">Pilih tema desain (Adat Jawa, Botanical Floral, Noir, RPG 2D).</li>
        <li style="margin-bottom: 4px;">Isi profil kedua mempelai dan rundown acara.</li>
        <li>Unduh file QR siap cetak atau buat link WhatsApp 1-klik untuk tamu.</li>
      </ul>
    </div>

    <!-- CTA Button -->
    <table border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
      <tr>
        <td align="center" style="border-radius: 12px; background-color: #2d4a3e;">
          <a href="${dashboardUrl}" target="_blank" style="font-size: 14px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 28px; display: inline-block; border-radius: 12px;">
            Masuk ke Dashboard
          </a>
        </td>
      </tr>
    </table>

    <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">
      Atau buka tautan berikut di peramban Anda: <br/>
      <a href="${dashboardUrl}" style="color: #2d4a3e; word-break: break-all;">${dashboardUrl}</a>
    </p>
  `;

  return sendEmail({
    to,
    subject,
    html: emailWrapper({ title: subject, content }),
  });
}

/**
 * 2. Kirim Email Bukti Pembayaran / Invoice Paket Midtrans Sukses
 */
export async function sendPaymentSuccessEmail({
  to,
  name,
  planName,
  amount,
  orderId,
}: {
  to: string;
  name: string;
  planName: string;
  amount: number;
  orderId: string;
}) {
  const subject = `Bukti Pembayaran Berhasil — Hayvows ${planName} (${orderId})`;
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const dashboardUrl = `${appUrl}/dashboard`;
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; background-color: #e6f4ea; color: #137333; font-size: 24px; font-weight: bold;">
        ✓
      </div>
      <h2 style="font-size: 20px; font-weight: bold; color: #1e293b; margin: 12px 0 4px 0;">
        Pembayaran Berhasil!
      </h2>
      <p style="font-size: 13px; color: #64748b; margin: 0;">
        Terima kasih, ${name}. Akun Anda telah berhasil di-upgrade.
      </p>
    </div>

    <!-- Invoice Details Table -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">No. Transaksi</td>
        <td align="right" style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: bold; font-family: monospace; color: #1e293b;">${orderId}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">Paket Layanan</td>
        <td align="right" style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: bold; color: #2d4a3e;">${planName}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">Tanggal Pembayaran</td>
        <td align="right" style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #1e293b;">${new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}</td>
      </tr>
      <tr>
        <td style="padding: 16px; font-size: 14px; font-weight: bold; color: #1e293b;">Total Bayar</td>
        <td align="right" style="padding: 16px; font-size: 16px; font-weight: 800; color: #2d4a3e;">${formattedAmount}</td>
      </tr>
    </table>

    <p style="margin-bottom: 20px;">
      Seluruh fitur premium (termasuk Studio Desain QR 300 DPI Siap Cetak, Buku Tamu Digital, dan Layar Sapa TV) kini telah aktif tanpa batas.
    </p>

    <!-- CTA Button -->
    <table border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
      <tr>
        <td align="center" style="border-radius: 12px; background-color: #2d4a3e;">
          <a href="${dashboardUrl}" target="_blank" style="font-size: 14px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 28px; display: inline-block; border-radius: 12px;">
            Buka Fitur Premium di Dashboard
          </a>
        </td>
      </tr>
    </table>

    <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">
      Tautan langsung: <a href="${dashboardUrl}" style="color: #2d4a3e; word-break: break-all;">${dashboardUrl}</a>
    </p>
  `;

  return sendEmail({
    to,
    subject,
    html: emailWrapper({ title: subject, content }),
  });
}

/**
 * 3. Kirim Email Notifikasi Konfirmasi Kehadiran (RSVP) Baru untuk Mempelai
 */
export async function sendRSVPNotificationEmail({
  to,
  coupleName,
  guestName,
  status,
  guestCount,
  message,
  weddingSlug,
}: {
  to: string;
  coupleName: string;
  guestName: string;
  status: "attending" | "not_attending";
  guestCount: number;
  message?: string;
  weddingSlug?: string;
}) {
  const isAttending = status === "attending";
  const subject = isAttending
    ? `🎉 ${guestName} Mengonfirmasi HADIR di Pernikahan Anda`
    : `💌 Konfirmasi RSVP Baru dari ${guestName}`;

  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const dashboardUrl = `${appUrl}/dashboard`;
  const invitationUrl = weddingSlug ? `${appUrl}/${weddingSlug}` : dashboardUrl;

  const statusBadge = isAttending
    ? `<span style="background-color: #dcfce7; color: #166534; font-weight: bold; padding: 4px 12px; border-radius: 20px; font-size: 12px;">Hadir (${guestCount} Orang)</span>`
    : `<span style="background-color: #fee2e2; color: #991b1b; font-weight: bold; padding: 4px 12px; border-radius: 20px; font-size: 12px;">Tidak Dapat Hadir</span>`;

  const content = `
    <h2 style="font-size: 18px; font-weight: bold; color: #1e293b; margin-top: 0; margin-bottom: 12px;">
      Hai, ${coupleName}! 💍
    </h2>
    <p style="margin-bottom: 16px;">
      Ada tamu yang baru saja mengisi konfirmasi kehadiran (RSVP) pada undangan pernikahan Anda:
    </p>

    <!-- Guest Card -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
      <tr>
        <td style="font-size: 14px; font-weight: bold; color: #0f172a; padding-bottom: 8px;">
          ${guestName}
        </td>
      </tr>
      <tr>
        <td style="padding-bottom: 12px;">
          ${statusBadge}
        </td>
      </tr>
      ${
        message
          ? `
      <tr>
        <td style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 13px; font-style: italic; color: #475569;">
          &ldquo;${message}&rdquo;
        </td>
      </tr>
      `
          : ""
      }
    </table>

    <p style="margin-bottom: 20px; font-size: 13px;">
      Data kehadiran ini sudah otomatis disinkronkan ke Buku Tamu Digital dan Kalkulator Katering di dashboard Anda.
    </p>

    <!-- CTA Button -->
    <table border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0;">
      <tr>
        <td align="center" style="border-radius: 12px; background-color: #2d4a3e;">
          <a href="${dashboardUrl}" target="_blank" style="font-size: 13px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 24px; display: inline-block; border-radius: 12px;">
            Buka Buku Tamu & RSVP di Dashboard
          </a>
        </td>
      </tr>
    </table>

    <div style="font-size: 12px; color: #64748b; line-height: 1.8; margin-top: 16px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
      <div>• <strong>Cek Rekap Dashboard</strong>: <a href="${dashboardUrl}" style="color: #2d4a3e;">${dashboardUrl}</a></div>
      ${weddingSlug ? `<div>• <strong>Lihat Halaman Undangan</strong>: <a href="${invitationUrl}" style="color: #2d4a3e;">${invitationUrl}</a></div>` : ""}
    </div>
  `;

  return sendEmail({
    to,
    subject,
    html: emailWrapper({ title: subject, content }),
  });
}

/**
 * 4. Kirim Email Notifikasi Konfirmasi Kado / Transfer Tanda Kasih untuk Mempelai
 */
export async function sendGiftNotificationEmail({
  to,
  coupleName,
  guestName,
  bankName,
  amount,
  accountSender,
  notes,
}: {
  to: string;
  coupleName: string;
  guestName: string;
  bankName: string;
  amount: number;
  accountSender?: string | null;
  notes?: string | null;
}) {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

  const subject = `🎁 Konfirmasi Tanda Kasih Baru dari ${guestName} (${formattedAmount})`;
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const dashboardUrl = `${appUrl}/dashboard`;

  const content = `
    <h2 style="font-size: 18px; font-weight: bold; color: #1e293b; margin-top: 0; margin-bottom: 12px;">
      Hai, ${coupleName}! 🎁
    </h2>
    <p style="margin-bottom: 16px;">
      Kabar gembira! Ada tamu yang baru saja mengirimkan konfirmasi transfer tanda kasih / kado digital untuk pernikahan Anda:
    </p>

    <!-- Gift Details Table -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px;">
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">Nama Tamu Pengirim</td>
        <td align="right" style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: bold; color: #0f172a;">${guestName}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">Bank Tujuan</td>
        <td align="right" style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: bold; color: #2d4a3e;">${bankName}</td>
      </tr>
      ${
        accountSender
          ? `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">Rekening / Nama Pengirim</td>
        <td align="right" style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #334155;">${accountSender}</td>
      </tr>
      `
          : ""
      }
      <tr>
        <td style="padding: 14px 16px; font-size: 13px; font-weight: bold; color: #1e293b;">Nominal Tanda Kasih</td>
        <td align="right" style="padding: 14px 16px; font-size: 16px; font-weight: 800; color: #2d4a3e;">${formattedAmount}</td>
      </tr>
      ${
        notes
          ? `
      <tr>
        <td colspan="2" style="border-top: 1px solid #e2e8f0; padding: 14px 16px; background-color: #f1f5f9; font-size: 13px; font-style: italic; color: #475569;">
          &ldquo;${notes}&rdquo;
        </td>
      </tr>
      `
          : ""
      }
    </table>

    <!-- CTA Button -->
    <table border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0;">
      <tr>
        <td align="center" style="border-radius: 12px; background-color: #2d4a3e;">
          <a href="${dashboardUrl}" target="_blank" style="font-size: 13px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 24px; display: inline-block; border-radius: 12px;">
            Buka Rekap Amplop Digital di Dashboard
          </a>
        </td>
      </tr>
    </table>

    <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">
      Tautan langsung rekap: <a href="${dashboardUrl}" style="color: #2d4a3e; word-break: break-all;">${dashboardUrl}</a>
    </p>
  `;

  return sendEmail({
    to,
    subject,
    html: emailWrapper({ title: subject, content }),
  });
}

/**
 * Core send email executor
 */
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    if (!resend) {
      console.log(
        `\n📧 [EMAIL_DEV_SIMULASI] Kepada: ${to}\nSubjek: ${subject}\n(Catatan: Masukkan RESEND_API_KEY di .env untuk kirim email sungguhan)\n`
      );
      return { success: true, isSimulated: true };
    }

    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("[RESEND_ERROR]", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("[EMAIL_SEND_EXCEPTION]", err);
    return { success: false, error: err?.message || "Gagal mengirim email" };
  }
}

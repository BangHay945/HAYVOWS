import { NextResponse } from "next/server";
import { submitRSVP } from "@/lib/rsvp";
import { submitMessage } from "@/lib/messages";
import { prisma } from "@/lib/prisma";
import type { Guest } from "@prisma/client";
import { isDemoWedding } from "@/lib/demo";
import { validateGuestMessage } from "@/lib/security/contentFilter";
import { sendRSVPNotificationEmail } from "@/lib/email";
import { sendRSVPTicketWhatsApp, normalizeIndonesianPhone } from "@/lib/whatsapp/fonnte";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z
  .object({
    weddingId: z.string(),
    guestId: z.string().optional(),
    guestName: z.string().optional(),
    guestAddress: z.string().optional(),
    phone: z.string().optional(),
    attendanceStatus: z.enum(["attending", "not_attending"]).optional(),
    status: z.enum(["attending", "not_attending"]).optional(),
    guestCount: z.number().min(0).max(20).optional(),
    message: z.string().optional(),
    source: z.string().optional(), // "printed_qr" | "web"
  })
  .transform((val) => {
    const finalStatus = (val.attendanceStatus || val.status || "attending") as
      | "attending"
      | "not_attending";
    const finalCount =
      finalStatus === "attending" ? Math.max(1, val.guestCount ?? 1) : 0;
    return {
      ...val,
      attendanceStatus: finalStatus,
      guestCount: finalCount,
    };
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const wedding = await prisma.wedding.findUnique({
      where: { id: data.weddingId },
      include: {
        couple: true,
        template: true,
        user: true,
        events: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!wedding) {
      return NextResponse.json({ error: "Wedding tidak ditemukan" }, { status: 404 });
    }

    // Smart Content Security Filter (Anti-Racism & Profanity)
    if (data.message && data.message.trim()) {
      const contentCheck = validateGuestMessage(data.message);
      if (!contentCheck.isSafe) {
        return NextResponse.json(
          {
            error:
              contentCheck.reason ||
              "Pesan doa restu terdeteksi mengandung kata-kata yang tidak pantas.",
            category: contentCheck.category,
          },
          { status: 422 }
        );
      }
    }

    let targetGuestId = data.guestId;
    let targetGuest: Guest | null = null;

    // If guestId is provided, check if valid
    if (targetGuestId && targetGuestId !== "new" && targetGuestId !== "public") {
      targetGuest = await prisma.guest.findUnique({
        where: { id: targetGuestId },
      });
      if (targetGuest) {
        // Keep existing guest data updated with latest form submission
        targetGuest = await prisma.guest.update({
          where: { id: targetGuest.id },
          data: {
            name: data.guestName?.trim() || targetGuest.name,
            address: data.guestAddress?.trim() || targetGuest.address,
            phone: data.phone?.trim() || targetGuest.phone,
            guestCount: data.guestCount,
            attendanceStatus: data.attendanceStatus,
          },
        });
      }
    }

    // If no existing guest was found and guestName is provided (Public / Printed QR submission)
    if (!targetGuest && data.guestName && data.guestName.trim()) {
      const cleanName = data.guestName.trim();
      const cleanPhone = data.phone ? normalizeIndonesianPhone(data.phone) : "";

      // Check if a guest with this phone number OR exact name already exists in this wedding (Prevent Duplication)
      const allGuests = await prisma.guest.findMany({
        where: { weddingId: wedding.id },
      });
      const existing = allGuests.find((g) => {
        const gPhoneNorm = g.phone ? normalizeIndonesianPhone(g.phone) : "";
        const samePhone = Boolean(cleanPhone && gPhoneNorm && cleanPhone === gPhoneNorm);
        const sameName = g.name.trim().toLowerCase() === cleanName.toLowerCase();
        return samePhone || sameName;
      });

      if (existing) {
        // Update existing guest data without creating a duplicate row
        targetGuest = await prisma.guest.update({
          where: { id: existing.id },
          data: {
            name: cleanName, // Update name if edited
            address: data.guestAddress?.trim() || existing.address,
            phone: data.phone?.trim() || existing.phone,
            guestCount: data.guestCount,
            attendanceStatus: data.attendanceStatus,
          },
        });
        targetGuestId = targetGuest.id;
      } else {
        const baseSlug = cleanName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 30);
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        const uniqueGuestSlug = `${baseSlug || "tamu"}-${randomSuffix}`;
        const weddingTokenPrefix = wedding.slug.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase();
        const generatedQrCode = `HVW-${weddingTokenPrefix}-${uniqueGuestSlug.toUpperCase()}`;

        targetGuest = await prisma.guest.create({
          data: {
            weddingId: wedding.id,
            name: cleanName,
            slug: uniqueGuestSlug,
            phone: data.phone?.trim() || "",
            address: data.guestAddress?.trim() || "",
            category: data.source === "printed_qr" ? "Undangan Cetak" : "Public RSVP",
            guestCount: data.guestCount,
            qrCode: generatedQrCode,
            attendanceStatus: data.attendanceStatus,
          },
        });

        targetGuestId = targetGuest.id;
      }
    }

    if (!targetGuestId || !targetGuest) {
      return NextResponse.json(
        { error: "Identitas tamu wajib diisi (Nama atau Guest ID)" },
        { status: 400 }
      );
    }

    const rsvp = await submitRSVP({
      weddingId: data.weddingId,
      guestId: targetGuestId,
      attendanceStatus: data.attendanceStatus,
      guestCount: data.guestCount,
    });

    if (data.message && data.message.trim()) {
      // Do not pollute demo weddings with messages
      if (!isDemoWedding(wedding.slug)) {
        await submitMessage({
          weddingId: data.weddingId,
          guestId: targetGuestId,
          message: data.message.trim(),
          autoApprove: wedding.messageMode !== "approval",
        });
      }
    }

    // Update nomor WhatsApp tamu jika diisi dalam form RSVP
    if (data.phone?.trim() && targetGuest.phone !== data.phone.trim()) {
      targetGuest = await prisma.guest.update({
        where: { id: targetGuest.id },
        data: { phone: data.phone.trim() },
      });
    }

    const coupleNames =
      wedding.couple?.groomNickname && wedding.couple?.brideNickname
        ? `${wedding.couple.groomNickname} & ${wedding.couple.brideNickname}`
        : wedding.user?.name || "Kedua Mempelai";

    // Kirim E-Tiket Presensi QR otomatis ke WhatsApp tamu via Fonnte Gateway
    const targetPhone = data.phone?.trim() || targetGuest.phone?.trim();
    let whatsappDispatched = false;

    if (targetPhone) {
      let qrToken = targetGuest.qrCode;
      if (!qrToken) {
        qrToken = `HVW-${wedding.slug.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase()}-${targetGuest.slug.toUpperCase()}`;
        try {
          targetGuest = await prisma.guest.update({
            where: { id: targetGuest.id },
            data: { qrCode: qrToken },
          });
        } catch {
          // Keep current targetGuest
        }
      }

      const firstEvent = wedding.events && wedding.events.length > 0 ? wedding.events[0] : null;
      const eventVenue = firstEvent
        ? [firstEvent.venue, firstEvent.address].filter(Boolean).join(" - ") || undefined
        : undefined;

      sendRSVPTicketWhatsApp({
        phone: targetPhone,
        guestName: targetGuest.name,
        coupleTitle: coupleNames,
        weddingSlug: wedding.slug,
        guestSlug: targetGuest.slug,
        attendanceStatus: data.attendanceStatus,
        guestCount: data.guestCount,
        eventDate: firstEvent?.date,
        eventVenue,
        qrCode: qrToken,
      })
        .then((res) => {
          if (res.success) {
            console.log(`[Fonnte] E-Tiket QR berhasil dikirim ke WhatsApp ${targetPhone}`);
          }
        })
        .catch((err) => console.error("[FONNTE_WA_TICKET_FAILED]", err));

      whatsappDispatched = true;
    }

    // Kirim notifikasi email ke pemilik undangan (non-blocking & bukan demo)
    if (!isDemoWedding(wedding.slug) && wedding.user?.email) {
      sendRSVPNotificationEmail({
        to: wedding.user.email,
        coupleName: coupleNames,
        guestName: targetGuest.name,
        status: data.attendanceStatus,
        guestCount: data.guestCount,
        message: data.message?.trim() || undefined,
        weddingSlug: wedding.slug,
      }).catch((err) => console.error("[RSVP_EMAIL_NOTIF_FAILED]", err));
    }

    return NextResponse.json(
      {
        success: true,
        rsvp,
        whatsappSent: whatsappDispatched,
        guest: {
          id: targetGuest.id,
          name: targetGuest.name,
          slug: targetGuest.slug,
          phone: targetGuest.phone,
          address: targetGuest.address,
          category: targetGuest.category,
          guestCount: targetGuest.guestCount,
          tableNumber: targetGuest.tableNumber,
          sessionName: targetGuest.sessionName,
          qrCode: targetGuest.qrCode,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    console.error("RSVP Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const rsvpId = searchParams.get("id");

    if (!rsvpId) {
      return NextResponse.json({ error: "ID RSVP wajib disertakan" }, { status: 400 });
    }

    const rsvp = await prisma.rsvp.findUnique({
      where: { id: rsvpId },
      include: {
        guest: {
          include: {
            wedding: true,
          },
        },
      },
    });

    if (!rsvp || rsvp.guest.wedding.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Data RSVP tidak ditemukan atau Anda tidak memiliki akses" },
        { status: 404 }
      );
    }

    await prisma.rsvp.delete({
      where: { id: rsvpId },
    });

    // If guest was created from public QR / printed QR, delete guest too to keep list clean
    if (
      rsvp.guest.category === "Undangan Cetak" ||
      rsvp.guest.category === "Public RSVP"
    ) {
      await prisma.guest.delete({
        where: { id: rsvp.guestId },
      }).catch(() => null);
    } else {
      await prisma.guest.update({
        where: { id: rsvp.guestId },
        data: { attendanceStatus: "pending" },
      }).catch(() => null);
    }

    return NextResponse.json({ success: true, id: rsvpId });
  } catch (error: any) {
    console.error("Delete RSVP Error:", error);
    return NextResponse.json({ error: error?.message || "Gagal menghapus RSVP" }, { status: 500 });
  }
}

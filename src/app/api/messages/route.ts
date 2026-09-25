import { NextResponse } from "next/server";
import { getApprovedMessages, submitMessage } from "@/lib/messages";
import { prisma } from "@/lib/prisma";
import { isDemoWedding } from "@/lib/demo";
import { validateGuestMessage } from "@/lib/security/contentFilter";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const weddingId = searchParams.get("weddingId");
  const take = parseInt(searchParams.get("take") ?? "20");
  const skip = parseInt(searchParams.get("skip") ?? "0");

  if (!weddingId) {
    return NextResponse.json({ error: "weddingId required" }, { status: 400 });
  }

  const messages = await getApprovedMessages(weddingId, take, skip);
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { weddingId, guestId, message, website_url, hp } = body;

    // 1. Honeypot check (anti-bot)
    if (website_url || hp) {
      return NextResponse.json({ error: "Spam terdeteksi" }, { status: 400 });
    }

    if (!weddingId || !message?.trim()) {
      return NextResponse.json(
        { error: "weddingId dan pesan wajib diisi" },
        { status: 400 }
      );
    }

    // 2. Strict guest verification (prevent spoofing/spam)
    if (!guestId) {
      return NextResponse.json(
        { error: "Tamu tidak terverifikasi. Mohon gunakan tautan undangan resmi untuk mengirim ucapan." },
        { status: 403 }
      );
    }

    const verifiedGuest = await prisma.guest.findFirst({
      where: { id: guestId, weddingId },
    });

    if (!verifiedGuest) {
      return NextResponse.json(
        { error: "Tamu tidak valid atau tidak terdaftar pada acara ini." },
        { status: 403 }
      );
    }

    // 3. Anti-flooding rate limit (1 message per 30 seconds per guest)
    const recentMsg = await prisma.guestMessage.findFirst({
      where: { weddingId, guestId: verifiedGuest.id },
      orderBy: { createdAt: "desc" },
    });

    if (recentMsg) {
      const diffMs = Date.now() - new Date(recentMsg.createdAt).getTime();
      if (diffMs < 30 * 1000) {
        return NextResponse.json(
          { error: "Anda baru saja mengirim ucapan. Mohon tunggu 30 detik sebelum mengirim lagi." },
          { status: 429 }
        );
      }
    }

    const wedding = await prisma.wedding.findUnique({
      where: { id: weddingId },
    });

    if (!wedding) {
      return NextResponse.json({ error: "Pernikahan tidak ditemukan" }, { status: 404 });
    }

    // 4. Block submissions on demo preview weddings
    if (isDemoWedding(wedding.slug)) {
      return NextResponse.json(
        { error: "Mode Demo: Pengiriman ucapan dinonaktifkan pada halaman pratinjau tema untuk mencegah spam." },
        { status: 403 }
      );
    }

    // 5. Smart Content Security Filter (Anti-Racism, SARA & Profanity with Leetspeak defense)
    const contentCheck = validateGuestMessage(message);
    if (!contentCheck.isSafe) {
      return NextResponse.json(
        {
          error: contentCheck.reason || "Ucapan terdeteksi mengandung kata-kata yang tidak pantas. Mohon gunakan kata yang santun.",
          category: contentCheck.category,
        },
        { status: 422 }
      );
    }

    const newMsg = await prisma.guestMessage.create({
      data: {
        weddingId,
        guestId: verifiedGuest.id,
        message: message.trim(),
        status: wedding?.messageMode !== "approval" ? "approved" : "pending",
      },
      include: {
        guest: { select: { name: true } },
      },
    });

    return NextResponse.json(newMsg, { status: 201 });
  } catch (error) {
    console.error("Submit message error:", error);
    return NextResponse.json({ error: "Gagal mengirim ucapan" }, { status: 500 });
  }
}


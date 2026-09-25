import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";
import { isDemoWedding } from "@/lib/demo";
import { validateGuestMessage } from "@/lib/security/contentFilter";
import { sendGiftNotificationEmail } from "@/lib/email";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: weddingIdentifier } = await params;
    const body = await req.json();
    const { guestName, bankName, amount, notes, accountSender, proofUrl } = body;

    if (!guestName || typeof guestName !== "string" || !guestName.trim()) {
      return NextResponse.json(
        { error: "Nama pengirim wajib diisi" },
        { status: 400 }
      );
    }

    if (!bankName || typeof bankName !== "string" || !bankName.trim()) {
      return NextResponse.json(
        { error: "Bank tujuan transfer wajib dipilih" },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Nominal transfer tidak valid" },
        { status: 400 }
      );
    }

    // Find wedding by ID or Slug with user and couple
    const wedding = await prisma.wedding.findFirst({
      where: {
        OR: [{ id: weddingIdentifier }, { slug: weddingIdentifier }],
      },
      include: {
        user: true,
        couple: true,
      },
    });

    if (!wedding) {
      return NextResponse.json(
        { error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (isDemoWedding(wedding.slug)) {
      return NextResponse.json(
        { error: "Konfirmasi kirim kado dinonaktifkan untuk mode demo" },
        { status: 403 }
      );
    }

    if (notes && typeof notes === "string" && notes.trim()) {
      const contentCheck = validateGuestMessage(notes);
      if (!contentCheck.isSafe) {
        return NextResponse.json(
          {
            error: contentCheck.reason || "Pesan tanda kasih terdeteksi mengandung kata-kata yang tidak pantas.",
            category: contentCheck.category,
          },
          { status: 422 }
        );
      }
    }

    const confirmation = await prisma.giftConfirmation.create({
      data: {
        weddingId: wedding.id,
        guestName: guestName.trim(),
        bankName: bankName.trim(),
        amount: Math.round(parsedAmount),
        notes: notes && typeof notes === "string" ? notes.trim() : null,
        accountSender: accountSender && typeof accountSender === "string" ? accountSender.trim() : null,
        proofUrl: proofUrl && typeof proofUrl === "string" ? proofUrl.trim() : null,
      },
    });

    // Kirim notifikasi email ke mempelai (non-blocking)
    if (!isDemoWedding(wedding.slug) && wedding.user?.email) {
      const coupleNames =
        wedding.couple?.groomNickname && wedding.couple?.brideNickname
          ? `${wedding.couple.groomNickname} & ${wedding.couple.brideNickname}`
          : wedding.user.name || "Mempelai";

      sendGiftNotificationEmail({
        to: wedding.user.email,
        coupleName: coupleNames,
        guestName: confirmation.guestName,
        bankName: confirmation.bankName,
        amount: confirmation.amount,
        accountSender: confirmation.accountSender,
        notes: confirmation.notes,
      }).catch((err) => console.error("[GIFT_EMAIL_NOTIF_FAILED]", err));
    }

    // Track analytics event asynchronously
    try {
      await trackEvent({
        weddingId: wedding.id,
        event: "gift_confirm",
        metadata: {
          amount: parsedAmount,
          bank: bankName.trim(),
          sender: guestName.trim(),
        },
      });
    } catch {
      // Analytics non-blocking
    }

    return NextResponse.json(
      {
        success: true,
        message: "Konfirmasi transfer tanda kasih berhasil dikirim",
        confirmation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gift confirmation error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat menyimpan konfirmasi transfer" },
      { status: 500 }
    );
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: weddingIdentifier } = await params;

  // Find wedding by ID or Slug
  const wedding = await prisma.wedding.findFirst({
    where: {
      OR: [{ id: weddingIdentifier }, { slug: weddingIdentifier }],
    },
  });

  if (!wedding) {
    return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
  }

  const confirmations = await prisma.giftConfirmation.findMany({
    where: { weddingId: wedding.id },
    orderBy: { createdAt: "desc" },
  });

  const totalAmount = confirmations.reduce((sum, item) => sum + item.amount, 0);

  return NextResponse.json({
    totalCount: confirmations.length,
    totalAmount,
    confirmations,
  });
}

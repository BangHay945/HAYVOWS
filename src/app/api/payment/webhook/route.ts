import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySignatureKey } from "@/lib/midtrans";
import { sendPaymentSuccessEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const notification = await req.json();

    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const statusCode = notification.status_code;
    const grossAmount = notification.gross_amount;
    const signatureKey = notification.signature_key;
    const paymentType = notification.payment_type || "qris";

    // Handle simulasi lokal
    const isSimulated = notification.is_simulated === true || orderId?.startsWith("HAYVOWS-");

    if (!isSimulated && signatureKey) {
      const isValid = verifySignatureKey(orderId, statusCode, grossAmount, signatureKey);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid signature key" }, { status: 403 });
      }
    }

    const transaction = await prisma.transaction.findUnique({
      where: { orderId },
      include: { user: true },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    let finalStatus = "pending";

    if (transactionStatus === "capture") {
      if (fraudStatus === "challenge") {
        finalStatus = "challenge";
      } else if (fraudStatus === "accept") {
        finalStatus = "settlement";
      }
    } else if (transactionStatus === "settlement") {
      finalStatus = "settlement";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      finalStatus = transactionStatus;
    }

    // Update status transaksi
    await prisma.transaction.update({
      where: { orderId },
      data: {
        status: finalStatus,
        paymentType,
      },
    });

    // Jika pembayaran sukses, upgrade paket wedding & user
    if (finalStatus === "settlement") {
      // 1. Update paket wedding spesifik jika ada weddingId
      if (transaction.weddingId) {
        await prisma.wedding.update({
          where: { id: transaction.weddingId },
          data: {
            plan: transaction.plan,
          },
        });
        console.log(
          `[PAYMENT_SUCCESS] Wedding ${transaction.weddingId} berhasil di-upgrade ke paket ${transaction.plan}`
        );
      }

      // 2. Update status paket user
      await prisma.user.update({
        where: { id: transaction.userId },
        data: {
          plan: transaction.plan,
        },
      });
      console.log(
        `[PAYMENT_SUCCESS] User ${transaction.userId} berhasil di-upgrade ke paket ${transaction.plan}`
      );

      // Kirim email konfirmasi & invoice jika user memiliki email
      if (transaction.user?.email) {
        const planNameFormatted =
          transaction.plan === "basic"
            ? "Paket Basic"
            : transaction.plan === "premium"
            ? "Paket Populer"
            : transaction.plan === "luxury"
            ? "Paket Exclusive"
            : `Paket ${transaction.plan}`;

        sendPaymentSuccessEmail({
          to: transaction.user.email,
          name: transaction.user.name || "Pelanggan Hayvows",
          planName: planNameFormatted,
          amount: transaction.amount,
          orderId: transaction.orderId,
        }).catch((err) => console.error("[PAYMENT_EMAIL_FAILED]", err));
      }
    }

    return NextResponse.json({ success: true, status: finalStatus });
  } catch (error: any) {
    console.error("[MIDTRANS_WEBHOOK_ERROR]", error);
    return NextResponse.json(
      { error: "Gagal memproses webhook: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}

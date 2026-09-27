import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { coreApi, isMidtransConfigured } from "@/lib/midtrans";
import { sendPaymentSuccessEmail } from "@/lib/email";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (currentUser?.role !== "admin") {
      return NextResponse.json(
        { error: "Akses ditolak. Khusus Super Admin." },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "all";

    const whereClause: any = {};

    if (status !== "all") {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { orderId: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            plan: true,
          },
        },
        wedding: {
          select: {
            id: true,
            slug: true,
            plan: true,
            couple: {
              select: {
                groomName: true,
                brideName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ transactions });
  } catch (error: any) {
    console.error("[ADMIN_PAYMENTS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Gagal memuat transaksi: " + (error?.message || "Internal error") },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (currentUser?.role !== "admin") {
      return NextResponse.json(
        { error: "Akses ditolak. Khusus Super Admin." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, transactionId, orderId } = body;

    if (!transactionId && !orderId) {
      return NextResponse.json({ error: "ID Transaksi tidak diberikan" }, { status: 400 });
    }

    const transaction = await prisma.transaction.findFirst({
      where: transactionId ? { id: transactionId } : { orderId },
      include: { user: true, wedding: true },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    // 1. APPROVE MANUAL (SETTLEMENT)
    if (action === "approve_manual") {
      const updatedTx = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "settlement",
          paymentType: transaction.paymentType || "manual_bank_transfer",
        },
      });

      // Upgrade User Plan
      await prisma.user.update({
        where: { id: transaction.userId },
        data: { plan: transaction.plan },
      });

      // Upgrade Wedding Plan jika ada weddingId
      if (transaction.weddingId) {
        await prisma.wedding.update({
          where: { id: transaction.weddingId },
          data: { plan: transaction.plan },
        });
      }

      // Kirim email konfirmasi sukses jika ada email
      if (transaction.user?.email) {
        try {
          const planNameFormatted =
            transaction.plan === "basic"
              ? "Paket Basic"
              : transaction.plan === "premium"
              ? "Paket Populer"
              : transaction.plan === "luxury"
              ? "Paket Exclusive"
              : `Paket ${transaction.plan}`;

          await sendPaymentSuccessEmail({
            to: transaction.user.email,
            name: transaction.user.name || "Klien Hayvows",
            planName: planNameFormatted,
            orderId: transaction.orderId,
            amount: transaction.amount,
          });
        } catch (emailErr) {
          console.warn("[ADMIN_PAYMENT] Gagal kirim email notifikasi:", emailErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Transaksi ${transaction.orderId} berhasil di-approve! Paket pengguna telah ditingkatkan ke ${transaction.plan.toUpperCase()}.`,
        transaction: updatedTx,
      });
    }

    // 2. CANCEL TRANSACTION
    if (action === "cancel") {
      const updatedTx = await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: "cancel" },
      });

      return NextResponse.json({
        success: true,
        message: `Transaksi ${transaction.orderId} telah dibatalkan.`,
        transaction: updatedTx,
      });
    }

    // 3. SINKRONISASI STATUS DENGAN MIDTRANS
    if (action === "sync_midtrans") {
      if (!isMidtransConfigured()) {
        return NextResponse.json({
          error: "Midtrans API belum dikonfigurasi dengan Server Key aktif.",
        }, { status: 400 });
      }

      let midtransStatus: any = null;
      try {
        midtransStatus = await coreApi.transaction.status(transaction.orderId);
      } catch (mtErr: any) {
        return NextResponse.json({
          error: `Gagal cek ke Midtrans: ${mtErr?.message || "Order ID belum terdaftar di Midtrans"}`,
        }, { status: 400 });
      }

      const txStatus = midtransStatus?.transaction_status;
      const fraudStatus = midtransStatus?.fraud_status;
      const paymentType = midtransStatus?.payment_type || transaction.paymentType;

      let newStatus = transaction.status;
      if (txStatus === "capture") {
        newStatus = fraudStatus === "accept" ? "settlement" : "challenge";
      } else if (txStatus === "settlement") {
        newStatus = "settlement";
      } else if (["cancel", "deny", "expire"].includes(txStatus)) {
        newStatus = txStatus;
      }

      const updatedTx = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: newStatus,
          paymentType,
        },
      });

      if (newStatus === "settlement") {
        await prisma.user.update({
          where: { id: transaction.userId },
          data: { plan: transaction.plan },
        });

        if (transaction.weddingId) {
          await prisma.wedding.update({
            where: { id: transaction.weddingId },
            data: { plan: transaction.plan },
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Status Midtrans disinkronkan: ${newStatus.toUpperCase()}`,
        transaction: updatedTx,
        midtransRaw: midtransStatus,
      });
    }

    return NextResponse.json({ error: "Aksi tidak dikenali" }, { status: 400 });
  } catch (error: any) {
    console.error("[ADMIN_PAYMENTS_PATCH_ERROR]", error);
    return NextResponse.json(
      { error: "Gagal memproses transaksi: " + (error?.message || "Internal error") },
      { status: 500 }
    );
  }
}

// POST: Catat Pembayaran Manual Baru oleh Admin
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (currentUser?.role !== "admin") {
      return NextResponse.json(
        { error: "Akses ditolak. Khusus Super Admin." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId, weddingId, plan, amount, paymentType, notes } = body;

    if (!userId || !plan || !amount) {
      return NextResponse.json(
        { error: "UserId, Paket, dan Nominal wajib diisi." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    // Generate Order ID Manual
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `HAYVOWS-MANUAL-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const newTx = await prisma.transaction.create({
      data: {
        userId,
        weddingId: weddingId || null,
        orderId,
        plan,
        amount: Number(amount),
        status: "settlement", // Transaksi manual yang diinput admin langsung dianggap lunas
        paymentType: paymentType || "manual_bank_transfer",
      },
    });

    // Upgrade User Plan
    await prisma.user.update({
      where: { id: userId },
      data: { plan },
    });

    // Upgrade Wedding Plan jika dipilih
    if (weddingId) {
      await prisma.wedding.update({
        where: { id: weddingId },
        data: { plan },
      });
    }

    // Kirim email notifikasi
    if (user.email) {
      try {
        const planNameFormatted =
          plan === "basic"
            ? "Paket Basic"
            : plan === "premium"
            ? "Paket Populer"
            : plan === "luxury"
            ? "Paket Exclusive"
            : `Paket ${plan}`;

        await sendPaymentSuccessEmail({
          to: user.email,
          name: user.name || "Klien Hayvows",
          planName: planNameFormatted,
          orderId,
          amount: Number(amount),
        });
      } catch (emailErr) {
        console.warn("[ADMIN_PAYMENT] Gagal kirim email:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Pembayaran manual ${orderId} berhasil dicatat & paket pengguna diaktifkan!`,
      transaction: newTx,
    });
  } catch (error: any) {
    console.error("[ADMIN_PAYMENTS_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Gagal membuat pembayaran manual: " + (error?.message || "Internal error") },
      { status: 500 }
    );
  }
}

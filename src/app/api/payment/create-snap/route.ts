import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { snap, PLAN_PRICING, type PlanType } from "@/lib/midtrans";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const plan = (body.plan as PlanType) || "premium";

    if (plan !== "basic" && plan !== "premium" && plan !== "luxury") {
      return NextResponse.json({ error: "Paket tidak valid" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const price = PLAN_PRICING[plan].price;
    const orderId = `HAYVOWS-${plan.toUpperCase()}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    // Buat parameter Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price,
      },
      item_details: [
        {
          id: plan,
          price: price,
          quantity: 1,
          name: `Hayvows ${PLAN_PRICING[plan].name}`,
          category: "Digital Wedding Invitation",
        },
      ],
      customer_details: {
        first_name: user.name || "Calon",
        last_name: "Pengantin",
        email: user.email,
      },
      credit_card: {
        secure: true,
      },
      callbacks: {
        finish: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard?payment=success&orderId=${orderId}`,
      },
    };

    let snapToken: string;
    let redirectUrl: string;

    try {
      const snapResponse = await snap.createTransaction(parameter);
      snapToken = snapResponse.token;
      redirectUrl = snapResponse.redirect_url;
    } catch (midtransError: any) {
      // Jika kredensial sandbox belum diganti kunci asli, gunakan mode simulasi sandbox lokal
      console.warn("[MIDTRANS_DEV_FALLBACK] Menggunakan mode simulasi lokal:", midtransError?.message || midtransError);
      snapToken = `SIMULASI-SNAP-${orderId}`;
      redirectUrl = `/dashboard?payment=simulated&orderId=${orderId}`;
    }

    // Rekam transaksi di database
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        orderId,
        plan,
        amount: price,
        status: "pending",
        snapToken,
      },
    });

    return NextResponse.json({
      success: true,
      orderId,
      snapToken,
      redirectUrl,
      isSimulated: snapToken.startsWith("SIMULASI-SNAP-"),
      plan,
      amount: price,
    });
  } catch (error: any) {
    console.error("[CREATE_SNAP_ERROR]", error);
    return NextResponse.json(
      { error: "Gagal membuat sesi pembayaran: " + (error?.message || "Internal Error") },
      { status: 500 }
    );
  }
}

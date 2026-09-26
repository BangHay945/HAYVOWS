import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// @ts-ignore
import midtransClient from "midtrans-client";
import {
  snap,
  PLAN_PRICING,
  type PlanType,
  isMidtransConfigured,
  getMidtransServerKey,
  getMidtransClientKey,
  isMidtransProduction,
} from "@/lib/midtrans";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const plan = (body.plan as PlanType) || "premium";
    const weddingId = body.weddingId ? String(body.weddingId) : undefined;

    if (plan !== "basic" && plan !== "premium" && plan !== "luxury") {
      return NextResponse.json({ error: "Paket tidak valid" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Cari wedding jika weddingId disertakan
    let wedding = null;
    if (weddingId) {
      wedding = await prisma.wedding.findFirst({
        where: { id: weddingId, userId: user.id },
        include: { couple: true },
      });
    }

    const price = PLAN_PRICING[plan].price;
    const orderId = `HAYVOWS-${plan.toUpperCase()}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    const weddingLabel = wedding ? ` (${wedding.slug})` : "";

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
          name: `Hayvows ${PLAN_PRICING[plan].name}${weddingLabel}`.slice(0, 50),
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
      const isConfigured = isMidtransConfigured();
      if (!isConfigured) {
        console.warn("[MIDTRANS_DEV_FALLBACK] Kredensial Midtrans belum dikonfigurasi di .env. Menggunakan mode simulasi.");
        snapToken = `SIMULASI-SNAP-${orderId}`;
        redirectUrl = `/dashboard?payment=simulated&orderId=${orderId}`;
      } else {
        const snapClient = new midtransClient.Snap({
          isProduction: isMidtransProduction(),
          serverKey: getMidtransServerKey(),
          clientKey: getMidtransClientKey(),
        });
        const snapResponse = await snapClient.createTransaction(parameter);
        snapToken = snapResponse.token;
        redirectUrl = snapResponse.redirect_url;
      }
    } catch (midtransError: any) {
      console.error("[MIDTRANS_CREATE_SNAP_ERROR]", midtransError?.message || midtransError);
      snapToken = `SIMULASI-SNAP-${orderId}`;
      redirectUrl = `/dashboard?payment=simulated&orderId=${orderId}`;
    }

    // Rekam transaksi di database dengan weddingId
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        weddingId: wedding ? wedding.id : null,
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

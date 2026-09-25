// @ts-ignore
import midtransClient from "midtrans-client";
import crypto from "crypto";

export const PLAN_PRICING = {
  basic: {
    name: "Paket Basic",
    price: 149000,
    guestLimit: 50,
    hasWatermark: false,
  },
  premium: {
    name: "Paket Premium",
    price: 199000,
    guestLimit: 500,
    hasWatermark: false,
  },
  luxury: {
    name: "Paket Luxury",
    price: 299000,
    guestLimit: 999999, // Unlimited
    hasWatermark: false,
  },
} as const;

export type PlanType = "basic" | "premium" | "luxury";

const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-TEST_SANDBOX_KEY";
const clientKey = process.env.MIDTRANS_CLIENT_KEY || "SB-Mid-client-TEST_SANDBOX_KEY";

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

export const coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey,
  clientKey,
});

/**
 * Verifikasi signature hash notifikasi Midtrans:
 * SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifySignatureKey(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const hash = crypto
    .createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest("hex");
  return hash === signatureKey;
}

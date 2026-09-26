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
    name: "Paket Populer",
    price: 199000,
    guestLimit: 500,
    hasWatermark: false,
  },
  luxury: {
    name: "Paket Exclusive",
    price: 299000,
    guestLimit: 999999, // Unlimited
    hasWatermark: false,
  },
} as const;

export type PlanType = "basic" | "premium" | "luxury";

export const isMidtransProduction = (): boolean => {
  const sk = getMidtransServerKey();
  const ck = getMidtransClientKey();
  if (sk.startsWith("Mid-server-") || ck.startsWith("Mid-client-")) {
    return true;
  }
  if (sk.startsWith("SB-Mid-server-") || ck.startsWith("SB-Mid-client-")) {
    return false;
  }
  return (
    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true" ||
    process.env.MIDTRANS_IS_PRODUCTION === "true"
  );
};

export const getMidtransServerKey = (): string => {
  return process.env.MIDTRANS_SERVER_KEY || "";
};

export const getMidtransClientKey = (): string => {
  return (
    process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ||
    process.env.MIDTRANS_CLIENT_KEY ||
    ""
  );
};

export const isMidtransConfigured = (): boolean => {
  const sk = getMidtransServerKey();
  const ck = getMidtransClientKey();
  return Boolean(
    sk &&
    ck &&
    !sk.includes("TEST_SANDBOX_KEY") &&
    !ck.includes("TEST_SANDBOX_KEY")
  );
};

export const snap = new midtransClient.Snap({
  isProduction: isMidtransProduction(),
  serverKey: getMidtransServerKey() || "SB-Mid-server-TEST_SANDBOX_KEY",
  clientKey: getMidtransClientKey() || "SB-Mid-client-TEST_SANDBOX_KEY",
});

export const coreApi = new midtransClient.CoreApi({
  isProduction: isMidtransProduction(),
  serverKey: getMidtransServerKey() || "SB-Mid-server-TEST_SANDBOX_KEY",
  clientKey: getMidtransClientKey() || "SB-Mid-client-TEST_SANDBOX_KEY",
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
  const serverKey = getMidtransServerKey();
  if (!serverKey) return false;
  const hash = crypto
    .createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest("hex");
  return hash === signatureKey;
}

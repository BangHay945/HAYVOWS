export interface TrialStatus {
  isTrial: boolean;
  isExpired: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  trialEndsAt: Date | null;
}

export function checkTrialStatus(
  user: {
    role?: string | null;
    plan?: string | null;
    createdAt?: Date | string | null;
    transactions?: { status: string }[];
  } | null | undefined,
  isDemoWedding: boolean = false
): TrialStatus {
  // 1. Undangan demo platform atau akun Super Admin tidak pernah kedaluwarsa
  if (isDemoWedding || user?.role === "admin") {
    return {
      isTrial: false,
      isExpired: false,
      daysRemaining: 999,
      hoursRemaining: 999,
      trialEndsAt: null,
    };
  }

  // 2. Jika user sudah membeli paket berbayar (transaksi settlement) atau status paket bukan trial/unpaid basic
  const hasSettledPayment = user?.transactions?.some(
    (t) => t.status === "settlement"
  );

  if (hasSettledPayment) {
    return {
      isTrial: false,
      isExpired: false,
      daysRemaining: 999,
      hoursRemaining: 999,
      trialEndsAt: null,
    };
  }

  // Jika paket di-update oleh admin menjadi premium atau luxury, bukan trial lagi
  if (user?.plan === "premium" || user?.plan === "luxury") {
    return {
      isTrial: false,
      isExpired: false,
      daysRemaining: 999,
      hoursRemaining: 999,
      trialEndsAt: null,
    };
  }

  // 3. User dalam masa uji coba (Trial / Unpaid Basic) - Aktif 3 Hari
  const createdDate = user?.createdAt ? new Date(user.createdAt) : new Date();
  const trialDurationMs = 3 * 24 * 60 * 60 * 1000; // 3 Hari dalam milidetik
  const trialEndsAt = new Date(createdDate.getTime() + trialDurationMs);
  const now = new Date();
  const diffMs = trialEndsAt.getTime() - now.getTime();

  const isExpired = diffMs <= 0;
  const hoursRemaining = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  return {
    isTrial: true,
    isExpired,
    daysRemaining,
    hoursRemaining,
    trialEndsAt,
  };
}

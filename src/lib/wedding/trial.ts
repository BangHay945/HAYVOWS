export interface TrialStatus {
  isTrial: boolean;
  isExpired: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  trialEndsAt: Date | null;
}

export function checkTrialStatus(
  target: {
    role?: string | null;
    plan?: string | null;
    createdAt?: Date | string | null;
    transactions?: { status: string }[];
    user?: {
      role?: string | null;
      plan?: string | null;
      createdAt?: Date | string | null;
    } | null;
  } | null | undefined,
  isDemoWedding: boolean = false
): TrialStatus {
  // 1. Undangan demo platform atau akun Super Admin tidak pernah kedaluwarsa
  const isAdmin = target?.role === "admin" || target?.user?.role === "admin";
  if (isDemoWedding || isAdmin) {
    return {
      isTrial: false,
      isExpired: false,
      daysRemaining: 999,
      hoursRemaining: 999,
      trialEndsAt: null,
    };
  }

  // 2. Jika paket berbayar aktif (Basic, Premium/Populer, Luxury/Exclusive)
  // Evaluasi plan undangan (target.plan), atau fallback ke target.user?.plan
  const activePlan = target?.plan || target?.user?.plan;
  const isPaidPlan =
    activePlan === "basic" ||
    activePlan === "premium" ||
    activePlan === "luxury";

  // Cek apakah ada transaksi settlement
  const hasSettledPayment = target?.transactions?.some(
    (t) => t.status === "settlement"
  );

  if (isPaidPlan || hasSettledPayment) {
    return {
      isTrial: false,
      isExpired: false,
      daysRemaining: 999,
      hoursRemaining: 999,
      trialEndsAt: null,
    };
  }

  // 3. Undangan dalam masa uji coba (Trial) - Aktif 3 Hari dari tanggal dibuatnya undangan
  const createdDate = target?.createdAt
    ? new Date(target.createdAt)
    : target?.user?.createdAt
    ? new Date(target.user.createdAt)
    : new Date();
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

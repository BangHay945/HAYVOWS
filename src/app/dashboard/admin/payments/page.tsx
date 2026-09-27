import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminPaymentsClient from "./AdminPaymentsClient";

export default async function AdminPaymentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Periksa apakah user memiliki peran admin
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (currentUser?.role !== "admin") {
    redirect("/dashboard");
  }

  // Ambil semua transaksi
  const rawTransactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
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
  });

  // Ambil daftar pengguna & wedding untuk opsi pencatatan manual
  const rawUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      weddings: {
        select: {
          id: true,
          slug: true,
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

  const transactions = rawTransactions.map((tx) => ({
    id: tx.id,
    orderId: tx.orderId,
    userId: tx.userId,
    userName: tx.user?.name || "Tanpa Nama",
    userEmail: tx.user?.email || "-",
    currentPlan: tx.user?.plan || "basic",
    weddingId: tx.weddingId,
    weddingSlug: tx.wedding?.slug || null,
    coupleTitle: tx.wedding?.couple
      ? `${tx.wedding.couple.groomName} & ${tx.wedding.couple.brideName}`
      : null,
    plan: tx.plan,
    amount: tx.amount,
    status: tx.status,
    paymentType: tx.paymentType,
    createdAt: tx.createdAt.toISOString(),
  }));

  const users = rawUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    plan: u.plan,
    weddings: u.weddings.map((w) => ({
      id: w.id,
      slug: w.slug,
      coupleTitle: w.couple
        ? `${w.couple.groomName} & ${w.couple.brideName}`
        : w.slug,
    })),
  }));

  // Hitung metrik finansial
  const totalRevenue = transactions
    .filter((tx) => tx.status === "settlement")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const settlementCount = transactions.filter(
    (tx) => tx.status === "settlement"
  ).length;

  const pendingCount = transactions.filter(
    (tx) => tx.status === "pending"
  ).length;

  const failedCount = transactions.filter((tx) =>
    ["cancel", "expire", "deny"].includes(tx.status)
  ).length;

  return (
    <AdminPaymentsClient
      initialTransactions={transactions}
      users={users}
      stats={{
        totalRevenue,
        settlementCount,
        pendingCount,
        failedCount,
        totalCount: transactions.length,
      }}
    />
  );
}

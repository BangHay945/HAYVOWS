import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "./DashboardShell";
import { DEMO_WEDDING_SLUGS } from "@/lib/demo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user?.name || "Pengguna";
  const userEmail = session.user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  // Fetch user role & plan
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      plan: true,
      createdAt: true,
      transactions: {
        where: { status: "settlement" },
        select: { id: true, status: true },
      },
    },
  });

  const userRole = currentUser?.role || "client";
  const userPlan = userRole === "admin" ? "luxury" : (currentUser?.plan || "basic");
  const userCreatedAt = currentUser?.createdAt
    ? currentUser.createdAt.toISOString()
    : undefined;
  const hasPaid =
    userRole === "admin" ||
    Boolean(currentUser?.transactions && currentUser.transactions.length > 0);

  // Fetch all weddings for the logged in user to supply active workspace switcher in sidebar.
  // Super Admin can manage all demo showcase weddings plus their own.
  let weddings: any[] = [];
  try {
    weddings = await prisma.wedding.findMany({
      where:
        userRole === "admin"
          ? {
              OR: [
                { userId: session.user.id },
                { slug: { in: [...DEMO_WEDDING_SLUGS] } },
              ],
            }
          : { userId: session.user.id },
      include: {
        couple: true,
        transactions: {
          where: { status: "settlement" },
          select: { id: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[DashboardLayout] Warning: wedding transactions query fallback:", err);
    try {
      weddings = await prisma.wedding.findMany({
        where:
          userRole === "admin"
            ? {
                OR: [
                  { userId: session.user.id },
                  { slug: { in: [...DEMO_WEDDING_SLUGS] } },
                ],
              }
            : { userId: session.user.id },
        include: {
          couple: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (fallbackErr) {
      console.error("[DashboardLayout] Fallback weddings query failed:", fallbackErr);
      weddings = [];
    }
  }

  const weddingOptions = weddings.map((w: any) => {
    const isWeddingPaid =
      Boolean(w.transactions && w.transactions.length > 0) ||
      w.plan === "basic" ||
      w.plan === "premium" ||
      w.plan === "luxury" ||
      userRole === "admin";

    return {
      id: w.id,
      slug: w.slug,
      status: w.status,
      plan: userRole === "admin" ? "luxury" : (w.plan || "trial"),
      createdAt: w.createdAt ? (typeof w.createdAt === "string" ? w.createdAt : w.createdAt.toISOString()) : new Date().toISOString(),
      hasPaid: isWeddingPaid,
      coupleTitle: `${w.couple?.groomName || "Pengantin"} & ${
        w.couple?.brideName || "Pengantin"
      }`,
    };
  });

  const handleLogout = async () => {
    "use server";
    await signOut({ redirectTo: "/login" });
  };

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-xs text-slate-400 font-mono">Memuat Dashboard...</div>}>
      <DashboardShell
        userName={userName}
        userEmail={userEmail}
        userInitial={userInitial}
        userRole={userRole}
        userPlan={userPlan}
        userCreatedAt={userCreatedAt}
        hasPaid={hasPaid}
        weddings={weddingOptions}
        onLogout={handleLogout}
      >
        {children}
      </DashboardShell>
    </Suspense>
  );
}

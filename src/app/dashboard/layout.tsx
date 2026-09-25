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
    select: { role: true, plan: true },
  });

  const userRole = currentUser?.role || "client";
  const userPlan = currentUser?.plan || "basic";

  // Fetch all weddings for the logged in user to supply active workspace switcher in sidebar.
  // Super Admin can manage all demo showcase weddings plus their own.
  const weddings = await prisma.wedding.findMany({
    where:
      userRole === "admin"
        ? {
            OR: [
              { userId: session.user.id },
              { slug: { in: [...DEMO_WEDDING_SLUGS] } },
            ],
          }
        : { userId: session.user.id },
    include: { couple: true },
    orderBy: { createdAt: "desc" },
  });

  const weddingOptions = weddings.map((w) => ({
    id: w.id,
    slug: w.slug,
    status: w.status,
    coupleTitle: `${w.couple?.groomName || "Pengantin"} & ${
      w.couple?.brideName || "Pengantin"
    }`,
  }));

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
        weddings={weddingOptions}
        onLogout={handleLogout}
      >
        {children}
      </DashboardShell>
    </Suspense>
  );
}

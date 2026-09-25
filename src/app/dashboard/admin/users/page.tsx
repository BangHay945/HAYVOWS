import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminUsersClient from "./AdminUsersClient";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Periksa apakah user memiliki peran admin
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (currentUser?.role !== "admin") {
    redirect("/dashboard");
  }

  const rawUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          weddings: true,
          transactions: true,
        },
      },
    },
  });

  const users = rawUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    plan: u.plan || "basic",
    createdAt: u.createdAt.toISOString(),
    _count: u._count,
  }));

  return <AdminUsersClient initialUsers={users} />;
}

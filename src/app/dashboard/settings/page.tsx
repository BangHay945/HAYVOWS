import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AccountSettings from "./AccountSettings";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <AccountSettings initialUser={user} />
    </div>
  );
}

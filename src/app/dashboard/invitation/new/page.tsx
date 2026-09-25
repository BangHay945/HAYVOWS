import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getTemplates } from "@/lib/templates";
import { NewWeddingClient } from "./NewWeddingClient";

export default async function NewWeddingPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [templates, user] = await Promise.all([
    getTemplates(),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, plan: true },
    }),
  ]);

  const userRole = user?.role || "client";
  const userPlan = user?.plan || "basic";

  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400 font-mono">
          Memuat formulir template...
        </div>
      }
    >
      <NewWeddingClient
        initialTemplates={templates}
        userPlan={userPlan}
        userRole={userRole}
      />
    </Suspense>
  );
}

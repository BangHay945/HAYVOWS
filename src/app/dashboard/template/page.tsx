import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TemplateSelector from "./TemplateSelector";

export default async function TemplateSelectionPage({
  searchParams,
}: {
  searchParams?: Promise<{ weddingId?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sParams = await searchParams;

  const [weddings, templates] = await Promise.all([
    prisma.wedding.findMany({
      where: { userId: session.user.id },
      include: { couple: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.template.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const hasWeddings = weddings.length > 0;
  const selectedWedding = hasWeddings
    ? weddings.find((w) => w.id === sParams?.weddingId) || weddings[0]
    : null;

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, role: true },
  });
  const userPlan = currentUser?.plan || "basic";
  const userRole = currentUser?.role || "client";

  return (
    <div className="space-y-6">
      {!hasWeddings && (
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <span>Selamat Datang di Katalog Tema Undangan!</span>
            </h2>
            <p className="text-xs text-emerald-800/80 mt-1 max-w-2xl leading-relaxed">
              Anda belum membuat undangan. Jangan ragu untuk mencoba interaksi masing-masing tema melalui tombol <strong>Uji Coba Demo</strong>, lalu buat undangan Anda.
            </p>
          </div>
        </div>
      )}

      <TemplateSelector
        key={selectedWedding?.id || "guest-catalog"}
        weddingId={selectedWedding?.id || null}
        currentTemplateId={selectedWedding?.templateId || ""}
        templates={templates}
        userPlan={userPlan}
        userRole={userRole}
      />
    </div>
  );
}

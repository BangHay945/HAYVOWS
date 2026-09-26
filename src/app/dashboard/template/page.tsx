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

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, role: true },
  });
  const userPlan = currentUser?.plan || "basic";
  const userRole = currentUser?.role || "client";

  const [weddings, rawTemplates] = await Promise.all([
    prisma.wedding.findMany({
      where: { userId: session.user.id },
      include: { couple: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.template.findMany({
      where:
        userRole === "admin"
          ? { isActive: true }
          : { isActive: true, adminOnly: false },
      orderBy: { name: "asc" },
    }).catch(async (err) => {
      console.warn("[TemplatePage] Fallback querying templates:", err);
      const all = await prisma.template.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      });
      return userRole === "admin" ? all : all.filter((t: any) => !t.adminOnly);
    }),
  ]);

  const templates = rawTemplates;

  const hasWeddings = weddings.length > 0;
  const selectedWedding = hasWeddings
    ? weddings.find((w) => w.id === sParams?.weddingId) || weddings[0]
    : null;

  const weddingPlan = (selectedWedding as any)?.plan || userPlan || "trial";
  const weddingTitle = selectedWedding
    ? `${selectedWedding.couple?.groomName || "Pengantin"} & ${
        selectedWedding.couple?.brideName || "Pengantin"
      }`
    : undefined;

  return (
    <div className="space-y-6">
      {userRole === "admin" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <span className="text-lg">👑</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Mode Super Admin — Staging &amp; Manajemen Tema</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold font-mono">
                  BETA CONTROL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Anda dapat melihat seluruh tema (termasuk yang berstatus <strong>Draft / Mode Uji Coba</strong>). Pengguna biasa hanya dapat melihat tema yang sudah <strong>Publik</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

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
        userPlan={weddingPlan}
        userRole={userRole}
        weddingTitle={weddingTitle}
      />
    </div>
  );
}

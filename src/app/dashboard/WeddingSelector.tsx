"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HeartHandshake, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";

export interface WeddingOption {
  id: string;
  slug: string;
  coupleTitle: string;
  status: string;
}

export function WeddingSelector({
  weddings,
  currentWeddingId,
}: {
  weddings: WeddingOption[];
  currentWeddingId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (weddings.length <= 1) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextId = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("weddingId", nextId);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#faf8f5] border border-slate-200 flex items-center justify-center text-[#2d4a3e] shrink-0">
          <HeartHandshake className="w-5 h-5 text-[#2d4a3e]" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Pilih Undangan yang Dikelola
          </p>
          <div className="relative inline-block mt-0.5 max-w-[280px] sm:max-w-md">
            <select
              value={currentWeddingId}
              onChange={handleChange}
              className="w-full appearance-none bg-slate-50 border border-slate-300 hover:border-[#2d4a3e] rounded-xl px-3 py-1.5 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] cursor-pointer truncate"
            >
              {weddings.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.coupleTitle} (/{w.slug}) — {w.status.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 hidden sm:inline">
          Total: {weddings.length} Undangan
        </span>
        <Link
          href="/dashboard/invitation/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2d4a3e] hover:bg-[#233a30] text-white font-medium rounded-xl transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#c9a84c]" />
          <span>Buat Undangan Baru</span>
        </Link>
      </div>
    </div>
  );
}

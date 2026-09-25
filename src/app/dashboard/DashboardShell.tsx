"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { HayvowsLogo } from "@/components/brand/HayvowsLogo";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { isDemoWedding } from "@/lib/demo";
import {
  LayoutDashboard,
  HeartHandshake,
  Palette,
  Users,
  CheckCircle2,
  MessageSquare,
  BarChart3,
  Settings2,
  LogOut,
  ExternalLink,
  Heart,
  ChevronLeft,
  Menu,
  X,
  ShieldCheck,
  Crown,
  Sparkles,
  ArrowUpRight,
  BookOpenCheck,
  QrCode,
} from "lucide-react";

export type WeddingOption = {
  id: string;
  slug: string;
  status: string;
  coupleTitle: string;
};

export const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/invitation", label: "Kelola Undangan", icon: HeartHandshake },
  { href: "/dashboard/template", label: "Pilihan Template", icon: Palette },
  { href: "/dashboard/guests", label: "Daftar Tamu", icon: Users },
  { href: "/dashboard/guestbook", label: "Buku Tamu (QR)", icon: BookOpenCheck },
  { href: "/dashboard/rsvp", label: "Konfirmasi RSVP", icon: CheckCircle2 },
  { href: "/dashboard/messages", label: "Ucapan & Doa", icon: MessageSquare },
  { href: "/dashboard/analytics", label: "Statistik Kunjungan", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Pengaturan", icon: Settings2 },
];

export function DashboardShell({
  userName,
  userEmail,
  userInitial,
  userRole = "client",
  userPlan = "basic",
  weddings = [],
  children,
  onLogout,
}: {
  userName: string;
  userEmail: string;
  userInitial: string;
  userRole?: string;
  userPlan?: string;
  weddings?: WeddingOption[];
  children: React.ReactNode;
  onLogout: () => Promise<void>;
}) {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();


  const isOverview = pathname === "/dashboard";

  // Check if current page is in the "Lainnya" group
  const isOtherPage =
    pathname.startsWith("/dashboard/rsvp") ||
    pathname.startsWith("/dashboard/messages") ||
    pathname.startsWith("/dashboard/invitation") ||
    pathname.startsWith("/dashboard/analytics") ||
    pathname.startsWith("/dashboard/settings");

  // Close sheet on route change
  useEffect(() => {
    setMoreMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when bottom sheet is open
  useEffect(() => {
    if (moreMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [moreMenuOpen]);

  // Selected wedding from URL or fallback to first
  const weddingIdParam = searchParams.get("weddingId");
  const activeWedding =
    weddings.find((w) => w.id === weddingIdParam) || weddings[0] || null;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/dashboard/invitation") {
      return (
        pathname === "/dashboard/invitation" ||
        pathname.startsWith("/dashboard/invitation/")
      );
    }
    if (href === "/dashboard/settings") {
      return pathname === "/dashboard/settings";
    }
    return pathname.startsWith(href);
  };

  const getHrefWithWedding = (href: string) => {
    if (activeWedding) {
      return `${href}?weddingId=${activeWedding.id}`;
    }
    return href;
  };

  const handleWeddingSwitch = (newId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("weddingId", newId);
    router.push(`${pathname}?${params.toString()}`);
  };

  const getPageTitle = (path: string) => {
    if (path.startsWith("/dashboard/guestbook")) return "Buku Tamu & Presensi";
    if (path.startsWith("/dashboard/guests")) return "Daftar Tamu";
    if (path.startsWith("/dashboard/rsvp")) return "Konfirmasi RSVP";
    if (path.startsWith("/dashboard/template")) return "Pilihan Template";
    if (path.startsWith("/dashboard/messages")) return "Ucapan & Doa";
    if (path.startsWith("/dashboard/invitation")) return "Kelola Undangan";
    if (path.startsWith("/dashboard/analytics")) return "Statistik";
    if (path.startsWith("/dashboard/settings")) return "Pengaturan";
    return "Overview";
  };

  const demoUrl = activeWedding ? `/invitation/${activeWedding.slug}` : "/invitation/neo-2077";

  return (
    <div className="flex min-h-screen bg-[#faf8f5] font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Desktop Sidebar (Sticky, Hidden on mobile) */}
      <aside className="hidden md:flex w-64 bg-white/95 backdrop-blur-md border-r border-slate-200/80 flex-col shrink-0 sticky top-0 h-screen z-30 shadow-[1px_0_12px_rgba(45,74,62,0.03)]">
        {/* Brand Header */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <HayvowsLogo size="md" />
          </Link>
        </div>

        {/* Wedding Selector inside Sidebar (Matching DesainPakeAI Prototype) */}
        {activeWedding && (
          <div className="mx-3.5 my-3 p-3 bg-[#faf8f5] border border-slate-200/80 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[#2d4a3e] shadow-2xs shrink-0">
                <Heart className="w-3.5 h-3.5 fill-emerald-100 text-[#2d4a3e]" />
              </span>
              <div className="flex-1 min-w-0">
                <select
                  value={activeWedding.id}
                  onChange={(e) => handleWeddingSwitch(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer truncate"
                >
                  {weddings.map((w) => (
                    <option key={w.id} value={w.id}>
                      {isDemoWedding(w.slug) ? `[DEMO] ${w.coupleTitle}` : w.coupleTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60 font-medium">
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                    activeWedding.status === "published"
                      ? "bg-emerald-50 text-[#2d4a3e] border border-emerald-200/80"
                      : "bg-amber-50 text-amber-800 border border-amber-200/80"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activeWedding.status === "published"
                        ? "bg-[#2d4a3e]"
                        : "bg-amber-600"
                    }`}
                  />
                  <span>
                    {activeWedding.status === "published" ? "Published" : "Draft"}
                  </span>
                </span>
                {isDemoWedding(activeWedding.slug) && (
                  <span className="font-bold text-[9px] bg-purple-100 text-purple-900 border border-purple-200 px-1.5 py-0.5 rounded">
                    DEMO
                  </span>
                )}
              </div>
              <span className="font-mono text-slate-400">/{activeWedding.slug}</span>
            </div>
          </div>
        )}

        {/* Navigation Links (8 Menu Lengkap) */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-mono tracking-widest text-slate-400 px-3 py-1.5 uppercase">
            Menu Undangan
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const isItemLocked =
              userPlan === "basic" &&
              userRole !== "admin" &&
              (item.href === "/dashboard/guestbook" ||
                item.href === "/dashboard/rsvp" ||
                item.href === "/dashboard/messages");

            return (
              <Link
                key={item.href}
                href={getHrefWithWedding(item.href)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  active
                    ? "bg-[#2d4a3e] text-white font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-[#faf8f5] font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active
                        ? "text-emerald-200"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {active ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fef08a]" />
                ) : isItemLocked ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200/80">
                    Populer
                  </span>
                ) : null}
              </Link>
            );
          })}

          {/* Super Admin Menu */}
          {userRole === "admin" && (
            <div className="pt-3 mt-2 border-t border-slate-100">
              <p className="text-[10px] font-mono tracking-widest text-purple-600 px-3 py-1 uppercase font-bold">
                Admin Center
              </p>
              <Link
                href="/dashboard/admin/users"
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  pathname.startsWith("/dashboard/admin")
                    ? "bg-purple-900 text-white font-semibold shadow-xs"
                    : "text-purple-700 hover:text-purple-900 hover:bg-purple-50 font-semibold"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Kelola Pengguna</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-200 text-purple-900">
                  SUPER
                </span>
              </Link>
            </div>
          )}
        </nav>

        {/* Plan Upgrade Card */}
        <div className="px-3 pt-2 pb-1 bg-[#faf8f5]/80 border-t border-slate-100">
          <div
            className={`p-3 rounded-xl border text-xs space-y-2 ${
              userPlan === "luxury"
                ? "bg-[#0a0a0a] text-white border-[#c9a84c]/40"
                : userPlan === "premium"
                ? "bg-emerald-50 text-emerald-950 border-emerald-200"
                : "bg-amber-50/80 text-amber-950 border-amber-200/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                {userPlan === "luxury" ? (
                  <>
                    <Crown className="w-3 h-3 text-[#c9a84c]" />
                    <span className="text-[#c9a84c]">Paket Luxury</span>
                  </>
                ) : userPlan === "premium" ? (
                  <>
                    <Sparkles className="w-3 h-3 text-emerald-700" />
                    <span className="text-emerald-800">Paket Premium</span>
                  </>
                ) : (
                  <span className="text-amber-800 font-bold">Mode Uji Coba</span>
                )}
              </span>
              <span className="text-[10px] font-mono opacity-60">
                {userPlan === "luxury" ? "Unlimited" : userPlan === "premium" ? "500 Tamu" : "50 Tamu"}
              </span>
            </div>

            {userPlan === "basic" && (
              <p className="text-[10px] text-amber-800/90 leading-tight">
                Undangan memuat label mode uji coba.
              </p>
            )}

            {userPlan !== "luxury" && (
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(true)}
                className="w-full py-1.5 px-2.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-2xs"
              >
                <span>{userPlan === "premium" ? "Upgrade Luxury" : "Upgrade / Hapus Label"}</span>
                <ArrowUpRight className="w-3 h-3 text-[#fef08a]" />
              </button>
            )}
          </div>
        </div>

        {/* User Profile & Integrated Logout Button */}
        <div className="p-3 bg-[#faf8f5]/80">
          <div className="flex items-center justify-between gap-2.5 bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2d4a3e] to-[#4c7361] text-[#fef08a] font-bold text-xs flex items-center justify-center shadow-xs border border-[#2d4a3e]/30 shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">{userName}</p>
                <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
              </div>
            </div>
            <form action={onLogout} className="shrink-0">
              <button
                type="submit"
                title="Keluar Akun"
                aria-label="Keluar Akun"
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar (Sticky, Responsive for Desktop & Mobile) */}
        <header className="flex sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 items-center justify-between gap-2 sm:gap-3">
          {/* Left Context */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {/* Mobile View: If on Subpage, show Back to Overview Button */}
            {!isOverview ? (
              <div className="flex md:hidden items-center gap-1.5 min-w-0">
                <Link
                  href={getHrefWithWedding("/dashboard")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 py-1.5 px-2 rounded-lg transition-colors shrink-0"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Overview</span>
                </Link>
                <span className="text-slate-300 font-light shrink-0">/</span>
                <span className="text-xs font-bold text-slate-900 truncate">
                  {getPageTitle(pathname)}
                </span>
              </div>
            ) : (
              /* Mobile View: On Overview Hub, show Brand & Wedding Switcher */
              <div className="flex md:hidden items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2d4a3e] to-[#4c7361] flex items-center justify-center text-white text-xs shadow-xs shrink-0">
                  <Heart className="w-3.5 h-3.5 fill-white/20 text-white" />
                </div>
                {weddings.length > 1 ? (
                  <select
                    value={activeWedding?.id}
                    onChange={(e) => handleWeddingSwitch(e.target.value)}
                    className="text-xs font-bold text-slate-900 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer truncate max-w-[150px]"
                  >
                    {weddings.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.coupleTitle}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 text-xs truncate block">
                      {activeWedding ? activeWedding.coupleTitle : "Hayvows"}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Desktop Breadcrumb Context */}
            <div className="hidden md:flex items-center gap-2 text-xs min-w-0">
              <Link
                href={getHrefWithWedding("/dashboard")}
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                Undangan
              </Link>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-900 truncate">
                {activeWedding ? activeWedding.coupleTitle : "Workbench Mempelai"}
              </span>
              {!isOverview && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-[#2d4a3e] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    {getPageTitle(pathname)}
                  </span>
                </>
              )}
              {activeWedding && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-[#2d4a3e] border border-emerald-200/80 rounded-full shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2d4a3e]" />
                  <span>Live &bull; Published</span>
                </span>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[#2d4a3e] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl shadow-2xs transition-colors"
            >
              <ExternalLink className="hidden sm:inline w-3.5 h-3.5 text-[#2d4a3e] shrink-0" />
              <span className="hidden sm:inline">Live Demo Undangan</span>
              <span className="sm:hidden text-[11px] font-semibold">Demo ↗</span>
            </Link>
          </div>
        </header>

        {/* Page Content Body (with pb-20 on mobile for 4-tab bottom bar clearance) */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-20 md:pb-8 w-full min-w-0">
          {/* Mobile Plan Banner (Khusus Tampilan Mobile saat bukan Luxury) */}
          {userPlan !== "luxury" && (
            <div
              className={`block md:hidden mb-4 p-3.5 sm:p-4 rounded-2xl border shadow-2xs transition-all ${
                userPlan === "premium"
                  ? "bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-100/70 border-emerald-200/90 text-emerald-950"
                  : "bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-100/80 border-amber-200/90 text-amber-950"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="p-1 rounded-lg bg-white/90 border border-slate-200/60 shadow-2xs shrink-0">
                    <Sparkles
                      className={`w-3.5 h-3.5 ${
                        userPlan === "premium" ? "text-emerald-700" : "text-amber-700"
                      }`}
                    />
                  </span>
                  <span className="text-xs font-bold truncate">
                    {userPlan === "premium" ? "Paket Premium Aktif" : "Mode Uji Coba (Free)"}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    userPlan === "premium"
                      ? "bg-emerald-200/90 text-emerald-900 border border-emerald-300"
                      : "bg-amber-200/90 text-amber-950 border border-amber-300"
                  }`}
                >
                  {userPlan === "premium" ? "500 Tamu" : "50 Tamu"}
                </span>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-600 mb-2.5">
                {userPlan === "premium"
                  ? "Tingkatkan ke paket Luxury untuk kuota tanpa batas dan bebas kustomisasi tanpa kompromi."
                  : "Undangan Anda memuat label mode uji coba. Upgrade sekarang untuk menghapus label 100%."}
              </p>

              <button
                type="button"
                onClick={() => setUpgradeModalOpen(true)}
                className="w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-xs active:scale-[0.99]"
              >
                <span>{userPlan === "premium" ? "Upgrade ke Paket Luxury" : "Upgrade / Hapus Label"}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#fef08a]" />
              </button>
            </div>
          )}

          {children}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation Bar (Bilah 4 Tab Ringkas) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-1.5 flex items-center justify-around shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        {/* Tab 1: Overview */}
        <Link
          href={getHrefWithWedding("/dashboard")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] transition-colors ${
            pathname === "/dashboard"
              ? "text-[#2d4a3e] font-bold"
              : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </Link>

        {/* Tab 2: Tamu */}
        <Link
          href={getHrefWithWedding("/dashboard/guests")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] transition-colors ${
            pathname.startsWith("/dashboard/guests")
              ? "text-[#2d4a3e] font-bold"
              : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tamu</span>
        </Link>

        {/* Tab 3: Template */}
        <Link
          href={getHrefWithWedding("/dashboard/template")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] transition-colors ${
            pathname.startsWith("/dashboard/template")
              ? "text-[#2d4a3e] font-bold"
              : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Template</span>
        </Link>

        {/* Tab 4: Lainnya (Membuka Menu Lengkap Sheet) */}
        <button
          type="button"
          onClick={() => setMoreMenuOpen(true)}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] transition-colors cursor-pointer ${
            isOtherPage || moreMenuOpen
              ? "text-[#2d4a3e] font-bold"
              : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <div className="relative">
            <Menu className="w-4 h-4" />
            {isOtherPage && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#2d4a3e]" />
            )}
          </div>
          <span>Lainnya</span>
        </button>
      </nav>

      {/* 4. Bottom Sheet: Menu Lengkap "Lainnya" */}
      {moreMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMoreMenuOpen(false)}
          />

          {/* Sheet Modal */}
          <aside className="fixed inset-x-0 bottom-0 z-10 max-h-[85vh] bg-white rounded-t-2xl shadow-2xl flex flex-col border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
            {/* Drag Bar Indicator */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1" />

            {/* Header */}
            <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2d4a3e] to-[#4c7361] flex items-center justify-center text-white text-xs shadow-xs">
                  <Heart className="w-3.5 h-3.5 fill-white/20 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">
                    Menu Lengkap Undangan
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">NAVIGASI FITUR</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wedding Switcher inside sheet if multiple exist */}
            {weddings.length > 1 && (
              <div className="mx-4 mt-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-[#2d4a3e] shrink-0" />
                <select
                  value={activeWedding?.id}
                  onChange={(e) => {
                    handleWeddingSwitch(e.target.value);
                    setMoreMenuOpen(false);
                  }}
                  className="w-full text-xs font-semibold text-slate-800 bg-transparent border-0 p-0 focus:ring-0 truncate cursor-pointer"
                >
                  {weddings.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.coupleTitle}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Scrollable Features Content */}
            <div className="flex-1 px-4 py-3 overflow-y-auto space-y-4">
              {/* Category 1: Tamu & Respon */}
              <div>
                <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 px-1 mb-1.5">
                  Tamu &amp; Respon
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={getHrefWithWedding("/dashboard/guests")}
                    onClick={() => setMoreMenuOpen(false)}
                    className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 text-xs font-medium ${
                      pathname.startsWith("/dashboard/guests")
                        ? "bg-emerald-50 border-emerald-300 text-[#2d4a3e] font-bold"
                        : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Users className="w-4 h-4 text-[#2d4a3e] shrink-0" />
                    <span className="truncate">Daftar Tamu</span>
                  </Link>

                  <Link
                    href={getHrefWithWedding("/dashboard/guestbook")}
                    onClick={() => setMoreMenuOpen(false)}
                    className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 text-xs font-medium ${
                      pathname.startsWith("/dashboard/guestbook")
                        ? "bg-emerald-50 border-emerald-300 text-[#2d4a3e] font-bold"
                        : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <BookOpenCheck className="w-4 h-4 text-[#2d4a3e] shrink-0" />
                    <span className="truncate">Buku Tamu (QR)</span>
                  </Link>

                  <Link
                    href={getHrefWithWedding("/dashboard/rsvp")}
                    onClick={() => setMoreMenuOpen(false)}
                    className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 text-xs font-medium ${
                      pathname.startsWith("/dashboard/rsvp")
                        ? "bg-emerald-50 border-emerald-300 text-[#2d4a3e] font-bold"
                        : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#2d4a3e] shrink-0" />
                    <span className="truncate">Konfirmasi RSVP</span>
                  </Link>

                  <Link
                    href={getHrefWithWedding("/dashboard/messages")}
                    onClick={() => setMoreMenuOpen(false)}
                    className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 text-xs font-medium ${
                      pathname.startsWith("/dashboard/messages")
                        ? "bg-emerald-50 border-emerald-300 text-[#2d4a3e] font-bold"
                        : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-[#2d4a3e] shrink-0" />
                    <span className="truncate">Ucapan &amp; Doa</span>
                  </Link>

                  <Link
                    href={getHrefWithWedding("/dashboard/analytics")}
                    onClick={() => setMoreMenuOpen(false)}
                    className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 text-xs font-medium ${
                      pathname.startsWith("/dashboard/analytics")
                        ? "bg-amber-50 border-amber-300 text-amber-900 font-bold"
                        : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">Statistik</span>
                  </Link>
                </div>
              </div>

              {/* Category 2: Undangan & Pengaturan */}
              <div>
                <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 px-1 mb-1.5">
                  Undangan &amp; Pengaturan
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={getHrefWithWedding("/dashboard/invitation")}
                    onClick={() => setMoreMenuOpen(false)}
                    className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 text-xs font-medium ${
                      pathname.startsWith("/dashboard/invitation")
                        ? "bg-emerald-50 border-emerald-300 text-[#2d4a3e] font-bold"
                        : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <HeartHandshake className="w-4 h-4 text-[#2d4a3e] shrink-0" />
                    <span className="truncate">Kelola Undangan</span>
                  </Link>

                  <Link
                    href={getHrefWithWedding("/dashboard/template")}
                    onClick={() => setMoreMenuOpen(false)}
                    className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 text-xs font-medium ${
                      pathname.startsWith("/dashboard/template")
                        ? "bg-emerald-50 border-emerald-300 text-[#2d4a3e] font-bold"
                        : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Palette className="w-4 h-4 text-[#2d4a3e] shrink-0" />
                    <span className="truncate">Pilihan Template</span>
                  </Link>

                  <Link
                    href={getHrefWithWedding("/dashboard/settings")}
                    onClick={() => setMoreMenuOpen(false)}
                    className={`col-span-2 p-3 rounded-xl border transition-all flex items-center gap-2.5 text-xs font-medium ${
                      pathname.startsWith("/dashboard/settings")
                        ? "bg-emerald-50 border-emerald-300 text-[#2d4a3e] font-bold"
                        : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Settings2 className="w-4 h-4 text-slate-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="truncate block font-semibold text-slate-800">Pengaturan</span>
                      <span className="text-[10px] text-slate-400 block truncate">Profil pengguna, kata sandi &amp; keamanan akun</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Super Admin Quick Link if admin */}
            {userRole === "admin" && (
              <div className="px-4 pb-2">
                <Link
                  href="/admin/users"
                  onClick={() => setMoreMenuOpen(false)}
                  className="w-full p-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 flex items-center justify-between text-xs font-semibold text-purple-950 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <span>Panel Super Admin</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-200 text-purple-900">
                    SUPER
                  </span>
                </Link>
              </div>
            )}

            {/* Plan Upgrade Card inside Bottom Sheet */}
            <div className="px-4 pb-3">
              <div
                className={`p-3 rounded-xl border text-xs space-y-2 ${
                  userPlan === "luxury"
                    ? "bg-[#0a0a0a] text-white border-[#c9a84c]/40"
                    : userPlan === "premium"
                    ? "bg-emerald-50 text-emerald-950 border-emerald-200"
                    : "bg-amber-50/80 text-amber-950 border-amber-200/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    {userPlan === "luxury" ? (
                      <>
                        <Crown className="w-3 h-3 text-[#c9a84c]" />
                        <span className="text-[#c9a84c]">Paket Luxury</span>
                      </>
                    ) : userPlan === "premium" ? (
                      <>
                        <Sparkles className="w-3 h-3 text-emerald-700" />
                        <span className="text-emerald-800">Paket Premium</span>
                      </>
                    ) : (
                      <span className="text-amber-800 font-bold">Mode Uji Coba</span>
                    )}
                  </span>
                  <span className="text-[10px] font-mono opacity-60">
                    {userPlan === "luxury" ? "Unlimited" : userPlan === "premium" ? "500 Tamu" : "50 Tamu"}
                  </span>
                </div>

                {userPlan === "basic" && (
                  <p className="text-[10px] text-amber-800/90 leading-tight">
                    Undangan memuat label mode uji coba.
                  </p>
                )}

                {userPlan !== "luxury" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      setUpgradeModalOpen(true);
                    }}
                    className="w-full py-1.5 px-2.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-2xs"
                  >
                    <span>{userPlan === "premium" ? "Upgrade Luxury" : "Upgrade / Hapus Label"}</span>
                    <ArrowUpRight className="w-3 h-3 text-[#fef08a]" />
                  </button>
                )}
              </div>
            </div>

            {/* User Profile & Logout in Bottom Sheet */}
            <div className="p-3.5 border-t border-slate-100 bg-[#faf8f5] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2d4a3e] to-[#4c7361] text-[#fef08a] font-bold text-xs flex items-center justify-center shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{userName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
                </div>
              </div>
              <form action={onLogout} className="shrink-0">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={userPlan}
      />

      {/* Midtrans Snap JS Script */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
    </div>
  );
}

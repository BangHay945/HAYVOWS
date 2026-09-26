"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { HayvowsLogo } from "@/components/brand/HayvowsLogo";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Send,
  Gift,
  Music,
  MapPin,
  Clock,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Shield,
  Filter,
  Lock,
  Star,
  Zap,
  Play,
  Heart,
  Menu,
  X,
  Gamepad2,
  Flower2,
  Layers,
  Palette,
  Tag,
  HelpCircle,
  MessageCircle,
  MessageSquare,
  Compass,
  Crown,
  QrCode,
  Tv,
  Printer,
  Utensils,
  Check,
  FileSpreadsheet,
  Share2,
  Image as ImageIcon,
  Calendar,
  Copy,
} from "lucide-react";

export type ThemeCategory = "all" | "adat" | "floral" | "rpg" | "luxury" | "minimalist" | "basic";

export interface ThemeCategoryItem {
  id: ThemeCategory;
  label: string;
  shortLabel: string;
  icon: any;
  description: string;
}

export const THEME_CATEGORIES: ThemeCategoryItem[] = [
  {
    id: "all",
    label: "Semua Tema",
    shortLabel: "Semua",
    icon: Layers,
    description: "Seluruh koleksi desain undangan digital Hayvows dari berbagai konsep dan nuansa pernikahan.",
  },
  {
    id: "adat",
    label: "Adat Nusantara",
    shortLabel: "Adat",
    icon: Compass,
    description: "Keagungan adat pernikahan Nusantara dengan ornamen gunungan & kawung otentik serta musik gamelan daerah.",
  },
  {
    id: "floral",
    label: "Botanical & Floral",
    shortLabel: "Floral",
    icon: Flower2,
    description: "Estetika botani hijau sage, sentuhan dedaunan anggun, dan aksen emas kemewahan organik.",
  },
  {
    id: "rpg",
    label: "Game & 2D Pixel RPG",
    shortLabel: "2D RPG",
    icon: Gamepad2,
    description: "Pengalaman interaktif unik bernuansa retro 16-bit! Tamu diajak berkeliling dan berinteraksi dengan karakter mempelai.",
  },
  {
    id: "luxury",
    label: "Luxury Noir & Monokrom",
    shortLabel: "Luxury",
    icon: Crown,
    description: "Kemewahan monokromatik hitam pekat berpadu aksen emas sampanye mewah dengan animasi Ken Burns sinematik.",
  },
  {
    id: "minimalist",
    label: "Modern Minimalist",
    shortLabel: "Minimalis",
    icon: Sparkles,
    description: "Desain editorial modern tanpa bunga, berfokus pada monogram inisial nama mempelai, tipografi arsitektural, dan estetika bersih.",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedThemeTab, setSelectedThemeTab] = useState<ThemeCategory>("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (
    tabKey: ThemeCategory,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    setSelectedThemeTab(tabKey);
    const container = tabContainerRef.current;
    if (!container || !e) return;

    const target = e.currentTarget;
    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const diff = targetRect.left + targetRect.width / 2 - (containerRect.left + containerRect.width / 2);

    container.scrollBy({
      left: diff,
      behavior: "smooth",
    });
  };

  const handleSelectCategory = (catId: ThemeCategory) => {
    setSelectedThemeTab(catId);
    const temaSection = document.getElementById("tema");
    if (temaSection) {
      temaSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqs = [
    {
      q: "Apakah Hayvows menyediakan layanan cetak kertas fisik?",
      a: "Hayvows adalah platform teknologi digital. Kami tidak mencetak kertas fisik secara langsung, namun kami menyediakan Studio Desain QR Siap Cetak (300 DPI). Anda dapat mengunduh file gambar stiker atau kartu beresolusi tinggi untuk diserahkan ke vendor percetakan fisik langganan Anda. Saat tamu scan stiker tersebut, data otomatis tersambung ke sistem Hayvows!",
    },
    {
      q: "Bagaimana jika tamu undangan cetak lupa membawa atau men-download tiket QR?",
      a: "Sangat aman! Petugas meja resepsi tidak hanya mengandalkan scanner kamera, tetapi juga memiliki fitur Pencarian Nama 1-Klik di laptop/tablet. Tamu cukup menyebutkan nama mereka dan petugas langsung memverifikasi kehadiran tanpa kendala.",
    },
    {
      q: "Bagaimana cara menghubungkan Layar Sapa ke TV atau Videotron gedung?",
      a: "Cukup buka tautan Layar Sapa (display) di browser laptop meja resepsionis, hubungkan kabel HDMI ke TV/Videotron gedung, lalu tekan tombol 'Layar Penuh' (Fullscreen). Setiap kali ada tamu check-in, layar TV otomatis menampilkan nama tamu tersebut secara sinematik.",
    },
    {
      q: "Apakah ada batasan jumlah nama tamu yang bisa dibuatkan link khusus?",
      a: "Tidak ada batasan (Unlimited)! Anda bisa memasukkan ratusan hingga ribuan nama tamu. Sistem kami akan otomatis membuatkan tautan khusus dengan nama tamu tertera elegan di sampul undangan dan pesan WhatsApp.",
    },
    {
      q: "Apakah tamu undangan bisa langsung konfirmasi kehadiran (RSVP) & kirim kado?",
      a: "Tentu! Tamu dapat memilih kehadiran (Hadir/Tidak Hadir), jumlah orang (pax), menulis doa restu, serta mentransfer tanda kasih langsung ke nomor rekening bank kedua mempelai di dalam undangan.",
    },
    {
      q: "Bagaimana cara kerja Proteksi Anti-Spam dan moderasi ucapan doa?",
      a: "Hayvows dilengkapi sistem penyaring teks cerdas yang secara otomatis mendeteksi dan memblokir tautan spam (URL judi/promosi) serta kata-kata tidak sopan. Anda juga memiliki panel kendali penuh di Dashboard untuk meninjau, menyembunyikan, atau menghapus ucapan doa kapan saja demi menjaga kekhidmatan halaman pernikahan.",
    },
    {
      q: "Apakah ada potongan biaya (admin fee) pada amplop digital?",
      a: "Sama sekali tidak ada potongan (0% Admin Fee). Nomor rekening bank maupun QRIS yang Anda pasang langsung terhubung ke rekening pribadi Anda, sehingga seluruh tanda kasih dari tamu masuk 100% utuh tanpa perantara.",
    },
    {
      q: "Bisakah mengganti lagu atau latar musik undangan?",
      a: "Sangat bisa! Anda dapat menggunakan lagu pilihan dari playlist kami, mengunggah file MP3 sendiri, ataupun menyematkan lagu romantis langsung dari video YouTube favorit Anda.",
    },
  ];

  const themes = [
    {
      id: "modern-monogram",
      category: "minimalist",
      name: "Modern Monogram Minimalis",
      tag: "Bersih & Editorial",
      tagColor: "bg-slate-100 text-slate-800 border-slate-300",
      description: "Desain minimalis bebas bunga berfokus pada monogram inisial nama mempelai, keindahan tipografi editorial modern, hitung mundur waktu acara, serta alunan musik romantis.",
      demoUrl: "/invitation/adrian-nadia/budi-santoso",
      bannerImage: "/assets/templates/modern-monogram/banner.jpg",
      highlights: ["Monogram Inisial Artistik", "Tipografi Bersih Tanpa Bunga", "Musik Romantis Preset"],
      bgColor: "from-stone-900 via-[#2d4a3e] to-stone-950",
      badge: "Modern Minimalist",
    },
    {
      id: "nature-floral",
      category: "floral",
      name: "Nature Botanical Floral",
      tag: "Terbaru & Elegan",
      tagColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      description: "Estetika botani hijau sage & emas mewah dengan tipografi Playfair Display puitis. Lengkap dengan 11 komponen interaktif dan efek suara akustik lembut.",
      demoUrl: "/invitation/dimas-anindya/budi-santoso",
      bannerImage: "/assets/templates/nature-floral/banner.jpg",
      highlights: ["Desain Botani Mewah", "Modal Amplop Digital", "Sound FX Akustik"],
      bgColor: "from-emerald-950/80 via-emerald-900/60 to-slate-900",
      badge: "Floral Luxury",
    },
    {
      id: "batik-jawa",
      category: "adat",
      name: "Batik Jawa Heritage",
      tag: "Adat Nusantara",
      tagColor: "bg-amber-900/30 text-amber-700 border-amber-700/40",
      description: "Keanggunan pernikahan adat Jawa Kraton dengan ornamen gunungan & kawung SVG, tipografi prasasti, palet merah saga & emas kraton, serta alunan gamelan Jawa.",
      demoUrl: "/invitation/prasetyo-kinanti/budi-santoso",
      bannerImage: "/assets/templates/batik-jawa/banner.jpg",
      highlights: ["Ornamen Gunungan & Kawung SVG", "Tipografi Prasasti Kraton", "Musik Gamelan Jawa"],
      bgColor: "from-amber-950 via-stone-900 to-red-950",
      badge: "Adat Heritage",
    },
    {
      id: "eternal-noir",
      category: "luxury",
      name: "Eternal Luxury Noir",
      tag: "Monochrome Exclusive",
      tagColor: "bg-slate-800 text-amber-300 border-amber-500/40",
      description: "Keanggunan monokromatik hitam pekat berpadu aksen emas sampanye mewah. Tata letak split-screen desktop dengan transisi Ken Burns sinematik.",
      demoUrl: "/invitation/eleanor-xavier/budi-santoso",
      bannerImage: "/assets/templates/eternal-noir/banner.jpg",
      highlights: ["Kemewahan Noir & Emas", "Layout Split Desktop", "Animasi Ken Burns"],
      bgColor: "from-black via-stone-900 to-black",
      badge: "Luxury Exclusive",
    },
    {
      id: "royal-emerald",
      category: "luxury",
      name: "Royal Emerald & Gold",
      tag: "Aristocratic Exclusive",
      tagColor: "bg-emerald-950 text-amber-300 border-amber-500/40",
      description: "Kemewahan aristokrat bernuansa hijau zamrud (emerald velvet) dipadukan dengan aksen emas bangsawan, mahkota kerajaan, dan layout split desktop sinematik.",
      demoUrl: "/invitation/eleanor-xavier/budi-santoso?tpl=royal-emerald",
      bannerImage: "/assets/templates/eternal-noir/banner.jpg",
      highlights: ["Emerald Velvet & Emas Bangsawan", "Mahkota & Ornamen Kerajaan", "Layout Sinematik Split Desktop"],
      bgColor: "from-[#02241b] via-[#064e3b] to-[#021a13]",
      badge: "Royal Luxury",
    },
    {
      id: "pixel-adventure",
      category: "rpg",
      name: "Pixel Adventure RPG 2D",
      tag: "Paling Populer & Unik",
      tagColor: "bg-amber-100 text-amber-800 border-amber-300",
      description: "Pengalaman seperti bermain game RPG 16-bit! Tamu diajak berkeliling di pulau langit terapung, berbicara dengan 5 NPC interaktif, dan membuka fitur pernikahan.",
      demoUrl: "/invitation/alex-sara/budi-santoso",
      bannerImage: "/assets/templates/pixel-adventure/banner.jpg",
      highlights: ["Petualangan Game 2D", "Pulau Langit Eksplorasi", "Gerakan Karakter WASD"],
      bgColor: "from-amber-950/80 via-indigo-950/60 to-slate-900",
      badge: "2D Pixel RPG",
    },
    {
      id: "pixel-cyberpunk",
      category: "rpg",
      name: "Cyberpunk Neo-District 2077",
      tag: "Futuristic 2D RPG",
      tagColor: "bg-cyan-100 text-cyan-900 border-cyan-300",
      description: "Pengalaman pernikahan futuristik bernuansa neon cyberpunk! Dilengkapi eksplorasi peta kota Skyline District, 7 NPC interaktif, audio synthwave, dan visual retro-futuristik.",
      demoUrl: "/invitation/neo-2077/budi-santoso",
      bannerImage: "/assets/templates/pixel-cyberpunk/banner.jpg",
      highlights: ["Kota Cyberpunk Futuristik", "Audio Synthwave", "7 NPC Interaktif"],
      bgColor: "from-cyan-950 via-slate-950 to-pink-950",
      badge: "Cyberpunk Edition",
    },
  ];

  const filteredThemes = themes.filter((t) => {
    if (selectedThemeTab === "all") return true;
    return t.category === selectedThemeTab;
  });

  return (
    <div className="min-h-screen bg-[#fbf8f3] text-slate-800 flex flex-col font-sans selection:bg-[#2d4a3e] selection:text-white">
      {/* ───────────────── 1. NAVBAR ───────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#fbf8f3]/85 border-b border-[#2d4a3e]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <HayvowsLogo variant="full" theme="light" size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#keunggulan" className="hover:text-[#2d4a3e] transition-colors">
              Keunggulan Ekosistem
            </a>
            <a href="#fitur" className="hover:text-[#2d4a3e] transition-colors">
              Fitur Lengkap
            </a>
            <a href="#cara-kerja" className="hover:text-[#2d4a3e] transition-colors">
              Alur Hybrid Cetak &amp; Digital
            </a>
            <a href="#tema" className="hover:text-[#2d4a3e] transition-colors">
              Galeri Tema
            </a>
            <a href="#harga" className="hover:text-[#2d4a3e] transition-colors">
              Paket Harga
            </a>
            <a href="#faq" className="hover:text-[#2d4a3e] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 hover:text-[#2d4a3e] px-3.5 py-2 rounded-xl transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2d4a3e] hover:bg-[#233a30] px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <span>Buat Undangan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-[#2d4a3e] focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <a
              href="#keunggulan"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-2 border-b border-slate-100"
            >
              Keunggulan Ekosistem
            </a>
            <a
              href="#fitur"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-2 border-b border-slate-100"
            >
              Fitur Lengkap &amp; Anti-Spam
            </a>
            <a
              href="#cara-kerja"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-2 border-b border-slate-100"
            >
              Alur Hybrid Cetak &amp; Digital
            </a>
            <a
              href="#tema"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-2 border-b border-slate-100"
            >
              Galeri Tema
            </a>
            <a
              href="#harga"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-2 border-b border-slate-100"
            >
              Paket Harga
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-2"
            >
              FAQ
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-800"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="w-full text-center py-2.5 rounded-xl bg-[#2d4a3e] text-white font-bold text-xs shadow-md"
              >
                Buat Undangan Sekarang
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ───────────────── 2. HERO SECTION ───────────────── */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/40 via-amber-50/30 to-transparent pointer-events-none -z-10 blur-3xl" />

        <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c5a880]/60 text-[#2d4a3e] text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>EKOSISTEM RESEPSI PERNIKAHAN DIGITAL LENGKAP</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Bukan Sekadar Undangan Online.{" "}
            <span className="bg-gradient-to-r from-[#2d4a3e] via-[#4c7361] to-[#c5a880] bg-clip-text text-transparent">
              Ini Sistem Resepsi Lengkap
            </span>{" "}
            untuk Hari Bahagia Anda.
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hubungkan undangan cetak fisik &amp; digital, hitung katering secara presisi, hingga sambut tamu dengan pemindai QR dan Layar Sapa TV otomatis di gedung resepsi.
          </p>

          {/* Main CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-white bg-[#2d4a3e] hover:bg-[#233a30] px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <span>Buat Undangan Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#tema"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 px-6 py-3.5 rounded-2xl shadow-xs transition-all hover:border-slate-400"
            >
              <Play className="w-4 h-4 fill-slate-700" />
              <span>Lihat Demo Interaktif</span>
            </a>
          </div>

          {/* ───────────────── DUAL LIVE PREVIEW HERO CARDS ───────────────── */}
          <div className="pt-8 sm:pt-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left max-w-4xl mx-auto">
            {/* Card 1: Pixel RPG Live Preview */}
            <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#161d42] to-[#0c102a] border-2 border-amber-400/80 shadow-2xl p-6 sm:p-7 text-white flex flex-col justify-between hover:shadow-amber-500/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/50 text-xs font-bold font-mono tracking-wider inline-flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>TEMA RETRO RPG</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Demo
                </span>
              </div>

              <div>
                <h3 className="font-mono text-xl sm:text-2xl font-bold text-amber-300">
                  Pixel Adventure RPG
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Tamu diajak berkeliling pulau langit 2D, berbicara dengan avatar mempelai &amp; NPC interaktif untuk membuka fitur RSVP, amplop digital, dan galeri foto.
                </p>

                <div className="my-5 p-3 rounded-2xl bg-black/40 border border-amber-400/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5 text-amber-300" />
                  </div>
                  <div className="text-xs font-mono text-amber-200">
                    <p className="font-bold">Eksplorasi Peta 2D Interaktif</p>
                    <p className="text-[11px] text-slate-400">Musik chiptune 8-bit &amp; 5 NPC interaktif</p>
                  </div>
                </div>
              </div>

              <Link
                href="/invitation/alex-sara/budi-santoso"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-bold text-xs sm:text-sm transition-all shadow-md group-hover:scale-[1.01]"
              >
                <span>Buka Demo Pixel RPG</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Nature Floral Live Preview */}
            <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#2d4a3e] to-[#1c3329] border-2 border-[#c5a880] shadow-2xl p-6 sm:p-7 text-[#fbf8f3] flex flex-col justify-between hover:shadow-emerald-900/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-[#fef08a] border border-[#c5a880]/60 text-xs font-semibold tracking-wider inline-flex items-center gap-1.5">
                  <Flower2 className="w-3.5 h-3.5" />
                  <span>TEMA BOTANICAL LUXURY</span>
                </span>
                <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Demo
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#fbf8f3]">
                  Nature Botanical Floral
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
                  Estetika botani hijau sage dengan aksen emas mewah. Dilengkapi amplop digital langsung, musik akustik, dan dock navigasi melayang tanpa distraksi.
                </p>

                <div className="my-5 p-3 rounded-2xl bg-black/25 border border-[#c5a880]/40 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c5a880]/20 border border-[#c5a880]/40 flex items-center justify-center shrink-0">
                    <Flower2 className="w-5 h-5 text-[#fef08a]" />
                  </div>
                  <div className="text-xs text-emerald-100">
                    <p className="font-bold">Desain Organik Elegan</p>
                    <p className="text-[11px] text-emerald-200/70">Tipografi puitis &amp; kontrol audio cerdas</p>
                  </div>
                </div>
              </div>

              <Link
                href="/invitation/dimas-anindya/budi-santoso"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#dfc49e] hover:brightness-110 text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-md group-hover:scale-[1.01]"
              >
                <span>Buka Demo Nature Floral</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── 3. STATS & KEY METRICS ───────────────── */}
      <section className="border-y border-slate-200 bg-white py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl sm:text-4xl font-extrabold text-[#2d4a3e]">1 Detik</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Check-in QR di Meja Resepsi</p>
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-extrabold text-[#2d4a3e]">100% Presisi</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Estimasi Katering &amp; Pax</p>
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-extrabold text-[#2d4a3e]">300 DPI</p>
            <p className="text-xs text-slate-500 font-medium mt-1">File Desain QR Siap Cetak</p>
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-extrabold text-[#2d4a3e]">Unlimited</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Tamu &amp; Sebaran WhatsApp</p>
          </div>
        </div>
      </section>

      {/* ───────────────── 4. THE 4 POWERHOUSE PILLARS ───────────────── */}
      <section id="keunggulan" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#2d4a3e] uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>4 PILAR EKOSISTEM PINTAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Fitur Canggih yang Bikin Hari H Anda Jauh Lebih Mudah
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Bukan sekadar website cantik. Hayvows adalah asisten digital yang mengurus tamu fisik, katering, hingga penyambutan di gedung resepsi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Pilar 1: Solusi Hybrid Cetak */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-500/40 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-[#2d4a3e] flex items-center justify-center shadow-2xs">
                  <Printer className="w-5 h-5 text-emerald-700" />
                </div>
                <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                  Solusi Hybrid Cetak
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                  Undangan Tetap Kertas, Tapi Bebas Ketik Ulang
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Punya percetakan langganan sendiri? Cukup tempelkan <strong>Stiker Segel QR</strong> dari Hayvows. Saat tamu scan amplop fisik, data kehadiran langsung otomatis tercatat di web Anda!
                </p>
              </div>

              {/* Visual Micro-Diagram */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Alur Otomatis Tamu Fisik
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono">Bebas Vendor Cetak</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-medium pt-1">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <p className="text-slate-400">1. Undangan</p>
                    <p className="font-bold text-slate-800">Kertas Percetakan</p>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-2xs">
                    <p className="text-emerald-600">2. Tempel</p>
                    <p className="font-bold">Stiker QR 300 DPI</p>
                  </div>
                  <div className="p-2 rounded-xl bg-[#2d4a3e] text-white shadow-2xs">
                    <p className="text-emerald-300">3. Tamu Scan</p>
                    <p className="font-bold text-[#fef08a]">Dapat Tiket QR</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tamu fisik &amp; digital otomatis menyatu</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700">Format 300 DPI High-Res &rarr;</span>
            </div>
          </div>

          {/* Pilar 2: Buku Tamu Digital & Presensi QR */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#2d4a3e] border border-emerald-200 flex items-center justify-center shadow-2xs">
                  <QrCode className="w-5 h-5" />
                </div>
                <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                  Hari H Bebas Antrean
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                  Check-in 1 Detik. Selamat Tinggal Buku Tulis Tangan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Penerima tamu cukup scan tiket QR di layar HP tamu atau cari nama 1-klik. Jumlah rombongan, souvenir, dan amplop tercatat rapi tanpa tumpukan kertas.
                </p>
              </div>

              {/* Visual Micro-Diagram */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Simulasi Scan Resepsionis
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold">1 Detik Selesai</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-emerald-200 text-[11px] flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Budi Santoso &amp; Rekan</p>
                      <p className="text-[10px] text-slate-400">2 Orang &bull; Souvenir Diambil</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    Terverifikasi
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bisa cari nama cepat tanpa QR</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700">Scanner HP &amp; Laptop &rarr;</span>
            </div>
          </div>

          {/* Pilar 3: Layar Sambutan TV / Videotron */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#2d4a3e] border border-emerald-200 flex items-center justify-center shadow-2xs">
                  <Tv className="w-5 h-5" />
                </div>
                <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                  Penyambutan Mewah
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                  Sambut Tamu Bak VIP di Layar TV &amp; Videotron
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Tinggal colok kabel HDMI ke TV gedung. Setiap kali tamu check-in di meja resepsi, nama mereka langsung disambut megah di layar TV secara otomatis.
                </p>
              </div>

              {/* Visual Micro-Diagram */}
              <div className="p-3 rounded-2xl bg-slate-900 text-white space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Layar Sapa TV Gedung
                  </span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">Live 3 Detik</span>
                </div>
                <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-[11px] text-center">
                  <p className="text-amber-200 text-[10px]">Selamat Datang di Pernikahan Kami</p>
                  <p className="font-bold text-white text-xs mt-0.5">Bapak Budi Santoso &amp; Keluarga</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mendukung Video YouTube &amp; Foto</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700">Tema Otomatis Sesuai Undangan &rarr;</span>
            </div>
          </div>

          {/* Pilar 4: Kalkulator Porsi Katering Presisi */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#2d4a3e] border border-emerald-200 flex items-center justify-center shadow-2xs">
                  <Utensils className="w-5 h-5" />
                </div>
                <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                  Hemat Anggaran
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                  Porsi Makanan Pas, Anggaran Katering Aman
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Ketahui estimasi riil konsumsi dari rombongan yang RSVP hadir, lengkap dengan rekomendasi cadangan aman 10% agar makanan tidak tekor ataupun mubazir.
                </p>
              </div>

              {/* Visual Micro-Diagram */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Kalkulator Katering Otomatis
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold">100% Akurat</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] pt-1">
                  <div className="p-1.5 rounded-xl bg-white border border-slate-200">
                    <p className="text-slate-400">RSVP Hadir</p>
                    <p className="font-bold text-slate-800">450 Tamu</p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white border border-slate-200">
                    <p className="text-slate-400">+10% Buffer</p>
                    <p className="font-bold text-amber-700">45 Pax</p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-emerald-600 text-white font-bold">
                    <p className="text-emerald-200">Rekomendasi</p>
                    <p className="text-xs">495 Porsi</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ekspor laporan CSV / Excel 1-Klik</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700">Langsung Serahkan ke Vendor &rarr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── 5. FITUR LENGKAP UNDANGAN & PROTEKSI ANTI-SPAM ───────────────── */}
      <section id="fitur" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fbf8f3] via-white to-[#fbf8f3] border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#2d4a3e] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>FITUR LENGKAP &amp; ANTI-SPAM</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Segala yang Dibutuhkan Undangan Digital Modern
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bukan cuma tampilan mewah, tapi juga interaktif, bebas spam, dan praktis dibagikan ke seluruh keluarga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Proteksi Anti-Spam & Moderasi Doa Cerdas */}
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-600/30 shadow-md hover:shadow-xl transition-all space-y-4 flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#2d4a3e] flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wider inline-flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Bebas Spam</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Proteksi Anti-Spam &amp; Filter Doa
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Buku doa tetap khidmat! Link promosi mencurigakan dan kata-kata tidak pantas otomatis disaring sebelum tayang.
                  </p>
                </div>

                {/* Simulated UI Mockup */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      Budi Santoso <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">Tamu Asli</span>
                    </span>
                    <span className="text-[10px] text-slate-400">12:30 WIB</span>
                  </div>
                  <p className="text-slate-600 italic text-[11px] leading-snug">
                    &ldquo;Selamat menempuh hidup baru Adrian &amp; Nadia!&rdquo;
                  </p>
                  <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-emerald-700 font-mono">
                    <span>🛡️ Filter Spam Aktif</span>
                    <span className="font-sans font-semibold underline">Moderasi Tersedia</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5 border-t border-slate-100">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bisa sembunyikan / hapus ucapan dari dashboard</span>
              </div>
            </div>

            {/* Card 2: Generator Sebar WhatsApp 1-Klik */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#2d4a3e] border border-emerald-200 flex items-center justify-center shadow-xs">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    1-Klik Sebar
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Generator Pesan WhatsApp 1-Klik
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Kirim undangan personal dengan nama masing-masing tamu secara instan tanpa perlu ketik atau simpan nomor satu per satu.
                  </p>
                </div>

                {/* Simulated UI Mockup */}
                <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-semibold text-[11px]">
                    <MessageCircle className="w-3 h-3 text-emerald-700" />
                    <span>Format WhatsApp Otomatis</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-100 text-[10px] text-slate-700 leading-snug">
                    Kepada Yth. <span className="font-bold text-[#2d4a3e]">Budi Santoso</span>, kami mengundang Bapak/Ibu...
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-emerald-800 font-medium">
                    <span>✓ Tautan Unik Tersedia</span>
                    <span className="font-bold">Kirim Sekarang &rarr;</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5 border-t border-slate-100">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Impor daftar ratusan tamu dari Excel / CSV</span>
              </div>
            </div>

            {/* Card 3: Amplop Digital & Rekening 0% Biaya Potongan */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center shadow-xs">
                    <Gift className="w-5 h-5 text-amber-700" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    0% Potongan
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Amplop Digital &amp; Rekening Langsung
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Tanda kasih masuk 100% utuh langsung ke rekening bank atau QRIS mempelai tanpa perantara atau potongan admin.
                  </p>
                </div>

                {/* Simulated UI Mockup */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-300">BANK BCA</span>
                    <span className="text-[9px] bg-white/10 px-2 py-0.2 rounded text-slate-300">Transfer Langsung</span>
                  </div>
                  <p className="font-mono text-xs tracking-wider text-white font-bold">5420 &bull;&bull;&bull;&bull; 8901</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-300 pt-0.5 border-t border-white/10">
                    <span>a.n Adrian Pratama</span>
                    <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                      <Copy className="w-3 h-3" /> Salin Rekening
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5 border-t border-slate-100">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Form konfirmasi transfer otomatis tercatat</span>
              </div>
            </div>

            {/* Card 4: Pemutar Musik Bebas Blokir (MP3 & YouTube) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#2d4a3e] border border-emerald-200 flex items-center justify-center shadow-xs">
                    <Music className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    Autoplay Cerdas
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Musik MP3 &amp; YouTube Bebas Blokir
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Alunan lagu romantis menyambut tamu begitu undangan dibuka. Bebas pakai lagu playlist kami, file MP3 sendiri, atau link YouTube.
                  </p>
                </div>

                {/* Simulated UI Mockup */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#2d4a3e] text-[#fef08a] flex items-center justify-center shadow-2xs">
                      <Music className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-[11px]">A Thousand Years</p>
                      <p className="text-[9px] text-slate-400">Piano &amp; Acoustic Version</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-semibold">
                    Memutar ♫
                  </span>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5 border-t border-slate-100">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tombol kontrol volume &amp; jeda yang elegan</span>
              </div>
            </div>

            {/* Card 5: Petunjuk Arah Google Maps & Simpan ke Kalender */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#2d4a3e] border border-emerald-200 flex items-center justify-center shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    Navigasi GPS
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Google Maps &amp; Pengingat Kalender
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Panduan rute GPS presisi menuju gerbang gedung acara, plus tombol 1-klik simpan jadwal ke Google Calendar tamu.
                  </p>
                </div>

                {/* Simulated UI Mockup */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px]">
                      <p className="font-bold text-slate-800">Grand Ballroom Hotel Indonesia</p>
                      <p className="text-[10px] text-slate-400">Jakarta Pusat</p>
                    </div>
                  </div>
                  <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-[#2d4a3e] font-semibold">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Tambah Kalender
                    </span>
                    <span className="underline">Buka Rute &rarr;</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5 border-t border-slate-100">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hitung mundur hari-H (Countdown Timer) interaktif</span>
              </div>
            </div>

            {/* Card 6: Galeri Momen Sinematik & Love Story */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#2d4a3e] border border-emerald-200 flex items-center justify-center shadow-xs">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    Album HD
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Galeri Foto HD &amp; Kisah Cinta
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Bagikan momen prewedding dalam foto beresolusi tinggi, lightbox interaktif yang ringan dibuka di smartphone, dan video teaser romantis.
                  </p>
                </div>

                {/* Simulated UI Mockup */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5 text-xs">
                  <div className="grid grid-cols-3 gap-1 text-center text-[9px]">
                    <div className="py-2 rounded-lg bg-emerald-900/10 text-slate-600 font-medium">
                      Pertemuan
                    </div>
                    <div className="py-2 rounded-lg bg-amber-900/10 text-slate-600 font-medium">
                      Lamaran
                    </div>
                    <div className="py-2 rounded-lg bg-[#2d4a3e]/15 text-[#2d4a3e] font-bold">
                      Hari H ♡
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5">
                    <span>Lightbox Zoom HD</span>
                    <span className="text-emerald-700 font-semibold">Cepat &amp; Ringan</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5 border-t border-slate-100">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kompresi pintar hemat kuota &amp; muat instan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── 6. CARA KERJA ALUR HYBRID ───────────────── */}
      <section id="cara-kerja" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#2d4a3e] text-white">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#fef08a] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>ALUR PRAKTIS &amp; TERPADU</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Cara Kerja Alur Hybrid Hayvows
            </h2>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Tiga langkah mudah menghubungkan undangan cetak fisik dan digital hingga hari H resepsi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="bg-white/5 border border-white/15 p-7 rounded-3xl backdrop-blur-md space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#c5a880] text-slate-900 font-extrabold flex items-center justify-center text-sm shadow-md">
                  1
                </div>
                <h3 className="font-bold text-lg text-white">
                  Buat Undangan &amp; Unduh File QR Siap Cetak
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
                  Isi data mempelai dalam 5 menit, pilih tema, dan unduh file desain stiker QR 300 DPI dari dashboard untuk dicetak di percetakan fisik pilihan Anda.
                </p>
              </div>
              <div className="text-[11px] text-[#fef08a] font-mono border-t border-white/10 pt-3">
                &bull; File 300 DPI High-Res Siap Cetak
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 border border-white/15 p-7 rounded-3xl backdrop-blur-md space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#c5a880] text-slate-900 font-extrabold flex items-center justify-center text-sm shadow-md">
                  2
                </div>
                <h3 className="font-bold text-lg text-white">
                  Sebar Undangan &amp; Rekap Kehadiran
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
                  Kirim link via WhatsApp atau bagikan kartu cetak berstiker QR. Respon tamu dari web maupun kartu fisik otomatis tercatat rapi di dashboard yang sama.
                </p>
              </div>
              <div className="text-[11px] text-[#fef08a] font-mono border-t border-white/10 pt-3">
                &bull; Terkoneksi ke Kalkulator Katering
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 border border-white/15 p-7 rounded-3xl backdrop-blur-md space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#c5a880] text-slate-900 font-extrabold flex items-center justify-center text-sm shadow-md">
                  3
                </div>
                <h3 className="font-bold text-lg text-white">
                  Hari H Resepsi Bebas Antre &amp; Layar TV Aktif
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
                  Penerima tamu scan QR tiket di ponsel tamu dalam 1 detik. Nama tamu langsung disambut di Layar Sapa TV gedung resepsi secara otomatis.
                </p>
              </div>
              <div className="text-[11px] text-[#fef08a] font-mono border-t border-white/10 pt-3">
                &bull; Sinkronisasi Realtime 3 Detik
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── 6. KATALOG TEMA SHOWCASE ───────────────── */}
      <section id="tema" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#2d4a3e] uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5 text-emerald-600" />
              <span>PILIHAN TEMA EKSKLUSIF</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Gaya Desain yang Sesuai Impian Anda
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pilih dari tema petualangan RPG 2D yang seru hingga tema botani elegan. Anda bebas berganti tema kapan saja tanpa kehilangan data.
            </p>

            {/* Filter Tabs */}
            <div className="w-full pt-4">
              <div
                ref={tabContainerRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-0 -mx-4 sm:mx-0 justify-start sm:justify-center py-1"
              >
                {THEME_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedThemeTab === cat.id;
                  const count = cat.id === "all" ? themes.length : themes.filter((t) => t.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={(e) => handleTabClick(cat.id, e)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer select-none active:scale-95 ${
                        isSelected
                          ? cat.id === "adat"
                            ? "bg-[#7C2D12] text-[#EDE0C4] shadow-xs"
                            : cat.id === "luxury"
                            ? "bg-slate-900 text-amber-300 border border-amber-500/40 shadow-xs"
                            : "bg-[#2d4a3e] text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          isSelected ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Category Info Bar */}
          {selectedThemeTab !== "all" && (
            <div className="mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
                  {(() => {
                    const CurrentIcon = THEME_CATEGORIES.find((c) => c.id === selectedThemeTab)?.icon || Layers;
                    return <CurrentIcon className="w-4 h-4" />;
                  })()}
                </span>
                <div>
                  <p className="font-bold text-slate-800">
                    Kategori: {THEME_CATEGORIES.find((c) => c.id === selectedThemeTab)?.label} ({filteredThemes.length} Desain)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {THEME_CATEGORIES.find((c) => c.id === selectedThemeTab)?.description}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedThemeTab("all")}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0 cursor-pointer"
              >
                Lihat Semua Koleksi ({themes.length}) &rarr;
              </button>
            </div>
          )}

          {/* Theme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredThemes.map((theme) => (
              <div
                key={theme.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                {/* Visual Header / Thumbnail Box */}
                <div
                  className={`h-48 bg-gradient-to-tr ${theme.bgColor} p-6 flex flex-col justify-between relative overflow-hidden text-white`}
                >
                  {theme.bannerImage && (
                    <>
                      <img
                        src={theme.bannerImage}
                        alt={theme.name}
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/30" />
                    </>
                  )}

                  <div className="flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wider">
                      {theme.badge}
                    </span>
                    <span className="text-xs bg-emerald-500/80 px-2 py-0.5 rounded-full font-bold">
                      Aktif
                    </span>
                  </div>

                  <div className="z-10">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase mb-1.5 ${theme.tagColor}`}>
                      {theme.tag}
                    </span>
                    <h3 className="text-xl font-extrabold text-white drop-shadow-md">{theme.name}</h3>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {theme.description}
                    </p>

                    <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                      {theme.highlights.map((h, i) => (
                        <p key={i} className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={theme.demoUrl}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-100 hover:bg-[#2d4a3e] hover:text-white text-slate-800 text-xs sm:text-sm font-bold transition-all group-hover:bg-[#2d4a3e] group-hover:text-white"
                  >
                    <span>Lihat Contoh Undangan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── 7. TABEL KOMPARASI (Platform Biasa vs Hayvows) ───────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#2d4a3e] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>KOMPARASI FITUR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Mengapa Hayvows Jauh Lebih Unggul?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Perbandingan fitur antara website undangan digital biasa dengan Ekosistem Resepsi Pintar Hayvows.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="py-4 px-5 sm:px-6 font-bold">Kemampuan &amp; Fitur</th>
                <th className="py-4 px-4 text-center font-semibold text-slate-400">Undangan Biasa</th>
                <th className="py-4 px-5 sm:px-6 text-center font-extrabold text-[#2d4a3e] bg-emerald-50/60">
                  Hayvows Smart Wedding
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3.5 px-5 sm:px-6 font-medium">Tampilan Web &amp; Pemutar Musik Romantis</td>
                <td className="py-3.5 px-4 text-center text-emerald-600">✓</td>
                <td className="py-3.5 px-5 sm:px-6 text-center font-bold text-emerald-700 bg-emerald-50/40">✓ Audio Bebas Blokir</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 sm:px-6 font-medium">Proteksi Anti-Spam &amp; Moderasi Ucapan Doa</td>
                <td className="py-3.5 px-4 text-center text-slate-300">✗ (Rawan spam)</td>
                <td className="py-3.5 px-5 sm:px-6 text-center font-bold text-emerald-700 bg-emerald-50/40">✓ Filter Cerdas &amp; Moderasi</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 sm:px-6 font-medium">Amplop Digital &amp; Rekening Bank Langsung</td>
                <td className="py-3.5 px-4 text-center text-slate-400">Potongan Admin</td>
                <td className="py-3.5 px-5 sm:px-6 text-center font-bold text-emerald-700 bg-emerald-50/40">✓ 0% Biaya Potongan</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 sm:px-6 font-medium">Dukungan Undangan Cetak Fisik (Studio 300 DPI)</td>
                <td className="py-3.5 px-4 text-center text-slate-300">✗</td>
                <td className="py-3.5 px-5 sm:px-6 text-center font-bold text-emerald-700 bg-emerald-50/40">✓ File Siap Cetak</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 sm:px-6 font-medium">Tiket E-Pass QR Presensi Tamu</td>
                <td className="py-3.5 px-4 text-center text-slate-300">✗</td>
                <td className="py-3.5 px-5 sm:px-6 text-center font-bold text-emerald-700 bg-emerald-50/40">✓ Otomatis per Tamu</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 sm:px-6 font-medium">Check-in Cepat Meja Resepsionis (QR &amp; Nama)</td>
                <td className="py-3.5 px-4 text-center text-slate-300">✗ (Manual)</td>
                <td className="py-3.5 px-5 sm:px-6 text-center font-bold text-emerald-700 bg-emerald-50/40">✓ 1-Detik Scan</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 sm:px-6 font-medium">Layar Sambutan TV / Videotron Real-time</td>
                <td className="py-3.5 px-4 text-center text-slate-300">✗</td>
                <td className="py-3.5 px-5 sm:px-6 text-center font-bold text-emerald-700 bg-emerald-50/40">✓ Live 3 Detik</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 sm:px-6 font-medium">Kalkulator Estimasi Porsi Katering</td>
                <td className="py-3.5 px-4 text-center text-slate-300">✗</td>
                <td className="py-3.5 px-5 sm:px-6 text-center font-bold text-emerald-700 bg-emerald-50/40">✓ Presisi + Buffer 10%</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 sm:px-6 font-medium">Ekspor Laporan Kehadiran CSV / Excel</td>
                <td className="py-3.5 px-4 text-center text-slate-300">Terbatas</td>
                <td className="py-3.5 px-5 sm:px-6 text-center font-bold text-emerald-700 bg-emerald-50/40">✓ 1-Klik Lengkap</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ───────────────── 8. HARGA & PAKET PENJUALAN ───────────────── */}
      <section id="harga" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#2d4a3e] uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <span>HARGA TRANSPARAN &amp; SEKALI BAYAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pilihan Paket untuk Setiap Pasangan
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Sekali bayar tanpa biaya tersembunyi. Seluruh paket sudah termasuk tamu tanpa batas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {/* Paket 1: Basic */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg">Paket Basic</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  Standar
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Cocok untuk acara intim dan praktis.</p>

              <div className="my-6">
                <span className="text-xs text-slate-400 font-semibold line-through">Rp 199.000</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">Rp 149.000</span>
                  <span className="text-xs text-slate-500 font-medium">/ selamanya</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-5 text-xs sm:text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Nama Tamu &amp; WhatsApp 1-Klik</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tema Modern Monogram Minimalis</span>
                </p>
                <p className="flex items-center gap-2 font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Proteksi Anti-Spam &amp; Sensor Kata Cerdas</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Informasi Detail Acara &amp; Countdown Timer</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Petunjuk Arah Google Maps Terintegrasi</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Musik Romantis Preset Bawaan</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Galeri Momen Foto (Hingga 5 foto)</span>
                </p>
              </div>
            </div>

            <Link
              href="/register?plan=basic"
              className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold text-center transition-all"
            >
              Pilih Paket Basic
            </Link>
          </div>

          {/* Paket 2: Populer / Best Value (Highlighted) */}
          <div className="bg-white rounded-3xl p-7 border-2 border-[#2d4a3e] shadow-xl relative flex flex-col justify-between space-y-6 scale-[1.02] bg-gradient-to-b from-[#fbf8f3] via-white to-white">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#2d4a3e] to-[#4c7361] text-[#fef08a] text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#fef08a]" />
              <span>PALING DIMINATI</span>
            </div>

            <div>
              <div className="flex items-center justify-between pt-1">
                <h3 className="font-extrabold text-[#2d4a3e] text-xl">Paket Populer</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#2d4a3e] font-bold">
                  Hemat 35%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Ekosistem lengkap: Studio QR Cetak, Buku Tamu &amp; Katering.</p>

              <div className="my-6">
                <span className="text-xs text-slate-400 font-semibold line-through">Rp 299.000</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#2d4a3e]">Rp 199.000</span>
                  <span className="text-xs text-slate-500 font-medium">/ selamanya</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-5 text-xs sm:text-sm text-slate-700">
                <p className="flex items-center gap-2 font-semibold text-[#2d4a3e]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Studio Desain QR Siap Cetak (300 DPI)</span>
                </p>
                <p className="flex items-center gap-2 font-semibold text-[#2d4a3e]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Buku Tamu Digital &amp; Presensi QR 1-Detik</span>
                </p>
                <p className="flex items-center gap-2 font-semibold text-[#2d4a3e]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kalkulator Estimasi Katering &amp; Pax Riil</span>
                </p>
                <p className="flex items-center gap-2 font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Proteksi Anti-Spam &amp; Moderasi Mandiri</span>
                </p>
                <p className="flex items-center gap-2 font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tema Nature Botanical Floral</span>
                </p>
                <p className="flex items-center gap-2 font-semibold text-amber-700">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Tema Batik Jawa Heritage (Adat)</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Amplop Digital (Transfer Rekening &amp; Salin Cepat)</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kustom Musik Latar (YouTube / MP3 Sendiri)</span>
                </p>
              </div>
            </div>

            <Link
              href="/register?plan=popular"
              className="w-full py-3.5 rounded-xl bg-[#2d4a3e] hover:bg-[#233a30] text-white text-xs sm:text-sm font-bold text-center shadow-md hover:shadow-lg transition-all"
            >
              Pilih Paket Populer
            </Link>
          </div>

          {/* Paket 3: Exclusive — Semua Tema Premium & Layar TV */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg">Paket Exclusive</h3>
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                  <Crown className="w-3 h-3 text-[#c9a84c]" />
                  <span>VIP RESEPSI</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Layar Sapa TV + Eternal Noir + Game RPG 2D.</p>

              <div className="my-6">
                <span className="text-xs text-slate-400 font-semibold line-through">Rp 499.000</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">Rp 299.000</span>
                  <span className="text-xs text-slate-500 font-medium">/ selamanya</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-5 text-xs sm:text-sm text-slate-600">
                <p className="flex items-center gap-2 font-semibold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-[#c9a84c] shrink-0" />
                  <span>Semua Fitur &amp; Tema Paket Populer</span>
                </p>
                <p className="flex items-center gap-2 font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Layar Sambutan TV / Videotron Real-time</span>
                </p>
                <p className="flex items-center gap-2 font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#c9a84c] shrink-0" />
                  <span>Tema Eternal Noir Luxury (Monokrom)</span>
                </p>
                <p className="flex items-center gap-2 font-semibold text-purple-700">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Tema Pixel RPG 2D &amp; Cyberpunk 2077</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tiket E-Pass QR Tamu &amp; NPC Interaktif</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Prioritas Dukungan Teknis Khusus</span>
                </p>
              </div>
            </div>

            <Link
              href="/register?plan=luxury"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4A2C12] to-[#7C2D12] hover:from-[#5C3D1E] hover:to-[#8B3A16] text-[#D4A853] text-xs sm:text-sm font-bold text-center transition-all shadow-md"
            >
              Pilih Paket Exclusive
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────── 9. FAQ ACCORDION ───────────────── */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#2d4a3e] uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>TANYA JAWAB</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Punya pertanyaan lain? Tim kami siap membantu kapan saja via WhatsApp.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left font-bold text-sm sm:text-base text-slate-800 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-[#2d4a3e]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────────────── 10. CALL TO ACTION BANNER ───────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-tr from-[#2d4a3e] via-[#385b4d] to-[#1c3329] p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-[#fef08a]" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Siap Membuat Momen Pernikahan Anda Tak Terlupakan?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Daftar sekarang dan nikmati kemudahan mengelola resepsi pernikahan digital modern dalam waktu kurang dari 5 menit.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#fef08a] hover:bg-white text-slate-900 font-bold text-sm px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-105"
              >
                <span>Mulai Buat Undangan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Admin%20Hayvows,%20saya%20ingin%20tanya%20tentang%20ekosistem%20undangan%20pernikahan%20digital"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-4 rounded-xl border border-white/20 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>Konsultasi WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* ───────────────── 11. FOOTER ───────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-14 px-4 sm:px-6 lg:px-8 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <HayvowsLogo variant="full" theme="dark" size="md" />
            <p className="text-slate-400 leading-relaxed">
              Platform ekosistem pernikahan digital &amp; resepsi pintar terdepan di Indonesia. Hadirkan pengalaman tak terlupakan bagi tamu Anda.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Kategori Tema</h4>
            <ul className="space-y-2">
              {THEME_CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
                const count = themes.filter((t) => t.category === cat.id).length;
                const IconComponent = cat.icon;
                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectCategory(cat.id)}
                      className="hover:text-white transition-colors text-left flex items-center justify-between w-full group py-0.5 cursor-pointer"
                    >
                      <span className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        <IconComponent className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{cat.label}</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 group-hover:bg-[#2d4a3e] group-hover:text-emerald-300 font-mono transition-colors">
                        {count} Desain
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Ekosistem Pintar</h4>
            <ul className="space-y-2">
              <li><a href="#keunggulan" className="hover:text-white transition-colors">Studio QR Siap Cetak (300 DPI)</a></li>
              <li><a href="#keunggulan" className="hover:text-white transition-colors">Buku Tamu Digital &amp; Scanner</a></li>
              <li><a href="#keunggulan" className="hover:text-white transition-colors">Layar Sambutan TV Gedung</a></li>
              <li><a href="#keunggulan" className="hover:text-white transition-colors">Kalkulator Estimasi Katering</a></li>
              <li><a href="#keunggulan" className="hover:text-white transition-colors">Amplop Digital &amp; Rekening Bank</a></li>
              <li><a href="#keunggulan" className="hover:text-white transition-colors">WhatsApp 1-Klik Generator</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Bantuan &amp; Kontak</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>WhatsApp CS: 0812-3456-7890</span>
                </a>
              </li>
              <li><span>Email: support@hayvows.com</span></li>
              <li><span>Jam Operasional: 09:00 - 21:00 WIB</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <p>&copy; 2026 HAYVOWS. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for unforgettable weddings.
          </p>
        </div>
      </footer>
    </div>
  );
}

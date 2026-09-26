"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { HayvowsLogo } from "@/components/brand/HayvowsLogo";
import {
  QrCode,
  Tv,
  MessageCircle,
  Gamepad2,
  Gift,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Search,
  ExternalLink,
  ChevronDown,
  Layers,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  HelpCircle,
  Clock,
  Printer,
  FileSpreadsheet,
  Monitor,
  Menu,
  X,
} from "lucide-react";

export type GuideCategory =
  | "all"
  | "resepsi"
  | "layar-tv"
  | "whatsapp"
  | "pixel-rpg"
  | "amplop"
  | "mulai-cepat";

interface GuideStep {
  number: string;
  title: string;
  desc: string;
  detail?: string;
}

interface GuideItem {
  id: string;
  category: GuideCategory;
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  readTime: string;
  summary: string;
  targetUser: string;
  steps: GuideStep[];
  proTip: string;
  demoUrl?: string;
  demoLabel?: string;
}

export default function PanduanClient() {
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    { id: "all", label: "Semua Panduan", icon: Layers },
    { id: "resepsi", label: "Buku Tamu & QR", icon: QrCode },
    { id: "layar-tv", label: "Layar Sapa TV", icon: Tv },
    { id: "whatsapp", label: "Sebar WhatsApp", icon: MessageCircle },
    { id: "pixel-rpg", label: "Game Pixel RPG", icon: Gamepad2 },
    { id: "amplop", label: "Amplop & Hadiah", icon: Gift },
    { id: "mulai-cepat", label: "Mulai Kilat", icon: Sparkles },
  ];

  const guides: GuideItem[] = [
    {
      id: "buku-tamu-qr",
      category: "resepsi",
      title: "Panduan Buku Tamu Digital & QR Code Resepsi Bebas Antre",
      badge: "Resepsi Pintar",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: QrCode,
      readTime: "3 Menit",
      targetUser: "Calon Pengantin & Panitia Meja Resepsi",
      summary:
        "Cara mengoperasikan sistem tiket QR tamu di hari H pernikahan, scan tanpa instalasi aplikasi, serta pencarian manual 1-klik jika tamu tidak membawa ponsel.",
      steps: [
        {
          number: "01",
          title: "Tamu Menerima Tiket QR Otomatis di Undangan",
          desc: "Setiap link undangan personal yang Anda buat otomatis menyertakan barcode QR unik beresolusi tinggi.",
          detail:
            "Tamu dapat menyimpan QR ke galeri foto ponsel mereka atau membukanya langsung saat tiba di meja resepsi gedung.",
        },
        {
          number: "02",
          title: "Panitia Membuka Menu Scanner (Cukup Browser Ponsel/Tablet)",
          desc: "Petugas resepsi cukup membuka link dashboard panitia di HP atau tablet tanpa perlu mengunduh aplikasi apapun.",
          detail:
            "Buka link scanner di browser Chrome/Safari, izinkan akses kamera, dan scanner langsung siap memindai tamu.",
        },
        {
          number: "03",
          title: "Scan Cepat 1 Detik & Verifikasi Kehadiran",
          desc: "Arahkan kamera ke layar HP tamu. Dalam 1 detik, sistem langsung mendeteksi nama tamu, jumlah pax, dan status kehadiran.",
          detail:
            "Status kehadiran langsung tercatat di database real-time dan jatah souvenir langsung terkonfirmasi.",
        },
        {
          number: "04",
          title: "Pencarian Nama 1-Klik (Solusi Jika Tamu Lupa Bawa HP)",
          desc: "Jika tamu lansia atau lupa membawa smartphone, panitia cukup mengetikkan 2–3 huruf nama tamu di kolom pencarian cepat.",
          detail:
            "Klik tombol 'Check-in Manual', dan kehadiran tamu langsung terverifikasi tanpa antrean panjang.",
        },
      ],
      proTip:
        "💡 Tips Panitia: Satu akun dapat dibuka di 3–5 HP panitia meja resepsi secara bersamaan untuk melayani ratusan tamu dengan sangat cepat.",
      demoUrl: "/invitation/arthur-guinevere/budi-santoso#rsvp",
      demoLabel: "Lihat Contoh Tiket QR di Demo Undangan",
    },
    {
      id: "layar-sapa-tv",
      category: "layar-tv",
      title: "Cara Menghubungkan Layar Sapa Resepsi ke TV atau Videotron Gedung",
      badge: "Display Interaktif",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
      icon: Tv,
      readTime: "3 Menit",
      targetUser: "Panitia Meja Resepsi & Operator Multimedia Gedung",
      summary:
        "Tutorial menghubungkan laptop meja resepsionis ke monitor TV LED atau videotron gedung untuk menampilkan animasi sapaan tamu secara sinematik.",
      steps: [
        {
          number: "01",
          title: "Buka Tautan Layar Sapa di Laptop Meja Resepsi",
          desc: "Di laptop meja depan, buka alamat: hayvows.com/display/[slug-pernikahan].",
          detail:
            "Halaman display ini dirancang khusus dengan latar belakang animasi elegan bertema pernikahan Anda.",
        },
        {
          number: "02",
          title: "Sambungkan Laptop ke TV / Videotron Menggunakan Kabel HDMI",
          desc: "Colokkan kabel HDMI dari laptop ke port HDMI pada monitor TV atau kontroler Videotron gedung.",
          detail:
            "Pada laptop (Windows), tekan tombol Windows + P lalu pilih mode 'Duplicate' (Duplikasi Layar) atau 'Extend'.",
        },
        {
          number: "03",
          title: "Aktifkan Mode Layar Penuh (Fullscreen)",
          desc: "Klik tombol 'Layar Penuh' di pojok kanan atas tampilan atau tekan tombol F11 pada keyboard.",
          detail:
            "Bilah alamat browser dan tombol navigasi akan otomatis tersembunyi, menghasilkan tampilan visual panggung yang sangat mewah.",
        },
        {
          number: "04",
          title: "Animasi Sapaan Otomatis Setiap Kali Tamu Check-in",
          desc: "Setiap kali panitia men-scan QR code tamu di meja penerima tamu, monitor TV otomatis memunculkan sapaan hangat nama tamu secara real-time.",
          detail:
            "Contoh tampilan: 'Selamat Datang, Bapak Budi Santoso & Keluarga'. Tidak perlu me-refresh browser secara manual.",
        },
      ],
      proTip:
        "💡 Tips Gedung: Layar sapa otomatis menyesuaikan resolusi TV mulai dari Full HD (1080p) hingga 4K tanpa pecah.",
      demoUrl: "/display/arthur-guinevere",
      demoLabel: "Buka Simulasi Layar Sapa TV Demo",
    },
    {
      id: "sebar-whatsapp",
      category: "whatsapp",
      title: "Panduan Membuat Undangan Personal & Sebar WhatsApp Otomatis",
      badge: "Undangan Tak Terbatas",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      icon: MessageCircle,
      readTime: "4 Menit",
      targetUser: "Calon Pengantin",
      summary:
        "Cara mengunggah ratusan nama tamu, menghasilkan tautan personal dengan nama tamu di sampul, dan mengirim pesan WhatsApp resmi sekali klik.",
      steps: [
        {
          number: "01",
          title: "Masukkan Daftar Nama Tamu (Bisa Impor Excel Sekaligus)",
          desc: "Masuk ke Dashboard > menu Tamu Undangan. Anda bisa menambahkan tamu satu per satu atau mengunggah berkas Excel/CSV untuk ratusan nama sekaligus.",
          detail:
            "Dukungan kuota tamu unlimited tanpa batasan jumlah nama.",
        },
        {
          number: "02",
          title: "Tautan Unik Otomatis Tersusun Rapi",
          desc: "Sistem otomatis membuat link khusus untuk masing-masing tamu, misalnya: hayvows.com/invitation/arthur-guinevere/budi-santoso.",
          detail:
            "Saat tamu membuka link tersebut, nama tamu otomatis terpampang anggun di sampul muka undangan.",
        },
        {
          number: "03",
          title: "Kirim Pesan WhatsApp Resmi 1-Klik",
          desc: "Di samping setiap nama tamu, klik tombol hijau 'Kirim WA'.",
          detail:
            "Aplikasi WhatsApp otomatis terbuka dengan teks ucapan salam santun, jadwal acara, dan tautan khusus yang sudah terisi otomatis tanpa perlu mengetik manual.",
        },
        {
          number: "04",
          title: "Pantau Status Konfirmasi Kehadiran (RSVP)",
          desc: "Di tabel tamu dashboard, Anda dapat melihat siapa saja yang telah mengonfirmasi 'Hadir' beserta jumlah orang yang dibawa.",
          detail:
            "Data RSVP dapat diunduh ke Excel kapan saja untuk diserahkan ke pihak katering gedung.",
        },
      ],
      proTip:
        "💡 Tips Pengantin: Anda dapat mengelompokkan tamu berdasarkan kategori (Keluarga, Sahabat, Rekan Kerja, VIP) untuk memudahkan pengaturan tempat duduk.",
    },
    {
      id: "game-pixel-rpg",
      category: "pixel-rpg",
      title: "Eksplorasi Undangan Interaktif 2D Pixel RPG (Tema Game Retro 16-Bit)",
      badge: "Tema Eksklusif Game",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      icon: Gamepad2,
      readTime: "3 Menit",
      targetUser: "Calon Pengantin & Tamu Penggemar Game",
      summary:
        "Panduan kontrol joystick virtual di ponsel, berjalan-jalan di peta desa pernikahan, menyapa karakter NPC, dan membuka Peti Hadiah.",
      steps: [
        {
          number: "01",
          title: "Pilih Tema Pixel Adventure di Dashboard",
          desc: "Pilih tema Pixel Adventure RPG. Pengantin dapat mengatur nama hero/heroine dan pesan sambutan awal bagi para pengembara.",
          detail:
            "Grafis pixel art autentik berpadu animasi 60 FPS yang sangat ringan dibuka di browser smartphone.",
        },
        {
          number: "02",
          title: "Navigasi Kontrol yang Sangat Ramah Pengguna",
          desc: "Di layar smartphone, tamu cukup menggunakan D-Pad virtual transparan di pojok kiri bawah. Di laptop/PC, gunakan tombol panah arah atau W, A, S, D.",
          detail:
            "Karakter dapat bergerak bebas menjelajahi jembatan gerbang desa, area air mancur, balai pertemuan, dan panggung pelaminan.",
        },
        {
          number: "03",
          title: "Interaksi Objek & Titik Poin Berwarna Oranye",
          desc: "Saat karakter mendekati objek penting, akan muncul lingkaran oranye dan tanda seru di atas kepala karakter.",
          detail:
            "Tekan tombol aksi untuk berdialog dengan NPC Guide Aria, membuka Peti Tanda Kasih, atau membuka Buku Tamu di balai desa.",
        },
        {
          number: "04",
          title: "Musik Latar Retro 16-Bit Chiptune",
          desc: "Dilengkapi alunan musik pesta petualangan yang dapat diputar atau dihentikan sewaktu-waktu oleh tamu melalui tombol speaker.",
          detail:
            "Memberikan pengalaman menghadiri pernikahan yang tidak akan pernah dilupakan oleh teman dan kerabat Anda.",
        },
      ],
      proTip:
        "💡 Tips Tamu: Tamu tidak perlu menginstal aplikasi game apapun, cukup klik tautan undangan dan game langsung berjalan mulus di browser web.",
      demoUrl: "/invitation/alex-sarah/budi-santoso",
      demoLabel: "Coba Mainkan Undangan 2D Pixel RPG Sekarang",
    },
    {
      id: "amplop-digital-0-persen",
      category: "amplop",
      title: "Panduan Amplop Digital, QRIS & Konfirmasi Transfer Tanpa Potongan (0%)",
      badge: "Bebas Biaya Admin",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      icon: Gift,
      readTime: "3 Menit",
      targetUser: "Calon Pengantin",
      summary:
        "Cara mendaftarkan rekening bank pribadi, memasang QRIS, dan menerima tanda kasih secara langsung 100% utuh tanpa potongan pihak ketiga.",
      steps: [
        {
          number: "01",
          title: "Daftarkan Rekening Bank & QRIS di Dashboard",
          desc: "Buka menu Tanda Kasih / Amplop Digital. Masukkan nomor rekening bank Anda (BCA, Mandiri, BNI, BRI, Bank Jago, dll.) serta nama pemilik rekening.",
          detail:
            "Anda juga dapat mengunggah gambar QRIS agar tamu dari e-wallet (GoPay, OVO, Dana, ShopeePay) bisa langsung scan.",
        },
        {
          number: "02",
          title: "0% Biaya Admin — Uang Masuk 100% Utuh ke Anda",
          desc: "Hayvows sama sekali tidak memotong tanda kasih tamu Anda. Dana langsung ditransfer oleh tamu ke rekening pribadi mempelai tanpa perantara.",
          detail:
            "Aman, transparan, dan tidak ada biaya penarikan saldo.",
        },
        {
          number: "03",
          title: "Fitur Konfirmasi Transfer & Upload Bukti",
          desc: "Tamu yang telah mentransfer dapat mengunggah struk transfer dan mengisi nama pengirim serta bank asal.",
          detail:
            "Seluruh catatan transfer tersusun rapi di dashboard Anda untuk memudahkan pencatatan dan ucapan terima kasih personal.",
        },
        {
          number: "04",
          title: "Cantumkan Alamat Rumah untuk Kado Fisik",
          desc: "Bagi tamu yang ingin mengirimkan kado fisik berupa barang, Anda dapat mengaktifkan fitur Alamat Pengiriman Kado lengkap dengan tombol 'Salin Alamat'.",
          detail:
            "Tamu dapat langsung menempelkan alamat pengantin ke aplikasi kurir pengiriman barang.",
        },
      ],
      proTip:
        "💡 Tips Keamanan: Setiap ucapan doa dan konfirmasi transfer dilengkapi penyaring cerdas anti-spam untuk melindungi halaman Anda dari tautan iklan promosi/judi.",
    },
    {
      id: "mulai-cepat-5-menit",
      category: "mulai-cepat",
      title: "Panduan Kilat: Dari Buat Akun Hingga Siap Sebar dalam 5 Menit",
      badge: "Mulai Kilat",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      icon: Sparkles,
      readTime: "2 Menit",
      targetUser: "Calon Pengantin Baru",
      summary:
        "Empat langkah sederhana menyusun undangan pernikahan modern dari pendaftaran akun gratis hingga link siap dikirim ke keluarga.",
      steps: [
        {
          number: "01",
          title: "Daftar Akun Gratis di Hayvows",
          desc: "Kunjungi hayvows.com/register dan daftarkan akun menggunakan email dan nama Anda. Tanpa perlu kartu kredit.",
        },
        {
          number: "02",
          title: "Pilih Desain Tema yang Anda Sukai",
          desc: "Pilih tema dari katalog Hayvows: mulai dari Royal Emerald mewah, 2D Pixel RPG, Adat Nusantara Batik Jawa, hingga Modern Monogram.",
        },
        {
          number: "03",
          title: "Lengkapi Data Mempelai, Acara, & Foto",
          desc: "Isi nama kedua mempelai, tanggal & jam akad/resepsi, sematkan titik Google Maps gedung, dan unggah foto prewedding terbaik Anda.",
        },
        {
          number: "04",
          title: "Salin Tautan Khusus & Bagikan ke Kerabat",
          desc: "Masukkan nama tamu di menu Tamu Undangan, lalu klik Salin Tautan atau Kirim WA. Undangan elegan Anda siap menyapa keluarga tercinta!",
        },
      ],
      proTip:
        "💡 Anda dapat mengubah data acara, foto, atau lagu kapan saja bahkan setelah undangan disebarkan ke tamu.",
    },
  ];

  const faqs = [
    {
      q: "Apakah panitia meja resepsi harus menginstal aplikasi dari Play Store / App Store?",
      a: "Sama sekali tidak perlu! Scanner QR Hayvows berbasis web modern. Panitia cukup membuka tautan dashboard meja resepsi di browser ponsel (Chrome, Safari, atau Edge) dan scanner kamera langsung siap digunakan dalam hitungan detik.",
    },
    {
      q: "Bisa dipakai di berapa HP panitia sekaligus saat acara resepsi?",
      a: "Tidak ada batasan! Anda dapat membuka scanner meja resepsi di 2, 4, hingga 8 HP atau tablet panitia secara bersamaan. Seluruh data check-in otomatis tersinkronisasi secara real-time tanpa ada data ganda.",
    },
    {
      q: "Bagaimana jika tamu undangan lupa membawa HP atau kehabisan baterai?",
      a: "Petugas resepsi memiliki tombol 'Pencarian Manual 1-Klik'. Cukup ketikkan nama tamu di kolom pencarian, nama tamu akan langsung muncul, dan petugas dapat mengklik tombol check-in manual untuk mencatat kehadiran serta memberikan souvenir.",
    },
    {
      q: "Apakah Layar Sapa TV membutuhkan koneksi internet berkecepatan tinggi?",
      a: "Tidak memerlukan internet super kencang. Sistem Layar Sapa Hayvows dirancang sangat ringan (data yang dikirim hanya teks sapaan nama tamu), sehingga tethering dari hotspot ponsel panitia pun sudah sangat cukup untuk menjalankan display secara mulus.",
    },
    {
      q: "Apakah ada batasan jumlah nama tamu yang bisa dibuatkan undangan?",
      a: "Unlimited (tanpa batasan)! Anda bebas membuat 100, 500, hingga ribuan tautan nama tamu personal.",
    },
  ];

  // Filter guides berdasarkan kategori & query pencarian
  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      const matchCategory =
        selectedCategory === "all" || g.category === selectedCategory;
      const matchQuery =
        searchQuery.trim() === "" ||
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.targetUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.steps.some(
          (s) =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.desc.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery, guides]);

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/panduan#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(id);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 🧭 1. NAVIGATION BAR 🧭 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <HayvowsLogo size="md" variant="horizontal" />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold text-slate-600 whitespace-nowrap">
            <Link href="/" className="hover:text-[#2d4a3e] transition-colors">
              Beranda
            </Link>
            <Link href="/#fitur" className="hover:text-[#2d4a3e] transition-colors">
              Fitur
            </Link>
            <Link href="/#tema" className="hover:text-[#2d4a3e] transition-colors">
              Tema
            </Link>
            <Link href="/#harga" className="hover:text-[#2d4a3e] transition-colors">
              Harga
            </Link>
            <Link
              href="/panduan"
              className="text-[#2d4a3e] font-bold border-b-2 border-[#2d4a3e] pb-0.5"
            >
              Panduan
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 hover:text-[#2d4a3e] px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2d4a3e] hover:bg-[#233a30] px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all whitespace-nowrap"
            >
              <span>Buat Undangan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#2d4a3e] cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white px-5 py-4 space-y-3 shadow-lg">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1 border-b border-slate-100"
            >
              Beranda
            </Link>
            <Link
              href="/#fitur"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1 border-b border-slate-100"
            >
              Fitur Ekosistem
            </Link>
            <Link
              href="/#tema"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1 border-b border-slate-100"
            >
              Galeri Tema
            </Link>
            <Link
              href="/#harga"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1 border-b border-slate-100"
            >
              Paket Harga
            </Link>
            <Link
              href="/panduan"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-bold text-emerald-800 py-1"
            >
              Pusat Panduan &amp; Fitur
            </Link>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="w-full text-center py-2.5 rounded-xl bg-[#2d4a3e] text-xs font-bold text-white shadow-xs"
              >
                Buat Undangan Gratis
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 🚀 2. HERO SECTION 🚀 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2d4a3e]/10 via-slate-50 to-slate-50 pt-16 pb-12 sm:pt-20 sm:pb-16 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-[#2d4a3e] tracking-wide uppercase shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pusat Panduan &amp; Dokumentasi Fitur</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Cara Menggunakan Hayvows untuk <br className="hidden sm:inline" />
            <span className="text-[#2d4a3e]">Pernikahan Modern &amp; Bebas Repot</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
            Panduan visual langkah demi langkah untuk calon pengantin dan panitia resepsi: mulai dari pembuatan undangan kilat 5 menit hingga operasional sistem buku tamu ber-QR Code di hari pernikahan.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari panduan... (misal: 'QR Code', 'TV', 'WhatsApp', 'Pixel')"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a3e] focus:border-transparent transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 🧭 3. CATEGORY FILTER TABS 🧭 */}
      <section className="sticky top-18 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 py-3 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as GuideCategory)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-[#2d4a3e] text-white shadow-xs scale-102"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-300" : "text-slate-500"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 📚 4. GUIDES LIST 📚 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {filteredGuides.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Panduan Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ada panduan yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;. Silakan gunakan kata kunci lain atau pilih kategori &ldquo;Semua Panduan&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-2 text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              Lihat Seluruh Panduan
            </button>
          </div>
        ) : (
          filteredGuides.map((guide, idx) => {
            const Icon = guide.icon;
            const isCopied = copiedSlug === guide.id;

            return (
              <article
                key={guide.id}
                id={guide.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden scroll-mt-36"
              >
                {/* Header Kartu Panduan */}
                <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/70 via-white to-slate-50/40">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-3 py-1 rounded-full border ${guide.badgeColor}`}
                      >
                        {guide.badge}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{guide.readTime}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(guide.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      title="Salin Tautan Panduan Ini"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Tautan Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Salin Tautan</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#2d4a3e] shrink-0 mt-1">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="space-y-1.5">
                      <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                        {guide.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {guide.summary}
                      </p>
                      <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">Untuk Siapa:</span>
                        <span>{guide.targetUser}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Isi Langkah-Langkah (Step-by-Step) */}
                <div className="p-6 sm:p-8 space-y-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Langkah-Langkah Praktis:
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {guide.steps.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-300 transition-colors space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#2d4a3e] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                              {step.number}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed pl-8">
                            {step.desc}
                          </p>
                        </div>

                        {step.detail && (
                          <div className="pl-8 pt-1">
                            <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200/60 leading-normal">
                              {step.detail}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pro Tip Box */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 font-medium leading-relaxed">
                    {guide.proTip}
                  </div>

                  {/* Demo Link Button jika ada */}
                  {guide.demoUrl && (
                    <div className="pt-2 flex justify-end">
                      <Link
                        href={guide.demoUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-xl transition-all"
                      >
                        <span>{guide.demoLabel || "Coba Lihat Demo Terkait"}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}

        {/* ❓ 5. FAQ TEKNIS OPERASIONAL ❓ */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Tanya Jawab Teknis</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Pertanyaan yang Sering Diajukan Panitia
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Pertanyaan umum mengenai kendala teknis dan kelancaran resepsi di lokasi acara.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto pt-2">
            {faqs.map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;
              return (
                <div
                  key={fIdx}
                  className="rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-50/50"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                    className="w-full px-5 py-4 text-left font-bold text-xs sm:text-sm text-slate-800 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-emerald-700" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 💬 6. CALL TO ACTION & BANTUAN 💬 */}
        <section className="rounded-3xl bg-gradient-to-br from-[#2d4a3e] via-[#233a30] to-stone-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Siap Mewujudkan Pernikahan Impian Anda?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Coba seluruh fitur undangan interaktif dan sistem buku tamu pintar Hayvows secara gratis. Nikmati pengalaman resepsi yang elegan dan modern.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#d8b85c] text-stone-950 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-transform active:scale-95"
            >
              <span>Buat Undangan Sekarang (Gratis)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20Hayvows,%20saya%20ingin%20tanya%20seputar%20fitur%20undangan"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-white/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi via WhatsApp</span>
            </a>
          </div>
        </section>
      </main>

      {/* 🦶 7. FOOTER 🦶 */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <HayvowsLogo size="md" theme="dark" variant="horizontal" />
            <p className="text-xs text-slate-500 text-center sm:text-right">
              Platform Undangan Pernikahan Digital &amp; Manajemen Resepsi Pintar #1 di Indonesia.
            </p>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Hayvows. Hak Cipta Dilindungi Undang-Undang.</p>
            <div className="flex items-center gap-5">
              <Link href="/" className="hover:text-white transition-colors">
                Beranda
              </Link>
              <Link href="/panduan" className="text-emerald-400 font-semibold hover:text-white transition-colors">
                Pusat Panduan
              </Link>
              <Link href="/#tema" className="hover:text-white transition-colors">
                Galeri Tema
              </Link>
              <Link href="/#harga" className="hover:text-white transition-colors">
                Paket Harga
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

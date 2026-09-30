"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Save,
  Plus,
  Heart,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  Music,
  Gift,
  CheckCircle2,
  Globe,
  FileText,
  Trash2,
  Settings2,
  MessageSquare,
  Sparkles,
  Share2,
  Play,
  Pause,
  Radio,
  Volume2,
  Info,
  AlertTriangle,
  Crown,
  Copy,
  ExternalLink as ExternalLinkIcon,
  Link2,
  AlertCircle,
  CheckCheck,
  ChevronLeft,
  ChevronDown,
  X,
} from "lucide-react";

import ImageUploadDropzone from "@/components/ui/ImageUploadDropzone";
import GalleryUploader from "@/components/ui/GalleryUploader";
import { PRESET_MUSICS, PresetMusicItem } from "@/lib/constants/presetMusic";
import { extractYouTubeId, isYouTubeUrl, getYouTubeEmbedUrl } from "@/lib/utils/youtube";

interface WeddingData {
  id: string;
  slug: string;
  status: string;
  messageMode: string;
  plan?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  whatsappMessage?: string | null;
  customSubdomain?: string | null;
  customDomain?: string | null;
  domainVerified?: boolean | null;
  template?: { name: string; slug: string } | null;
  couple?: {
    groomName: string;
    groomNickname: string;
    groomPhoto: string | null;
    groomFather: string;
    groomMother: string;
    groomInstagram: string;
    brideName: string;
    brideNickname: string;
    bridePhoto: string | null;
    couplePhoto?: string | null;
    brideFather: string;
    brideMother: string;
    brideInstagram: string;
  } | null;
  events: Array<{
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string | null;
    venue: string;
    address: string;
    mapsUrl: string;
  }>;
  stories: Array<{
    id: string;
    title: string;
    date: string;
    description: string;
  }>;
  galleries: Array<{
    id: string;
    imageUrl: string;
    caption: string;
  }>;
  musics: Array<{
    id: string;
    title: string;
    fileUrl: string;
  }>;
  giftAccounts: Array<{
    id: string;
    bankName: string;
    accountName: string;
    accountNo: string;
    type: string;
  }>;
}


export default function WeddingEditor({
  initialWedding,
}: {
  initialWedding: WeddingData;
}) {
  const [wedding, setWedding] = useState(initialWedding);
  const [activeTab, setActiveTab] = useState<
    "couple" | "events" | "story" | "gallery" | "music" | "gift" | "settings" | "domain"
  >("couple");

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingWedding, setDeletingWedding] = useState(false);
  const [deleteItemTarget, setDeleteItemTarget] = useState<{
    type: "event" | "story" | "gallery" | "music" | "gift";
    id: string;
    title: string;
  } | null>(null);
  const [deletingItem, setDeletingItem] = useState(false);

  // Couple State
  const [couple, setCouple] = useState({
    groomName: wedding.couple?.groomName ?? "",
    groomNickname: wedding.couple?.groomNickname ?? "",
    groomPhoto: wedding.couple?.groomPhoto ?? "",
    groomFather: wedding.couple?.groomFather ?? "",
    groomMother: wedding.couple?.groomMother ?? "",
    groomInstagram: wedding.couple?.groomInstagram ?? "",
    brideName: wedding.couple?.brideName ?? "",
    brideNickname: wedding.couple?.brideNickname ?? "",
    bridePhoto: wedding.couple?.bridePhoto ?? "",
    couplePhoto: wedding.couple?.couplePhoto ?? "",
    brideFather: wedding.couple?.brideFather ?? "",
    brideMother: wedding.couple?.brideMother ?? "",
    brideInstagram: wedding.couple?.brideInstagram ?? "",
  });

  // Template feature checks
  const templateSlug = wedding.template?.slug ?? "";
  const supportsHeroCouplePhoto =
    templateSlug === "modern-monogram" ||
    templateSlug === "eternal-noir" ||
    templateSlug === "royal-emerald";
  const [showOptionalHeroPhoto, setShowOptionalHeroPhoto] = useState(false);

  // Event State
  const [events, setEvents] = useState(wedding.events ?? []);
  const [newEvent, setNewEvent] = useState({
    title: "Akad Nikah",
    date: "2026-10-18",
    startTime: "08:00",
    endTime: "10:00",
    venue: "Masjid Al-Barkah",
    address: "Jl. Melati No. 12, Jakarta Selatan",
    mapsUrl: "",
  });

  // Story State
  const [stories, setStories] = useState(wedding.stories ?? []);
  const [newStory, setNewStory] = useState({
    title: "Pertama Bertemu",
    date: "2022",
    description: "Kami pertama kali bertemu di kampus.",
  });

  // Gallery State
  const [galleries, setGalleries] = useState(wedding.galleries ?? []);

  // Music State
  const [musics, setMusics] = useState(wedding.musics ?? []);
  const [musicSourceMode, setMusicSourceMode] = useState<"preset" | "youtube" | "custom">("preset");
  const [playingPresetUrl, setPlayingPresetUrl] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [newMusic, setNewMusic] = useState({
    title: "",
    fileUrl: "",
  });
  const [youtubeInput, setYoutubeInput] = useState({
    title: "",
    url: "",
  });

  // Gift State
  const [gifts, setGifts] = useState(wedding.giftAccounts ?? []);
  const [newGift, setNewGift] = useState({
    bankName: "BCA",
    accountName: "",
    accountNo: "",
    type: "bank",
  });

  // Settings & SEO State
  const [settingsData, setSettingsData] = useState({
    slug: wedding.slug,
    status: wedding.status,
    messageMode: wedding.messageMode || "auto",
    ogTitle:
      wedding.ogTitle ||
      `The Wedding of ${wedding.couple?.groomNickname || wedding.couple?.groomName || "Pengantin"} & ${wedding.couple?.brideNickname || wedding.couple?.brideName || "Pengantin"}`,
    ogDescription:
      wedding.ogDescription ||
      "Kami mengundang Anda untuk merayakan hari bahagia pernikahan kami. Buka tautan untuk melihat detail acara dan konfirmasi kehadiran.",
    ogImage: wedding.ogImage || "",
    whatsappMessage:
      wedding.whatsappMessage ||
      `Kepada Yth.
Bapak/Ibu/Saudara/i: *{nama}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir di acara pernikahan kami:

💍 *{mempelai}*

Untuk detail informasi acara dan konfirmasi kehadiran, silakan kunjungi tautan undangan resmi berikut:
🔗 {link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.`,
  });

  const [mounted, setMounted] = useState(false);

  // Domain state (tab Domain)
  const [subdomainInput, setSubdomainInput] = useState(wedding.customSubdomain ?? "");
  const [customDomainInput, setCustomDomainInput] = useState(wedding.customDomain ?? "");
  const [domainSaving, setDomainSaving] = useState(false);
  const [domainMsg, setDomainMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedSubdomain, setCopiedSubdomain] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setDomainSaving(true);
    setDomainMsg(null);
    try {
      const body: { customSubdomain?: string | null; customDomain?: string | null } = {};
      // Hanya kirim field yang diisi
      body.customSubdomain = subdomainInput.trim() || null;
      body.customDomain = customDomainInput.trim() || null;

      const res = await fetch(`/api/wedding/${wedding.id}/domain`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.requireUpgrade) {
          setDomainMsg({ type: "error", text: "Fitur Custom Domain hanya tersedia untuk Paket Exclusive. Upgrade dulu!" });
        } else {
          setDomainMsg({ type: "error", text: data.error || "Gagal menyimpan domain." });
        }
      } else {
        setWedding((prev) => ({
          ...prev,
          customSubdomain: data.customSubdomain,
          customDomain: data.customDomain,
          domainVerified: data.domainVerified,
        }));
        setSubdomainInput(data.customSubdomain ?? "");
        setCustomDomainInput(data.customDomain ?? "");
        setDomainMsg({ type: "success", text: "Pengaturan domain berhasil disimpan!" });
      }
    } catch {
      setDomainMsg({ type: "error", text: "Terjadi kesalahan jaringan. Coba lagi." });
    }
    setDomainSaving(false);
  };

  const handleCopySubdomain = () => {
    const subdomain = wedding.customSubdomain;
    if (!subdomain) return;
    navigator.clipboard.writeText(`https://${subdomain}.hayvows.com`).then(() => {
      setCopiedSubdomain(true);
      setTimeout(() => setCopiedSubdomain(false), 2000);
    });
  };




  const coupleTitle = `${couple.groomNickname || couple.groomName || "Pengantin"} & ${couple.brideNickname || couple.brideName || "Pengantin"}`;
  const origin = mounted && typeof window !== "undefined" ? window.location.origin : "https://undangan.me";
  const hostName = mounted && typeof window !== "undefined" ? window.location.host : "undangan.me";

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const handleStatusToggle = async () => {
    const nextStatus = wedding.status === "published" ? "draft" : "published";
    setSaving(true);
    const res = await fetch(`/api/wedding/${wedding.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) {
      setWedding((prev) => ({ ...prev, status: nextStatus }));
      setSettingsData((prev) => ({ ...prev, status: nextStatus }));
      showNotification(
        `Status undangan berhasil diubah menjadi ${nextStatus.toUpperCase()}`
      );
    }
    setSaving(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/wedding/${wedding.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settingsData),
    });
    if (res.ok) {
      setWedding((prev) => ({
        ...prev,
        ...settingsData,
      }));
      showNotification("Pengaturan & SEO undangan berhasil disimpan!");
    } else {
      alert("Gagal menyimpan pengaturan. Silakan periksa kembali.");
    }
    setSaving(false);
  };

  const handleSaveCouple = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/wedding/${wedding.id}/couple`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(couple),
    });
    if (res.ok) showNotification("Data kedua mempelai berhasil disimpan!");
    setSaving(false);
  };

  const handleCouplePhotoChange = async (url: string) => {
    const updatedCouple = { ...couple, couplePhoto: url };
    setCouple(updatedCouple);
    try {
      const res = await fetch(`/api/wedding/${wedding.id}/couple`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCouple),
      });
      if (res.ok) {
        showNotification(
          url
            ? "Foto berdua berhasil diunggah dan otomatis tersimpan!"
            : "Foto berdua berhasil dihapus!"
        );
      }
    } catch (err) {
      console.error("Auto-save couple photo failed:", err);
    }
  };


  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/wedding/${wedding.id}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });
    if (res.ok) {
      const created = await res.json();
      setEvents((prev) => [...prev, created]);
      showNotification("Jadwal acara berhasil ditambahkan!");
    }
    setSaving(false);
  };

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/wedding/${wedding.id}/story`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStory),
    });
    if (res.ok) {
      const created = await res.json();
      setStories((prev) => [...prev, created]);
      showNotification("Cerita berhasil ditambahkan!");
    }
    setSaving(false);
  };

  // Preset Audio Preview Toggle
  const togglePresetPreview = (url: string) => {
    if (playingPresetUrl === url) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setPlayingPresetUrl(null);
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      const audio = new Audio(url);
      previewAudioRef.current = audio;
      audio.play().then(() => {
        setPlayingPresetUrl(url);
      }).catch((err) => {
        console.warn("Preset audio preview error:", err);
        setPlayingPresetUrl(null);
      });
      audio.onended = () => setPlayingPresetUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  const handleSelectPreset = async (preset: PresetMusicItem) => {
    setSaving(true);
    if (musics.length > 0) {
      for (const m of musics) {
        await fetch(`/api/wedding/${wedding.id}/music?itemId=${m.id}`, { method: "DELETE" });
      }
    }
    const res = await fetch(`/api/wedding/${wedding.id}/music`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: preset.title,
        fileUrl: preset.fileUrl,
      }),
    });
    if (res.ok) {
      const created = await res.json();
      setMusics([created]);
      showNotification(`Musik preset "${preset.title}" berhasil diatur sebagai musik latar!`);
    }
    setSaving(false);
  };

  const handleSaveYouTube = async (e: React.FormEvent) => {
    e.preventDefault();
    const ytId = extractYouTubeId(youtubeInput.url);
    if (!ytId) {
      showNotification("Format tautan YouTube tidak valid!");
      return;
    }
    setSaving(true);
    if (musics.length > 0) {
      for (const m of musics) {
        await fetch(`/api/wedding/${wedding.id}/music?itemId=${m.id}`, { method: "DELETE" });
      }
    }
    const title = youtubeInput.title.trim() || `YouTube Track (${ytId})`;
    const res = await fetch(`/api/wedding/${wedding.id}/music`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        fileUrl: `https://www.youtube.com/watch?v=${ytId}`,
      }),
    });
    if (res.ok) {
      const created = await res.json();
      setMusics([created]);
      setYoutubeInput({ title: "", url: "" });
      showNotification("Musik YouTube berhasil disimpan sebagai musik latar!");
    }
    setSaving(false);
  };

  const handleAddMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMusic.fileUrl) return;
    setSaving(true);
    if (musics.length > 0) {
      for (const m of musics) {
        await fetch(`/api/wedding/${wedding.id}/music?itemId=${m.id}`, { method: "DELETE" });
      }
    }
    const res = await fetch(`/api/wedding/${wedding.id}/music`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMusic),
    });
    if (res.ok) {
      const created = await res.json();
      setMusics([created]);
      setNewMusic({ title: "", fileUrl: "" });
      showNotification("Musik latar belakang berhasil disimpan!");
    }
    setSaving(false);
  };

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/wedding/${wedding.id}/gift`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGift),
    });
    if (res.ok) {
      const created = await res.json();
      setGifts((prev) => [...prev, created]);
      showNotification("Nomor rekening hadiah berhasil disimpan!");
    }
    setSaving(false);
  };

  const handleConfirmDeleteItem = async () => {
    if (!deleteItemTarget) return;
    setDeletingItem(true);
    const { type, id, title } = deleteItemTarget;
    try {
      let endpoint = "";
      if (type === "event") endpoint = `/api/wedding/${wedding.id}/events?itemId=${id}`;
      else if (type === "story") endpoint = `/api/wedding/${wedding.id}/story?itemId=${id}`;
      else if (type === "gallery") endpoint = `/api/wedding/${wedding.id}/gallery?itemId=${id}`;
      else if (type === "music") endpoint = `/api/wedding/${wedding.id}/music?itemId=${id}`;
      else if (type === "gift") endpoint = `/api/wedding/${wedding.id}/gift?itemId=${id}`;

      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        if (type === "event") setEvents((prev) => prev.filter((item) => item.id !== id));
        else if (type === "story") setStories((prev) => prev.filter((item) => item.id !== id));
        else if (type === "gallery") setGalleries((prev) => prev.filter((item) => item.id !== id));
        else if (type === "music") setMusics((prev) => prev.filter((item) => item.id !== id));
        else if (type === "gift") setGifts((prev) => prev.filter((item) => item.id !== id));
        showNotification(`${title || "Item"} berhasil dihapus!`);
        setDeleteItemTarget(null);
      } else {
        alert("Gagal menghapus item.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setDeletingItem(false);
    }
  };

  const handleDeleteEvent = (id: string, title?: string) => {
    setDeleteItemTarget({ type: "event", id, title: title ? `Jadwal "${title}"` : "Jadwal Acara" });
  };

  const handleDeleteStory = (id: string, title?: string) => {
    setDeleteItemTarget({ type: "story", id, title: title ? `Momen "${title}"` : "Cerita Cinta" });
  };

  const handleDeleteGallery = (id: string) => {
    setDeleteItemTarget({ type: "gallery", id, title: "Foto Galeri" });
  };

  const handleDeleteMusic = (id: string, title?: string) => {
    setDeleteItemTarget({ type: "music", id, title: title ? `Musik "${title}"` : "Musik Latar" });
  };

  const handleDeleteGift = (id: string, bankName?: string) => {
    setDeleteItemTarget({ type: "gift", id, title: bankName ? `Rekening ${bankName}` : "Rekening Hadiah" });
  };

  const isLuxury = wedding.plan === "luxury";

  const tabs = [
    { key: "couple", label: "Mempelai", icon: Heart, desc: "Data & foto kedua mempelai" },
    { key: "events", label: "Jadwal Acara", icon: Calendar, desc: "Akad nikah, resepsi & peta lokasi" },
    { key: "story", label: "Cerita Cinta", icon: BookOpen, desc: "Timeline kisah perjalanan cinta" },
    { key: "gallery", label: "Galeri Foto", icon: ImageIcon, desc: "Koleksi foto prewedding & kenangan" },
    { key: "music", label: "Musik Latar", icon: Music, desc: "Preset lagu, YouTube, atau custom" },
    { key: "gift", label: "Amplop & Kado", icon: Gift, desc: "Nomor rekening & dompet digital" },
    { key: "settings", label: "Pengaturan & SEO", icon: Settings2, desc: "Tautan URL, status, & preview link" },
    { key: "domain", label: "Link Web Sendiri", icon: Crown, desc: "Subdomain & custom domain pribadi" },
  ] as const;


  const isPublished = wedding.status === "published";

  return (
    <div className="space-y-5 sm:space-y-6 w-full max-w-7xl mx-auto pb-12">
      {/* 1. Top Header (Responsive Mobile & Tablet) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-slate-200/70 sm:border-0 shadow-2xs sm:shadow-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif tracking-tight">
              Edit Undangan
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 font-semibold rounded-full ${
                isPublished
                  ? "bg-emerald-50 text-[#2d4a3e] border border-emerald-200/80"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {isPublished ? "Live • Published" : "Draft"}
            </span>
          </div>
          <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Slug: <strong className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">/{wedding.slug}</strong></span>
            <span className="text-slate-300">•</span>
            <span>Tema: <strong className="text-slate-700">{wedding.template?.name || "Katalog Tema"}</strong></span>
          </p>
        </div>

        {/* Action Buttons: 2-column on mobile, right-aligned on tablet/desktop */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto shrink-0">
          <Link
            href={`/invitation/${wedding.slug}/preview`}
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 text-xs font-semibold rounded-xl shadow-2xs transition-colors min-h-[44px]"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Lihat Preview</span>
          </Link>

          <button
            type="button"
            onClick={handleStatusToggle}
            disabled={saving}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer min-h-[44px] ${
              isPublished
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                : "bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] text-white"
            }`}
          >
            {isPublished ? (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Ubah ke Draft</span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5 text-[#c9a84c]" />
                <span>Publikasikan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Notification Toast Banner */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#2d4a3e] text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#2d4a3e] shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {/* 3. Modern Tab Navigation (Horizontal Scroll with Touch Snap on Mobile, Clean Pills on Tablet/Desktop) */}
      <div className="border-b border-slate-200/90 flex gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x -mx-1 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-semibold rounded-xl sm:rounded-t-xl transition-all cursor-pointer whitespace-nowrap shrink-0 snap-start min-h-[42px] ${
                isActive
                  ? "bg-[#2d4a3e] text-white shadow-2xs sm:bg-white sm:text-[#2d4a3e] sm:border-b-2 sm:border-[#2d4a3e] sm:rounded-b-none"
                  : "bg-white sm:bg-transparent border border-slate-200/80 sm:border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#c9a84c] sm:text-[#2d4a3e]" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mempelai Tab */}
      {activeTab === "couple" && (
        <form onSubmit={handleSaveCouple} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Couple / Hero Photo Card - Muncul untuk tema yang memiliki Hero Section Foto Berdua */}
            {supportsHeroCouplePhoto ? (
              <div className="md:col-span-2 bg-white border border-emerald-200/90 rounded-xl p-5 shadow-sm space-y-3 bg-gradient-to-br from-white via-white to-emerald-50/20">
                <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 text-sm">
                        Foto Bersama Kedua Mempelai (Cover &amp; Hero Photo)
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {wedding.template?.name || "Tema Pilihan"} • Cover &amp; Hero Section
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Foto berdua mempelai pria &amp; wanita untuk latar layar Cover utama dan kartu potret pada tema {wedding.template?.name || "Eternal Noir / Modern Monogram"}.
                    </p>
                  </div>
                </div>
                <ImageUploadDropzone
                  label="Unggah Foto Berdua / Pasangan (Cover &amp; Hero Photo)"
                  value={couple.couplePhoto}
                  onChange={handleCouplePhotoChange}
                  type="cover"
                  enableCrop={true}
                  defaultCropRatio="3:4"
                />
              </div>
            ) : (
              /* Ketika tema aktif tidak menggunakan Hero Section foto berdua (misal tema game RPG Pixel / Floral) */
              <div className="md:col-span-2">
                {showOptionalHeroPhoto ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 text-sm">
                            Foto Bersama Kedua Mempelai (Opsional / WhatsApp Thumbnail)
                          </h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            Opsional
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Tema aktif ({wedding.template?.name || "Game RPG"}) tidak menggunakan Hero Section foto berdua. Foto ini dapat digunakan untuk pratinjau tautan share sosial media atau saat beralih ke tema Modern Monogram.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowOptionalHeroPhoto(false)}
                        className="text-xs text-slate-500 hover:text-slate-700 font-medium underline self-start sm:self-auto cursor-pointer"
                      >
                        Sembunyikan
                      </button>
                    </div>
                    <ImageUploadDropzone
                      label="Unggah Foto Berdua / Pasangan"
                      value={couple.couplePhoto}
                      onChange={handleCouplePhotoChange}
                      type="cover"
                      enableCrop={true}
                      defaultCropRatio="3:4"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        Tema aktif (<strong>{wedding.template?.name || "Game RPG"}</strong>) tidak memerlukan Hero Section foto berdua.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowOptionalHeroPhoto(true)}
                      className="text-emerald-700 hover:text-emerald-800 font-medium underline cursor-pointer text-left sm:text-right"
                    >
                      {couple.couplePhoto ? "Lihat / Ubah Foto Bersama Tersimpan" : "+ Unggah Foto Berdua (Opsional)"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Groom */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
                <span>Pengantin Pria (Groom)</span>
              </h3>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap &amp; Gelar
                </label>
                <input
                  type="text"
                  value={couple.groomName}
                  onChange={(e) => setCouple({ ...couple, groomName: e.target.value })}
                  placeholder="Alexander Pratama, S.T."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Panggilan
                </label>
                <input
                  type="text"
                  value={couple.groomNickname}
                  onChange={(e) => setCouple({ ...couple, groomNickname: e.target.value })}
                  placeholder="Alex"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <ImageUploadDropzone
                label="Foto Profil Mempelai Pria (Groom)"
                value={couple.groomPhoto}
                onChange={(url) => setCouple({ ...couple, groomPhoto: url })}
                type="couple"
                enableCrop={true}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nama Ayah
                  </label>
                  <input
                    type="text"
                    value={couple.groomFather}
                    onChange={(e) => setCouple({ ...couple, groomFather: e.target.value })}
                    placeholder="Bpk. Hendra"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nama Ibu
                  </label>
                  <input
                    type="text"
                    value={couple.groomMother}
                    onChange={(e) => setCouple({ ...couple, groomMother: e.target.value })}
                    placeholder="Ibu Ratna"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Username Instagram (tanpa @)
                </label>
                <input
                  type="text"
                  value={couple.groomInstagram}
                  onChange={(e) => setCouple({ ...couple, groomInstagram: e.target.value })}
                  placeholder="alex_pratama"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Bride */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
                <span>Pengantin Wanita (Bride)</span>
              </h3>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap &amp; Gelar
                </label>
                <input
                  type="text"
                  value={couple.brideName}
                  onChange={(e) => setCouple({ ...couple, brideName: e.target.value })}
                  placeholder="Sara Wijaya, S.Kom."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Panggilan
                </label>
                <input
                  type="text"
                  value={couple.brideNickname}
                  onChange={(e) => setCouple({ ...couple, brideNickname: e.target.value })}
                  placeholder="Sara"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <ImageUploadDropzone
                label="Foto Profil Mempelai Wanita (Bride)"
                value={couple.bridePhoto}
                onChange={(url) => setCouple({ ...couple, bridePhoto: url })}
                type="couple"
                enableCrop={true}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nama Ayah
                  </label>
                  <input
                    type="text"
                    value={couple.brideFather}
                    onChange={(e) => setCouple({ ...couple, brideFather: e.target.value })}
                    placeholder="Bpk. Bambang"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nama Ibu
                  </label>
                  <input
                    type="text"
                    value={couple.brideMother}
                    onChange={(e) => setCouple({ ...couple, brideMother: e.target.value })}
                    placeholder="Ibu Sri"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Username Instagram (tanpa @)
                </label>
                <input
                  type="text"
                  value={couple.brideInstagram}
                  onChange={(e) => setCouple({ ...couple, brideInstagram: e.target.value })}
                  placeholder="sara_wijaya"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold px-6 py-3 sm:py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer min-h-[44px]"
            >
              <Save className="w-4 h-4 text-[#c9a84c]" />
              <span>{saving ? "Menyimpan..." : "Simpan Data Mempelai"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Events Tab */}
      {activeTab === "events" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Daftar Rangkaian Acara
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Acara yang tersimpan akan tampil pada jadwal hari pernikahan di undangan.
              </p>
            </div>

            <div className="space-y-3">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-slate-900 text-sm">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-slate-600">
                      📅 {ev.date} • ⏰ {ev.startTime} {ev.endTime ? `- ${ev.endTime}` : ""} WIB
                    </p>
                    <p className="text-xs text-slate-500">
                      📍 {ev.venue} {ev.address ? `(${ev.address})` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(ev.id, ev.title)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors self-end sm:self-center cursor-pointer"
                    title="Hapus Acara"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Belum ada acara ditambahkan.
                </p>
              )}
            </div>

            <form
              onSubmit={handleAddEvent}
              className="pt-6 border-t border-slate-200 space-y-4"
            >
              <h4 className="font-semibold text-slate-900 text-sm">
                + Tambah Jadwal Acara
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nama Acara
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Akad Nikah / Resepsi"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Waktu Mulai
                  </label>
                  <input
                    type="time"
                    required
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Waktu Selesai (Opsional)
                  </label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nama Tempat / Gedung
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Grand Ballroom Hotel..."
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Jl. Sudirman No..."
                    value={newEvent.address}
                    onChange={(e) => setNewEvent({ ...newEvent, address: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    URL Google Maps (Opsional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={newEvent.mapsUrl}
                    onChange={(e) => setNewEvent({ ...newEvent, mapsUrl: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold px-5 py-3 sm:py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer min-h-[44px]"
              >
                <Plus className="w-4 h-4 text-[#c9a84c]" />
                <span>{saving ? "Menyimpan..." : "Simpan Jadwal Acara"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Story Tab */}
      {activeTab === "story" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">
              Timeline Cerita Cinta
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Bagikan momen penting perjalanan kasih Anda berdua kepada para tamu.
            </p>
          </div>

          <div className="space-y-3">
            {stories.map((st) => (
              <div
                key={st.id}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start gap-4"
              >
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-bold shrink-0">
                  {st.date}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-slate-900">{st.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{st.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteStory(st.id, st.title)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Hapus Cerita"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddStory} className="pt-6 border-t border-slate-200 space-y-3">
            <h4 className="font-semibold text-slate-900 text-sm">+ Tambah Momen Cerita</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tahun / Periode</label>
                <input
                  type="text"
                  placeholder="2023"
                  value={newStory.date}
                  onChange={(e) => setNewStory({ ...newStory, date: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Judul Momen</label>
                <input
                  type="text"
                  placeholder="Lamaran / Tunangan"
                  value={newStory.title}
                  onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  placeholder="Ceritakan momen berkesan ini..."
                  value={newStory.description}
                  onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold px-5 py-3 sm:py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer min-h-[44px]"
            >
              <Plus className="w-4 h-4 text-[#c9a84c]" />
              <span>{saving ? "Menyimpan..." : "Simpan Cerita Cinta"}</span>
            </button>
          </form>
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === "gallery" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <GalleryUploader
            weddingId={wedding.id}
            galleries={galleries}
            onAddGallery={(newItem) => setGalleries((prev) => [...prev, newItem])}
            onDeleteGallery={handleDeleteGallery}
            showNotification={showNotification}
          />
        </div>
      )}

      {/* Music Tab */}
      {activeTab === "music" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">
              Musik Latar Belakang
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Musik yang akan otomatis diputar saat tamu menekan tombol buka undangan.
            </p>
          </div>

          {/* Musik Aktif Saat Ini */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Musik Aktif Undangan
            </h4>
            {musics.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-900">
                    Menggunakan Musik Bawaan Tema
                  </p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Lagu default tema (/wedding-bgm.mp3) sedang aktif. Pilih musik preset di bawah atau masukkan tautan YouTube favorit untuk menggantinya.
                  </p>
                </div>
              </div>
            ) : (
              musics.map((m) => {
                const isYT = isYouTubeUrl(m.fileUrl);
                const isPreset = m.fileUrl.startsWith("/music/presets/") || m.fileUrl === "/wedding-bgm.mp3";
                const isThisPlaying = playingPresetUrl === m.fileUrl;

                return (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                        {isYT ? (
                          <span className="text-red-600 font-black text-sm">▶</span>
                        ) : isPreset ? (
                          <Radio className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Music className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm text-slate-900 truncate">{m.title}</p>
                          {isYT ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-red-100 text-red-800">
                              YouTube Video
                            </span>
                          ) : isPreset ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-indigo-100 text-indigo-800">
                              Koleksi Preset
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-100 text-emerald-800">
                              File Audio MP3
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium bg-emerald-600 text-white">
                            Aktif
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate max-w-lg mt-0.5">{m.fileUrl}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {!isYT && (
                        <button
                          type="button"
                          onClick={() => togglePresetPreview(m.fileUrl)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer"
                        >
                          {isThisPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Jeda</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Dengarkan</span>
                            </>
                          )}
                        </button>
                      )}
                      {isYT && (
                        <a
                          href={m.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-red-600" />
                          <span>Buka YouTube</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteMusic(m.id, m.title)}
                        className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Musik"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Mode Selector Tabs */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Ganti / Atur Musik</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih sumber audio yang ingin Anda pasang sebagai pengiring undangan.
              </p>
            </div>

            <div className="flex items-center p-1 bg-slate-100 rounded-xl max-w-fit gap-1">
              <button
                type="button"
                onClick={() => setMusicSourceMode("preset")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  musicSourceMode === "preset"
                    ? "bg-white text-emerald-800 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-indigo-600" />
                <span>Koleksi Preset</span>
              </button>
              <button
                type="button"
                onClick={() => setMusicSourceMode("youtube")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  musicSourceMode === "youtube"
                    ? "bg-white text-emerald-800 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="text-red-600 font-bold">▶</span>
                <span>Tautan YouTube</span>
              </button>
              <button
                type="button"
                onClick={() => setMusicSourceMode("custom")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  musicSourceMode === "custom"
                    ? "bg-white text-emerald-800 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Music className="w-3.5 h-3.5 text-emerald-600" />
                <span>File Audio / URL MP3</span>
              </button>
            </div>

            {/* Sub-Tab 1: Preset Musics */}
            {musicSourceMode === "preset" && (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-slate-500">
                  Dengarkan dan pilih lagu bebas royalti berkualitas tinggi yang siap diputar mulus:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PRESET_MUSICS.map((preset) => {
                    const activeMusicUrl = musics[0]?.fileUrl || "/wedding-bgm.mp3";
                    const isSelected = activeMusicUrl === preset.fileUrl;
                    const isThisPlaying = playingPresetUrl === preset.fileUrl;

                    return (
                      <div
                        key={preset.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/40 shadow-xs"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {preset.badge}
                            </span>
                            <span className="text-2xs font-medium text-slate-400">
                              {preset.genre}
                            </span>
                          </div>
                          <h5 className="font-semibold text-sm text-slate-900 mt-2">
                            {preset.title}
                          </h5>
                          <p className="text-xs text-slate-500 font-medium">
                            {preset.artist}
                          </p>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {preset.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => togglePresetPreview(preset.fileUrl)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer"
                          >
                            {isThisPlaying ? (
                              <>
                                <Pause className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Jeda Demo</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Dengarkan Demo</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            disabled={saving || isSelected}
                            onClick={() => handleSelectPreset(preset)}
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                              isSelected
                                ? "bg-emerald-100 text-emerald-800 cursor-default"
                                : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white shadow-xs"
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Sedang Dipakai</span>
                              </>
                            ) : (
                              <span>Pilih Musik Ini</span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-Tab 2: YouTube Link */}
            {musicSourceMode === "youtube" && (
              <form onSubmit={handleSaveYouTube} className="space-y-4 pt-2">
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 text-xs text-amber-900 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <span>💡</span> Tips Pemutaran YouTube:
                  </p>
                  <p className="text-amber-800">
                    Pastikan video berstatus <strong>Publik</strong> atau <strong>Tidak Terdaftar (Unlisted)</strong> dan fitur embedding aktif. Pemutaran akan otomatis dimulai segera setelah tamu menekan tombol <strong>"Buka Undangan"</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Tautan / URL Video YouTube
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ atau https://youtu.be/..."
                      value={youtubeInput.url}
                      onChange={(e) => setYoutubeInput({ ...youtubeInput, url: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Judul Lagu (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: A Thousand Years - Piano Version"
                      value={youtubeInput.title}
                      onChange={(e) => setYoutubeInput({ ...youtubeInput, title: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Live YouTube Preview Card */}
                {youtubeInput.url && extractYouTubeId(youtubeInput.url) && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Video Ditemukan & Siap Diputar:</span>
                    </p>
                    <div className="relative aspect-video max-w-sm rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900">
                      <iframe
                        src={getYouTubeEmbedUrl(youtubeInput.url) || ""}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {youtubeInput.url && !extractYouTubeId(youtubeInput.url) && (
                  <p className="text-xs text-rose-600">
                    ⚠️ Format URL YouTube belum sesuai. Masukkan tautan seperti https://www.youtube.com/watch?v=... atau https://youtu.be/...
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving || !extractYouTubeId(youtubeInput.url)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold px-5 py-3 sm:py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer min-h-[44px]"
                >
                  <Save className="w-4 h-4 text-[#c9a84c]" />
                  <span>{saving ? "Menyimpan..." : "Simpan Musik YouTube"}</span>
                </button>
              </form>
            )}

            {/* Sub-Tab 3: Custom Audio MP3 URL */}
            {musicSourceMode === "custom" && (
              <form onSubmit={handleAddMusic} className="space-y-3 pt-2">
                <p className="text-xs text-slate-500">
                  Masukkan tautan langsung file audio berformat .mp3 yang di-host di server atau CDN sendiri:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Judul Lagu</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Romantic Piano"
                      value={newMusic.title}
                      onChange={(e) => setNewMusic({ ...newMusic, title: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">URL File MP3 Audio</label>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/audio/song.mp3"
                      value={newMusic.fileUrl}
                      onChange={(e) => setNewMusic({ ...newMusic, fileUrl: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving || !newMusic.fileUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold px-5 py-3 sm:py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer min-h-[44px]"
                >
                  <Plus className="w-4 h-4 text-[#c9a84c]" />
                  <span>{saving ? "Menyimpan..." : "Simpan File Audio"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Gift Tab */}
      {activeTab === "gift" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">
              Rekening Hadiah / Amplop Digital
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tampilkan opsi transfer bank atau QRIS bagi tamu yang ingin mengirim hadiah.
            </p>
          </div>

          <div className="space-y-3">
            {gifts.map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-sm text-slate-900">
                    {g.bankName} — <span className="font-mono">{g.accountNo}</span>
                  </p>
                  <p className="text-xs text-slate-500">Atas Nama: {g.accountName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteGift(g.id, g.bankName)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Hapus Rekening"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddGift} className="pt-6 border-t border-slate-200 space-y-3">
            <h4 className="font-semibold text-slate-900 text-sm">+ Tambah Rekening</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bank / E-Wallet</label>
                <input
                  type="text"
                  required
                  placeholder="BCA / Mandiri / GoPay"
                  value={newGift.bankName}
                  onChange={(e) => setNewGift({ ...newGift, bankName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nomor Rekening</label>
                <input
                  type="text"
                  required
                  placeholder="1234567890"
                  value={newGift.accountNo}
                  onChange={(e) => setNewGift({ ...newGift, accountNo: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Atas Nama</label>
                <input
                  type="text"
                  required
                  placeholder="Alexander Pratama"
                  value={newGift.accountName}
                  onChange={(e) => setNewGift({ ...newGift, accountName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold px-5 py-3 sm:py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer min-h-[44px]"
            >
              <Plus className="w-4 h-4 text-[#c9a84c]" />
              <span>{saving ? "Menyimpan..." : "Simpan Rekening Hadiah"}</span>
            </button>
          </form>
        </div>
      )}

      {/* Settings & SEO Tab */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* SECTION 1: STATUS & SLUG */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>Tautan Undangan &amp; Status Publikasi</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tentukan alamat URL undangan Anda dan atur apakah undangan sudah bisa dibuka oleh para tamu.
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
                  settingsData.status === "published"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    settingsData.status === "published" ? "bg-emerald-600" : "bg-amber-600"
                  }`}
                />
                <span>{settingsData.status === "published" ? "Published (Live)" : "Draft (Privat)"}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Status Publikasi
                </label>
                <select
                  value={settingsData.status}
                  onChange={(e) => setSettingsData({ ...settingsData, status: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="published">Published (Dapat Diakses Tamu)</option>
                  <option value="draft">Draft (Hanya Pemilik Undangan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Slug Alamat Web (Domain Path)
                </label>
                <div className="flex items-center">
                  <span className="bg-slate-100 border border-r-0 border-slate-300 px-2.5 py-2 text-xs text-slate-500 rounded-l-lg font-mono">
                    /invitation/
                  </span>
                  <input
                    type="text"
                    required
                    value={settingsData.slug}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    className="w-full rounded-r-lg border border-slate-300 px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mode Ucapan Tamu
                </label>
                <select
                  value={settingsData.messageMode}
                  onChange={(e) => setSettingsData({ ...settingsData, messageMode: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="auto">Otomatis Tayang (Auto-Approve)</option>
                  <option value="approval">Moderasi Manual (Perlu Disetujui)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: FORMAT PESAN WHATSAPP (DIPUSATKAN DI DAFTAR TAMU) */}
          <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center shrink-0 text-emerald-700 mt-0.5 sm:mt-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm">
                      Format Pesan Broadcast WhatsApp
                    </h3>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Dipusatkan di Daftar Tamu
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                    Template pesan, pilihan ucapan (Islami, Formal, Kasual, Jawa, dll), variabel khusus nama & meja, serta simulasi gelembung chat WhatsApp kini dipusatkan langsung di menu <strong>Daftar Tamu</strong> agar terintegrasi penuh saat membagikan link ke masing-masing tamu.
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/guests"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm hover:shadow transition-all shrink-0 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Atur Format Pesan di Daftar Tamu</span>
                <ExternalLinkIcon className="w-3.5 h-3.5 opacity-80" />
              </Link>
            </div>
          </div>

          {/* SECTION 3: METADATA SEO & SOCIAL SHARE */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span>Metadata SEO &amp; Media Sosial (Open Graph)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tampilan judul, deskripsi, dan gambar banner saat tautan undangan dibagikan di WhatsApp, Instagram, Facebook, atau Twitter.
                </p>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                SEO &amp; Sosmed
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Undangan (OG Title)
                  </label>
                  <input
                    type="text"
                    value={settingsData.ogTitle}
                    onChange={(e) => setSettingsData({ ...settingsData, ogTitle: e.target.value })}
                    placeholder={`The Wedding of ${coupleTitle}`}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Judul utama tebal yang muncul di kartu preview link medsos.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deskripsi Undangan (OG Description)
                  </label>
                  <textarea
                    rows={3}
                    value={settingsData.ogDescription}
                    onChange={(e) => setSettingsData({ ...settingsData, ogDescription: e.target.value })}
                    placeholder="Kami mengundang Anda untuk merayakan hari bahagia pernikahan kami..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Deskripsi ringkas yang mendampingi judul link undangan.
                  </p>
                </div>

                <div>
                  <ImageUploadDropzone
                    label="Banner Pratinjau Media Sosial (OG Image)"
                    value={settingsData.ogImage}
                    onChange={(url) => setSettingsData({ ...settingsData, ogImage: url })}
                    type="gallery"
                    enableCrop={true}
                    defaultCropRatio="16:9"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Gambar banner rasio 16:9 yang tampil saat link dibagikan. Otomatis WebP.
                  </p>
                </div>
              </div>

              {/* Live Social Share Card Preview */}
              <div className="lg:col-span-5 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Simulasi Kartu Media Sosial (Link Card Preview)
                </label>

                <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shadow-xs">
                  <div className="aspect-16/9 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                    {settingsData.ogImage ? (
                      <img
                        src={settingsData.ogImage}
                        alt="OG Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4 text-slate-400">
                        <Share2 className="w-8 h-8 mx-auto mb-1 opacity-40" />
                        <span className="text-[11px]">Belum ada gambar banner</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-white space-y-1">
                    <span suppressHydrationWarning className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      {hostName}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {settingsData.ogTitle || `The Wedding of ${coupleTitle}`}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {settingsData.ogDescription ||
                        "Buka tautan untuk melihat detail acara pernikahan dan konfirmasi kehadiran."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold px-6 py-3 sm:py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer min-h-[44px]"
            >
              <Save className="w-4 h-4 text-[#c9a84c]" />
              <span>{saving ? "Menyimpan..." : "Simpan Pengaturan & SEO"}</span>
            </button>
          </div>

          {/* Danger Zone: Hapus Undangan */}
          <div className="border border-rose-200/80 bg-rose-50/50 rounded-2xl p-5 sm:p-6 mt-8 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Zona Berbahaya: Hapus Acara Ini</span>
                </h4>
                <p className="text-xs text-rose-700/80 mt-1 max-w-xl">
                  Menghapus undangan ini akan menghapus seluruh data pengantin, daftar tamu, konfirmasi kehadiran (RSVP), pesan ucapan, amplop digital, dan foto galeri secara permanen.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition-all cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Undangan Ini</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ─── DOMAIN TAB ─────────────────────────────────────────────────── */}
      {activeTab === "domain" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <Crown className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Alamat Link Web Sendiri (Custom Domain)
                {isLuxury ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    Paket Exclusive ✓
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Hanya Paket Exclusive
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ganti link undangan biasa menjadi alamat resmi memakai nama kedua mempelai (contoh: <strong className="text-slate-700">romeo-juliet.my.id</strong> atau <strong className="text-slate-700">alex-sara.hayvows.com</strong>).
              </p>
            </div>
          </div>

          {/* Lock state untuk non-luxury */}
          {!isLuxury && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto">
                <Crown className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">Fitur Eksklusif Paket Exclusive</h3>
                <p className="text-xs text-amber-700 mt-1 max-w-sm mx-auto leading-relaxed">
                  Upgrade ke Paket Exclusive untuk mendapatkan <strong>Gratis Domain .my.id 1 Tahun</strong> (contoh:{" "}
                  <strong>alex-sara.my.id</strong>) atau membuat alamat pendek khusus (contoh:{" "}
                  <strong>alex-sara.hayvows.com</strong>).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                Upgrade ke Paket Exclusive
              </button>
            </div>
          )}

          {/* Form Domain (hanya untuk luxury) */}
          {isLuxury && (
            <form onSubmit={handleSaveDomain} className="space-y-5">

              {/* Notifikasi */}
              {domainMsg && (
                <div
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
                    domainMsg.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border border-rose-200 text-rose-800"
                  }`}
                >
                  {domainMsg.type === "success" ? (
                    <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{domainMsg.text}</span>
                </div>
              )}

              {/* SECTION 1: Subdomain Hayvows */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      Pilihan 1: Alamat Pendek Hayvows (Langsung Aktif)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Buat link pendek yang langsung aktif dalam 1 detik tanpa perlu konfigurasi teknis.
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    Langsung Aktif
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Link yang Diinginkan
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-stretch flex-1 rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                      <input
                        type="text"
                        value={subdomainInput}
                        onChange={(e) => setSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                        placeholder="alex-sara"
                        className="flex-1 px-3 py-2 text-sm bg-white outline-none"
                        minLength={3}
                        maxLength={63}
                      />
                      <span className="flex items-center px-3 bg-slate-50 border-l border-slate-300 text-xs text-slate-500 font-mono whitespace-nowrap">
                        .hayvows.com
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Hanya gunakan huruf kecil, angka, dan tanda hubung (-). Contoh: <code className="text-slate-600 font-mono">alex-sara</code>
                  </p>
                </div>

                {/* Preview & Salin */}
                {wedding.customSubdomain && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Link Aktif Sekarang</p>
                      <p className="text-xs font-mono text-emerald-700 font-semibold truncate">
                        https://{wedding.customSubdomain}.hayvows.com
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopySubdomain}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium bg-white hover:bg-slate-100 border border-slate-300 rounded-lg cursor-pointer transition-colors"
                      >
                        {copiedSubdomain ? (
                          <><CheckCheck className="w-3.5 h-3.5 text-emerald-600" /><span className="text-emerald-700">Disalin!</span></>
                        ) : (
                          <><Copy className="w-3.5 h-3.5" /><span>Salin</span></>
                        )}
                      </button>
                      <a
                        href={`https://${wedding.customSubdomain}.hayvows.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium bg-white hover:bg-slate-100 border border-slate-300 rounded-lg cursor-pointer transition-colors"
                      >
                        <ExternalLinkIcon className="w-3.5 h-3.5" />
                        Buka
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: Custom Domain Sendiri */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-purple-600" />
                      Pilihan 2: Domain Pribadi (Nama Website Sendiri)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Gunakan alamat website sepenuhnya tanpa nama Hayvows (contoh: <strong className="text-slate-700">romeo-juliet.my.id</strong> atau <strong className="text-slate-700">pernikahankami.com</strong>).
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    Paling Eksklusif
                  </span>
                </div>

                {/* Info Klaim Gratis untuk Exclusive */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
                  <Crown className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-amber-950">
                      🎁 Bonus Paket Exclusive: Gratis 1 Domain .my.id Selama 1 Tahun!
                    </p>
                    <p className="text-amber-900/90 leading-relaxed text-[11px]">
                      Bingung cara beli atau setting domain? Tenang, tim Admin Hayvows siap membantu mendaftarkan dan menyambungkan nama domain pilihan Anda tanpa biaya tambahan. Silakan hubungi kami via WhatsApp untuk klaim domain gratis Anda.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Domain Anda (tanpa https://)
                  </label>
                  <input
                    type="text"
                    value={customDomainInput}
                    onChange={(e) => setCustomDomainInput(e.target.value.toLowerCase().trim().replace(/^https?:\/\//, ""))}
                    placeholder="romeo-juliet.my.id"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Contoh: <code className="font-mono text-slate-600">romeo-juliet.my.id</code> atau <code className="font-mono text-slate-600">pernikahan-kami.com</code>
                  </p>
                </div>

                {/* Panduan DNS */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0" />
                    <h4 className="text-xs font-bold text-blue-900">Bagi yang Memasang Sendiri (Panduan DNS)</h4>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Jika Anda membeli domain sendiri di registrar luar, cukup arahkan DNS CNAME domain Anda ke server Hayvows:
                  </p>
                  <div className="bg-white rounded-lg border border-blue-200 overflow-hidden">
                    <div className="grid grid-cols-3 text-[10px] font-bold text-blue-900 bg-blue-100 px-3 py-2">
                      <span>Type</span>
                      <span>Name / Host</span>
                      <span>Value / Target</span>
                    </div>
                    <div className="grid grid-cols-3 text-[11px] font-mono px-3 py-2 border-t border-blue-100">
                      <span className="font-bold text-slate-700">CNAME</span>
                      <span className="text-slate-600">@ atau www</span>
                      <span className="text-emerald-700">hayvows.com</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    Butuh bantuan pemasangan? Tim CS kami di WhatsApp siap memandu sampai domain aktif.
                  </p>
                </div>

                {/* Status domain */}
                {wedding.customDomain && (
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-xs ${
                    wedding.domainVerified
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-amber-50 border-amber-200 text-amber-800"
                  }`}>
                    {wedding.domainVerified ? (
                      <><CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>{wedding.customDomain}</strong> — Domain terverifikasi dan aktif ✓</span></>
                    ) : (
                      <><AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span><strong>{wedding.customDomain}</strong> — Menunggu propagasi DNS. Bisa butuh hingga 24 jam.</span></>
                    )}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={domainSaving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold px-6 py-3 sm:py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer min-h-[44px]"
                >
                  <Save className="w-4 h-4 text-[#c9a84c]" />
                  <span>{domainSaving ? "Menyimpan..." : "Simpan Pengaturan Domain"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 7. In-App Item Delete Confirmation Modal (Event, Story, Gallery, Music, Gift) */}
      {deleteItemTarget && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  Hapus Item Ini?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus:
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 mt-1.5">
                  {deleteItemTarget.title}
                </div>
                <p className="text-[11px] text-rose-600 mt-1">
                  Item yang telah dihapus tidak dapat dipulihkan kembali.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={deletingItem}
                onClick={() => setDeleteItemTarget(null)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deletingItem}
                onClick={handleConfirmDeleteItem}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 rounded-xl shadow-xs transition-all cursor-pointer min-h-[44px]"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deletingItem ? "Menghapus..." : "Ya, Hapus Sekarang"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Full Wedding Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  Hapus Undangan Pernikahan?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus data undangan untuk:
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs mt-1.5">
                  <span className="font-bold text-slate-900 block truncate text-sm">
                    {couple.groomName || "Mempelai Pria"} &amp; {couple.brideName || "Mempelai Wanita"}
                  </span>
                  <span className="font-mono text-slate-500 text-xs block mt-0.5">
                    /{settingsData.slug}
                  </span>
                </div>
                <p className="text-[11px] text-rose-700 bg-rose-50/80 p-2.5 rounded-xl border border-rose-200 leading-relaxed mt-2">
                  Tindakan ini permanen. Seluruh data acara, tamu, RSVP, ucapan, dan foto akan dihapus secara menyeluruh.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={deletingWedding}
                onClick={() => setDeleteModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deletingWedding}
                onClick={async () => {
                  setDeletingWedding(true);
                  try {
                    const res = await fetch(`/api/wedding/${initialWedding.id}`, {
                      method: "DELETE",
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      throw new Error(data.error || "Gagal menghapus undangan");
                    }
                    router.push("/dashboard/invitation");
                    router.refresh();
                  } catch (err: unknown) {
                    alert(err instanceof Error ? err.message : "Gagal menghapus undangan");
                    setDeletingWedding(false);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 rounded-xl shadow-xs transition-all cursor-pointer min-h-[44px]"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deletingWedding ? "Menghapus..." : "Ya, Hapus Undangan"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import ImageUploadDropzone from "@/components/ui/ImageUploadDropzone";
import GalleryUploader from "@/components/ui/GalleryUploader";
import { WHATSAPP_PRESETS, WhatsAppPreset } from "@/lib/whatsappPresets";
import { PRESET_MUSICS, PresetMusicItem } from "@/lib/constants/presetMusic";
import { extractYouTubeId, isYouTubeUrl, getYouTubeEmbedUrl } from "@/lib/utils/youtube";

interface WeddingData {
  id: string;
  slug: string;
  status: string;
  messageMode: string;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  whatsappMessage?: string | null;
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
    "couple" | "events" | "story" | "gallery" | "music" | "gift" | "settings"
  >("couple");
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingWedding, setDeletingWedding] = useState(false);

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

  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [presetNotice, setPresetNotice] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const applyPreset = (preset: WhatsAppPreset) => {
    setSettingsData((prev) => ({
      ...prev,
      whatsappMessage: preset.template,
    }));
    setSelectedPresetId(preset.id);
    setPresetNotice(`Ucapan ${preset.name} berhasil diterapkan!`);
    setTimeout(() => setPresetNotice(null), 3000);
  };

  const insertVariable = (variableTag: string) => {
    setSettingsData((prev) => ({
      ...prev,
      whatsappMessage: (prev.whatsappMessage || "") + " " + variableTag,
    }));
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

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Hapus jadwal acara ini?")) return;
    setSaving(true);
    const res = await fetch(`/api/wedding/${wedding.id}/events?itemId=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setEvents((prev) => prev.filter((item) => item.id !== id));
      showNotification("Jadwal acara berhasil dihapus!");
    }
    setSaving(false);
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm("Hapus cerita cinta ini?")) return;
    setSaving(true);
    const res = await fetch(`/api/wedding/${wedding.id}/story?itemId=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setStories((prev) => prev.filter((item) => item.id !== id));
      showNotification("Cerita berhasil dihapus!");
    }
    setSaving(false);
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    setSaving(true);
    const res = await fetch(`/api/wedding/${wedding.id}/gallery?itemId=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setGalleries((prev) => prev.filter((item) => item.id !== id));
      showNotification("Foto berhasil dihapus dari galeri!");
    }
    setSaving(false);
  };

  const handleDeleteMusic = async (id: string) => {
    if (!confirm("Hapus musik latar ini?")) return;
    setSaving(true);
    const res = await fetch(`/api/wedding/${wedding.id}/music?itemId=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMusics((prev) => prev.filter((item) => item.id !== id));
      showNotification("Musik berhasil dihapus!");
    }
    setSaving(false);
  };

  const handleDeleteGift = async (id: string) => {
    if (!confirm("Hapus nomor rekening ini?")) return;
    setSaving(true);
    const res = await fetch(`/api/wedding/${wedding.id}/gift?itemId=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setGifts((prev) => prev.filter((item) => item.id !== id));
      showNotification("Nomor rekening berhasil dihapus!");
    }
    setSaving(false);
  };

  const tabs = [
    { key: "couple", label: "Mempelai", icon: Heart },
    { key: "events", label: "Jadwal Acara", icon: Calendar },
    { key: "story", label: "Cerita Cinta", icon: BookOpen },
    { key: "gallery", label: "Galeri Foto", icon: ImageIcon },
    { key: "music", label: "Musik Latar", icon: Music },
    { key: "gift", label: "Amplop & Kado", icon: Gift },
    { key: "settings", label: "Pengaturan & SEO", icon: Settings2 },
  ] as const;

  const isPublished = wedding.status === "published";

  return (
    <div className="space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">
              Edit Undangan
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 font-medium rounded-full ${
                isPublished
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>Slug: <strong className="font-mono text-slate-700">/{wedding.slug}</strong></span>
            <span>•</span>
            <span>Template: <strong className="text-slate-700">{wedding.template?.name}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/invitation/${wedding.slug}/preview`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 text-xs font-medium rounded-xl shadow-2xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Lihat Preview</span>
          </Link>

          <button
            onClick={handleStatusToggle}
            disabled={saving}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer ${
              isPublished
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white"
            }`}
          >
            {isPublished ? (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Ubah ke Draft</span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5" />
                <span>Publikasikan Undangan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notification */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Modern Tabs */}
      <div className="border-b border-slate-200 flex gap-1.5 sm:gap-2 overflow-x-auto pb-px scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 whitespace-nowrap shrink-0 ${
                isActive
                  ? "border-emerald-600 text-emerald-700 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
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
                    onClick={() => handleDeleteEvent(ev.id)}
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
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{saving ? "Menyimpan..." : "Simpan Acara"}</span>
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
                  onClick={() => handleDeleteStory(st.id)}
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
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{saving ? "Menyimpan..." : "Simpan Cerita"}</span>
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
                        onClick={() => handleDeleteMusic(m.id)}
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
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
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
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
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
                  onClick={() => handleDeleteGift(g.id)}
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
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{saving ? "Menyimpan..." : "Simpan Rekening"}</span>
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

          {/* SECTION 2: WHATSAPP BROADCAST TEMPLATE */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Format Pesan Broadcast WhatsApp</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Draf teks yang akan otomatis terisi saat Anda menekan tombol bagikan undangan ke nomor WhatsApp tamu.
                </p>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                WhatsApp Ready
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-3">
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pilihan Ucapan Siap Pakai:</span>
                    </div>
                    {presetNotice && (
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {presetNotice}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {WHATSAPP_PRESETS.map((p) => {
                      const isActive =
                        selectedPresetId === p.id ||
                        settingsData.whatsappMessage.trim() === p.template.trim();
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => applyPreset(p)}
                          className={`flex flex-col items-start p-2 rounded-lg text-left transition-all cursor-pointer border ${
                            isActive
                              ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500 shadow-2xs"
                              : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 w-full">
                            <span className="text-sm">{p.icon}</span>
                            <span className="font-bold text-[11px] truncate">{p.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 leading-tight">
                            {p.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span>Sisipkan:</span>
                      <button
                        type="button"
                        onClick={() => insertVariable("{nama}")}
                        className="px-2 py-0.5 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] rounded-md border border-slate-300 cursor-pointer font-mono font-medium"
                      >
                        + {"{nama}"}
                      </button>
                      <button
                        type="button"
                        onClick={() => insertVariable("{mempelai}")}
                        className="px-2 py-0.5 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] rounded-md border border-slate-300 cursor-pointer font-mono font-medium"
                      >
                        + {"{mempelai}"}
                      </button>
                      <button
                        type="button"
                        onClick={() => insertVariable("{link}")}
                        className="px-2 py-0.5 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] rounded-md border border-slate-300 cursor-pointer font-mono font-medium"
                      >
                        + {"{link}"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={12}
                    value={settingsData.whatsappMessage}
                    onChange={(e) => {
                      setSettingsData({ ...settingsData, whatsappMessage: e.target.value });
                      setSelectedPresetId(null);
                    }}
                    placeholder="Ketik format pesan WhatsApp..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500 leading-relaxed bg-white"
                  />
                  <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                    <span>Tag dinamis akan otomatis terisi sesuai nama dan link khusus tamu.</span>
                    <span>{settingsData.whatsappMessage.length} karakter</span>
                  </div>
                </div>
              </div>

              {/* Live WhatsApp Bubble Preview */}
              <div className="lg:col-span-5 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Simulasi Gelembung Chat WhatsApp
                </label>

                <div className="bg-[#e5ddd5] p-3.5 rounded-2xl border border-[#c7bcaf] shadow-xs">
                  <div className="bg-[#d9fdd3] rounded-2xl rounded-tr-xs p-3.5 shadow-xs border border-emerald-200/50 space-y-2">
                    <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-600/10 flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-800 font-bold text-sm">
                        💍
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          The Wedding of {coupleTitle}
                        </p>
                        <p suppressHydrationWarning className="text-[10px] text-slate-500 font-mono truncate">
                          {hostName}/invitation/{settingsData.slug}
                        </p>
                      </div>
                    </div>

                    <div
                      suppressHydrationWarning
                      className="text-[11px] text-slate-800 whitespace-pre-line leading-relaxed font-sans max-h-[380px] overflow-y-auto pr-1"
                    >
                      {settingsData.whatsappMessage
                        .replace(/\{nama\}/g, "Budi Santoso")
                        .replace(/\{mempelai\}/g, coupleTitle)
                        .replace(/\{link\}/g, `${origin}/invitation/${settingsData.slug}?to=Budi+Santoso`)}
                    </div>

                    <div className="flex items-center justify-end gap-1 text-[9px] text-slate-500 pt-0.5">
                      <span>10:45</span>
                      <span className="text-sky-500 font-bold">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>
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
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Hapus Undangan Pernikahan?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus data undangan untuk:
                </p>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900 block truncate">
                    {couple.groomName || "Mempelai Pria"} &amp; {couple.brideName || "Mempelai Wanita"}
                  </span>
                  <span className="font-mono text-slate-500 text-[11px] block">
                    /{settingsData.slug}
                  </span>
                </div>
                <p className="text-[11px] text-rose-700 bg-rose-50/80 p-2.5 rounded-lg border border-rose-200 leading-relaxed">
                  Tindakan ini tidak dapat dibatalkan. Seluruh data acara, tamu, RSVP, ucapan, dan foto akan dihapus permanen.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={deletingWedding}
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deletingWedding ? "Menghapus..." : "Ya, Hapus Undangan"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

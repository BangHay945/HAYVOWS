"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Plus,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
}

interface GalleryUploaderProps {
  weddingId: string;
  galleries: GalleryItem[];
  onAddGallery: (item: GalleryItem) => void;
  onDeleteGallery: (id: string) => void;
  showNotification: (msg: string) => void;
}

export default function GalleryUploader({
  weddingId,
  galleries,
  onAddGallery,
  onDeleteGallery,
  showNotification,
}: GalleryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Fallback Manual URL Input State
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [manualCaption, setManualCaption] = useState("");
  const [isSavingManual, setIsSavingManual] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger file dialog
  const handleTriggerSelect = () => {
    fileInputRef.current?.click();
  };

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
      e.target.value = ""; // Reset
    }
  };

  // Process and upload batch files
  const handleFiles = async (files: File[]) => {
    // Filter only images
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      setErrorMessage("Pilih berkas berupa gambar (JPG, PNG, WebP).");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setUploadProgress({ current: 0, total: imageFiles.length });

    let successCount = 0;

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      setUploadProgress({ current: i + 1, total: imageFiles.length });

      try {
        // 1. Upload ke /api/upload dengan type="gallery" (Sharp otomatis convert ke WebP ringan)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "gallery");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || "Gagal mengunggah gambar");
        }

        // 2. Simpan ke database wedding gallery
        const galleryRes = await fetch(`/api/wedding/${weddingId}/gallery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: uploadData.url,
            caption: file.name.replace(/\.[^/.]+$/, ""), // Nama file sebagai caption default (tanpa ekstensi)
            sortOrder: galleries.length + i + 1,
          }),
        });

        if (galleryRes.ok) {
          const created = await galleryRes.json();
          onAddGallery(created);
          successCount++;
        }
      } catch (err) {
        console.error("Gagal mengunggah foto:", err);
      }
    }

    setIsUploading(false);
    setUploadProgress(null);

    if (successCount > 0) {
      showNotification(`Berhasil mengunggah ${successCount} foto ke galeri (Otomatis WebP)!`);
    } else {
      setErrorMessage("Gagal mengunggah foto. Silakan periksa koneksi dan coba lagi.");
    }
  };

  // Simpan foto via URL manual
  const handleAddManualUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    setIsSavingManual(true);
    try {
      const res = await fetch(`/api/wedding/${weddingId}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: manualUrl.trim(),
          caption: manualCaption.trim(),
          sortOrder: galleries.length + 1,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        onAddGallery(created);
        setManualUrl("");
        setManualCaption("");
        setShowUrlForm(false);
        showNotification("Foto berhasil ditambahkan ke galeri!");
      }
    } catch {
      setErrorMessage("Gagal menyimpan foto via URL");
    } finally {
      setIsSavingManual(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Galeri Foto Pernikahan</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Foto-foto kenangan &amp; prewedding. Rasio foto asli tetap dipertahankan dan otomatis dikonversi ke format WebP ringan.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowUrlForm((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700 self-start sm:self-auto cursor-pointer"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>{showUrlForm ? "Tutup Input URL" : "+ Input via URL Luar"}</span>
        </button>
      </div>

      {/* Form Input Manual URL (Opsional/Collapsible) */}
      {showUrlForm && (
        <form
          onSubmit={handleAddManualUrl}
          className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 animate-in fade-in duration-200"
        >
          <h4 className="font-semibold text-slate-800 text-xs">Tambah Foto via URL Eksternal</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
            />
            <input
              type="text"
              placeholder="Keterangan foto (opsional)"
              value={manualCaption}
              onChange={(e) => setManualCaption(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={isSavingManual}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isSavingManual ? "Menyimpan..." : "Simpan Foto URL"}</span>
          </button>
        </form>
      )}

      {/* Hidden Multi-file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Multi-upload Dropzone */}
      <div
        onClick={handleTriggerSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          isDragging
            ? "border-emerald-500 bg-emerald-50/60 scale-[1.01]"
            : "border-slate-300 hover:border-emerald-500 hover:bg-slate-50/70 bg-white"
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2.5 py-2">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-800">
              Mengunggah &amp; Mengoptimalkan Foto {uploadProgress?.current} dari {uploadProgress?.total}...
            </p>
            <p className="text-xs text-slate-500">
              Otomatis dikonversi ke format WebP super ringan &amp; hemat kuota tamu
            </p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-900">
              Klik atau Tarik Foto Galeri ke Sini (Bisa Pilih Banyak)
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              Pilih satu atau sekaligus beberapa foto prewedding. Foto akan dipertahankan rasio aslinya dan dikonversi ke WebP otomatis.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 text-[11px] text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>JPG, PNG, WebP • Maks. 12 MB/foto</span>
            </div>
          </>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid Galeri yang Tersimpan */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">
            Daftar Foto Tersimpan ({galleries.length})
          </span>
        </div>

        {galleries.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-600">Belum ada foto di galeri</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Unggah foto prewedding Anda di atas</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {galleries.map((g) => (
              <div
                key={g.id}
                className="group relative aspect-4/3 rounded-xl border border-slate-200 overflow-hidden bg-slate-900 shadow-xs"
              >
                <img
                  src={g.imageUrl}
                  alt={g.caption || "Galeri"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay Action */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDeleteGallery(g.id)}
                      className="bg-black/60 hover:bg-rose-600 text-white p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {g.caption && (
                    <p className="text-white text-[11px] font-medium truncate drop-shadow">
                      {g.caption}
                    </p>
                  )}
                </div>

                {/* Badge WebP */}
                {g.imageUrl.endsWith(".webp") && (
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-emerald-600/90 text-white px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
                    WebP
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

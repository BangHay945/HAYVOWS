"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Crop,
  Loader2,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import ImageCropModal, { AspectRatioMode } from "./ImageCropModal";

interface ImageUploadDropzoneProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  type?: "couple" | "gallery" | "cover";
  enableCrop?: boolean;
  aspectRatio?: "square" | "free";
  defaultCropRatio?: AspectRatioMode;
}

export default function ImageUploadDropzone({
  value,
  onChange,
  label,
  type = "couple",
  enableCrop = true,
  defaultCropRatio,
}: ImageUploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cropModalSrc, setCropModalSrc] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value || "");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger file dialog
  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selected from file picker
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processSelectedFile(file);
    e.target.value = ""; // Reset agar bisa pilih file yang sama jika perlu
  };

  // Handle Drag & Drop
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    setErrorMessage("");

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Berkas harus berupa gambar (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar melebihi batas maksimal 12 MB.");
      return;
    }

    if (enableCrop) {
      // Buka modal crop 1:1
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropModalSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Upload langsung tanpa crop
      uploadBlob(file, file.name);
    }
  };

  // Upload cropped blob ke API /api/upload
  const uploadBlob = async (blob: Blob | File, filename = "photo.webp") => {
    setIsUploading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", blob, filename);
      formData.append("type", type);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah gambar");
      }

      onChange(data.url);
      setUrlInput(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat upload";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    setCropModalSrc(null);
    uploadBlob(croppedBlob, "cropped-photo.webp");
  };

  const handleRemovePhoto = () => {
    onChange("");
    setUrlInput("");
    setErrorMessage("");
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700">{label}</label>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
            <button
              type="button"
              onClick={() => setInputMode("upload")}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                inputMode === "upload"
                  ? "bg-white text-emerald-800 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Upload &amp; Crop
            </button>
            <button
              type="button"
              onClick={() => setInputMode("url")}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                inputMode === "url"
                  ? "bg-white text-emerald-800 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Input URL
            </button>
          </div>
        </div>
      )}

      {/* Input Mode: Input URL Manual */}
      {inputMode === "url" ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0"
            >
              Gunakan
            </button>
          </div>
          {value && (
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
              <img
                src={value}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-lg border border-slate-300 bg-white shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 truncate">{value}</p>
                <p className="text-[11px] text-slate-500">URL Eksternal</p>
              </div>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Input Mode: Upload File dengan Crop 1:1 */
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {value ? (
            /* State: Ada Gambar Aktif */
            <div className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 border-emerald-500/80 shadow-xs bg-slate-900 group">
                <img src={value} alt="Preview Foto" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[9px] text-white font-bold uppercase tracking-wider">Crop</span>
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    WebP Siap Pakai
                  </span>
                </div>
                <p className="text-xs text-slate-600 truncate">{value}</p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSelectClick}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>Ganti / Crop Baru</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* State: Belum Ada Foto (Dropzone Area) */
            <div
              onClick={handleSelectClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50/50 scale-[1.01]"
                  : "border-slate-300 hover:border-emerald-500 hover:bg-slate-50/60 bg-white"
              }`}
            >
              {isUploading ? (
                <div className="py-2 flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                  <p className="text-xs font-semibold text-slate-700">
                    Memproses &amp; Mengompresi ke WebP...
                  </p>
                  <p className="text-[10px] text-slate-400">Harap tunggu sebentar</p>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Klik atau tarik foto ke sini
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mendukung Crop 1:1, 3:4, 16:9, atau Bebas Asli • Otomatis dikonversi ke WebP ringan
                  </p>
                  <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    <span>JPG, PNG, WebP (Maks. 12 MB)</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Loading Indicator jika sedang upload ulang */}
          {isUploading && value && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg mt-2">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>Mengunggah dan mengonversi ke format WebP ringan...</span>
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg mt-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Modal Crop Multi-Rasio jika user memilih gambar */}
      {cropModalSrc && (
        <ImageCropModal
          imageSrc={cropModalSrc}
          title={`Sesuaikan ${label || "Foto"}`}
          initialRatio={defaultCropRatio || (type === "cover" ? "3:4" : "1:1")}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropModalSrc(null)}
        />
      )}
    </div>
  );
}

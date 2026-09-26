"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  X,
  Move,
  Square,
  RectangleVertical,
  RectangleHorizontal,
  Maximize2,
  Sparkles,
} from "lucide-react";

export type AspectRatioMode = "1:1" | "3:4" | "16:9" | "free";

interface ImageCropModalProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  title?: string;
  initialRatio?: AspectRatioMode;
}

export function getCropDimensions(mode: AspectRatioMode) {
  switch (mode) {
    case "1:1":
      return { cropW: 250, cropH: 250, targetW: 800, targetH: 800 };
    case "3:4":
      return { cropW: 204, cropH: 272, targetW: 750, targetH: 1000 };
    case "16:9":
      return { cropW: 288, cropH: 162, targetW: 1280, targetH: 720 };
    case "free":
    default:
      return { cropW: 0, cropH: 0, targetW: 0, targetH: 0 };
  }
}

export default function ImageCropModal({
  imageSrc,
  onCropComplete,
  onCancel,
  title = "Sesuaikan & Crop Foto",
  initialRatio = "1:1",
}: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropMode, setCropMode] = useState<AspectRatioMode>(initialRatio);

  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Touch Pinch-to-zoom state
  const [pinchDist, setPinchDist] = useState<number | null>(null);
  const [pinchStartScale, setPinchStartScale] = useState<number>(1);

  // Ukuran kanvas workspace di layar (px)
  const CANVAS_SIZE = 320;

  // Batasi pergeseran foto agar tidak keluar dari bingkai crop
  const clampOffset = useCallback(
    (x: number, y: number, currentScale: number, mode: AspectRatioMode) => {
      if (!image || mode === "free") return { x: 0, y: 0 };
      const { cropW, cropH } = getCropDimensions(mode);
      const w = image.naturalWidth * currentScale;
      const h = image.naturalHeight * currentScale;
      const maxX = Math.max(0, (w - cropW) / 2);
      const maxY = Math.max(0, (h - cropH) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, x)),
        y: Math.min(maxY, Math.max(-maxY, y)),
      };
    },
    [image]
  );

  // Inisialisasi skala & posisi saat rasio berubah
  const applyRatioDimensions = useCallback(
    (img: HTMLImageElement, mode: AspectRatioMode) => {
      if (mode === "free") {
        const fitScale = Math.min(270 / img.naturalWidth, 270 / img.naturalHeight);
        setMinScale(fitScale);
        setScale(fitScale);
        setOffset({ x: 0, y: 0 });
      } else {
        const { cropW, cropH } = getCropDimensions(mode);
        const neededScale = Math.max(cropW / img.naturalWidth, cropH / img.naturalHeight);
        setMinScale(neededScale);
        setScale(neededScale);
        setOffset({ x: 0, y: 0 });
      }
    },
    []
  );

  // Muat gambar pertama kali
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      setImage(img);
      applyRatioDimensions(img, cropMode);
    };
  }, [imageSrc, cropMode, applyRatioDimensions]);

  // Ganti rasio crop (1:1, 3:4, 16:9, free)
  const handleRatioChange = (newRatio: AspectRatioMode) => {
    setCropMode(newRatio);
    if (image) {
      applyRatioDimensions(image, newRatio);
    }
  };

  // Ubah skala zoom dengan perlindungan clamping
  const handleScaleChange = (newScale: number) => {
    const clampedScale = Math.min(Math.max(newScale, minScale * 0.8), minScale * 4);
    setScale(clampedScale);
    setOffset((prev) => clampOffset(prev.x, prev.y, clampedScale, cropMode));
  };

  // Gambar ulang kanvas setiap ada perubahan posisi atau zoom
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Bersihkan
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;

    // 1. Gambar latar belakang gambar yang di-zoom dan di-pan
    ctx.save();
    ctx.translate(centerX + offset.x, centerY + offset.y);
    ctx.scale(scale, scale);
    ctx.drawImage(
      image,
      -image.naturalWidth / 2,
      -image.naturalHeight / 2,
      image.naturalWidth,
      image.naturalHeight
    );
    ctx.restore();

    // 2. Mode Crop (1:1, 3:4, 16:9) vs Mode Bebas (free)
    if (cropMode !== "free") {
      const { cropW, cropH } = getCropDimensions(cropMode);
      const cropX = (CANVAS_SIZE - cropW) / 2;
      const cropY = (CANVAS_SIZE - cropH) / 2;

      // Overlay gelap di luar kotak crop
      ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
      // Atas
      ctx.fillRect(0, 0, CANVAS_SIZE, cropY);
      // Bawah
      ctx.fillRect(0, cropY + cropH, CANVAS_SIZE, CANVAS_SIZE - (cropY + cropH));
      // Kiri
      ctx.fillRect(0, cropY, cropX, cropH);
      // Kanan
      ctx.fillRect(cropX + cropW, cropY, CANVAS_SIZE - (cropX + cropW), cropH);

      // Border kotak crop
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cropX, cropY, cropW, cropH);

      // Garis bantu Rule of Thirds
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Vertikal
      ctx.moveTo(cropX + cropW / 3, cropY);
      ctx.lineTo(cropX + cropW / 3, cropY + cropH);
      ctx.moveTo(cropX + (cropW * 2) / 3, cropY);
      ctx.lineTo(cropX + (cropW * 2) / 3, cropY + cropH);
      // Horizontal
      ctx.moveTo(cropX, cropY + cropH / 3);
      ctx.lineTo(cropX + cropW, cropY + cropH / 3);
      ctx.moveTo(cropX, cropY + (cropH * 2) / 3);
      ctx.lineTo(cropX + cropW, cropY + (cropH * 2) / 3);
      ctx.stroke();

      // Siku penanda sudut (Corner brackets emerald)
      const bracketLen = 14;
      ctx.strokeStyle = "#10b981"; // Emerald-500
      ctx.lineWidth = 3;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(cropX, cropY + bracketLen);
      ctx.lineTo(cropX, cropY);
      ctx.lineTo(cropX + bracketLen, cropY);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(cropX + cropW - bracketLen, cropY);
      ctx.lineTo(cropX + cropW, cropY);
      ctx.lineTo(cropX + cropW, cropY + bracketLen);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(cropX, cropY + cropH - bracketLen);
      ctx.lineTo(cropX, cropY + cropH);
      ctx.lineTo(cropX + bracketLen, cropY + cropH);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(cropX + cropW - bracketLen, cropY + cropH);
      ctx.lineTo(cropX + cropW, cropY + cropH);
      ctx.lineTo(cropX + cropW, cropY + cropH - bracketLen);
      ctx.stroke();
    } else {
      // Mode Bebas: Border aksen halus di sekeliling canvas
      ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, CANVAS_SIZE - 2, CANVAS_SIZE - 2);
    }
  }, [image, scale, offset, cropMode]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle Drag / Pan Mouse
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (cropMode === "free") return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || cropMode === "free") return;
    const rawX = e.clientX - dragStart.x;
    const rawY = e.clientY - dragStart.y;
    setOffset(clampOffset(rawX, rawY, scale, cropMode));
  };

  const handleMouseUp = () => setIsDragging(false);

  // Handle Drag & Pinch Touch di Layar HP
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (cropMode === "free") return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
      setPinchDist(null);
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setPinchDist(dist);
      setPinchStartScale(scale);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (cropMode === "free") return;
    if (e.touches.length === 1 && isDragging) {
      const rawX = e.touches[0].clientX - dragStart.x;
      const rawY = e.touches[0].clientY - dragStart.y;
      setOffset(clampOffset(rawX, rawY, scale, cropMode));
    } else if (e.touches.length === 2 && pinchDist !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / pinchDist;
      handleScaleChange(pinchStartScale * factor);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setPinchDist(null);
  };

  // Handle Wheel Zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (cropMode === "free") return;
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    handleScaleChange(scale * zoomFactor);
  };

  // Ekspor hasil crop resolusi tinggi ke Blob WebP
  const handleApplyCrop = () => {
    if (!image) return;

    const exportToBlob = (canvas: HTMLCanvasElement) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropComplete(blob);
          } else {
            // Fallback JPEG jika browser tidak mendukung toBlob webp
            canvas.toBlob((fallbackBlob) => {
              if (fallbackBlob) onCropComplete(fallbackBlob);
            }, "image/jpeg", 0.92);
          }
        },
        "image/webp",
        0.92
      );
    };

    if (cropMode === "free") {
      // Mode Bebas: Simpan seluruh gambar utuh tanpa dipotong
      const maxDim = 1600;
      let exportW = image.naturalWidth;
      let exportH = image.naturalHeight;
      if (exportW > maxDim || exportH > maxDim) {
        if (exportW >= exportH) {
          exportH = Math.round((exportH * maxDim) / exportW);
          exportW = maxDim;
        } else {
          exportW = Math.round((exportW * maxDim) / exportH);
          exportH = maxDim;
        }
      }

      const targetCanvas = document.createElement("canvas");
      targetCanvas.width = exportW;
      targetCanvas.height = exportH;
      const ctx = targetCanvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(image, 0, 0, exportW, exportH);
      exportToBlob(targetCanvas);
      return;
    }

    // Mode Aspect Ratio: 1:1, 3:4, atau 16:9
    const { cropW, cropH, targetW, targetH } = getCropDimensions(cropMode);
    const targetCanvas = document.createElement("canvas");
    targetCanvas.width = targetW;
    targetCanvas.height = targetH;
    const ctx = targetCanvas.getContext("2d");
    if (!ctx) return;

    const ratio = targetW / cropW;

    ctx.save();
    ctx.translate(targetW / 2, targetH / 2);
    ctx.scale(scale * ratio, scale * ratio);
    ctx.drawImage(
      image,
      -image.naturalWidth / 2 + offset.x / scale,
      -image.naturalHeight / 2 + offset.y / scale
    );
    ctx.restore();

    exportToBlob(targetCanvas);
  };

  const handleReset = () => {
    if (image) {
      applyRatioDimensions(image, cropMode);
    }
  };

  const RATIO_OPTIONS: {
    key: AspectRatioMode;
    label: string;
    sublabel: string;
    icon: React.ElementType;
  }[] = [
    {
      key: "1:1",
      label: "1:1",
      sublabel: "Persegi",
      icon: Square,
    },
    {
      key: "3:4",
      label: "3:4",
      sublabel: "Potret",
      icon: RectangleVertical,
    },
    {
      key: "16:9",
      label: "16:9",
      sublabel: "Lanskap",
      icon: RectangleHorizontal,
    },
    {
      key: "free",
      label: "Bebas",
      sublabel: "Asli",
      icon: Maximize2,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{title}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pilih rasio crop sesuai kebutuhan atau simpan foto secara utuh
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Aspect Ratio Switcher Tabs */}
        <div className="px-5 pt-3 pb-2 bg-slate-50/80 border-b border-slate-100">
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-200/70 rounded-xl">
            {RATIO_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = cropMode === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleRatioChange(opt.key)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-emerald-800 shadow-xs border border-emerald-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  <span className="leading-none">{opt.label}</span>
                  <span
                    className={`text-[10px] hidden sm:inline font-normal ${
                      isActive ? "text-emerald-700 font-medium" : "text-slate-400"
                    }`}
                  >
                    ({opt.sublabel})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ratio Description */}
          <div className="text-[11px] text-slate-600 text-center pt-2 flex items-center justify-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {cropMode === "1:1" && (
              <span>
                <strong>Rasio 1:1 (Persegi)</strong> • Pas untuk avatar profil mempelai &amp; thumbnail kotak
              </span>
            )}
            {cropMode === "3:4" && (
              <span>
                <strong>Rasio 3:4 (Potret)</strong> • Pas untuk foto berdua berdiri &amp; kartu mobile
              </span>
            )}
            {cropMode === "16:9" && (
              <span>
                <strong>Rasio 16:9 (Lanskap)</strong> • Pas untuk cover banner, landscape hero &amp; share link
              </span>
            )}
            {cropMode === "free" && (
              <span>
                <strong>Bebas / Asli</strong> • Menyimpan seluruh gambar utuh tanpa ada bagian terpotong
              </span>
            )}
          </div>
        </div>

        {/* Canvas Workspace */}
        <div className="p-4 sm:p-5 flex flex-col items-center justify-center bg-slate-900 select-none relative">
          <div className="relative rounded-lg overflow-hidden shadow-inner border border-slate-700 bg-slate-950">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              className={`block touch-none ${
                cropMode === "free"
                  ? "cursor-default"
                  : isDragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
              }`}
            />

            {/* Badge Mode Bebas */}
            {cropMode === "free" && (
              <div className="absolute top-2.5 left-2.5 pointer-events-none">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/90 text-white px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
                  <Sparkles className="w-3 h-3" />
                  Foto Utuh (100% Rasio Asli)
                </span>
              </div>
            )}
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
            {cropMode !== "free" ? (
              <>
                <Move className="w-3.5 h-3.5 text-emerald-400" />
                <span>Klik &amp; geser untuk memindahkan posisi foto</span>
              </>
            ) : (
              <span>Foto ditampilkan utuh dan akan disimpan dengan proporsi aslinya</span>
            )}
          </div>
        </div>

        {/* Controls: Zoom Slider & Reset */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200">
          {cropMode !== "free" ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleScaleChange(scale * 0.9)}
                className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-200/60 cursor-pointer"
                title="Perkecil"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input
                type="range"
                min={minScale}
                max={minScale * 3.5}
                step={(minScale * 2.5) / 100}
                value={scale}
                onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                className="flex-1 accent-emerald-600 h-1.5 bg-slate-300 rounded-lg cursor-pointer"
              />

              <button
                type="button"
                onClick={() => handleScaleChange(scale * 1.1)}
                className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-200/60 cursor-pointer"
                title="Perbesar"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200/60 transition-colors ml-1 cursor-pointer"
                title="Reset Posisi &amp; Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="text-center py-1 text-xs text-slate-600">
              💡 Seluruh bidang foto akan disimpan optimal dalam format WebP berkualitas tinggi.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2.5 bg-white">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan &amp; Simpan</span>
          </button>
        </div>
      </div>
    </div>
  );
}

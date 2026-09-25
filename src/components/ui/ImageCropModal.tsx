"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Check, X, Move } from "lucide-react";

interface ImageCropModalProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  title?: string;
}

export default function ImageCropModal({
  imageSrc,
  onCropComplete,
  onCancel,
  title = "Sesuaikan Foto (Crop 1:1)",
}: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Ukuran kanvas interaktif di layar (px)
  const CANVAS_SIZE = 340;
  // Ukuran kotak crop 1:1
  const CROP_SIZE = 280;

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      setImage(img);
      // Hitung skala minimum agar gambar selalu menutupi kotak crop 1:1
      const initialScale = Math.max(CROP_SIZE / img.naturalWidth, CROP_SIZE / img.naturalHeight);
      setMinScale(initialScale);
      setScale(initialScale);
      setOffset({ x: 0, y: 0 });
    };
  }, [imageSrc]);

  // Gambar ulang kanvas setiap ada perubahan posisi atau zoom
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Bersihkan
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // 1. Gambar latar belakang gambar yang di-zoom dan di-pan
    ctx.save();
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;

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

    // 2. Gambar overlay gelap di luar area crop 1:1
    const cropX = (CANVAS_SIZE - CROP_SIZE) / 2;
    const cropY = (CANVAS_SIZE - CROP_SIZE) / 2;

    ctx.fillStyle = "rgba(15, 23, 42, 0.65)"; // Slate-900 semi transparan

    // Atas
    ctx.fillRect(0, 0, CANVAS_SIZE, cropY);
    // Bawah
    ctx.fillRect(0, cropY + CROP_SIZE, CANVAS_SIZE, cropY);
    // Kiri
    ctx.fillRect(0, cropY, cropX, CROP_SIZE);
    // Kanan
    ctx.fillRect(cropX + CROP_SIZE, cropY, cropX, CROP_SIZE);

    // 3. Border kotak crop & Grid garis bantu Rule of Thirds
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, CROP_SIZE, CROP_SIZE);

    // Garis bantu tipis
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;
    // Vertikal
    ctx.beginPath();
    ctx.moveTo(cropX + CROP_SIZE / 3, cropY);
    ctx.lineTo(cropX + CROP_SIZE / 3, cropY + CROP_SIZE);
    ctx.moveTo(cropX + (CROP_SIZE * 2) / 3, cropY);
    ctx.lineTo(cropX + (CROP_SIZE * 2) / 3, cropY + CROP_SIZE);
    // Horizontal
    ctx.moveTo(cropX, cropY + CROP_SIZE / 3);
    ctx.lineTo(cropX + CROP_SIZE, cropY + CROP_SIZE / 3);
    ctx.moveTo(cropX, cropY + (CROP_SIZE * 2) / 3);
    ctx.lineTo(cropX + CROP_SIZE, cropY + (CROP_SIZE * 2) / 3);
    ctx.stroke();

    // 4. Siku penanda sudut (Corner brackets)
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
    ctx.moveTo(cropX + CROP_SIZE - bracketLen, cropY);
    ctx.lineTo(cropX + CROP_SIZE, cropY);
    ctx.lineTo(cropX + CROP_SIZE, cropY + bracketLen);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(cropX, cropY + CROP_SIZE - bracketLen);
    ctx.lineTo(cropX, cropY + CROP_SIZE);
    ctx.lineTo(cropX + bracketLen, cropY + CROP_SIZE);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(cropX + CROP_SIZE - bracketLen, cropY + CROP_SIZE);
    ctx.lineTo(cropX + CROP_SIZE, cropY + CROP_SIZE);
    ctx.lineTo(cropX + CROP_SIZE, cropY + CROP_SIZE - bracketLen);
    ctx.stroke();
  }, [image, scale, offset]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle Drag / Pan Mouse
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Handle Drag / Pan Touch di Layar HP
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Handle Wheel Zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setScale((prev) => {
      const next = prev * zoomFactor;
      return Math.min(Math.max(next, minScale * 0.8), minScale * 4);
    });
  };

  // Ekspor hasil crop
  const handleApplyCrop = () => {
    if (!image) return;

    // Canvas target berukuran resolusi tinggi 600x600 px
    const targetSize = 600;
    const targetCanvas = document.createElement("canvas");
    targetCanvas.width = targetSize;
    targetCanvas.height = targetSize;
    const ctx = targetCanvas.getContext("2d");
    if (!ctx) return;

    // Transformasi balik: dari koordinat layar ke koordinat gambar asli
    // Di layar: posisi (CANVAS_SIZE/2 + offset.x, CANVAS_SIZE/2 + offset.y) adalah pusat gambar
    // Kotak crop berpusat di (CANVAS_SIZE/2, CANVAS_SIZE/2) dengan lebar CROP_SIZE
    const ratio = targetSize / CROP_SIZE;

    ctx.save();
    // Pindahkan origin ke tengah kanvas target
    ctx.translate(targetSize / 2, targetSize / 2);
    // Terapkan translasi offset dan skala
    ctx.scale(scale * ratio, scale * ratio);
    ctx.drawImage(
      image,
      -image.naturalWidth / 2 + (offset.x / scale),
      -image.naturalHeight / 2 + (offset.y / scale)
    );
    ctx.restore();

    targetCanvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
        }
      },
      "image/jpeg",
      0.95
    );
  };

  const handleReset = () => {
    setScale(minScale);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Geser dan sesuaikan posisi wajah agar pas di tengah avatar 1:1
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Workspace */}
        <div className="p-5 flex flex-col items-center justify-center bg-slate-900 select-none relative">
          <div className="relative rounded-lg overflow-hidden shadow-inner border border-slate-700">
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
              className={`cursor-grab active:cursor-grabbing block touch-none ${
                isDragging ? "cursor-grabbing" : ""
              }`}
            />
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <Move className="w-3.5 h-3.5" />
            <span>Klik &amp; geser untuk memindahkan posisi foto</span>
          </div>
        </div>

        {/* Controls: Zoom Slider & Reset */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 space-y-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setScale((prev) => Math.max(prev * 0.9, minScale * 0.7))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-200/60"
              title="Perkecil"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <input
              type="range"
              min={minScale * 0.8}
              max={minScale * 3.5}
              step={(minScale * 2.7) / 100}
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="flex-1 accent-emerald-600 h-1.5 bg-slate-300 rounded-lg cursor-pointer"
            />

            <button
              type="button"
              onClick={() => setScale((prev) => Math.min(prev * 1.1, minScale * 3.5))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-200/60"
              title="Perbesar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200/60 transition-colors ml-1"
              title="Reset Posisi & Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2.5 bg-white">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan &amp; Simpan</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import sharp from "sharp";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12 MB max raw input

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "gallery";

    if (!file) {
      return NextResponse.json({ error: "Berkas tidak ditemukan" }, { status: 400 });
    }

    // Validate mime type
    if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Format berkas tidak didukung. Harap upload gambar (JPG, PNG, WebP, GIF)." },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran berkas terlalu besar. Maksimal 12 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = (type === "couple" || type === "cover") ? "couples" : "gallery";
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

    await fs.mkdir(uploadDir, { recursive: true });

    const fileId = crypto.randomUUID();
    const filename = `${fileId}.webp`;
    const targetFilePath = path.join(uploadDir, filename);

    let processedBuffer: Buffer;

    if (type === "couple") {
      // Foto profil mempelai: Max 800x800px, WebP Q85 (mempertahankan rasio framing pilihan user)
      processedBuffer = await sharp(buffer)
        .rotate() // Auto-rotate berdasarkan EXIF orientasi kamera HP
        .resize(800, 800, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toBuffer();
    } else if (type === "cover") {
      // Foto cover/hero resolusi tinggi: Pertahankan rasio asli (portrait/landscape), max 1920x1920px, WebP Q85
      processedBuffer = await sharp(buffer)
        .rotate()
        .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toBuffer();
    } else {
      // Foto galeri: Pertahankan rasio asli, max 1280x1280px, WebP Q82
      processedBuffer = await sharp(buffer)
        .rotate() // Auto-rotate berdasarkan EXIF
        .resize(1280, 1280, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toBuffer();
    }

    await fs.writeFile(targetFilePath, processedBuffer);

    const publicUrl = `/uploads/${folder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: processedBuffer.length,
    });
  } catch (error) {
    console.error("[UPLOAD_ERROR]", error);
    return NextResponse.json(
      { error: "Gagal memproses dan mengunggah gambar. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

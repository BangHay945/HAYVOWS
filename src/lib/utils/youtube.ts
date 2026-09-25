/**
 * Utilitas untuk memproses dan mendeteksi tautan YouTube
 */

/**
 * Mengekstrak 11-karakter YouTube Video ID dari berbagai variasi URL YouTube.
 * Mendukung format:
 * - https://www.youtube.com/watch?v=ID
 * - https://youtu.be/ID
 * - https://music.youtube.com/watch?v=ID
 * - https://www.youtube.com/embed/ID
 * - https://www.youtube.com/shorts/ID
 * - https://www.youtube.com/live/ID
 */
export function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();
  // Pola regex komprehensif untuk YouTube video ID (11 karakter alfanumerik, dash, underscore)
  const regExp = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/;
  const match = trimmed.match(regExp);

  if (match && match[1]) {
    return match[1];
  }

  // Jika input kebetulan sudah berupa 11-char ID murni
  if (/^[\w-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Memeriksa apakah sebuah string merupakan URL YouTube yang valid
 */
export function isYouTubeUrl(url: string | null | undefined): boolean {
  return extractYouTubeId(url) !== null;
}

/**
 * Mendapatkan URL thumbnail YouTube dari URL atau Video ID
 */
export function getYouTubeThumbnail(videoIdOrUrl: string): string | null {
  const id = extractYouTubeId(videoIdOrUrl);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

/**
 * Mendapatkan URL embed YouTube siap pakai untuk iframe preview
 */
export function getYouTubeEmbedUrl(videoIdOrUrl: string, autoplay = false): string | null {
  const id = extractYouTubeId(videoIdOrUrl);
  if (!id) return null;
  const autoParam = autoplay ? "1" : "0";
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=${autoParam}&enablejsapi=1&rel=0&playsinline=1`;
}

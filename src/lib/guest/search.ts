/**
 * Smart Search Engine for Wedding Guests
 * Designed for lightning-fast, highly-tolerant reception check-in.
 * 
 * Features:
 * 1. Multi-word search in any order (e.g., "Santoso Budi" matches "Bpk. Budi Santoso")
 * 2. Indonesian Honorifics & Title filtering (Bpk, Ibu, Dr, Haji, Ir, Keluarga, dll)
 * 3. Indonesian Phonetic & Spelling Variations (oe->u, dj->j, tj->c, ch/kh->k, sy/sh->s, f/v/p, dll)
 * 4. Fuzzy Levenshtein Typo Tolerance (e.g., "Budy" -> "Budi", "Farahn" -> "Farhan")
 * 5. Normalized Phone & Table Number matching
 * 6. Relevance Scoring & Priority for Unchecked-in guests
 */

export interface GuestSearchItem {
  id: string;
  name: string;
  slug: string;
  phone?: string | null;
  address?: string | null;
  category?: string | null;
  guestCount?: number | null;
  tableNumber?: string | null;
  sessionName?: string | null;
  qrCode?: string | null;
  checkedIn: boolean;
  checkedInAt?: Date | string | null;
  checkedInPax?: number | null;
  souvenirTaken?: boolean | null;
  checkInNotes?: string | null;
}

export interface SmartSearchResult<T extends GuestSearchItem = GuestSearchItem> {
  guest: T;
  score: number;
  matchReason: string;
  matchedTokens: string[];
}

// Common Indonesian honorifics and titles
const HONORIFICS = new Set([
  "bpk",
  "bapak",
  "pak",
  "ibu",
  "bu",
  "dr",
  "drg",
  "dokter",
  "prof",
  "ir",
  "drs",
  "dra",
  "sh",
  "se",
  "st",
  "skom",
  "haji",
  "hajjah",
  "h",
  "hj",
  "sdr",
  "sdri",
  "saudara",
  "saudari",
  "keluarga",
  "kel",
  "family",
  "ustadz",
  "ustadzah",
  "ust",
  "kyai",
  "gus",
  "tuan",
  "nyonya",
  "mr",
  "mrs",
  "ms",
  "om",
  "tante",
  "kak",
  "kakak",
  "mas",
  "mbak",
  "dek",
  "adik",
  "dan",
  "&",
  "partner",
  "beserta",
  "rekan",
  "alumni",
  "sahabat",
]);

/**
 * Clean & normalize text for uniform comparison
 */
export function normalizeSearchString(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s]/g, " ")   // punctuation to space
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Remove honorific words to isolate the core name
 */
export function stripHonorifics(text: string): string {
  const words = normalizeSearchString(text).split(" ");
  const filtered = words.filter((w) => !HONORIFICS.has(w) && w.length > 0);
  return filtered.length > 0 ? filtered.join(" ") : words.join(" ");
}

/**
 * Transform text into Indonesian phonetic key (handles old spelling & interchangeable letters)
 */
export function phoneticKey(text: string): string {
  let s = normalizeSearchString(text);
  if (!s) return "";

  // Old Indonesian spelling
  s = s.replace(/oe/g, "u");
  s = s.replace(/dj/g, "j");
  s = s.replace(/tj/g, "c");
  s = s.replace(/ch/g, "k");
  s = s.replace(/kh/g, "k");
  s = s.replace(/sh/g, "s");
  s = s.replace(/sy/g, "s");
  s = s.replace(/dh/g, "d");
  s = s.replace(/th/g, "t");
  s = s.replace(/ph/g, "f");
  s = s.replace(/v/g, "f");
  s = s.replace(/y/g, "i");
  s = s.replace(/z/g, "s");

  // Collapse consecutive identical letters
  s = s.replace(/(.)\1+/g, "$1");
  return s;
}

/**
 * Standardize phone number for Indonesian prefix comparison
 */
export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) {
    digits = "0" + digits.slice(2);
  }
  return digits;
}

/**
 * Standard Levenshtein distance algorithm
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Check if a single query token matches a target word
 */
function testTokenMatch(
  qTok: string,
  targetWord: string
): { isMatch: boolean; weight: number; isFuzzy: boolean } {
  if (!qTok || !targetWord) return { isMatch: false, weight: 0, isFuzzy: false };

  // 1. Exact match
  if (targetWord === qTok) {
    return { isMatch: true, weight: 1.0, isFuzzy: false };
  }

  // 2. Prefix match (e.g. "bud" matches "budi")
  if (targetWord.startsWith(qTok)) {
    return { isMatch: true, weight: 0.9, isFuzzy: false };
  }

  // 3. Substring match
  if (targetWord.includes(qTok)) {
    return { isMatch: true, weight: 0.8, isFuzzy: false };
  }

  // 4. Phonetic match (e.g. "djoko" vs "joko", "rachmat" vs "rahmat")
  const pQ = phoneticKey(qTok);
  const pT = phoneticKey(targetWord);
  if (pQ && pT && (pT === pQ || pT.startsWith(pQ))) {
    return { isMatch: true, weight: 0.85, isFuzzy: true };
  }

  // 5. Typo tolerance (Levenshtein)
  // Only apply if token is at least 3 chars long
  if (qTok.length >= 3) {
    const lenDiff = Math.abs(targetWord.length - qTok.length);
    if (lenDiff <= 2) {
      const dist = levenshtein(qTok, targetWord);
      const maxAllowedDist = qTok.length <= 4 ? 1 : 2;
      if (dist <= maxAllowedDist) {
        return { isMatch: true, weight: 0.7 - dist * 0.1, isFuzzy: true };
      }
    }
  }

  return { isMatch: false, weight: 0, isFuzzy: false };
}

/**
 * Score a single guest against the search query
 */
export function scoreGuest<T extends GuestSearchItem>(
  guest: T,
  rawQuery: string
): SmartSearchResult<T> | null {
  const query = rawQuery.trim();
  if (!query) return null;

  const qNorm = normalizeSearchString(query);
  const qClean = stripHonorifics(query);
  const qTokens = qNorm.split(" ").filter(Boolean);
  const qCleanTokens = qClean.split(" ").filter(Boolean);

  if (qTokens.length === 0) return null;

  const matchedTokens: string[] = [];
  let score = 0;
  let matchReason = "";

  // ── 1. QR Code / Ticket Token / Slug / ID Check ──
  const rawQr = (guest.qrCode || "").toLowerCase();
  const rawSlug = (guest.slug || "").toLowerCase();
  const rawId = (guest.id || "").toLowerCase();
  const qLower = query.toLowerCase();

  if (rawQr && (rawQr === qLower || rawQr.includes(qLower) || qLower.includes(rawQr))) {
    return {
      guest,
      score: 100,
      matchReason: "Token QR",
      matchedTokens: [query],
    };
  }

  if (rawSlug && (rawSlug === qLower || rawSlug.replace(/-/g, " ") === qNorm)) {
    return {
      guest,
      score: 99,
      matchReason: "Slug Undangan",
      matchedTokens: [query],
    };
  }

  if (rawId && rawId === qLower) {
    return {
      guest,
      score: 99,
      matchReason: "ID Tamu",
      matchedTokens: [query],
    };
  }

  // ── 2. Full Name Exact & Prefix Match ──
  const nameNorm = normalizeSearchString(guest.name);
  const nameClean = stripHonorifics(guest.name);
  const nameTokens = nameNorm.split(" ").filter(Boolean);
  const nameCleanTokens = nameClean.split(" ").filter(Boolean);

  if (nameNorm === qNorm) {
    return {
      guest,
      score: 98,
      matchReason: "Nama Persis",
      matchedTokens: [guest.name],
    };
  }

  if (nameClean && nameClean === qClean) {
    return {
      guest,
      score: 96,
      matchReason: "Nama Persis (Tanpa Gelar)",
      matchedTokens: [nameClean],
    };
  }

  if (nameNorm.startsWith(qNorm) || (nameClean && nameClean.startsWith(qClean))) {
    return {
      guest,
      score: 94,
      matchReason: "Awalan Nama",
      matchedTokens: [query],
    };
  }

  // ── 3. Token-based Multi-word Matching ──
  // Effective query tokens (prefer clean without honorifics if available)
  const activeQTokens = qCleanTokens.length > 0 ? qCleanTokens : qTokens;
  const activeNameTokens = nameCleanTokens.length > 0 ? nameCleanTokens : nameTokens;

  let allTokensMatched = true;
  let hasFuzzyWord = false;
  let totalTokenWeight = 0;

  for (const qTok of activeQTokens) {
    let bestMatchForToken = { isMatch: false, weight: 0, isFuzzy: false };

    for (const nTok of activeNameTokens) {
      const result = testTokenMatch(qTok, nTok);
      if (result.isMatch && result.weight > bestMatchForToken.weight) {
        bestMatchForToken = result;
      }
    }

    if (bestMatchForToken.isMatch) {
      matchedTokens.push(qTok);
      totalTokenWeight += bestMatchForToken.weight;
      if (bestMatchForToken.isFuzzy) {
        hasFuzzyWord = true;
      }
    } else {
      allTokensMatched = false;
    }
  }

  if (allTokensMatched && activeQTokens.length > 0) {
    const avgWeight = totalTokenWeight / activeQTokens.length;
    score = 80 + avgWeight * 12;
    matchReason = hasFuzzyWord ? "Mirip (Toleransi Ejaan)" : "Nama Cocok";
  } else if (matchedTokens.length > 0) {
    // Partial word match (e.g. 1 of 2 words matched)
    const ratio = matchedTokens.length / activeQTokens.length;
    if (ratio >= 0.5) {
      score = 45 + ratio * 20;
      matchReason = "Sebagian Nama Cocok";
    }
  }

  // ── 4. Phone Number Matching ──
  const digitsQuery = query.replace(/\D/g, "");
  if (digitsQuery.length >= 3 && guest.phone) {
    const cleanGuestPhone = cleanPhoneNumber(guest.phone);
    const cleanQPhone = cleanPhoneNumber(query);
    if (cleanGuestPhone) {
      if (cleanGuestPhone === cleanQPhone) {
        score = Math.max(score, 92);
        matchReason = "Nomor Telepon Persis";
        matchedTokens.push(guest.phone);
      } else if (cleanGuestPhone.includes(digitsQuery) || cleanGuestPhone.endsWith(digitsQuery)) {
        score = Math.max(score, 82);
        matchReason = "Nomor Telepon Cocok";
        matchedTokens.push(digitsQuery);
      }
    }
  }

  // ── 5. Table Number Matching (e.g. "Meja 5", "5", "VIP 1") ──
  if (guest.tableNumber) {
    const tableNorm = normalizeSearchString(guest.tableNumber);
    const queryWithoutTableWord = qNorm.replace(/\b(meja|table|t)\b/g, "").trim();
    if (tableNorm && (tableNorm === qNorm || tableNorm === queryWithoutTableWord)) {
      score = Math.max(score, 78);
      matchReason = `Meja ${guest.tableNumber}`;
      matchedTokens.push(guest.tableNumber);
    }
  }

  // ── 6. Address / Instansi / Category Matching ──
  const addressNorm = normalizeSearchString(guest.address || "");
  const categoryNorm = normalizeSearchString(guest.category || "");

  if (addressNorm && addressNorm.includes(qNorm)) {
    score = Math.max(score, 65);
    if (!matchReason) matchReason = `Alamat/Instansi: ${guest.address}`;
    matchedTokens.push(query);
  }

  if (categoryNorm && categoryNorm === qNorm) {
    score = Math.max(score, 60);
    if (!matchReason) matchReason = `Kategori: ${guest.category}`;
    matchedTokens.push(guest.category || "");
  }

  if (score < 40) {
    return null;
  }

  // Prioritize guests who haven't checked in yet (+3 bonus)
  if (!guest.checkedIn) {
    score += 3;
  }

  return {
    guest,
    score,
    matchReason: matchReason || "Pencocokan Cerdas",
    matchedTokens: Array.from(new Set(matchedTokens)),
  };
}

/**
 * Main Smart Search Function
 * Filters, scores, and ranks guests with high precision.
 */
export function searchSmartGuests<T extends GuestSearchItem>(
  allGuests: T[],
  rawQuery: string,
  options: { limit?: number; showRecentIfEmpty?: boolean } = {}
): SmartSearchResult<T>[] {
  const { limit = 15, showRecentIfEmpty = true } = options;
  const query = rawQuery.trim();

  // If query is empty, return default recent/uncheck-in guests
  if (!query) {
    if (!showRecentIfEmpty) return [];
    return allGuests
      .slice()
      .sort((a, b) => {
        // Unchecked-in first, then created/name
        if (a.checkedIn !== b.checkedIn) {
          return a.checkedIn ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
      })
      .slice(0, limit)
      .map((g) => ({
        guest: g,
        score: g.checkedIn ? 10 : 20,
        matchReason: g.checkedIn ? "Sudah Hadir" : "Daftar Tamu",
        matchedTokens: [],
      }));
  }

  const results: SmartSearchResult<T>[] = [];

  for (const guest of allGuests) {
    const scored = scoreGuest(guest, query);
    if (scored) {
      results.push(scored);
    }
  }

  // Sort descending by score, then unchecked-in first, then name
  results.sort((a, b) => {
    if (Math.abs(b.score - a.score) > 0.01) {
      return b.score - a.score;
    }
    if (a.guest.checkedIn !== b.guest.checkedIn) {
      return a.guest.checkedIn ? 1 : -1;
    }
    return a.guest.name.localeCompare(b.guest.name);
  });

  return results.slice(0, limit);
}

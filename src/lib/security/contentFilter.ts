/**
 * Hayvows Smart Content Moderation & Anti-Racism Security Filter
 *
 * Mendeteksi dan memblokir:
 * 1. Kata-kata rasis, ujaran kebencian, pelecehan SARA (etnis, ras, agama).
 * 2. Manipulasi kata terlarang menggunakan kombinasi angka & simbol (Leetspeak, misal: 4nj1ng, c1n4, n1gg3r, k0nt0l).
 * 3. Manipulasi pemisahan karakter / spasi / tanda baca (misal: a n j i n g, c.i.n.a, n_i_g_g_e_r).
 * 4. Manipulasi homoglyph Unicode (Cyrillic/Greek yang mirip huruf Latin).
 * 5. Manipulasi pengulangan huruf berlebihan (misal: annnjjjiinnggg).
 *
 * Didesain dengan presisi tinggi agar tidak memicu false positive pada kata-kata bahasa Indonesia yang sah
 * (seperti: asumsi, kasur, kancing, kontak, konten, kebajikan, titik, memekarkan).
 */

export interface FilterResult {
  isSafe: boolean;
  category?: "racism_sara" | "vulgar_profanity";
  flaggedWord?: string;
  reason?: string;
}

// ─────────────────────────────────────────────────────────────
// 1. DAFTAR KATA TERLARANG (BASE PATTERNS)
// ─────────────────────────────────────────────────────────────

// Kategori 1: Rasis, Pelecehan Etnis / Suku, dan Ujaran Kebencian SARA
const SARA_TERMS: string[] = [
  // Penghinaan Ras & Etnis
  "nigger",
  "nigga",
  "niggaz",
  "negro",
  "chink",
  "gook",
  "cino", // peyoratif rasis cina
  "chindo", // sering digunakan peyoratif rasis jika dalam konteks penghinaan
  "inlander",
  // Penghinaan Agama / SARA
  "antekyahudi",
  "yahudilaknat",
  "islamteroris",
  "terorisislam",
  "kristensesat",
  "sesatkafir",
  "kafirsesat",
  "monyetpapua",
  "papuamonyet",
  "kulithitambau",
  "hitambau",
  "cinababi",
  "bobicina",
  "cinakafir",
  "kafircina",
  "jawakuli",
];

// Kata-kata SARA yang membutuhkan pencocokan kata utuh (word boundary)
const SARA_STANDALONE_WORDS: string[] = [
  "nigger",
  "nigga",
  "negro",
  "chink",
  "gook",
  "cino",
];

// Kategori 2: Kata Kasar, Umpatan Vulgar, Pornografi, Hinaan Hewani Kasar
const PROFANITY_WORDS: string[] = [
  // Organ intim & seksual vulgar
  "kontol",
  "memek",
  "itil",
  "jembut",
  "pantek",
  "puki",
  "pukimak",
  "ngentot",
  "gentot",
  "pepek",
  "lonte",
  "perek",
  "pelacur",
  "bispak",
  "cuki",
  "kampang",
  // Hinaan hewan peyoratif
  "anjing",
  "asu",
  "babi",
  "bangsat",
  "bajingan",
  "brengsek",
  // Kata kasar Inggris umum
  "fuck",
  "fucking",
  "motherfucker",
  "bitch",
  "asshole",
  "cunt",
  "whore",
  "slut",
  "bastard",
  "faggot",
];

// Daftar Whitelist Kata Bahasa Indonesia Sah yang mengandung substring mirip kata kotor
const SAFE_INDONESIAN_WORDS: string[] = [
  "asumsi",
  "asuransi",
  "kasur",
  "masuk",
  "memasuki",
  "kemasukan",
  "pemasukan",
  "pengasuh",
  "asuhan",
  "mengasuh",
  "basuh",
  "membasuh",
  "asuh",
  "kancing",
  "pancing",
  "memancing",
  "terpancing",
  "pemancing",
  "anjing", // ini bukan safe, jangan masukkan anjing
  "kebajikan",
  "bajikan",
  "membicarakan",
  "pembicaraan",
  "bicara",
  "kontak",
  "mengontak",
  "konten",
  "kontes",
  "konteks",
  "kontras",
  "kontribusi",
  "titik",
  "titipan",
  "menitipkan",
  "memekarkan",
  "pemekaran",
  "mekar",
  "seksama",
  "seksama",
  "seksama",
];

// ─────────────────────────────────────────────────────────────
// 2. NORMALISASI HOMOGLYPH & LEETSPEAK
// ─────────────────────────────────────────────────────────────

// Peta Homoglyph Cyrillic & Greek ke Latin
const HOMOGLYPHS: Record<string, string> = {
  // Cyrillic
  а: "a",
  А: "a",
  в: "b",
  В: "b",
  е: "e",
  Е: "e",
  к: "k",
  К: "k",
  м: "m",
  М: "m",
  н: "h",
  Н: "h",
  о: "o",
  О: "o",
  р: "p",
  Р: "p",
  с: "c",
  С: "c",
  т: "t",
  Т: "t",
  у: "y",
  У: "y",
  х: "x",
  Х: "x",
  і: "i",
  І: "i",
  // Greek
  α: "a",
  Α: "a",
  β: "b",
  Β: "b",
  ε: "e",
  Ε: "e",
  ι: "i",
  Ι: "i",
  κ: "k",
  Κ: "k",
  ο: "o",
  Ο: "o",
  ρ: "p",
  Ρ: "p",
  τ: "t",
  Τ: "t",
  υ: "u",
  Υ: "u",
  χ: "x",
  Χ: "x",
};

/**
 * Mengubah karakter homoglyphs aksara lain ke karakter Latin standar
 */
function normalizeHomoglyphs(text: string): string {
  let result = "";
  for (const char of text) {
    result += HOMOGLYPHS[char] || char;
  }
  return result;
}

/**
 * Mengubah kombinasi angka dan simbol leetspeak ke huruf Latin
 */
function convertLeetspeak(text: string): string {
  return text
    // Angka leet umum
    .replace(/[@4^]/g, "a")
    .replace(/[8]/g, "b")
    .replace(/[3€]/g, "e")
    .replace(/[1!|]/g, "i")
    .replace(/[0]/g, "o")
    .replace(/[$5]/g, "s")
    .replace(/[7+]/g, "t")
    .replace(/[9]/g, "g")
    .replace(/[2]/g, "z")
    .replace(/\\\/\\\/|vv/g, "w")
    .replace(/\\\//g, "v");
}

/**
 * Mereduksi huruf berulang berturut-turut lebih dari 2 kali
 * misal: 'annnnjjjiiing' -> 'anjing', 'baaaabbbiiii' -> 'babi'
 */
function collapseRepeatedChars(text: string): string {
  return text.replace(/(.)\1{2,}/g, "$1");
}

/**
 * Menghapus spasi dan semua karakter pemisah tanda baca
 * misal: 'a.n.j.i.n.g' -> 'anjing', 'c - i - n - a' -> 'cina'
 */
function stripAllDelimiters(text: string): string {
  return text.replace(/[\s\-_.,/\\*#+~|'"^`!@$%&=;:<>?()[\]{}]+/g, "");
}

// ─────────────────────────────────────────────────────────────
// 3. MESIN VALIDASI UTAMA (SMART CONTENT FILTER)
// ─────────────────────────────────────────────────────────────

/**
 * Memeriksa apakah teks ucapan aman dari rasisme, SARA, dan kata-kata kotor
 */
export function validateGuestMessage(rawMessage: string): FilterResult {
  if (!rawMessage || typeof rawMessage !== "string") {
    return { isSafe: true };
  }

  // 1. Pra-pemrosesan: Unicode normalization & lowercasing
  const normalizedBase = normalizeHomoglyphs(
    rawMessage
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "") // Hapus tanda aksen diakritik
      .toLowerCase()
      .trim()
  );

  // 2. Buat berbagai representasi varian teks untuk mendeteksi berbagai teknik bypass
  const leetDecoded = convertLeetspeak(normalizedBase);
  const collapsedText = collapseRepeatedChars(leetDecoded);
  const compactText = stripAllDelimiters(collapsedText);

  // Array representasi teks yang akan diinspeksi
  const textVariants = [
    normalizedBase,
    leetDecoded,
    collapsedText,
  ];

  // ─────────────────────────────────────────────────────────────
  // A. DETEKSI KATEGORI 1: RASISME & PELECEHAN SARA
  // ─────────────────────────────────────────────────────────────

  // Cek pada teks yang dikompresi (menghalangi 'n.i.g.g.e.r', 'c i n o', 'monyet papua', dsb.)
  for (const term of SARA_TERMS) {
    if (compactText.includes(term)) {
      return {
        isSafe: false,
        category: "racism_sara",
        flaggedWord: term,
        reason:
          "Pesan mengandung ujaran atau istilah yang bernuansa rasisme/SARA. Mohon gunakan kata-kata yang santun dan penuh berkah untuk mendoakan kedua mempelai.",
      };
    }
  }

  // Cek kata SARA per-kata (word boundary) pada setiap varian teks
  for (const variant of textVariants) {
    const words = variant.split(/[\s,.;:!?_/\-+*&|()]+/).filter(Boolean);
    for (const word of words) {
      const cleanWord = collapseRepeatedChars(word);
      if (SARA_STANDALONE_WORDS.includes(cleanWord)) {
        return {
          isSafe: false,
          category: "racism_sara",
          flaggedWord: cleanWord,
          reason:
            "Pesan mengandung kata bernuansa rasisme/SARA. Mohon gunakan kata-kata yang santun untuk mendoakan kedua mempelai.",
        };
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  // B. DETEKSI KATEGORI 2: KATA KASAR, VULGARITAS & UMPATAN
  // ─────────────────────────────────────────────────────────────

  // 1. Pengecekan per-kata (Word Boundary Matching)
  for (const variant of textVariants) {
    const words = variant.split(/[\s,.;:!?_/\-+*&|()]+/).filter(Boolean);
    for (const word of words) {
      const cleanWord = collapseRepeatedChars(word);

      // Cek apakah kata persis cocok dengan kata kotor
      if (PROFANITY_WORDS.includes(cleanWord)) {
        return {
          isSafe: false,
          category: "vulgar_profanity",
          flaggedWord: cleanWord,
          reason:
            "Pesan terdeteksi mengandung kata-kata yang tidak pantas atau tidak sopan. Mohon sampaikan ucapan doa restu dengan bahasa yang santun.",
        };
      }
    }
  }

  // 2. Pengecekan Obfuscation (misal: 'a.n.j.i.n.g', 'k_o_n_t_o_l', '4 n j 1 n g')
  // Mengecek apakah compactText mengandung kata kotor, dengan menjaga agar kata aman (safe words) tidak terblokir
  for (const profanity of PROFANITY_WORDS) {
    if (compactText.includes(profanity)) {
      // Periksa apakah kemunculan ini berasal dari kata yang aman (whitelist)
      const isFalsePositive = isWhitelisted(rawMessage, normalizedBase, profanity);
      if (!isFalsePositive) {
        return {
          isSafe: false,
          category: "vulgar_profanity",
          flaggedWord: profanity,
          reason:
            "Pesan mengandung kata-kata yang tidak pantas atau tidak sopan. Mohon sampaikan doa restu yang baik untuk kedua mempelai.",
        };
      }
    }
  }

  // Lolos semua sensor
  return { isSafe: true };
}

/**
 * Mengecek apakah kata tertentu terlindungi oleh kata sah (whitelist)
 */
function isWhitelisted(
  rawText: string,
  normalizedBase: string,
  matchedTerm: string
): boolean {
  // Kata-kata pendek seperti 'asu' sering ada di dalam 'asumsi', 'kasur', 'masuk'
  if (matchedTerm === "asu") {
    // Jika hanya 'asu' yang berdiri sendiri, maka itu bukan safe word
    const words = normalizedBase.split(/[\s,.;:!?_/\-+*&|()]+/).filter(Boolean);
    const hasStandaloneAsu = words.some((w) => collapseRepeatedChars(convertLeetspeak(w)) === "asu");
    if (hasStandaloneAsu) return false;

    // Cek apakah semua kemunculan 'asu' adalah bagian dari safe words
    const safeRegex = /\b(asumsi|asuransi|kasur|masuk|memasuki|kemasukan|pemasukan|pengasuh|asuhan|mengasuh|basuh|membasuh|asuh)\w*\b/gi;
    const strippedWithoutSafe = normalizedBase.replace(safeRegex, "");
    const compactWithoutSafe = stripAllDelimiters(collapseRepeatedChars(convertLeetspeak(strippedWithoutSafe)));
    return !compactWithoutSafe.includes("asu");
  }

  // Kata 'babi' vs 'membicarakan' / 'kebajikan'
  if (matchedTerm === "babi") {
    const words = normalizedBase.split(/[\s,.;:!?_/\-+*&|()]+/).filter(Boolean);
    const hasStandaloneBabi = words.some((w) => collapseRepeatedChars(convertLeetspeak(w)) === "babi");
    if (hasStandaloneBabi) return false;

    const safeRegex = /\b(kebajikan|bajikan|membicarakan|pembicaraan|bicara)\w*\b/gi;
    const strippedWithoutSafe = normalizedBase.replace(safeRegex, "");
    const compactWithoutSafe = stripAllDelimiters(collapseRepeatedChars(convertLeetspeak(strippedWithoutSafe)));
    return !compactWithoutSafe.includes("babi");
  }

  // Kata 'anjing' vs 'kancing' / 'pancing'
  if (matchedTerm === "anjing") {
    const safeRegex = /\b(kancing|pancing|memancing|terpancing|pemancing)\w*\b/gi;
    const strippedWithoutSafe = normalizedBase.replace(safeRegex, "");
    const compactWithoutSafe = stripAllDelimiters(collapseRepeatedChars(convertLeetspeak(strippedWithoutSafe)));
    return !compactWithoutSafe.includes("anjing");
  }

  // Kata 'kontol' vs 'kontak' / 'konten' / 'konteks' / 'kontes' / 'kontribusi'
  if (matchedTerm === "kontol") {
    const safeRegex = /\b(kontak|mengontak|konten|kontes|konteks|kontras|kontribusi)\w*\b/gi;
    const strippedWithoutSafe = normalizedBase.replace(safeRegex, "");
    const compactWithoutSafe = stripAllDelimiters(collapseRepeatedChars(convertLeetspeak(strippedWithoutSafe)));
    return !compactWithoutSafe.includes("kontol");
  }

  // Kata 'memek' vs 'memekarkan' / 'pemekaran'
  if (matchedTerm === "memek") {
    const safeRegex = /\b(memekarkan|pemekaran|mekar)\w*\b/gi;
    const strippedWithoutSafe = normalizedBase.replace(safeRegex, "");
    const compactWithoutSafe = stripAllDelimiters(collapseRepeatedChars(convertLeetspeak(strippedWithoutSafe)));
    return !compactWithoutSafe.includes("memek");
  }

  return false;
}

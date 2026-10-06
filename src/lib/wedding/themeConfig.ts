import type { ThemeConfig } from "@/types/wedding";

export interface ColorwayPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  accentDark: string;
  badge: string;
  gradient: string;
  ringColor: string;
}

export interface VeilPreset {
  id: "light" | "medium" | "deep";
  label: string;
  percentage: string;
  description: string;
  opacityClass: string;
  rgba: string;
}

export interface ResolvedThemeConfig {
  colorway: string;
  veilIntensity: "light" | "medium" | "deep";
  veilOpacityClass: string;
  veilRgba: string;
  fontPairing: "cormorant" | "playfair" | "cinzel";
  accentColor: string;
  accentSecondary: string;
  sections: {
    countdown: boolean;
    story: boolean;
    gallery: boolean;
    rsvp: boolean;
    messages: boolean;
    gift: boolean;
  };
}

// ── 1. CINEMATIC & EDITORIAL (The Wedding Journal & Cinematic Ivory) ──
export const CINEMATIC_COLORWAYS: readonly ColorwayPreset[] = [
  {
    id: "champagne",
    name: "Platinum Champagne",
    tagline: "Signature Luxury",
    description: "Nuansa emas sampanye lembut dan abadi. Standar emas kemewahan Hayvows.",
    accent: "#e8d5b5",
    accentDark: "#d4b886",
    badge: "bg-[#e8d5b5]/15 text-[#e8d5b5] border-[#e8d5b5]/30",
    gradient: "from-[#f5e8d3] via-[#e8d5b5] to-[#c7ab7c]",
    ringColor: "ring-[#e8d5b5]",
  },
  {
    id: "rose",
    name: "Rose Noir",
    tagline: "Poetic Romance",
    description: "Aksen dusty rose gold yang hangat, puitis, dan berkesan romantis mendalam.",
    accent: "#e0b0b8",
    accentDark: "#c88e99",
    badge: "bg-[#e0b0b8]/15 text-[#e0b0b8] border-[#e0b0b8]/30",
    gradient: "from-[#f7d6dc] via-[#e0b0b8] to-[#b87d89]",
    ringColor: "ring-[#e0b0b8]",
  },
  {
    id: "emerald",
    name: "Emerald Velvet",
    tagline: "Regal Botanical",
    description: "Nuansa hijau zamrud bangsawan yang tenang, sakral, dan menyatu dengan alam.",
    accent: "#a3c9a8",
    accentDark: "#7fa886",
    badge: "bg-[#a3c9a8]/15 text-[#a3c9a8] border-[#a3c9a8]/30",
    gradient: "from-[#c2e2c6] via-[#a3c9a8] to-[#5b8061]",
    ringColor: "ring-[#a3c9a8]",
  },
  {
    id: "slate",
    name: "Monochrome Slate",
    tagline: "Modern Architectural",
    description: "Aksen perak platinum minimalis, modern, bersih, dan berwibawa.",
    accent: "#d4d8de",
    accentDark: "#a0a6b0",
    badge: "bg-[#d4d8de]/15 text-[#d4d8de] border-[#d4d8de]/30",
    gradient: "from-[#ebeef2] via-[#d4d8de] to-[#8a919e]",
    ringColor: "ring-[#d4d8de]",
  },
] as const;

// ── 2. BATIK JAWA HERITAGE ──
export const BATIK_JAWA_COLORWAYS: readonly ColorwayPreset[] = [
  {
    id: "prada-emas",
    name: "Prada Emas Keraton",
    tagline: "Kraton Splendor",
    description: "Nuansa prada emas tembaga mewah khas busana pengantin ageng kraton Jawa.",
    accent: "#d4a853",
    accentDark: "#b8860b",
    badge: "bg-[#d4a853]/15 text-[#d4a853] border-[#d4a853]/30",
    gradient: "from-[#fae6b8] via-[#d4a853] to-[#aa802e]",
    ringColor: "ring-[#d4a853]",
  },
  {
    id: "sogan-klasik",
    name: "Sogan Klasik",
    tagline: "Langgeng & Sakral",
    description: "Nuansa cokelat kayu alami batik tulis sogan klasik yang sakral dan abadi.",
    accent: "#c89065",
    accentDark: "#8c532b",
    badge: "bg-[#c89065]/15 text-[#c89065] border-[#c89065]/30",
    gradient: "from-[#edd2be] via-[#c89065] to-[#8c532b]",
    ringColor: "ring-[#c89065]",
  },
  {
    id: "marun-sekar",
    name: "Marun Sekar Jagad",
    tagline: "Wibawa Priyayi",
    description: "Sentuhan merah saga dan terakota sekar jagad yang berwibawa dan hangat.",
    accent: "#b85244",
    accentDark: "#7c2d12",
    badge: "bg-[#b85244]/15 text-[#b85244] border-[#b85244]/30",
    gradient: "from-[#e8a399] via-[#b85244] to-[#7c2d12]",
    ringColor: "ring-[#b85244]",
  },
  {
    id: "krem-dluwang",
    name: "Krem Gading Dluwang",
    tagline: "Bersahaja & Anggun",
    description: "Warna kertas dluwang kuno dan kain mori gading yang teduh dan bersahaja.",
    accent: "#d9c9a0",
    accentDark: "#a89368",
    badge: "bg-[#d9c9a0]/15 text-[#d9c9a0] border-[#d9c9a0]/30",
    gradient: "from-[#f4eedf] via-[#d9c9a0] to-[#998357]",
    ringColor: "ring-[#d9c9a0]",
  },
] as const;

// ── 3. NATURE FLORAL ──
export const NATURE_FLORAL_COLORWAYS: readonly ColorwayPreset[] = [
  {
    id: "sage-forest",
    name: "Sage Forest",
    tagline: "Botanical Harmony",
    description: "Nuansa daun zaitun dan kanopi hutan pinus yang menyejukkan.",
    accent: "#5a7263",
    accentDark: "#2d4a3e",
    badge: "bg-[#5a7263]/15 text-[#5a7263] border-[#5a7263]/30",
    gradient: "from-[#a8beaf] via-[#5a7263] to-[#2d4a3e]",
    ringColor: "ring-[#5a7263]",
  },
  {
    id: "warm-terracotta",
    name: "Warm Terracotta",
    tagline: "Earthy Warmth",
    description: "Aksen tembikar tanah liat dan bunga matahari kering yang hangat.",
    accent: "#d48b72",
    accentDark: "#a0563f",
    badge: "bg-[#d48b72]/15 text-[#d48b72] border-[#d48b72]/30",
    gradient: "from-[#f5c7b8] via-[#d48b72] to-[#9a4b33]",
    ringColor: "ring-[#d48b72]",
  },
  {
    id: "blush-blossom",
    name: "Blush Blossom",
    tagline: "Petal Elegance",
    description: "Nuansa merah muda kelopak mawar kuncup yang manis dan anggun.",
    accent: "#d8a499",
    accentDark: "#ad6d62",
    badge: "bg-[#d8a499]/15 text-[#d8a499] border-[#d8a499]/30",
    gradient: "from-[#fae0db] via-[#d8a499] to-[#ad6d62]",
    ringColor: "ring-[#d8a499]",
  },
  {
    id: "golden-petal",
    name: "Golden Petal",
    tagline: "Sunlit Flora",
    description: "Warna emas madu dan serbuk sari bunga di bawah sinar mentari pagi.",
    accent: "#c5a880",
    accentDark: "#987b53",
    badge: "bg-[#c5a880]/15 text-[#c5a880] border-[#c5a880]/30",
    gradient: "from-[#ede0ce] via-[#c5a880] to-[#8c6e44]",
    ringColor: "ring-[#c5a880]",
  },
] as const;

// ── 4. ROYAL EMERALD & GOLD ──
export const ROYAL_EMERALD_COLORWAYS: readonly ColorwayPreset[] = [
  {
    id: "royal-gold",
    name: "Royal Gold",
    tagline: "Imperial Majesty",
    description: "Aksen emas murni 24 karat khas istana kerajaan megah.",
    accent: "#d4af37",
    accentDark: "#aa820a",
    badge: "bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]/30",
    gradient: "from-[#f7e8b6] via-[#d4af37] to-[#8f6e07]",
    ringColor: "ring-[#d4af37]",
  },
  {
    id: "velvet-rose",
    name: "Velvet Rose",
    tagline: "Palace Romance",
    description: "Nuansa beludru mawar merah muda yang romantis dan berkelas.",
    accent: "#e0a6b2",
    accentDark: "#b8687a",
    badge: "bg-[#e0a6b2]/15 text-[#e0a6b2] border-[#e0a6b2]/30",
    gradient: "from-[#fae1e6] via-[#e0a6b2] to-[#a34f62]",
    ringColor: "ring-[#e0a6b2]",
  },
  {
    id: "midnight-sapphire",
    name: "Midnight Sapphire",
    tagline: "Aristocratic Blue",
    description: "Kilau batu permata safir malam biru tua yang sakral dan anggun.",
    accent: "#7ba5e8",
    accentDark: "#3b6ebb",
    badge: "bg-[#7ba5e8]/15 text-[#7ba5e8] border-[#7ba5e8]/30",
    gradient: "from-[#cfe0fc] via-[#7ba5e8] to-[#29569b]",
    ringColor: "ring-[#7ba5e8]",
  },
  {
    id: "platinum-silver",
    name: "Platinum Silver",
    tagline: "Regal Sterling",
    description: "Kemilau perak mahkota bangsawan yang bersih dan berwibawa.",
    accent: "#d1d5db",
    accentDark: "#9ca3af",
    badge: "bg-[#d1d5db]/15 text-[#d1d5db] border-[#d1d5db]/30",
    gradient: "from-[#f3f4f6] via-[#d1d5db] to-[#6b7280]",
    ringColor: "ring-[#d1d5db]",
  },
] as const;

// ── 5. ETERNAL NOIR ──
export const ETERNAL_NOIR_COLORWAYS: readonly ColorwayPreset[] = [
  {
    id: "imperial-gold",
    name: "Imperial Gold",
    tagline: "Golden Velvet",
    description: "Aksen foil emas mewah berlatar hitam pekat dramatis.",
    accent: "#c9a84c",
    accentDark: "#9e7e2e",
    badge: "bg-[#c9a84c]/15 text-[#c9a84c] border-[#c9a84c]/30",
    gradient: "from-[#f5e6b8] via-[#c9a84c] to-[#7a5e19]",
    ringColor: "ring-[#c9a84c]",
  },
  {
    id: "silver-moonlight",
    name: "Silver Moonlight",
    tagline: "Nocturne Silver",
    description: "Cahaya perak rembulan yang tajam dan futuristik di tengah kegelapan.",
    accent: "#e2e8f0",
    accentDark: "#94a3b8",
    badge: "bg-[#e2e8f0]/15 text-[#e2e8f0] border-[#e2e8f0]/30",
    gradient: "from-[#ffffff] via-[#e2e8f0] to-[#64748b]",
    ringColor: "ring-[#e2e8f0]",
  },
  {
    id: "champagne-ivory",
    name: "Champagne Ivory",
    tagline: "Timeless Contrast",
    description: "Kontras lembut antara hitam malam dan krem gading sampanye.",
    accent: "#e8d5b5",
    accentDark: "#c4ab84",
    badge: "bg-[#e8d5b5]/15 text-[#e8d5b5] border-[#e8d5b5]/30",
    gradient: "from-[#f8eee0] via-[#e8d5b5] to-[#997f59]",
    ringColor: "ring-[#e8d5b5]",
  },
  {
    id: "crimson-noir",
    name: "Crimson Noir",
    tagline: "Deep Passion",
    description: "Nuansa merah anggur beludru yang misterius dan memikat.",
    accent: "#cf5c6a",
    accentDark: "#9e2a38",
    badge: "bg-[#cf5c6a]/15 text-[#cf5c6a] border-[#cf5c6a]/30",
    gradient: "from-[#f8cbd1] via-[#cf5c6a] to-[#7a1824]",
    ringColor: "ring-[#cf5c6a]",
  },
] as const;

// ── 6. MODERN MONOGRAM ──
export const MODERN_MONOGRAM_COLORWAYS: readonly ColorwayPreset[] = [
  {
    id: "champagne-linen",
    name: "Champagne Linen",
    tagline: "Minimalist Luxury",
    description: "Nuansa emas serat linen yang tenang dan estetis.",
    accent: "#c5a880",
    accentDark: "#967850",
    badge: "bg-[#c5a880]/15 text-[#c5a880] border-[#c5a880]/30",
    gradient: "from-[#f2e7d8] via-[#c5a880] to-[#80643d]",
    ringColor: "ring-[#c5a880]",
  },
  {
    id: "botanical-forest",
    name: "Botanical Forest",
    tagline: "Editorial Green",
    description: "Hijau dedaunan terstruktur ala majalah arsitektur.",
    accent: "#5a7263",
    accentDark: "#2d4a3e",
    badge: "bg-[#5a7263]/15 text-[#5a7263] border-[#5a7263]/30",
    gradient: "from-[#bad0c3] via-[#5a7263] to-[#1c3329]",
    ringColor: "ring-[#5a7263]",
  },
  {
    id: "dusty-rose",
    name: "Dusty Rose",
    tagline: "Soft Monogram",
    description: "Merah muda abu-abu yang puitis, bersih, dan menawan.",
    accent: "#cfa39d",
    accentDark: "#9e6a64",
    badge: "bg-[#cfa39d]/15 text-[#cfa39d] border-[#cfa39d]/30",
    gradient: "from-[#f6dedb] via-[#cfa39d] to-[#7f4a44]",
    ringColor: "ring-[#cfa39d]",
  },
  {
    id: "charcoal-slate",
    name: "Charcoal Slate",
    tagline: "Classic Monogram",
    description: "Aksen arang monokrom berwibawa, modern, dan tajam.",
    accent: "#64748b",
    accentDark: "#334155",
    badge: "bg-[#64748b]/15 text-[#64748b] border-[#64748b]/30",
    gradient: "from-[#cbd5e1] via-[#64748b] to-[#1e293b]",
    ringColor: "ring-[#64748b]",
  },
] as const;

// ── 7. VINTAGE ROYAL (Old Money & Tuscan Estate) ──
export const VINTAGE_ROYAL_COLORWAYS: readonly ColorwayPreset[] = [
  {
    id: "tuscan-parchment",
    name: "Tuscan Parchment",
    tagline: "Aged Luxury",
    description: "Kombinasi kertas perkamen antik Italia dan emas perunggu klasik.",
    accent: "#d5be9b",
    accentDark: "#9b8058",
    badge: "bg-[#d5be9b]/15 text-[#d5be9b] border-[#d5be9b]/30",
    gradient: "from-[#f4e9db] via-[#d5be9b] to-[#8d714b]",
    ringColor: "ring-[#d5be9b]",
  },
  {
    id: "sienna-terracotta",
    name: "Sienna Terracotta",
    tagline: "Warm Tuscan Villa",
    description: "Nuansa bata terakota dan tanah liat hangat khas perbukitan Tuscany.",
    accent: "#c06c54",
    accentDark: "#8f422e",
    badge: "bg-[#c06c54]/15 text-[#c06c54] border-[#c06c54]/30",
    gradient: "from-[#fadcd3] via-[#c06c54] to-[#7a3422]",
    ringColor: "ring-[#c06c54]",
  },
  {
    id: "cypress-olive",
    name: "Cypress Olive",
    tagline: "Estate Garden",
    description: "Hijau zaitun dan cemara kebun anggur pribadi yang tenang dan prestisius.",
    accent: "#8a9a86",
    accentDark: "#52634e",
    badge: "bg-[#8a9a86]/15 text-[#8a9a86] border-[#8a9a86]/30",
    gradient: "from-[#e4ebe2] via-[#8a9a86] to-[#455442]",
    ringColor: "ring-[#8a9a86]",
  },
  {
    id: "antique-wax-seal",
    name: "Sigillo Di Cera",
    tagline: "Wax Seal Burgundy",
    description: "Merah stempel lilin bangsawan berpadu kilau emas sampanye.",
    accent: "#c4a47c",
    accentDark: "#8a3a30",
    badge: "bg-[#c4a47c]/15 text-[#c4a47c] border-[#c4a47c]/30",
    gradient: "from-[#faeede] via-[#c4a47c] to-[#7d2f26]",
    ringColor: "ring-[#c4a47c]",
  },
] as const;

// Default exported presets (backward compatibility with earlier imports)
export const COLORWAY_PRESETS: readonly ColorwayPreset[] = CINEMATIC_COLORWAYS;

export const VEIL_PRESETS: readonly VeilPreset[] = [
  {
    id: "light",
    label: "Soft",
    percentage: "25%",
    description: "Cocok untuk foto prewedding studio bernuansa gelap atau redup.",
    opacityClass: "bg-black/25",
    rgba: "rgba(10, 10, 12, 0.25)",
  },
  {
    id: "medium",
    label: "Standar",
    percentage: "40%",
    description: "Keseimbangan ideal antara kejelasan foto dan keterbacaan teks (Rekomendasi).",
    opacityClass: "bg-black/40",
    rgba: "rgba(10, 10, 12, 0.40)",
  },
  {
    id: "deep",
    label: "Deep",
    percentage: "55%",
    description: "Cocok untuk foto prewedding luar ruangan (outdoor / pantai) yang sangat terang.",
    opacityClass: "bg-black/55",
    rgba: "rgba(10, 10, 12, 0.55)",
  },
] as const;

export const DEFAULT_THEME_CONFIG: ResolvedThemeConfig = {
  colorway: "champagne",
  veilIntensity: "medium",
  veilOpacityClass: "bg-black/40",
  veilRgba: "rgba(10, 10, 12, 0.40)",
  fontPairing: "cormorant",
  accentColor: "#e8d5b5",
  accentSecondary: "#d4b886",
  sections: {
    countdown: true,
    story: true,
    gallery: true,
    rsvp: true,
    messages: true,
    gift: true,
  },
};

/**
 * Returns the theme-specific curated colorway list based on the active template slug.
 */
export function getColorwaysForTemplate(templateSlug?: string | null): readonly ColorwayPreset[] {
  if (!templateSlug) return CINEMATIC_COLORWAYS;

  switch (templateSlug) {
    case "batik-jawa":
      return BATIK_JAWA_COLORWAYS;
    case "nature-floral":
      return NATURE_FLORAL_COLORWAYS;
    case "royal-emerald":
      return ROYAL_EMERALD_COLORWAYS;
    case "eternal-noir":
      return ETERNAL_NOIR_COLORWAYS;
    case "modern-monogram":
      return MODERN_MONOGRAM_COLORWAYS;
    case "vintage-royal":
      return VINTAGE_ROYAL_COLORWAYS;
    case "cinematic-editorial":
    case "cinematic-ivory":
    default:
      return CINEMATIC_COLORWAYS;
  }
}

/**
 * Returns a human-friendly theme category/collection name.
 */
export function getThemeFamilyLabel(templateSlug?: string | null): string {
  if (!templateSlug) return "Curated Hayvows Collection";
  switch (templateSlug) {
    case "batik-jawa":
      return "Palet Tradisional Batik Kraton";
    case "nature-floral":
      return "Palet Botanical & Earthy Floral";
    case "royal-emerald":
      return "Palet Kemegahan Istana (Regal Palace)";
    case "eternal-noir":
      return "Palet Dramatis Hitam Monokrom (Nocturne)";
    case "modern-monogram":
      return "Palet Minimalis Tipografi Editorial";
    case "vintage-royal":
      return "Palet Old Money & Tuscan Estate";
    case "cinematic-editorial":
    case "cinematic-ivory":
    default:
      return "Palet Sinematik Modern Hayvows";
  }
}

export function parseThemeConfig(
  raw: string | ThemeConfig | null | undefined,
  templateSlug?: string | null
): ResolvedThemeConfig {
  const colorways = getColorwaysForTemplate(templateSlug);
  const defaultColor = colorways[0];

  if (!raw) {
    return {
      ...DEFAULT_THEME_CONFIG,
      colorway: defaultColor.id,
      accentColor: defaultColor.accent,
      accentSecondary: defaultColor.accentDark,
    };
  }

  let parsed: any = {};
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {
        ...DEFAULT_THEME_CONFIG,
        colorway: defaultColor.id,
        accentColor: defaultColor.accent,
        accentSecondary: defaultColor.accentDark,
      };
    }
  } else if (typeof raw === "object") {
    parsed = raw;
  }

  const rawColorway = parsed.colorway;
  // Match colorway in the active template's colorways
  let matchedColor = colorways.find((c) => c.id === rawColorway);
  if (!matchedColor) {
    matchedColor = defaultColor;
  }

  const rawVeil = parsed.veilIntensity;
  const validVeil = VEIL_PRESETS.some((v) => v.id === rawVeil)
    ? (rawVeil as ResolvedThemeConfig["veilIntensity"])
    : "medium";

  const matchedVeil = VEIL_PRESETS.find((v) => v.id === validVeil) || VEIL_PRESETS[1];

  return {
    colorway: matchedColor.id,
    veilIntensity: validVeil,
    veilOpacityClass: matchedVeil.opacityClass,
    veilRgba: matchedVeil.rgba,
    fontPairing: parsed.fontPairing || "cormorant",
    accentColor: matchedColor.accent,
    accentSecondary: matchedColor.accentDark,
    sections: {
      countdown: parsed.sections?.countdown !== false,
      story: parsed.sections?.story !== false,
      gallery: parsed.sections?.gallery !== false,
      rsvp: parsed.sections?.rsvp !== false,
      messages: parsed.sections?.messages !== false,
      gift: parsed.sections?.gift !== false,
    },
  };
}

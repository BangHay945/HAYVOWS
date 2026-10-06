export const VINTAGE_ROYAL_THEME = {
  colors: {
    // Base — Quiet Luxury Tuscan Estate (Warm Charcoal & Umber)
    charcoalBg: "#141517",
    cardBg: "#1c1e22",
    stoneBg: "#22242a",
    borderSubtle: "rgba(255, 255, 255, 0.08)",
    borderWarm: "rgba(213, 190, 155, 0.22)",

    // Typography — Aged Parchment & Warm Ivory
    parchment: "#f8f6f0",
    pureWhite: "#ffffff",
    textMuted: "#b8b5ad",
    textFaded: "#7c7970",

    // Tuscan Olive, Terracotta & Antique Warm Gold
    oliveGold: "#8a9a86",
    terracotta: "#c06c54",
    antiqueBronze: "#c4a47c",
    waxSealRed: "#9b3b32",
    waxSealGold: "#c89f58",
  },
  fonts: {
    serif: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
    sans: "'Montserrat', system-ui, -apple-system, sans-serif",
  },
  easing: [0.22, 1, 0.36, 1] as const,
  presetMusic: "/music/presets/canon-in-d.mp3",
  fallbackMusic: "/music/presets/canon-harp-strings.mp3",
  presetMusicTitle: "Canon in D — Classical Strings & Piano Romance",
} as const;

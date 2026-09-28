export const CINEMATIC_IVORY_THEME = {
  colors: {
    // Base — Dark Cinematic Film (Midnight & Charcoal)
    midnightBg: "#0c0d0e",
    charcoalBg: "#121316",
    cardBg: "#18191d",
    borderSubtle: "rgba(255, 255, 255, 0.08)",
    borderPlatinum: "rgba(212, 196, 176, 0.22)",

    // Typography — Luminous Platinum Ivory & Silver Muted
    platinumIvory: "#f5f3ef",
    pureWhite: "#ffffff",
    textMuted: "#b0b0b8",
    textFaded: "#72737a",
    textSubtle: "#484950",

    // Accent — Platinum Champagne & Warm Silver (NOT yellow gold)
    platinum: "#d4c4b0",
    platinumDim: "#a89987",
    platinumGlow: "rgba(212, 196, 176, 0.15)",
    platinumBorder: "rgba(212, 196, 176, 0.35)",
  },
  fonts: {
    serif: "'Cormorant Garamond', Georgia, serif",
    sans: "'Montserrat', system-ui, -apple-system, sans-serif",
  },
  easing: [0.22, 1, 0.36, 1] as const,
  presetMusic: "/music/presets/canon-harp-strings.mp3",
  presetMusicTitle: "Canon in D — Harp & Strings Quartet",
} as const;

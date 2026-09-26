/**
 * HAYVOWS TEMPLATE ARCHETYPES ARCHITECTURE
 * ─────────────────────────────────────────────────────────────
 * Sistem 5 Pilar Archetype Tema Hayvows
 * 
 * Setiap tema di Hayvows diturunkan dari salah satu dari 5 Base Archetype berikut.
 * Saat membuat tema turunan baru, pengembang mewarisi fungsionalitas inti
 * (Audio player, RSVP engine, Guest ticket modal, Digital envelope) dan hanya
 * mengkustomisasi Theme Tokens (warna, tipografi, ornamen SVG, dan tekstur).
 */

import type { TemplateArchetype } from "@/lib/templates";

export interface BaseThemeTokens {
  slug: string;
  name: string;
  archetype: TemplateArchetype;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    textDark: string;
    textMuted: string;
    border: string;
  };
  fonts: {
    display: string;
    serif?: string;
    body: string;
    mono?: string;
  };
  presetMusic?: {
    url: string;
    title: string;
  };
}

/**
 * PANDUAN PENGEMBANGAN TEMA TURUNAN BARU:
 * ─────────────────────────────────────────────────────────────
 * 
 * 1. PILAR "GAMIFIED & INTERACTIVE"
 *    - Base Component: src/templates/shared/BaseLayout.tsx
 *    - Turunan Eksisting: pixel-adventure, pixel-cyberpunk
 *    - Cara buat turunan: Duplikasi GameWorld map data + sesuaikan sprite tileset & BGM chiptune.
 * 
 * 2. PILAR "CULTURAL HERITAGE"
 *    - Base Pattern: Ornamen Adat SVG + Salam Formal + Instrumen Tradisional
 *    - Turunan Eksisting: batik-jawa
 *    - Cara buat turunan (misal: sunda-parahyangan / minang-marawa):
 *      Ganti motif Ornaments.tsx dengan motif daerah terkait + sesuaikan palet warna & alunan musik.
 * 
 * 3. PILAR "HAUTE LUXURY"
 *    - Base Pattern: Dark Mode Onyx/Obsidian + Metalik Gold/Silver + Split Desktop
 *    - Turunan Eksisting: eternal-noir
 *    - Cara buat turunan (misal: royal-emerald / midnight-sapphire):
 *      Ganti background onyx menjadi deep emerald / midnight navy + gold foil.
 * 
 * 4. PILAR "BOTANICAL & FLORAL"
 *    - Base Pattern: Flora Watercolor + Sage/Blush Palette + Garden Party Layout
 *    - Turunan Eksisting: nature-floral
 *    - Cara buat turunan (misal: terracotta-boho / spring-garden):
 *      Ganti aset watercolor daun eucalyptus menjadi pampas grass / kelopak bunga sakura.
 * 
 * 5. PILAR "MODERN MINIMALIST"
 *    - Base Pattern: Clutter-Free (Tanpa Bunga) + Monogram Seal + Clean Editorial Grid
 *    - Turunan Eksisting: modern-monogram
 *    - Cara buat turunan (misal: korean-aesthetic / swiss-grid):
 *      Ganti tipografi & framing foto polaroid dengan palet milky-white / editorial slate.
 */
export const ARCHETYPE_GUIDELINES = {
  version: "2.0.0",
  totalPillars: 5,
} as const;

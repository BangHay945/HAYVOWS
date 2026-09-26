import { prisma } from "@/lib/prisma";

export type SubscriptionTier = "basic" | "premium" | "luxury";

// ─────────────────────────────────────────
// 5 PILAR ARCHETYPE TEMA HAYVOWS
// ─────────────────────────────────────────

export type TemplateArchetype =
  | "gamified"     // 🎮 Gamified & Interactive (Pixel RPG, Cyberpunk)
  | "cultural"     // 🏛️ Cultural Heritage (Batik Jawa, Sunda, Minang)
  | "luxury"       // 💎 Haute Luxury (Eternal Noir, Royal Emerald)
  | "botanical"    // 🌿 Botanical & Floral (Nature Floral, Rustic Boho)
  | "minimalist";  // 📐 Modern Minimalist (Modern Monogram, Korean Clean)

export interface ArchetypeMeta {
  id: TemplateArchetype;
  name: string;
  shortLabel: string;
  badge: string;
  tagColor: string;
  iconName: "Gamepad2" | "Landmark" | "Crown" | "Flower2" | "Sparkles";
  description: string;
  traits: string[];
}

export const ARCHETYPES: Record<TemplateArchetype, ArchetypeMeta> = {
  gamified: {
    id: "gamified",
    name: "Gamified & Interactive",
    shortLabel: "Game RPG",
    badge: "🎮 Game & RPG",
    tagColor: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    iconName: "Gamepad2",
    description:
      "Undangan interaktif berbentuk game petualangan dunia virtual (Canvas 2D Engine). Tamu dapat menggerakkan karakter avatar menjelajahi peta dan berinteraksi dengan stasiun acara.",
    traits: [
      "Kontrol karakter avatar (WASD / D-Pad sentuh HP)",
      "Stasiun NPC interaktif: Mempelai, RSVP, Galeri & Hadiah",
      "Musik Chiptune / Retro Synthwave & Sound Effects",
    ],
  },
  cultural: {
    id: "cultural",
    name: "Cultural Heritage",
    shortLabel: "Adat Nusantara",
    badge: "🏛️ Adat & Tradisi",
    tagColor: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    iconName: "Landmark",
    description:
      "Keagungan dan kesakralan adat budaya luhur Nusantara berbalut ornamen filosofis daerah, salam kehormatan sakral, dan alunan instrumen musik tradisional.",
    traits: [
      "Ornamen visual adat otentik (Gunungan, Kawung, Ukiran khas)",
      "Tipografi klasik formal bernuansa prasasti sejarah luhur",
      "Pilihan alunan musik gamelan & instrumen tradisional",
    ],
  },
  luxury: {
    id: "luxury",
    name: "Haute Luxury",
    shortLabel: "Dark Glamour",
    badge: "💎 Dark Glamour",
    tagColor: "bg-slate-900 text-[#c9a84c] border-[#c9a84c]/50",
    iconName: "Crown",
    description:
      "Kemewahan monokromatik gelap pekat kontras tinggi (Onyx & Midnight) berpadu kilau foil emas sampanye. Bergaya pesta black-tie gala dan majalah fashion haute couture.",
    traits: [
      "Latar belakang gelap pekat kontras tinggi (Onyx / Obsidian)",
      "Aksen tipografi emas / champagne gold ultra-elegan",
      "Navigasi dot sidebar sinematik & split-screen desktop",
    ],
  },
  botanical: {
    id: "botanical",
    name: "Botanical & Floral",
    shortLabel: "Bunga & Alami",
    badge: "🌿 Bunga & Alami",
    tagColor: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    iconName: "Flower2",
    description:
      "Keindahan organik dedaunan asri, bunga cat air (watercolor) lembut, dan suasana hangat romantis pesta kebun (garden party).",
    traits: [
      "Ilustrasi dedaunan eucalyptus, monstera, & bunga watercolor",
      "Palet warna alami lembut (sage green, blush pink, olive, cream)",
      "Tekstur kertas seni handmade & transisi puitis romantis",
    ],
  },
  minimalist: {
    id: "minimalist",
    name: "Modern Minimalist",
    badge: "📐 Bersih & Monogram",
    shortLabel: "Bersih & Monogram",
    tagColor: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    iconName: "Sparkles",
    description:
      "Desain bersih tanpa ornamen bunga (clutter-free). Berfokus pada kekuatan tata letak arsitektural, ruang kosong lapang (whitespace), dan cap inisial monogram pengantin.",
    traits: [
      "Bersih tanpa ilustrasi bunga atau ornamen berlebihan",
      "Stempel inisial monogram geometris sebagai identitas utama",
      "Tipografi editorial presisi ala kartu pos pernikahan modern",
    ],
  },
};

export const ARCHETYPE_LIST: ArchetypeMeta[] = Object.values(ARCHETYPES);

export const getTemplateArchetype = (slug: string): TemplateArchetype => {
  if (
    slug === "pixel-adventure" ||
    slug === "pixel-cyberpunk" ||
    slug === "pixel-rpg" ||
    slug.includes("pixel") ||
    slug.includes("game")
  ) {
    return "gamified";
  }
  if (
    slug === "batik-jawa" ||
    slug.includes("jawa") ||
    slug.includes("sunda") ||
    slug.includes("minang") ||
    slug.includes("bali") ||
    slug.includes("batik") ||
    slug.includes("adat")
  ) {
    return "cultural";
  }
  if (
    slug === "eternal-noir" ||
    slug === "vintage-royal" ||
    slug.includes("noir") ||
    slug.includes("luxury") ||
    slug.includes("emerald") ||
    slug.includes("sapphire")
  ) {
    return "luxury";
  }
  if (
    slug === "nature-floral" ||
    slug.includes("floral") ||
    slug.includes("flower") ||
    slug.includes("garden") ||
    slug.includes("nature") ||
    slug.includes("boho")
  ) {
    return "botanical";
  }
  if (
    slug === "modern-monogram" ||
    slug.includes("monogram") ||
    slug.includes("minimal") ||
    slug.includes("clean") ||
    slug.includes("korean")
  ) {
    return "minimalist";
  }
  return "minimalist";
};

// ─────────────────────────────────────────
// SUBSCRIPTION TIER & PERMISSIONS
// ─────────────────────────────────────────

export const getRequiredPlan = (slug: string): SubscriptionTier => {
  // Paket Exclusive (Rp 299.000)
  if (
    slug === "pixel-adventure" ||
    slug === "pixel-cyberpunk" ||
    slug === "pixel-rpg" ||
    slug === "eternal-noir" ||
    slug === "royal-emerald"
  ) {
    return "luxury";
  }

  // Paket Populer (Rp 199.000)
  if (
    slug === "nature-floral" ||
    slug === "batik-jawa" ||
    slug === "vintage-royal"
  ) {
    return "premium";
  }

  // Paket Basic (Rp 149.000)
  return "basic";
};

export const isPlanAllowed = (reqPlan: string, curPlan: string, role?: string) => {
  if (role === "admin") return true;
  if (reqPlan === "basic") {
    return curPlan === "basic" || curPlan === "premium" || curPlan === "luxury";
  }
  if (reqPlan === "premium") {
    return curPlan === "premium" || curPlan === "luxury";
  }
  if (reqPlan === "luxury") {
    return curPlan === "luxury";
  }
  return false;
};

export async function getTemplates() {
  return prisma.template.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function getTemplateBySlug(slug: string) {
  return prisma.template.findUnique({ where: { slug } });
}

import type { InvitationTemplate } from "@/types/template";
import { PixelAdventureTemplate } from "./pixel-adventure";
import { PixelCyberpunkTemplate } from "./pixel-cyberpunk";
import { NatureFloralTemplate } from "./nature-floral";
import { ModernMonogramTemplate } from "./modern-monogram";
import { EternalNoirTemplate } from "./eternal-noir";
import { BatikJawaTemplate } from "./batik-jawa";

export const templateRegistry: Record<string, InvitationTemplate> = {
  "pixel-adventure": PixelAdventureTemplate,
  "pixel-cyberpunk": PixelCyberpunkTemplate,
  "nature-floral": NatureFloralTemplate,
  "modern-monogram": ModernMonogramTemplate,
  "eternal-noir": EternalNoirTemplate,
  "batik-jawa": BatikJawaTemplate,
};

export function getTemplate(slug: string): InvitationTemplate | null {
  return templateRegistry[slug] ?? null;
}


import type { InvitationTemplate } from "@/types/template";
import { MonogramCover } from "./components/Cover";
import { MonogramHero } from "./components/Hero";
import { MonogramCouple } from "./components/Couple";
import { MonogramCountdown } from "./components/Countdown";
import { MonogramEvent } from "./components/Event";
import { MonogramGallery } from "./components/Gallery";
import { MonogramMessages } from "./components/Messages";
import { MonogramGift } from "./components/Gift";
import { MonogramFooter } from "./components/Footer";
import { MonogramMusicButton } from "./components/MusicButton";
import { MonogramLayout } from "./layout";

export const ModernMonogramTemplate: InvitationTemplate = {
  id: "modern-monogram",
  name: "Modern Monogram",
  version: "1.0.0",
  Cover: MonogramCover,
  Hero: MonogramHero,
  Couple: MonogramCouple,
  Countdown: MonogramCountdown,
  Event: MonogramEvent,
  Gallery: MonogramGallery,
  Gift: MonogramGift,
  Messages: MonogramMessages,
  Footer: MonogramFooter,
  MusicButton: MonogramMusicButton,
  Layout: MonogramLayout,
};

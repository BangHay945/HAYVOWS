import type { InvitationTemplate } from "@/types/template";
import { PixelCover } from "./components/Cover";
import { PixelHero } from "./components/Hero";
import { PixelCouple } from "./components/Couple";
import { PixelCountdown } from "./components/Countdown";
import { PixelStory } from "./components/Story";
import { PixelEvent } from "./components/Event";
import { PixelGallery } from "./components/Gallery";
import { PixelRSVP } from "./components/RSVP";
import { PixelMessages } from "./components/Messages";
import { PixelGift } from "./components/Gift";
import { PixelFooter } from "./components/Footer";
import { PixelMusicButton } from "./components/MusicButton";
import { PixelLayout } from "./layout";

export const PixelAdventureTemplate: InvitationTemplate = {
  id: "pixel-adventure",
  name: "Pixel Adventure",
  version: "1.0.0",
  Cover: PixelCover,
  Hero: PixelHero,
  Couple: PixelCouple,
  Countdown: PixelCountdown,
  Story: PixelStory,
  Event: PixelEvent,
  Gallery: PixelGallery,
  RSVP: PixelRSVP,
  Messages: PixelMessages,
  Gift: PixelGift,
  Footer: PixelFooter,
  MusicButton: PixelMusicButton,
  Layout: PixelLayout,
};

import type { InvitationTemplate } from "@/types/template";
import { FloralCover } from "./components/Cover";
import { FloralHero } from "./components/Hero";
import { FloralCouple } from "./components/Couple";
import { FloralCountdown } from "./components/Countdown";
import { FloralStory } from "./components/Story";
import { FloralEvent } from "./components/Event";
import { FloralGallery } from "./components/Gallery";
import { FloralRSVP } from "./components/RSVP";
import { FloralMessages } from "./components/Messages";
import { FloralGift } from "./components/Gift";
import { FloralFooter } from "./components/Footer";
import { FloralMusicButton } from "./components/MusicButton";
import { FloralLayout } from "./layout";

export const NatureFloralTemplate: InvitationTemplate = {
  id: "nature-floral",
  name: "Nature Floral",
  version: "1.0.0",
  Cover: FloralCover,
  Hero: FloralHero,
  Couple: FloralCouple,
  Countdown: FloralCountdown,
  Story: FloralStory,
  Event: FloralEvent,
  Gallery: FloralGallery,
  RSVP: FloralRSVP,
  Messages: FloralMessages,
  Gift: FloralGift,
  Footer: FloralFooter,
  MusicButton: FloralMusicButton,
  Layout: FloralLayout,
};

import type { InvitationTemplate } from "@/types/template";
import { EditorialCover } from "./components/Cover";
import { EditorialHero } from "./components/Hero";
import { EditorialCouple } from "./components/Couple";
import { EditorialCountdown } from "./components/Countdown";
import { EditorialStory } from "./components/Story";
import { EditorialEvent } from "./components/Event";
import { EditorialGallery } from "./components/Gallery";
import { EditorialRSVP } from "./components/RSVP";
import { EditorialMessages } from "./components/Messages";
import { EditorialGift } from "./components/Gift";
import { EditorialFooter } from "./components/Footer";
import { EditorialMusicButton } from "./components/MusicButton";
import { EditorialLayout } from "./layout";

export const CinematicEditorialTemplate: InvitationTemplate = {
  id: "cinematic-editorial",
  name: "The Wedding Journal (Cinematic Editorial)",
  version: "1.0.0",
  Cover: EditorialCover,
  Hero: EditorialHero,
  Couple: EditorialCouple,
  Story: EditorialStory,
  Countdown: EditorialCountdown,
  Event: EditorialEvent,
  Gallery: EditorialGallery,
  RSVP: EditorialRSVP,
  Messages: EditorialMessages,
  Gift: EditorialGift,
  Footer: EditorialFooter,
  MusicButton: EditorialMusicButton,
  Layout: EditorialLayout,
};

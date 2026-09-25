import type { InvitationTemplate } from "@/types/template";
import { NoirCover } from "./components/Cover";
import { NoirHero } from "./components/Hero";
import { NoirCouple } from "./components/Couple";
import { NoirStory } from "./components/Story";
import { NoirCountdown } from "./components/Countdown";
import { NoirEvent } from "./components/Event";
import { NoirGallery } from "./components/Gallery";
import { NoirRSVP } from "./components/RSVP";
import { NoirMessages } from "./components/Messages";
import { NoirGift } from "./components/Gift";
import { NoirFooter } from "./components/Footer";
import { NoirMusicButton } from "./components/MusicButton";
import { NoirLayout } from "./layout";

export const EternalNoirTemplate: InvitationTemplate = {
  id: "eternal-noir",
  name: "Eternal Noir",
  version: "1.0.0",
  Cover: NoirCover,
  Hero: NoirHero,
  Couple: NoirCouple,
  Story: NoirStory,
  Countdown: NoirCountdown,
  Event: NoirEvent,
  Gallery: NoirGallery,
  RSVP: NoirRSVP,
  Messages: NoirMessages,
  Gift: NoirGift,
  Footer: NoirFooter,
  MusicButton: NoirMusicButton,
  Layout: NoirLayout,
};

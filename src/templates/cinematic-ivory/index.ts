import type { InvitationTemplate } from "@/types/template";
import { CinematicIvoryCover } from "./components/Cover";
import { CinematicIvoryHero } from "./components/Hero";
import { CinematicIvoryCouple } from "./components/Couple";
import { CinematicIvoryStory } from "./components/Story";
import { CinematicIvoryEvent } from "./components/Event";
import { CinematicIvoryGallery } from "./components/Gallery";
import { CinematicIvoryRSVP } from "./components/RSVP";
import { CinematicIvoryMessages } from "./components/Messages";
import { CinematicIvoryGift } from "./components/Gift";
import { CinematicIvoryFooter } from "./components/Footer";
import { CinematicIvoryMusicButton } from "./components/MusicButton";
import { CinematicIvoryLayout } from "./layout";

export const CinematicIvoryTemplate: InvitationTemplate = {
  id: "cinematic-ivory",
  name: "Cinematic Ivory",
  version: "1.0.0",
  Cover: CinematicIvoryCover,
  Hero: CinematicIvoryHero,
  Couple: CinematicIvoryCouple,
  Story: CinematicIvoryStory,
  Event: CinematicIvoryEvent,
  Gallery: CinematicIvoryGallery,
  RSVP: CinematicIvoryRSVP,
  Messages: CinematicIvoryMessages,
  Gift: CinematicIvoryGift,
  Footer: CinematicIvoryFooter,
  MusicButton: CinematicIvoryMusicButton,
  Layout: CinematicIvoryLayout,
};

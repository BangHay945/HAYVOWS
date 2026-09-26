import type { InvitationTemplate } from "@/types/template";
import { RoyalCover } from "./components/Cover";
import { RoyalHero } from "./components/Hero";
import { RoyalCouple } from "./components/Couple";
import { RoyalCountdown } from "./components/Countdown";
import { RoyalStory } from "./components/Story";
import { RoyalEvent } from "./components/Event";
import { RoyalGallery } from "./components/Gallery";
import { RoyalRSVP } from "./components/RSVP";
import { RoyalMessages } from "./components/Messages";
import { RoyalGift } from "./components/Gift";
import { RoyalFooter } from "./components/Footer";
import { RoyalMusicButton } from "./components/MusicButton";
import { RoyalLayout } from "./layout";

export const RoyalEmeraldTemplate: InvitationTemplate = {
  id: "royal-emerald",
  name: "Royal Emerald & Gold",
  version: "1.0.0",
  Cover: RoyalCover,
  Hero: RoyalHero,
  Couple: RoyalCouple,
  Story: RoyalStory,
  Countdown: RoyalCountdown,
  Event: RoyalEvent,
  Gallery: RoyalGallery,
  RSVP: RoyalRSVP,
  Messages: RoyalMessages,
  Gift: RoyalGift,
  Footer: RoyalFooter,
  MusicButton: RoyalMusicButton,
  Layout: RoyalLayout,
};

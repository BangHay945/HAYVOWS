import type { InvitationTemplate } from "@/types/template";
import { VintageRoyalCover } from "./components/Cover";
import { VintageRoyalHero } from "./components/Hero";
import { VintageRoyalCouple } from "./components/Couple";
import { VintageRoyalStory } from "./components/Story";
import { VintageRoyalCountdown } from "./components/Countdown";
import { VintageRoyalEvent } from "./components/Event";
import { VintageRoyalGallery } from "./components/Gallery";
import { VintageRoyalRSVP } from "./components/RSVP";
import { VintageRoyalGift } from "./components/Gift";
import { VintageRoyalFooter } from "./components/Footer";
import { VintageRoyalMusicButton } from "./components/MusicButton";
import { VintageRoyalLayout } from "./layout";

export const VintageRoyalTemplate: InvitationTemplate = {
  id: "vintage-royal",
  name: "Vintage Royal Estate",
  version: "1.0.0",
  Cover: VintageRoyalCover,
  Hero: VintageRoyalHero,
  Couple: VintageRoyalCouple,
  Countdown: VintageRoyalCountdown,
  Story: VintageRoyalStory,
  Event: VintageRoyalEvent,
  Gallery: VintageRoyalGallery,
  RSVP: VintageRoyalRSVP,
  Gift: VintageRoyalGift,
  Footer: VintageRoyalFooter,
  MusicButton: VintageRoyalMusicButton,
  Layout: VintageRoyalLayout,
};

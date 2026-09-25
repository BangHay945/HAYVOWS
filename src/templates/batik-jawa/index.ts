import type { InvitationTemplate } from "@/types/template";
import { BatikJawaCover } from "./components/Cover";
import { BatikJawaHero } from "./components/Hero";
import { BatikJawaCouple } from "./components/Couple";
import { BatikJawaCountdown } from "./components/Countdown";
import { BatikJawaStory } from "./components/Story";
import { BatikJawaEvent } from "./components/Event";
import { BatikJawaGallery } from "./components/Gallery";
import { BatikJawaRSVP } from "./components/RSVP";
import { BatikJawaGift } from "./components/Gift";
import { BatikJawaFooter } from "./components/Footer";
import { BatikJawaMusicButton } from "./components/MusicButton";
import { BatikJawaLayout } from "./layout";

export const BatikJawaTemplate: InvitationTemplate = {
  id: "batik-jawa",
  name: "Batik Jawa Heritage",
  version: "1.0.0",
  Cover: BatikJawaCover,
  Hero: BatikJawaHero,
  Couple: BatikJawaCouple,
  Countdown: BatikJawaCountdown,
  Story: BatikJawaStory,
  Event: BatikJawaEvent,
  Gallery: BatikJawaGallery,
  RSVP: BatikJawaRSVP,
  Gift: BatikJawaGift,
  Footer: BatikJawaFooter,
  MusicButton: BatikJawaMusicButton,
  Layout: BatikJawaLayout,
};

import type { InvitationTemplate } from "@/types/template";
import { CyberCover } from "./components/Cover";
import { CyberMusicButton } from "./components/MusicButton";
import { CyberLayout } from "./layout";

export const PixelCyberpunkTemplate: InvitationTemplate = {
  id: "pixel-cyberpunk",
  name: "Cyberpunk Neo-District",
  version: "1.0.0",
  Cover: CyberCover,
  MusicButton: CyberMusicButton,
  Layout: CyberLayout,
};

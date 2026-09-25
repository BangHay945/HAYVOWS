"use client";
import type { TemplateLayoutProps } from "@/types/template";
import { BaseLayout } from "../shared/BaseLayout";
import { CyberCover } from "./components/Cover";
import { CyberMusicButton } from "./components/MusicButton";
import { CyberGameWorld } from "./components/GameWorld";

export function CyberLayout(props: TemplateLayoutProps) {
  return (
    <BaseLayout
      {...props}
      bgClassName="bg-[#070913]"
      Cover={CyberCover}
      MusicButton={CyberMusicButton}
      GameWorld={CyberGameWorld}
    />
  );
}

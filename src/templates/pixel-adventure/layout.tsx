"use client";
import type { TemplateLayoutProps } from "@/types/template";
import { BaseLayout } from "../shared/BaseLayout";
import { PixelCover } from "./components/Cover";
import { PixelMusicButton } from "./components/MusicButton";
import { PixelGameWorld } from "./components/GameWorld";

export function PixelLayout(props: TemplateLayoutProps) {
  return (
    <BaseLayout
      {...props}
      bgClassName="bg-[#18040a]"
      Cover={PixelCover}
      MusicButton={PixelMusicButton}
      GameWorld={PixelGameWorld}
    />
  );
}

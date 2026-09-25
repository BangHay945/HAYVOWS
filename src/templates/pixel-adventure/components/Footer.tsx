"use client";
import type { TemplateComponentProps } from "@/types/template";

export function PixelFooter({ context }: TemplateComponentProps) {
  const couple = context.wedding.couple;
  return (
    <footer className="bg-[#111111] py-12 px-6 text-center">
      <div className="max-w-md mx-auto">
        <p className="font-mono text-[#FFD700] text-xs tracking-widest mb-4">
          GAME OVER? NOT YET!
        </p>
        <p className="font-mono text-white text-lg font-bold">
          {couple?.groomNickname || couple?.groomName || "Groom"} &amp;{" "}
          {couple?.brideNickname || couple?.brideName || "Bride"}
        </p>
        <p className="font-mono text-[#555] text-xs mt-6">
          Made with ♥ · Wedding Invitation
        </p>
      </div>
    </footer>
  );
}

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
        <p className="font-mono text-xs mt-6 text-[#888]">
          Made with ♥ by{" "}
          <a
            href="https://www.hayvows.com"
            target="_blank"
            rel="noopener"
            className="text-[#FFD700] underline hover:text-yellow-300 transition-colors font-bold"
          >
            Hayvows
          </a>{" "}
          &bull; 2D Pixel Wedding Invitation
        </p>
      </div>
    </footer>
  );
}

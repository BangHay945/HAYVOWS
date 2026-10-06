"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  RotateCcw,
  ExternalLink,
  Lock,
  Unlock,
} from "lucide-react";
import type { Wedding } from "@/types/wedding";

interface LivePhoneMockupProps {
  weddingSlug: string;
  liveWedding: Wedding;
  activeTab?: string;
  isCoverOpen?: boolean;
  onToggleCover?: (open: boolean) => void;
  // Backward compatibility props
  mode?: "desktop" | "mobile" | "both";
  isMobileModalOpen?: boolean;
  onCloseMobileModal?: () => void;
}

const TAB_TO_SECTION_MAP: Record<string, string> = {
  couple: "section-couple",
  events: "section-event",
  story: "section-story",
  gallery: "section-gallery",
  music: "section-hero",
  gift: "section-gift",
  theme: "section-hero",
  settings: "section-hero",
  domain: "section-hero",
};

export default function LivePhoneMockup({
  weddingSlug,
  liveWedding,
  activeTab,
  isCoverOpen = false,
  onToggleCover,
}: LivePhoneMockupProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [, setIsReady] = useState(false);
  const [coverState, setCoverState] = useState(isCoverOpen);
  const [, setLastSyncedAt] = useState<Date>(new Date());

  const previewUrl = `/invitation/${weddingSlug}/preview?preview=1`;

  // Function to sync current liveWedding state to iframe
  const syncToIframe = useCallback(
    (targetIframe: HTMLIFrameElement | null) => {
      if (!targetIframe?.contentWindow) return;
      try {
        targetIframe.contentWindow.postMessage(
          {
            type: "HAYVOWS_PREVIEW_SYNC",
            wedding: liveWedding,
          },
          "*"
        );
        setLastSyncedAt(new Date());
      } catch {}
    },
    [liveWedding]
  );

  // Send update whenever liveWedding changes (debounced by 80ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      syncToIframe(iframeRef.current);
    }, 80);

    return () => clearTimeout(timer);
  }, [liveWedding, syncToIframe]);

  const navigateToTabSection = useCallback(
    (targetIframe: HTMLIFrameElement | null, tab?: string) => {
      if (!targetIframe?.contentWindow || !tab) return;
      const sectionId = TAB_TO_SECTION_MAP[tab] || "section-hero";
      try {
        targetIframe.contentWindow.postMessage(
          {
            type: "HAYVOWS_NAVIGATE_TAB",
            tab,
            sectionId,
          },
          "*"
        );
      } catch {}
    },
    []
  );

  // Send navigation message whenever activeTab changes
  useEffect(() => {
    if (!activeTab) return;
    const timer = setTimeout(() => {
      navigateToTabSection(iframeRef.current, activeTab);
    }, 150);

    return () => clearTimeout(timer);
  }, [activeTab, navigateToTabSection]);

  // Listen to ready message from iframe
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data?.type === "HAYVOWS_PREVIEW_READY") {
        setIsReady(true);
        syncToIframe(iframeRef.current);
        if (activeTab) {
          setTimeout(() => {
            navigateToTabSection(iframeRef.current, activeTab);
          }, 250);
        }
      }
    };

    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, [syncToIframe, activeTab, navigateToTabSection]);

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = previewUrl;
    }
  };

  const handleToggleCoverAction = () => {
    const next = !coverState;
    setCoverState(next);
    onToggleCover?.(next);
    const msg = { type: "HAYVOWS_SET_OPEN", isOpen: next };
    iframeRef.current?.contentWindow?.postMessage(msg, "*");
  };

  return (
    <div className="hidden lg:flex flex-col items-center sticky top-20 w-full">
      {/* Mockup Toolbar Header */}
      <div className="w-[290px] xl:w-[310px] flex items-center justify-between pb-2 px-1 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-semibold text-slate-700 text-[10px] tracking-wide uppercase font-mono">
            Live Mockup
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Toggle Cover Open/Close button */}
          <button
            type="button"
            onClick={handleToggleCoverAction}
            title={coverState ? "Tutup ke Layar Cover" : "Buka Isi Undangan"}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-medium shadow-2xs transition-colors cursor-pointer"
          >
            {coverState ? (
              <>
                <Lock className="w-2.5 h-2.5 text-slate-500" />
                <span>Cover</span>
              </>
            ) : (
              <>
                <Unlock className="w-2.5 h-2.5 text-emerald-600" />
                <span>Isi</span>
              </>
            )}
          </button>

          {/* Refresh iframe button */}
          <button
            type="button"
            onClick={handleReload}
            title="Muat Ulang Frame"
            className="p-1 rounded-md bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {/* Open in full tab button */}
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka di Tab Baru"
            className="p-1 rounded-md bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Realistic Compact Smartphone Shell */}
      <div className="w-[290px] xl:w-[310px] h-[550px] xl:h-[590px] bg-slate-950 rounded-[36px] p-2.5 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.08)_inset] border-[3px] border-slate-800/90 relative flex flex-col items-center">
        {/* Top Notch / Dynamic Island */}
        <div className="absolute top-3.5 z-30 w-22 h-4 bg-black rounded-full flex items-center justify-center gap-1.5 pointer-events-none shadow-inner">
          <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Iframe Viewport Screen */}
        <div className="w-full h-full rounded-[30px] overflow-hidden bg-black relative border border-white/5 no-scrollbar">
          <iframe
            ref={iframeRef}
            src={previewUrl}
            title="Pratinjau Undangan Hayvows"
            className="w-full h-full border-0 select-none bg-black no-scrollbar"
            loading="eager"
          />
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="w-24 h-1 bg-white/20 rounded-full mt-1.5 pointer-events-none" />
      </div>

      <p className="text-[10px] text-slate-400 mt-2 text-center">
        Perubahan teks &amp; foto berefleksi otomatis.
      </p>
    </div>
  );
}

"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NPCEntity, CYBER_NPCS } from "./types";
import { formatDate } from "@/lib/utils";
import { playCyberSound } from "../../sound";

import type { Couple } from "@/types/wedding";

interface NPCDialogProps {
  couple?: Couple | null;
  firstEvent?: {
    date: string;
  };
  characterName: string;
  debugMode: boolean;
  setDebugMode: (val: boolean) => void;
  playerPos: { x: number; y: number };
  direction: string;
  isWalking: boolean;
  activePathQueue: { x: number; y: number; id: string }[];
  nearbyNPC: NPCEntity | null;
  activeDialogueNPC: NPCEntity | null;
  activeModal: string | null;
  setActiveDialogueNPC: (npc: NPCEntity | null) => void;
  setActiveModal: (modal: string | null) => void;
  navigateToNPC: (npc: NPCEntity) => void;
  onTalkToNPC: (npc: NPCEntity) => void;
  knobPos: { x: number; y: number };
  onJoystickPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onJoystickPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onJoystickPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export function NPCDialog({
  couple,
  firstEvent,
  characterName,
  debugMode,
  setDebugMode,
  playerPos,
  direction,
  isWalking,
  activePathQueue,
  nearbyNPC,
  activeDialogueNPC,
  activeModal,
  setActiveDialogueNPC,
  setActiveModal,
  navigateToNPC,
  onTalkToNPC,
  knobPos,
  onJoystickPointerDown,
  onJoystickPointerMove,
  onJoystickPointerUp,
}: NPCDialogProps) {
  return (
    <>
      {/* 1. HUD TOP BAR */}
      <header className="fixed top-2.5 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-2 border-[#00f0ff] bg-[#0b0f19e6] backdrop-blur-xs px-3.5 sm:px-5 py-1 sm:py-1.5 shadow-[0_4px_16px_rgba(0,240,255,0.4)] flex items-center gap-2 text-[#00f0ff] ring-1 ring-[#ff007f]/50"
        >
          <span className="text-xs sm:text-sm">👑</span>
          <h1 className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#00f0ff] drop-shadow">
            {(couple?.groomNickname || "LIAM").toUpperCase()} &amp; {(couple?.brideNickname || "ELARA").toUpperCase()}
          </h1>
          <span className="text-[10px] text-pink-400 font-bold hidden sm:inline">•</span>
          <span className="text-[10px] sm:text-[11px] text-[#ffe600] font-bold tracking-wider hidden sm:inline">
            {firstEvent ? formatDate(firstEvent.date) : "NEO-TIMESTAMP 2077"}
          </span>
          <span className="text-xs sm:text-sm">👑</span>
        </motion.div>
      </header>

      {/* Guest Access Indicator Top-Left */}
      <div className="fixed top-3 left-3 sm:top-4 sm:left-4 z-40 flex items-center gap-2 pointer-events-none">
        <div className="bg-[#0b0f19f2] border-2 border-[#00f0ff] px-3 py-1.5 shadow-[0_0_12px_rgba(0,240,255,0.4)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
          <span className="text-[9px] sm:text-[10px] font-black text-[#00f0ff] uppercase tracking-wider">
            [ACCESS]: {characterName}
          </span>
        </div>
      </div>

      {/* 2. DEVELOPER DEBUG HUD */}
      <div className="fixed top-12 left-3 sm:top-14 sm:left-4 z-40 pointer-events-auto flex flex-col gap-1 select-none">
        <button
          onClick={() => setDebugMode(!debugMode)}
          className={`px-2 py-1 border text-[9px] font-black uppercase tracking-wider shadow cursor-pointer transition-colors ${
            debugMode
              ? "bg-[#00f0ff] text-[#0b0f19] border-white shadow-[0_0_10px_#00f0ff]"
              : "bg-[#0b0f19d0] text-[#00f0ff] border-[#00f0ff] hover:bg-[#162038]"
          }`}
        >
          {debugMode ? "🛠️ NAV DEBUG: ON" : "🛠️ NAV DEBUG: OFF"}
        </button>

        {debugMode && (
          <div className="bg-[#0b0f19]/95 border border-[#00f0ff] p-2 text-[8px] font-mono text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)] max-w-[200px]">
            <p>X: {playerPos.x.toFixed(2)}% | Y: {playerPos.y.toFixed(2)}%</p>
            <p>Facing: {direction.toUpperCase()}</p>
            <p>Moving: {isWalking ? "YES" : "IDLE"}</p>
            <p>Path Queue: {activePathQueue.length} nodes</p>
            {nearbyNPC && <p className="text-[#ffe600]">Nearby: {nearbyNPC.name}</p>}
          </div>
        )}
      </div>

      {/* 3. SIDE QUEST MENU */}
      <aside className="fixed top-1/2 -translate-y-1/2 right-2 sm:right-4 z-40 flex flex-col gap-1.5 sm:gap-2 select-none pointer-events-auto">
        {CYBER_NPCS.map((npc) => (
          <motion.button
            key={npc.id}
            onClick={() => navigateToNPC(npc)}
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center bg-[#0b0f19f0] hover:bg-[#162038] border-2 border-[#00f0ff] hover:border-[#ff007f] px-2 sm:px-3 py-1.5 sm:py-2 text-left shadow-[0_4px_15px_rgba(0,240,255,0.4)] cursor-pointer transition-all"
          >
            <span className="text-base sm:text-lg shrink-0">{npc.icon}</span>
            <div className="ml-2 hidden sm:block">
              <p className="text-[10px] font-black text-[#00f0ff] uppercase tracking-wider leading-tight">
                {npc.badge}
              </p>
              <p className="text-[8px] text-pink-400 font-bold leading-none">
                {npc.name}
              </p>
            </div>
            <span className="sm:hidden absolute right-full mr-2 bg-[#0b0f19] border border-[#00f0ff] text-[#00f0ff] text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-[0_0_8px_#00f0ff]">
              {npc.badge}
            </span>
          </motion.button>
        ))}
      </aside>

      {/* 4. VIRTUAL ANALOG JOYSTICK */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 pointer-events-auto select-none touch-none">
        <div
          onPointerDown={onJoystickPointerDown}
          onPointerMove={onJoystickPointerMove}
          onPointerUp={onJoystickPointerUp}
          onPointerCancel={onJoystickPointerUp}
          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-3 border-[#00f0ff] bg-[#0b0f19e6] backdrop-blur-xs ring-2 ring-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.4),0_8px_30px_rgba(0,0,0,0.85)] flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-[1px] bg-[#00f0ff]/20 pointer-events-none" />
          <div className="absolute inset-y-3 left-1/2 -translate-x-1/2 w-[1px] bg-[#00f0ff]/20 pointer-events-none" />

          <span className="absolute top-1 text-[9px] text-[#00f0ff]/60 pointer-events-none">▲</span>
          <span className="absolute bottom-1 text-[9px] text-[#00f0ff]/60 pointer-events-none">▼</span>
          <span className="absolute left-1 text-[9px] text-[#00f0ff]/60 pointer-events-none">◀</span>
          <span className="absolute right-1 text-[9px] text-[#00f0ff]/60 pointer-events-none">▶</span>

          <motion.div
            style={{
              transform: `translate3d(${knobPos.x}px, ${knobPos.y}px, 0)`,
            }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white bg-gradient-to-tr from-[#ff007f] via-[#ec4899] to-[#00f0ff] shadow-[0_0_15px_#ff007f,0_4px_12px_rgba(0,0,0,0.8)] flex items-center justify-center text-white text-base font-black pointer-events-none select-none"
          >
            ⚡
          </motion.div>
        </div>
      </div>

      {/* 5. SMART ACTION PROMPT BUTTON */}
      <AnimatePresence>
        {nearbyNPC && !activeDialogueNPC && !activeModal && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 15 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 pointer-events-auto flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-1.5 px-2.5 py-0.5 bg-[#00f0ff] text-[#0b0f19] border border-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-[0_0_12px_#00f0ff] flex items-center gap-1"
            >
              <span>{nearbyNPC.icon}</span>
              <span>BICARA DENGAN {nearbyNPC.name}</span>
            </motion.div>

            <motion.button
              onClick={() => onTalkToNPC(nearbyNPC)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-3 border-white bg-gradient-to-tr from-[#00f0ff] via-[#38bdf8] to-[#ff007f] text-[#0b0f19] ring-4 ring-[#00f0ff]/70 shadow-[0_0_25px_#00f0ff,0_6px_25px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform"
            >
              <span className="text-lg sm:text-xl drop-shadow">{nearbyNPC.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">BICARA</span>
              <span className="text-[8px] font-bold text-[#0b0f19]">[E]</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. RETRO CYBERPUNK RPG DIALOGUE BOX */}
      <AnimatePresence>
        {activeDialogueNPC && !activeModal && (
          <div className="fixed inset-x-0 bottom-3 sm:bottom-5 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-[#0b0f19fa] border-3 sm:border-4 border-[#00f0ff] ring-2 ring-[#ff007f] p-3.5 sm:p-5 shadow-[0_12px_45px_rgba(0,0,0,0.95),inset_0_0_20px_rgba(0,240,255,0.25)] pointer-events-auto select-none font-pixel"
            >
              <div className="absolute -top-2.5 -left-2.5 w-4 h-4 bg-[#ff007f] border-2 border-[#00f0ff] shadow flex items-center justify-center text-[7px] text-white font-black">
                ◆
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-[#ff007f] border-2 border-[#00f0ff] shadow flex items-center justify-center text-[7px] text-white font-black">
                ◆
              </div>
              <div className="absolute -bottom-2.5 -left-2.5 w-4 h-4 bg-[#ff007f] border-2 border-[#00f0ff] shadow flex items-center justify-center text-[7px] text-white font-black">
                ◆
              </div>
              <div className="absolute -bottom-2.5 -right-2.5 w-4 h-4 bg-[#ff007f] border-2 border-[#00f0ff] shadow flex items-center justify-center text-[7px] text-white font-black">
                ◆
              </div>

              <button
                onClick={() => setActiveDialogueNPC(null)}
                className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 bg-[#121829] border border-[#ff007f] text-[#ff007f] hover:bg-[#ff007f] hover:text-white font-black text-xs flex items-center justify-center cursor-pointer shadow transition-colors"
                title="Tutup Dialog [Esc]"
              >
                ✕
              </button>

              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 sm:border-3 border-[#00f0ff] bg-[#121829] overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.6)] [image-rendering:pixelated]">
                    <img
                      src={activeDialogueNPC.avatar}
                      alt={activeDialogueNPC.name}
                      className="w-full h-full object-cover [image-rendering:pixelated]"
                    />
                  </div>
                  <span className="mt-1 bg-[#121829] border border-[#ff007f] px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black text-[#00f0ff] uppercase tracking-wider shadow whitespace-nowrap">
                    [{activeDialogueNPC.name.split(" ")[0]}]
                  </span>
                </div>

                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#00f0ff] font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                      {activeDialogueNPC.name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-pink-400/90 font-semibold">
                      • {activeDialogueNPC.title}
                    </span>
                  </div>

                  <p className="text-gray-100 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                    &ldquo;{activeDialogueNPC.greeting}&rdquo;
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        const targetModal = activeDialogueNPC.stationId;
                        setActiveDialogueNPC(null);
                        setActiveModal(targetModal);
                        playCyberSound("select");
                      }}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#ff007f] text-[#0b0f19] border-2 border-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.7)] cursor-pointer flex items-center gap-1.5 active:scale-95 transition-transform"
                    >
                      <span>{activeDialogueNPC.icon}</span>
                      <span>{activeDialogueNPC.actionLabel}</span>
                    </button>

                    <button
                      onClick={() => setActiveDialogueNPC(null)}
                      className="px-3 py-1.5 bg-[#121829] hover:bg-[#1a233b] border border-[#00f0ff]/60 text-gray-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow cursor-pointer transition-colors"
                    >
                      TUTUP
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

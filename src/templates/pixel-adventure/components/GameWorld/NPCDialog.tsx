"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NPCEntity, NPCS } from "./types";
import { formatDate } from "@/lib/utils";
import { play8BitSound } from "../../sound";

import type { Couple } from "@/types/wedding";

interface NPCDialogProps {
  couple?: Couple | null;
  firstEvent?: {
    date: string;
  };
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
      {/* 1. TOP RETRO ROYAL BANNER */}
      <header className="fixed top-2.5 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-2 sm:border-3 border-[#f6d776] bg-[#2a0812e6] backdrop-blur-xs px-3 sm:px-5 py-1 sm:py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.85)] flex items-center gap-2 text-[#fde047] ring-1 ring-[#78350f]"
        >
          <span className="text-xs sm:text-sm">👑</span>
          <h1 className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#fde047] drop-shadow">
            {couple?.groomNickname || "ALEX"} &amp; {couple?.brideNickname || "SARA"}
          </h1>
          <span className="text-[10px] text-[#fef08a]/80 font-bold hidden sm:inline">•</span>
          <span className="text-[10px] sm:text-[11px] text-[#fef08a] font-bold tracking-wider hidden sm:inline">
            {firstEvent ? formatDate(firstEvent.date) : "20 OKTOBER 2026"}
          </span>
          <span className="text-xs sm:text-sm">👑</span>
        </motion.div>
      </header>

      {/* 2. SIDE QUEST MENU */}
      <aside className="fixed top-1/2 -translate-y-1/2 right-2 sm:right-4 z-40 flex flex-col gap-1.5 sm:gap-2 select-none pointer-events-auto">
        {NPCS.map((npc) => (
          <motion.button
            key={npc.id}
            onClick={() => navigateToNPC(npc)}
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center bg-[#2a0812f0] hover:bg-[#4c0519] border-2 border-[#f6d776] px-2 sm:px-3 py-1.5 sm:py-2 text-left shadow-[0_4px_12px_rgba(0,0,0,0.85)] ring-1 ring-[#78350f] cursor-pointer transition-all"
          >
            <span className="text-base sm:text-lg shrink-0">{npc.icon}</span>
            <div className="ml-2 hidden sm:block">
              <p className="text-[10px] font-black text-[#fde047] uppercase tracking-wider leading-tight">
                {npc.badge}
              </p>
              <p className="text-[8px] text-[#fef08a]/80 font-bold leading-none">
                {npc.name}
              </p>
            </div>
            <span className="sm:hidden absolute right-full mr-2 bg-[#2a0812] border border-[#f6d776] text-[#fde047] text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow">
              {npc.badge}
            </span>
          </motion.button>
        ))}
      </aside>

      {/* 3. DEVELOPER DEBUG HUD */}
      <div className="fixed top-12 left-3 sm:top-14 sm:left-4 z-40 pointer-events-auto flex flex-col gap-1 select-none">
        <button
          onClick={() => setDebugMode(!debugMode)}
          className={`px-2 py-1 border text-[9px] font-black uppercase tracking-wider shadow cursor-pointer transition-colors ${
            debugMode
              ? "bg-[#22c55e] text-[#052e16] border-white"
              : "bg-[#2a0812d0] text-[#fde047] border-[#f6d776] hover:bg-[#4c0519]"
          }`}
        >
          {debugMode ? "🛠️ NAV DEBUG: ON" : "🛠️ NAV DEBUG: OFF"}
        </button>

        {debugMode && (
          <div className="bg-[#18040a]/90 border border-[#22c55e] p-2 text-[8px] font-mono text-[#4ade80] shadow max-w-[200px]">
            <p>X: {playerPos.x.toFixed(2)}% | Y: {playerPos.y.toFixed(2)}%</p>
            <p>Facing: {direction.toUpperCase()}</p>
            <p>Moving: {isWalking ? "YES" : "IDLE"}</p>
            <p>Path Queue: {activePathQueue.length} nodes</p>
            {nearbyNPC && <p className="text-[#facc15]">Nearby: {nearbyNPC.name}</p>}
          </div>
        )}
      </div>

      {/* 4. VIRTUAL ANALOG JOYSTICK */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 pointer-events-auto select-none touch-none">
        <div
          onPointerDown={onJoystickPointerDown}
          onPointerMove={onJoystickPointerMove}
          onPointerUp={onJoystickPointerUp}
          onPointerCancel={onJoystickPointerUp}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#eab308] ring-1 ring-[#78350f] bg-[#2a0812e6] backdrop-blur-xs shadow-[0_6px_25px_rgba(0,0,0,0.85)] relative flex items-center justify-center cursor-pointer active:brightness-105"
        >
          <span className="absolute top-1 text-[8px] text-[#fde047]/70 font-black">▲</span>
          <span className="absolute bottom-1 text-[8px] text-[#fde047]/70 font-black">▼</span>
          <span className="absolute left-1 text-[8px] text-[#fde047]/70 font-black">◀</span>
          <span className="absolute right-1 text-[8px] text-[#fde047]/70 font-black">▶</span>

          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-dashed border-[#eab308]/30 pointer-events-none" />

          <motion.div
            animate={{ x: knobPos.x, y: knobPos.y }}
            transition={{ type: "spring", stiffness: 800, damping: 40 }}
            className="absolute w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#eab308] via-[#fde047] to-[#f59e0b] border-2 border-white shadow-[0_2px_12px_rgba(0,0,0,0.85)] ring-1 ring-[#78350f] flex items-center justify-center pointer-events-none"
          >
            <span className="text-xs text-[#451a03]">👑</span>
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
              className="mb-1 px-2 py-0.5 bg-[#fde047] text-[#451a03] border border-[#78350f] text-[9px] font-black uppercase tracking-wider shadow rounded-full flex items-center gap-1"
            >
              <span>{nearbyNPC.icon}</span>
              <span>BICARA DENGAN {nearbyNPC.name}</span>
            </motion.div>

            <motion.button
              onClick={() => onTalkToNPC(nearbyNPC)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-3 border-white bg-gradient-to-tr from-[#eab308] via-[#fde047] to-[#d97706] text-[#451a03] ring-4 ring-[#fde047]/70 shadow-[0_0_20px_#fde047,0_6px_20px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center cursor-pointer"
            >
              <span className="text-lg sm:text-xl drop-shadow">{nearbyNPC.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">BICARA</span>
              <span className="text-[8px] font-bold text-[#78350f]">[E]</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. RETRO WOODEN RPG DIALOGUE BOX */}
      <AnimatePresence>
        {activeDialogueNPC && !activeModal && (
          <div className="fixed inset-x-0 bottom-3 sm:bottom-5 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-[#24060ef8] border-3 sm:border-4 border-[#eab308] ring-2 ring-[#78350f] p-3 sm:p-5 shadow-[0_12px_45px_rgba(0,0,0,0.95),inset_0_0_20px_rgba(234,179,8,0.25)] pointer-events-auto select-none font-pixel"
            >
              <div className="absolute -top-2.5 -left-2.5 w-4 h-4 bg-[#fde047] border-2 border-[#78350f] shadow flex items-center justify-center text-[7px] text-[#78350f] font-black">
                ◆
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-[#fde047] border-2 border-[#78350f] shadow flex items-center justify-center text-[7px] text-[#78350f] font-black">
                ◆
              </div>
              <div className="absolute -bottom-2.5 -left-2.5 w-4 h-4 bg-[#fde047] border-2 border-[#78350f] shadow flex items-center justify-center text-[7px] text-[#78350f] font-black">
                ◆
              </div>
              <div className="absolute -bottom-2.5 -right-2.5 w-4 h-4 bg-[#fde047] border-2 border-[#78350f] shadow flex items-center justify-center text-[7px] text-[#78350f] font-black">
                ◆
              </div>

              <button
                onClick={() => setActiveDialogueNPC(null)}
                className="absolute top-2 right-2 w-6 h-6 bg-[#e11d48] border border-white text-white hover:bg-[#be123c] font-black text-xs flex items-center justify-center cursor-pointer shadow"
              >
                ✕
              </button>

              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 sm:border-3 border-[#fde047] bg-[#3b0d19] overflow-hidden shadow-[0_0_12px_rgba(253,224,71,0.5)] [image-rendering:pixelated]">
                    <img
                      src={activeDialogueNPC.avatar}
                      alt={activeDialogueNPC.name}
                      className="w-full h-full object-cover [image-rendering:pixelated]"
                    />
                  </div>
                  <span className="mt-1 bg-[#4c0519] border border-[#fde047] px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black text-[#fde047] uppercase tracking-wider shadow whitespace-nowrap">
                    [{activeDialogueNPC.name.split(" ")[0]}]
                  </span>
                </div>

                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#fde047] font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                      {activeDialogueNPC.name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-[#fef08a]/80 font-semibold">
                      • {activeDialogueNPC.title}
                    </span>
                  </div>

                  <p className="text-white text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                    &ldquo;{activeDialogueNPC.greeting}&rdquo;
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {activeDialogueNPC.id === "guide" ? (
                      <button
                        onClick={() => {
                          setActiveDialogueNPC(null);
                          play8BitSound("select");
                        }}
                        className="px-4 py-1.5 bg-[#3b0d19] hover:bg-[#4c0519] border-2 border-[#fde047] text-[#fde047] text-[10px] sm:text-xs font-black uppercase tracking-wider shadow cursor-pointer flex items-center gap-1.5"
                      >
                        <span>✕</span>
                        <span>TUTUP</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            const targetModal = activeDialogueNPC.stationId;
                            setActiveDialogueNPC(null);
                            setActiveModal(targetModal);
                            play8BitSound("magic");
                          }}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-[#eab308] via-[#fde047] to-[#ca8a04] hover:brightness-110 text-[#451a03] border-2 border-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{activeDialogueNPC.icon}</span>
                          <span>{activeDialogueNPC.actionLabel}</span>
                        </button>

                        <button
                          onClick={() => setActiveDialogueNPC(null)}
                          className="px-3 py-1.5 bg-[#3b0d19] hover:bg-[#4c0519] border border-[#fde047]/60 text-[#fef08a] text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
                        >
                          TUTUP
                        </button>
                      </>
                    )}
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

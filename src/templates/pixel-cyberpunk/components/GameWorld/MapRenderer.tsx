"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  NPCEntity,
  CYBER_NPCS,
  WAYPOINTS,
  EDGES,
  W,
  H,
} from "./types";

import type { Couple } from "@/types/wedding";

interface MapRendererProps {
  worldWidth: number;
  worldHeight: number;
  cameraPos: { x: number; y: number };
  playerPos: { x: number; y: number };
  direction: "up" | "down" | "left" | "right";
  isWalking: boolean;
  walkFrame: number;
  characterName: string;
  debugMode: boolean;
  activePathQueue: { x: number; y: number; id: string }[];
  targetBeacon: { x: number; y: number } | null;
  nearbyNPC: NPCEntity | null;
  couple?: Couple | null;
  onMapClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  navigateToNPC: (npc: NPCEntity) => void;
}

export function MapRenderer({
  worldWidth,
  worldHeight,
  cameraPos,
  playerPos,
  direction,
  isWalking,
  walkFrame,
  characterName,
  debugMode,
  activePathQueue,
  targetBeacon,
  nearbyNPC,
  couple,
  onMapClick,
  navigateToNPC,
}: MapRendererProps) {
  const getSpriteSrc = () => {
    if (!isWalking)
      return `/assets/templates/pixel-cyberpunk/characters/player/char-${direction}-0.png`;
    const frameIndex = walkFrame % 2 === 0 ? 1 : 2;
    return `/assets/templates/pixel-cyberpunk/characters/player/char-${direction}-${frameIndex}.png`;
  };

  const coupleNPC = CYBER_NPCS.find((n) => n.id === "couple")!;

  return (
    <div
      onClick={onMapClick}
      className="absolute top-0 left-0 cursor-crosshair overflow-hidden will-change-transform [image-rendering:pixelated] select-none"
      style={{
        width: `${worldWidth}px`,
        height: `${worldHeight}px`,
        transform: `translate3d(${cameraPos.x}px, ${cameraPos.y}px, 0)`,
      }}
    >
      {/* Base Rooftop Ground Map */}
      <img
        src="/assets/templates/pixel-cyberpunk/maps/skyline-district-v1/ground-map.png"
        alt="Cyberpunk Rooftop District Ground Map"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none [image-rendering:pixelated]"
      />

      {/* Central Quantum Fountain Pulsing Core */}
      <div
        className="absolute w-28 h-28 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse"
        style={{
          left: "50%",
          top: "52%",
          background:
            "radial-gradient(circle, rgba(0, 240, 255, 0.45) 0%, rgba(255, 0, 127, 0.15) 60%, transparent 80%)",
          filter: "blur(8px)",
        }}
      />

      {/* Click Target Beacon */}
      {targetBeacon && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
          style={{ left: `${targetBeacon.x}%`, top: `${targetBeacon.y}%` }}
        >
          <motion.div
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-10 h-10 rounded-full border-2 border-[#00f0ff] shadow-[0_0_15px_#00f0ff]"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#00f0ff] rounded-full shadow" />
        </div>
      )}

      {/* Developer Nav Debug Overlay */}
      {debugMode && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
          {EDGES.map(([fromId, toId], idx) => {
            const from = WAYPOINTS[fromId];
            const to = WAYPOINTS[toId];
            if (!from || !to) return null;
            return (
              <line
                key={`edge-${idx}`}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke="#00f0ff"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
            );
          })}
          {Object.values(WAYPOINTS).map((wpt) => (
            <circle
              key={`wpt-${wpt.id}`}
              cx={`${wpt.x}%`}
              cy={`${wpt.y}%`}
              r="4"
              fill="#ff007f"
              stroke="#ffffff"
              strokeWidth="1"
            />
          ))}
          {CYBER_NPCS.map((npc) => (
            <g key={`npc-debug-${npc.id}`}>
              <line
                x1={`${npc.x}%`}
                y1={`${npc.y}%`}
                x2={`${npc.interactionPoint.x}%`}
                y2={`${npc.interactionPoint.y}%`}
                stroke="#ffe600"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <circle
                cx={`${npc.interactionPoint.x}%`}
                cy={`${npc.interactionPoint.y}%`}
                r="3.5"
                fill="#ffe600"
                stroke="#0b0f19"
                strokeWidth="1"
              />
            </g>
          ))}
        </svg>
      )}

      {/* Royal Altar Wedding Couple (Liam & Elara) */}
      {coupleNPC && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            navigateToNPC(coupleNPC);
          }}
          className="absolute cursor-pointer group select-none flex flex-col items-center"
          style={{
            left: `${coupleNPC.x}%`,
            top: `${coupleNPC.y}%`,
            zIndex: Math.round(coupleNPC.y * 10),
            transform: "translate(-50%, -90%)",
          }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-[#0b0f19fa] border-2 border-[#ff007f] text-[#ff007f] text-[8px] sm:text-[9px] font-black px-2.5 py-0.5 shadow-[0_0_15px_rgba(255,0,127,0.7)] whitespace-nowrap flex items-center gap-1 mb-1 transition-transform group-hover:scale-105"
          >
            <span className="text-[#00f0ff]">💍</span>
            <span className="text-white font-extrabold tracking-wider">
              {(couple?.groomNickname || couple?.groomName || "LIAM").toUpperCase()} &amp;{" "}
              {(couple?.brideNickname || couple?.brideName || "ELARA").toUpperCase()}
            </span>
            <span className="text-[#00f0ff]">💍</span>
          </motion.div>

            <div className="relative flex items-end -space-x-3 transition-transform group-hover:scale-105">
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 sm:w-26 h-3.5 bg-black/60 rounded-full blur-[2px] pointer-events-none" />
            <img
              src="/assets/templates/pixel-cyberpunk/characters/npcs/npc-groom.png"
              alt="Groom"
              className="w-11 sm:w-15 h-16 sm:h-22 object-contain filter drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] [image-rendering:pixelated]"
            />
            <img
              src="/assets/templates/pixel-cyberpunk/characters/npcs/npc-bride.png"
              alt="Bride"
              className="w-13 sm:w-17 h-16 sm:h-22 object-contain filter drop-shadow-[0_0_12px_rgba(255,0,127,0.7)] [image-rendering:pixelated]"
            />
          </div>
        </div>
      )}

      {/* Interactive NPCs */}
      {CYBER_NPCS.filter((npc) => npc.id !== "couple").map((npc) => {
        const isNearby = nearbyNPC?.id === npc.id;
        return (
          <div
            key={npc.id}
            onClick={(e) => {
              e.stopPropagation();
              navigateToNPC(npc);
            }}
            className="absolute cursor-pointer group select-none flex flex-col items-center"
            style={{
              left: `${npc.x}%`,
              top: `${npc.y}%`,
              transform: "translate(-50%, -92%)",
              zIndex: Math.round(npc.y * 10),
            }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
            >
              <div className="px-1.5 py-0.5 rounded bg-[#0b0f19fa] border border-[#00f0ff] shadow-[0_0_8px_#00f0ff] text-[#00f0ff] text-[8px] sm:text-[9px] font-black uppercase whitespace-nowrap">
                {npc.badge}
              </div>
            </motion.div>

            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 sm:w-10 h-3 bg-black/60 rounded-full blur-[2px] pointer-events-none" />

            <img
              src={npc.avatar}
              alt={npc.name}
              className={`w-11 sm:w-15 h-16 sm:h-22 object-contain [image-rendering:pixelated] transition-transform ${
                isNearby
                  ? "scale-110 drop-shadow-[0_0_12px_rgba(0,240,255,0.9)]"
                  : "group-hover:scale-105"
              } ${npc.id === "messages" ? "filter hue-rotate(170deg)" : ""}`}
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        );
      })}

      {/* Playable Cyber Guest Character */}
      <div
        style={{
          left: `${playerPos.x}%`,
          top: `${playerPos.y}%`,
          zIndex: Math.round(playerPos.y * 10),
          transform: "translate3d(-50%, -92%, 0)",
        }}
        className="absolute flex flex-col items-center pointer-events-none will-change-transform"
      >
        <div className="pointer-events-none select-none bg-[#0b0f19fa] border-2 border-[#00f0ff] text-[#ffe600] text-[8px] sm:text-[9px] font-black px-2 py-0.5 mb-1 shadow-[0_0_12px_rgba(0,240,255,0.7)] whitespace-nowrap flex items-center gap-1 font-mono">
          <span className="text-[#00f0ff]">⚡</span>
          <span>{characterName}</span>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="absolute -bottom-1 w-8 h-3 rounded-full bg-cyan-950/80 blur-[2px]" />
          <img
            src={getSpriteSrc()}
            alt="Cyber Guest Sprite"
            className="w-11 sm:w-14 h-16 sm:h-20 object-contain filter drop-shadow-[0_0_8px_rgba(0,240,255,0.7)] [image-rendering:pixelated]"
          />
        </div>
      </div>

      {/* Overhead Entrance Archway */}
      <img
        src="/assets/templates/pixel-cyberpunk/maps/skyline-district-v1/skyline_gate_overlay.png"
        alt="Skyline Gardens Overhead Gate Canopy"
        className="absolute pointer-events-none select-none [image-rendering:pixelated]"
        style={{
          left: `${(566 / W) * 100}%`,
          top: `${(568 / H) * 100}%`,
          width: `${(244 / W) * 100}%`,
          height: `${(200 / H) * 100}%`,
          imageRendering: "pixelated",
          zIndex: Math.round(((568 + 102) / H) * 100 * 10),
        }}
      />
    </div>
  );
}

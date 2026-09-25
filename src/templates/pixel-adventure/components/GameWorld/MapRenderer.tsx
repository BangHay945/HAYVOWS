"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  NPCEntity,
  NPCS,
  WALKABLE_POLYGONS,
  WAYPOINTS,
  EDGES,
  W,
  H,
} from "./types";

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
  onMapClick,
  navigateToNPC,
}: MapRendererProps) {
  const getSpriteSrc = () => {
    if (!isWalking)
      return `/assets/templates/pixel-adventure/characters/player/char-${direction}-0.png`;
    const frameIndex = walkFrame % 2 === 0 ? 1 : 2;
    return `/assets/templates/pixel-adventure/characters/player/char-${direction}-${frameIndex}.png`;
  };

  return (
    <div
      onClick={onMapClick}
      className="absolute top-0 left-0 cursor-pointer overflow-hidden select-none"
      style={{
        width: `${worldWidth}px`,
        height: `${worldHeight}px`,
        transform: `translate3d(${cameraPos.x}px, ${cameraPos.y}px, 0)`,
        willChange: "transform",
      }}
    >
      {/* 1. Base Floating Island Map Image */}
      <img
        src="/assets/templates/pixel-adventure/maps/floating-island-v1/map.png"
        alt="Floating Island Map"
        className="w-full h-full object-cover select-none pointer-events-none [image-rendering:pixelated]"
        style={{ imageRendering: "pixelated" }}
      />

      {/* 2. Floating Atmospheric Sparkles & Clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute [image-rendering:pixelated]"
            style={{
              left: `${(i * 19 + 7) % 94}%`,
              top: `${(i * 29 + 11) % 90}%`,
              width: i % 2 === 0 ? "5px" : "7px",
              height: i % 2 === 0 ? "5px" : "7px",
              backgroundColor:
                i % 3 === 0 ? "#fde047" : i % 3 === 1 ? "#38bdf8" : "#fef08a",
              boxShadow: "0 0 8px rgba(253, 224, 71, 0.8)",
            }}
            animate={{
              y: [0, -28, 0],
              opacity: [0.2, 0.9, 0.2],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* 3. Developer Navigation Debug Mode Overlay */}
      {debugMode && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {WALKABLE_POLYGONS.map((poly, idx) => (
            <polygon
              key={`debug-poly-${idx}`}
              points={poly.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="rgba(34, 197, 94, 0.28)"
              stroke="#22c55e"
              strokeWidth="0.3"
            />
          ))}

          {EDGES.map(([u, v], i) => {
            const p1 = WAYPOINTS[u];
            const p2 = WAYPOINTS[v];
            return (
              <line
                key={i}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#22c55e"
                strokeWidth="0.3"
                strokeDasharray="0.8,0.8"
              />
            );
          })}

          {activePathQueue.map((pt, i) => {
            const prev = i === 0 ? playerPos : activePathQueue[i - 1];
            return (
              <line
                key={`path-${i}`}
                x1={prev.x}
                y1={prev.y}
                x2={pt.x}
                y2={pt.y}
                stroke="#38bdf8"
                strokeWidth="0.6"
              />
            );
          })}

          {Object.values(WAYPOINTS).map((wpt) => (
            <circle
              key={wpt.id}
              cx={wpt.x}
              cy={wpt.y}
              r="0.7"
              fill="#15803d"
              stroke="#ffffff"
              strokeWidth="0.2"
            />
          ))}

          {NPCS.map((npc) => (
            <g key={`npc-debug-${npc.id}`}>
              <line
                x1={npc.x}
                y1={npc.y}
                x2={npc.interactionPoint.x}
                y2={npc.interactionPoint.y}
                stroke="#f59e0b"
                strokeWidth="0.3"
                strokeDasharray="0.5,0.5"
              />
              <circle
                cx={npc.interactionPoint.x}
                cy={npc.interactionPoint.y}
                r="0.8"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="0.2"
              />
            </g>
          ))}
        </svg>
      )}

      {/* 4. Target Beacon */}
      {targetBeacon && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
          style={{ left: `${targetBeacon.x}%`, top: `${targetBeacon.y}%` }}
        >
          <motion.div
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-10 h-10 rounded-full border-2 border-[#fde047] shadow-[0_0_15px_#fde047]"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#fde047] rounded-full shadow" />
        </div>
      )}

      {/* 5. Interactive NPCs */}
      {NPCS.map((npc) => {
        const isNearby = nearbyNPC?.id === npc.id;
        return (
          <div
            key={npc.id}
            onClick={(e) => {
              e.stopPropagation();
              navigateToNPC(npc);
            }}
            className="absolute cursor-pointer group select-none"
            style={{
              left: `${npc.x}%`,
              top: `${npc.y}%`,
              transform: "translate(-50%, -95%)",
              zIndex: Math.floor(npc.y * 10) + 50,
            }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
            >
              {npc.id === "couple" ? (
                <div className="text-sm sm:text-base animate-bounce">💖</div>
              ) : (
                <div className="px-1.5 py-0.5 rounded bg-[#4c0519] border border-[#f6d776] shadow text-[#fde047] text-[8px] sm:text-[9px] font-black uppercase whitespace-nowrap">
                  {npc.badge}
                </div>
              )}
            </motion.div>

            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 sm:w-10 h-3 bg-black/40 rounded-full blur-xs pointer-events-none" />

            {npc.sprite ? (
              <img
                src={npc.sprite}
                alt={npc.name}
                className={`w-14 h-14 sm:w-18 sm:h-18 object-contain [image-rendering:pixelated] transition-transform ${
                  isNearby
                    ? "scale-110 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
                    : "group-hover:scale-105"
                }`}
                style={{ imageRendering: "pixelated" }}
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center text-2xl">
                {npc.icon}
              </div>
            )}
          </div>
        );
      })}

      {/* 6. Chibi Player Character */}
      <div
        className="absolute select-none pointer-events-none"
        style={{
          left: `${playerPos.x}%`,
          top: `${playerPos.y}%`,
          transform: "translate(-50%, -96%)",
          zIndex: Math.floor(playerPos.y * 10) + 50,
        }}
      >
        <div className="pointer-events-none select-none absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#4c0519]/90 border border-[#fde047] rounded text-[8px] sm:text-[9px] text-[#fef08a] font-black uppercase tracking-wider whitespace-nowrap shadow flex items-center gap-1 font-mono">
          <span>{characterName}</span>
        </div>

        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 sm:w-10 h-3 bg-black/45 rounded-full blur-xs pointer-events-none" />

        <img
          src={getSpriteSrc()}
          alt="Player Guest"
          className="w-12 h-12 sm:w-16 sm:h-16 object-contain [image-rendering:pixelated] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* 7. Overhead Archway Canopies */}
      <img
        src="/assets/templates/pixel-adventure/maps/floating-island-v1/castle_arch_overlay.png"
        alt="Castle Arch Overhead"
        className="absolute pointer-events-none select-none [image-rendering:pixelated]"
        style={{
          left: `${(790 / W) * 100}%`,
          top: `${(210 / H) * 100}%`,
          width: `${(120 / W) * 100}%`,
          height: `${(160 / H) * 100}%`,
          imageRendering: "pixelated",
          zIndex: Math.floor(((210 + 160) / H) * 100 * 10) + 55,
        }}
      />
      <img
        src="/assets/templates/pixel-adventure/maps/floating-island-v1/gazebo_arch_overlay.png"
        alt="Gazebo Arch Overhead"
        className="absolute pointer-events-none select-none [image-rendering:pixelated]"
        style={{
          left: `${(560 / W) * 100}%`,
          top: `${(250 / H) * 100}%`,
          width: `${(120 / W) * 100}%`,
          height: `${(160 / H) * 100}%`,
          imageRendering: "pixelated",
          zIndex: Math.floor(((250 + 160) / H) * 100 * 10) + 55,
        }}
      />
    </div>
  );
}

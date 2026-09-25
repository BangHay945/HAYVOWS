"use client";
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { TemplateComponentProps } from "@/types/template";
import { playCyberSound } from "../../sound";
import {
  NPCEntity,
  CYBER_NPCS,
  WAYPOINTS,
  canMoveTo,
  findShortestPath,
  resolveNPCCollision,
} from "./types";
import { MapRenderer } from "./MapRenderer";
import { NPCDialog } from "./NPCDialog";
import { StationPanel } from "./StationPanel";

export function CyberGameWorld({
  context,
  onRSVPSubmit,
  onTrack,
}: TemplateComponentProps) {
  const { wedding, guest, messages } = context;
  const couple = wedding.couple;

  // Viewport tracking for smooth camera
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Player position in district coordinates
  const [playerPos, setPlayerPos] = useState({ x: 50.0, y: 95.0 });
  const posRef = useRef({ x: 50.0, y: 95.0 });
  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">("up");
  const dirRef = useRef<"up" | "down" | "left" | "right">("up");
  const [isWalking, setIsWalking] = useState(false);
  const isWalkingRef = useRef(false);
  const [walkFrame, setWalkFrame] = useState(0);
  const walkDistRef = useRef(0);
  const stepSoundTimerRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Pathfinding Auto-Walk Queue
  const pathQueueRef = useRef<{ x: number; y: number; id: string }[]>([]);
  const [activePathQueue, setActivePathQueue] = useState<{ x: number; y: number; id: string }[]>([]);
  const [targetBeacon, setTargetBeacon] = useState<{ x: number; y: number } | null>(null);
  const pendingTargetNPCRef = useRef<NPCEntity | null>(null);

  const searchParams = useSearchParams();

  // Resolusi nama tamu dari URL
  const resolvedGuestName = useMemo(() => {
    const fromParam = searchParams?.get("to") || searchParams?.get("u");
    if (fromParam && fromParam.trim()) {
      try {
        return decodeURIComponent(fromParam).trim();
      } catch {
        return fromParam.trim();
      }
    }
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const winTo = urlParams.get("to") || urlParams.get("u");
      if (winTo && winTo.trim()) {
        try {
          return decodeURIComponent(winTo).trim();
        } catch {
          return winTo.trim();
        }
      }
    }
    if (guest?.name && guest.name.trim()) {
      return guest.name.trim();
    }
    return "VIP CYBER GUEST";
  }, [searchParams, guest?.name]);

  const [characterName, setCharacterName] = useState(resolvedGuestName);
  useEffect(() => {
    if (resolvedGuestName) {
      setCharacterName(resolvedGuestName);
    }
  }, [resolvedGuestName]);

  // Smooth Camera Coordinates
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 0 });
  const camRef = useRef({ x: 0, y: 0 });
  const camInitializedRef = useRef(false);

  // Developer Debug Mode Toggle
  const [debugMode, setDebugMode] = useState(false);

  // Virtual Analog Joystick
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const joystickVectorRef = useRef({ vx: 0, vy: 0, intensity: 0 });
  const isDraggingRef = useRef(false);
  const joystickCenterRef = useRef({ x: 0, y: 0 });

  // Keyboard Navigation State
  const keyStateRef = useRef({ up: false, down: false, left: false, right: false });

  // Dialogue & Modals
  const [nearbyNPC, setNearbyNPC] = useState<NPCEntity | null>(null);
  const [activeDialogueNPC, setActiveDialogueNPC] = useState<NPCEntity | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [allMessages, setAllMessages] = useState<any[]>(messages || []);
  useEffect(() => {
    if (messages) setAllMessages(messages);
  }, [messages]);

  // Countdown calculations
  const firstEvent = wedding.events?.[0];
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!firstEvent) return;
    const target = new Date(firstEvent.date + "T" + (firstEvent.startTime || "00:00"));
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [firstEvent]);

  // World Sizing
  const isMobile = viewportSize.width < 768;
  const MAP_ASPECT = 16 / 9;
  const zoomFactor = isMobile ? 1.55 : 1.25;

  let baseHeight = Math.max(viewportSize.height * zoomFactor, isMobile ? 850 : 900);
  let baseWidth = baseHeight * MAP_ASPECT;

  if (baseWidth < viewportSize.width * zoomFactor) {
    baseWidth = viewportSize.width * zoomFactor;
    baseHeight = baseWidth / MAP_ASPECT;
  }

  const worldWidth = Math.round(baseWidth);
  const worldHeight = Math.round(baseHeight);

  // Initialize smooth camera
  useEffect(() => {
    if (!camInitializedRef.current && worldWidth > 0 && worldHeight > 0) {
      const pX = (posRef.current.x / 100) * worldWidth;
      const pY = (posRef.current.y / 100) * worldHeight;
      const tCamX = viewportSize.width / 2 - pX;
      const tCamY = viewportSize.height / 2 - pY;
      const mCamX = viewportSize.width - worldWidth;
      const mCamY = viewportSize.height - worldHeight;
      const initX = mCamX < 0 ? Math.min(0, Math.max(mCamX, tCamX)) : (viewportSize.width - worldWidth) / 2;
      const initY = mCamY < 0 ? Math.min(0, Math.max(mCamY, tCamY)) : (viewportSize.height - worldHeight) / 2;
      camRef.current = { x: initX, y: initY };
      setCameraPos({ x: initX, y: initY });
      camInitializedRef.current = true;
    }
  }, [worldWidth, worldHeight, viewportSize]);

  // Navigate to an NPC
  const navigateToNPC = useCallback(
    (npc: NPCEntity) => {
      playCyberSound("select");
      setActiveDialogueNPC(null);
      setActiveModal(null);

      const fromX = posRef.current.x;
      const fromY = posRef.current.y;
      const toX = npc.interactionPoint.x;
      const toY = npc.interactionPoint.y;

      const path = findShortestPath(fromX, fromY, toX, toY);
      pendingTargetNPCRef.current = npc;
      pathQueueRef.current = path;
      setActivePathQueue([...path]);
      setTargetBeacon({ x: toX, y: toY });
    },
    []
  );

  // Map Click
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeDialogueNPC || activeModal) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / worldWidth) * 100;
    const clickY = ((e.clientY - rect.top) / worldHeight) * 100;

    let targetX = clickX;
    let targetY = clickY;

    if (!canMoveTo(clickX, clickY)) {
      let closestWpt = null;
      let minD = Infinity;
      for (const wpt of Object.values(WAYPOINTS)) {
        const d = Math.hypot(wpt.x - clickX, wpt.y - clickY);
        if (d < minD) {
          minD = d;
          closestWpt = wpt;
        }
      }

      if (closestWpt && minD < 14) {
        targetX = closestWpt.x;
        targetY = closestWpt.y;
      } else {
        return;
      }
    }

    const path = findShortestPath(posRef.current.x, posRef.current.y, targetX, targetY);
    pendingTargetNPCRef.current = null;
    pathQueueRef.current = path;
    setActivePathQueue([...path]);
    setTargetBeacon({ x: targetX, y: targetY });
    playCyberSound("move");
  };

  // 60FPS Game Loop
  useEffect(() => {
    let animId: number;

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop);

      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      if (activeDialogueNPC || activeModal) {
        return;
      }

      let vx = 0;
      let vy = 0;
      let isInputActive = false;

      if (pathQueueRef.current.length > 0) {
        const targetNode = pathQueueRef.current[0];
        const dx = targetNode.x - posRef.current.x;
        const dy = targetNode.y - posRef.current.y;
        const dist = Math.hypot(dx, dy);

        if (dist <= 0.8) {
          pathQueueRef.current.shift();
          setActivePathQueue([...pathQueueRef.current]);

          if (pathQueueRef.current.length === 0) {
            setTargetBeacon(null);
            if (pendingTargetNPCRef.current) {
              const targetNPC = pendingTargetNPCRef.current;
              dirRef.current = targetNPC.interactionPoint.facing;
              setDirection(targetNPC.interactionPoint.facing);
              setActiveDialogueNPC(targetNPC);
              playCyberSound("interact");
              onTrack?.(`wedding_talk_${targetNPC.id}`);
              pendingTargetNPCRef.current = null;
            }
          }
        } else {
          vx = dx / dist;
          vy = dy / dist;
          isInputActive = true;
        }
      } else {
        if (joystickVectorRef.current.intensity > 0.05) {
          vx = joystickVectorRef.current.vx;
          vy = joystickVectorRef.current.vy;
          isInputActive = true;
        } else {
          if (keyStateRef.current.up) vy -= 1;
          if (keyStateRef.current.down) vy += 1;
          if (keyStateRef.current.left) vx -= 1;
          if (keyStateRef.current.right) vx += 1;

          if (vx !== 0 || vy !== 0) {
            const len = Math.hypot(vx, vy);
            vx /= len;
            vy /= len;
            isInputActive = true;
          }
        }
      }

      const curX = posRef.current.x;
      const curY = posRef.current.y;
      let nextX = curX;
      let nextY = curY;

      if (isInputActive) {
        const SPEED = 8.5;
        const stepX = vx * SPEED * dt;
        const stepY = vy * SPEED * dt;

        let candidateX = curX;
        let candidateY = curY;

        if (canMoveTo(curX + stepX, curY + stepY)) {
          candidateX = curX + stepX;
          candidateY = curY + stepY;
        } else if (canMoveTo(curX + stepX, curY)) {
          candidateX = curX + stepX;
          candidateY = curY;
        } else if (canMoveTo(curX, curY + stepY)) {
          candidateX = curX;
          candidateY = curY + stepY;
        }

        const resolved = resolveNPCCollision(curX, curY, candidateX, candidateY);
        nextX = resolved.x;
        nextY = resolved.y;

        let newDir = dirRef.current;
        if (Math.abs(vx) > Math.abs(vy)) {
          newDir = vx > 0 ? "right" : "left";
        } else if (Math.abs(vy) > 0.05) {
          newDir = vy > 0 ? "down" : "up";
        }

        if (newDir !== dirRef.current) {
          dirRef.current = newDir;
          setDirection(newDir);
        }

        posRef.current = { x: nextX, y: nextY };
        setPlayerPos({ x: nextX, y: nextY });

        isWalkingRef.current = true;
        setIsWalking(true);

        const movedDist = Math.hypot(nextX - curX, nextY - curY);
        walkDistRef.current += movedDist;
        if (walkDistRef.current > 0.8) {
          walkDistRef.current = 0;
          setWalkFrame((f) => (f + 1) % 4);
        }

        stepSoundTimerRef.current += dt;
        if (stepSoundTimerRef.current >= 0.28) {
          stepSoundTimerRef.current = 0;
          playCyberSound("move");
        }
      } else {
        if (isWalkingRef.current) {
          isWalkingRef.current = false;
          setIsWalking(false);
          setWalkFrame(0);
        }
      }

      let closeNPC: NPCEntity | null = null;
      let minNpcDist = 3.6;
      for (const npc of CYBER_NPCS) {
        const d = Math.hypot(nextX - npc.interactionPoint.x, nextY - npc.interactionPoint.y);
        if (d < minNpcDist) {
          minNpcDist = d;
          closeNPC = npc;
        }
      }
      setNearbyNPC(closeNPC);

      const playerPixelX = (nextX / 100) * worldWidth;
      const playerPixelY = (nextY / 100) * worldHeight;

      const targetCamX = viewportSize.width / 2 - playerPixelX;
      const targetCamY = viewportSize.height / 2 - playerPixelY;

      const minCamX = viewportSize.width - worldWidth;
      const minCamY = viewportSize.height - worldHeight;

      const clampedCamX = minCamX < 0 ? Math.min(0, Math.max(minCamX, targetCamX)) : (viewportSize.width - worldWidth) / 2;
      const clampedCamY = minCamY < 0 ? Math.min(0, Math.max(minCamY, targetCamY)) : (viewportSize.height - worldHeight) / 2;

      const lerpSpeed = 0.12;
      camRef.current.x += (clampedCamX - camRef.current.x) * lerpSpeed;
      camRef.current.y += (clampedCamY - camRef.current.y) * lerpSpeed;

      setCameraPos({
        x: Math.round(camRef.current.x * 10) / 10,
        y: Math.round(camRef.current.y * 10) / 10,
      });
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [worldWidth, worldHeight, viewportSize, activeDialogueNPC, activeModal, onTrack]);

  // Joystick Controls
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeDialogueNPC || activeModal) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    joystickCenterRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    updateJoystick(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updateJoystick(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    joystickVectorRef.current = { vx: 0, vy: 0, intensity: 0 };
    setKnobPos({ x: 0, y: 0 });
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    pathQueueRef.current = [];
    setActivePathQueue([]);
    setTargetBeacon(null);

    const dx = clientX - joystickCenterRef.current.x;
    const dy = clientY - joystickCenterRef.current.y;
    const distance = Math.hypot(dx, dy);
    const maxRadius = 38;

    if (distance === 0) {
      joystickVectorRef.current = { vx: 0, vy: 0, intensity: 0 };
      setKnobPos({ x: 0, y: 0 });
      return;
    }

    const intensity = Math.min(1, distance / maxRadius);
    const clampedDist = Math.min(distance, maxRadius);
    const nx = dx / distance;
    const ny = dy / distance;

    joystickVectorRef.current = {
      vx: nx * intensity,
      vy: ny * intensity,
      intensity,
    };

    setKnobPos({
      x: nx * clampedDist,
      y: ny * clampedDist,
    });
  };

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeDialogueNPC || activeModal) {
        if (e.key === "Escape") {
          setActiveDialogueNPC(null);
          setActiveModal(null);
        }
        return;
      }

      pathQueueRef.current = [];
      setActivePathQueue([]);
      setTargetBeacon(null);

      if (e.key === "ArrowUp" || e.key === "KeyW" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        keyStateRef.current.up = true;
      } else if (e.key === "ArrowDown" || e.key === "KeyS" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        keyStateRef.current.down = true;
      } else if (e.key === "ArrowLeft" || e.key === "KeyA" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        keyStateRef.current.left = true;
      } else if (e.key === "ArrowRight" || e.key === "KeyD" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        keyStateRef.current.right = true;
      } else if (e.key === "Enter" || e.key === " " || e.key === "KeyE" || e.key === "e") {
        e.preventDefault();
        if (nearbyNPC) {
          dirRef.current = nearbyNPC.interactionPoint.facing;
          setDirection(nearbyNPC.interactionPoint.facing);
          setActiveDialogueNPC(nearbyNPC);
          playCyberSound("interact");
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "KeyW" || e.key === "w" || e.key === "W") {
        keyStateRef.current.up = false;
      } else if (e.key === "ArrowDown" || e.key === "KeyS" || e.key === "s" || e.key === "S") {
        keyStateRef.current.down = false;
      } else if (e.key === "ArrowLeft" || e.key === "KeyA" || e.key === "a" || e.key === "A") {
        keyStateRef.current.left = false;
      } else if (e.key === "ArrowRight" || e.key === "KeyD" || e.key === "d" || e.key === "D") {
        keyStateRef.current.right = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeDialogueNPC, activeModal, nearbyNPC]);

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden select-none font-pixel bg-[#070913]">
      <MapRenderer
        worldWidth={worldWidth}
        worldHeight={worldHeight}
        cameraPos={cameraPos}
        playerPos={playerPos}
        direction={direction}
        isWalking={isWalking}
        walkFrame={walkFrame}
        characterName={characterName}
        debugMode={debugMode}
        activePathQueue={activePathQueue}
        targetBeacon={targetBeacon}
        nearbyNPC={nearbyNPC}
        couple={couple}
        onMapClick={handleMapClick}
        navigateToNPC={navigateToNPC}
      />

      <NPCDialog
        couple={couple}
        firstEvent={firstEvent}
        characterName={characterName}
        debugMode={debugMode}
        setDebugMode={setDebugMode}
        playerPos={playerPos}
        direction={direction}
        isWalking={isWalking}
        activePathQueue={activePathQueue}
        nearbyNPC={nearbyNPC}
        activeDialogueNPC={activeDialogueNPC}
        activeModal={activeModal}
        setActiveDialogueNPC={setActiveDialogueNPC}
        setActiveModal={setActiveModal}
        navigateToNPC={navigateToNPC}
        onTalkToNPC={(npc) => {
          dirRef.current = npc.interactionPoint.facing;
          setDirection(npc.interactionPoint.facing);
          setActiveDialogueNPC(npc);
          playCyberSound("select");
        }}
        knobPos={knobPos}
        onJoystickPointerDown={handlePointerDown}
        onJoystickPointerMove={handlePointerMove}
        onJoystickPointerUp={handlePointerUp}
      />

      <StationPanel
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        context={context}
        resolvedGuestName={resolvedGuestName}
        countdown={countdown}
        onRSVPSubmit={onRSVPSubmit}
        allMessages={allMessages}
        setAllMessages={setAllMessages}
      />
    </div>
  );
}

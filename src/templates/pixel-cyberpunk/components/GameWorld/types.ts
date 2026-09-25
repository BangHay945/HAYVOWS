// Data-driven navigation graph & NPC definitions for Cyberpunk Neo-District
// Native Map Dimensions: 1376 x 768

export interface Waypoint {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  label: string;
}

export interface NPCEntity {
  id: string;
  type: "guide" | "couple" | "event" | "rsvp" | "messages" | "gift" | "gallery";
  name: string;
  title: string;
  badge: string;
  icon: string;
  x: number; // percentage
  y: number; // percentage
  interactionPoint: {
    x: number;
    y: number;
    facing: "up" | "down" | "left" | "right";
  };
  avatar: string;
  sprite?: string;
  greeting: string;
  actionLabel: string;
  stationId: string;
}

export const MAP_SIZE = { width: 1376, height: 768 };
export const W = 1376;
export const H = 768;

// Exact Walkable Polygons Mapped Strictly to Rooftop Architecture
export const WALKABLE_POLYGONS: { x: number; y: number }[][] = [
  // 1. South Entrance Ramp & Skyline Gardens Gate
  [
    { x: (630 / W) * 100, y: (768 / H) * 100 },
    { x: (630 / W) * 100, y: (620 / H) * 100 },
    { x: (746 / W) * 100, y: (620 / H) * 100 },
    { x: (746 / W) * 100, y: (768 / H) * 100 },
  ],
  // 2. Central Fountain Diamond Plaza
  [
    { x: (688 / W) * 100, y: (665 / H) * 100 },
    { x: (380 / W) * 100, y: (505 / H) * 100 },
    { x: (560 / W) * 100, y: (365 / H) * 100 },
    { x: (816 / W) * 100, y: (365 / H) * 100 },
    { x: (996 / W) * 100, y: (505 / H) * 100 },
  ],
  // 3. Altar Center Stairs & Royal Wedding Stage
  [
    { x: (560 / W) * 100, y: (365 / H) * 100 },
    { x: (515 / W) * 100, y: (280 / H) * 100 },
    { x: (515 / W) * 100, y: (240 / H) * 100 },
    { x: (861 / W) * 100, y: (240 / H) * 100 },
    { x: (861 / W) * 100, y: (280 / H) * 100 },
    { x: (816 / W) * 100, y: (365 / H) * 100 },
  ],
  // 4. Northwest Avenue towards Gazebo
  [
    { x: (440 / W) * 100, y: (480 / H) * 100 },
    { x: (310 / W) * 100, y: (405 / H) * 100 },
    { x: (245 / W) * 100, y: (425 / H) * 100 },
    { x: (245 / W) * 100, y: (475 / H) * 100 },
    { x: (340 / W) * 100, y: (520 / H) * 100 },
    { x: (450 / W) * 100, y: (525 / H) * 100 },
  ],
  // 5. Gazebo Interior Platform
  [
    { x: (175 / W) * 100, y: (365 / H) * 100 },
    { x: (350 / W) * 100, y: (365 / H) * 100 },
    { x: (370 / W) * 100, y: (440 / H) * 100 },
    { x: (315 / W) * 100, y: (470 / H) * 100 },
    { x: (175 / W) * 100, y: (445 / H) * 100 },
  ],
  // 6. Far West Panoramic Terrace
  [
    { x: (75 / W) * 100, y: (425 / H) * 100 },
    { x: (275 / W) * 100, y: (425 / H) * 100 },
    { x: (275 / W) * 100, y: (520 / H) * 100 },
    { x: (75 / W) * 100, y: (520 / H) * 100 },
  ],
  // 7. Northeast Avenue towards Clock Tower
  [
    { x: (936 / W) * 100, y: (480 / H) * 100 },
    { x: (1035 / W) * 100, y: (415 / H) * 100 },
    { x: (1110 / W) * 100, y: (415 / H) * 100 },
    { x: (1110 / W) * 100, y: (485 / H) * 100 },
    { x: (1025 / W) * 100, y: (520 / H) * 100 },
    { x: (926 / W) * 100, y: (525 / H) * 100 },
  ],
  // 8. Far East Terrace
  [
    { x: (1085 / W) * 100, y: (465 / H) * 100 },
    { x: (1245 / W) * 100, y: (465 / H) * 100 },
    { x: (1245 / W) * 100, y: (530 / H) * 100 },
    { x: (1085 / W) * 100, y: (530 / H) * 100 },
  ],
  // 9. South Railing Promenade
  [
    { x: (250 / W) * 100, y: (495 / H) * 100 },
    { x: (630 / W) * 100, y: (620 / H) * 100 },
    { x: (746 / W) * 100, y: (620 / H) * 100 },
    { x: (1110 / W) * 100, y: (495 / H) * 100 },
    { x: (1110 / W) * 100, y: (535 / H) * 100 },
    { x: (746 / W) * 100, y: (665 / H) * 100 },
    { x: (630 / W) * 100, y: (665 / H) * 100 },
    { x: (250 / W) * 100, y: (535 / H) * 100 },
  ],
];

// Fountain Cutout Ellipse
export const FOUNTAIN_CUTOUT = {
  cx: (688 / W) * 100,
  cy: (465 / H) * 100,
  rx: (122 / W) * 100,
  ry: (66 / H) * 100,
};

// Point-in-polygon raycasting algorithm
export function isPointInPoly(
  x: number,
  y: number,
  poly: { x: number; y: number }[]
): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// 100% Exact Walkable Path Check
export function isWalkable(x: number, y: number): boolean {
  if (x < 4 || x > 95 || y < 20 || y > 98) return false;

  const dx = (x - FOUNTAIN_CUTOUT.cx) / FOUNTAIN_CUTOUT.rx;
  const dy = (y - FOUNTAIN_CUTOUT.cy) / FOUNTAIN_CUTOUT.ry;
  if (dx * dx + dy * dy <= 1.0) return false;

  for (const poly of WALKABLE_POLYGONS) {
    if (isPointInPoly(x, y, poly)) return true;
  }
  return false;
}

export const canMoveTo = isWalkable;

// Raycast Line of Sight
export function hasLineOfSight(x1: number, y1: number, x2: number, y2: number, steps = 14): boolean {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    if (!isWalkable(x, y)) return false;
  }
  return true;
}

export const WAYPOINTS: Record<string, Waypoint> = {
  spawn: { id: "spawn", x: (688 / W) * 100, y: (730 / H) * 100, label: "Ramp Masuk" },
  gate: { id: "gate", x: (688 / W) * 100, y: (655 / H) * 100, label: "Gerbang Utama" },
  fountain_south: { id: "fountain_south", x: (688 / W) * 100, y: (580 / H) * 100, label: "Quantum Fountain" },
  guide_spot: { id: "guide_spot", x: (520 / W) * 100, y: (555 / H) * 100, label: "CS-Enforcer" },
  messages_spot: { id: "messages_spot", x: (850 / W) * 100, y: (555 / H) * 100, label: "Quantum Nymph" },
  plaza_sw: { id: "plaza_sw", x: (480 / W) * 100, y: (490 / H) * 100, label: "Plaza SW" },
  plaza_se: { id: "plaza_se", x: (896 / W) * 100, y: (490 / H) * 100, label: "Plaza SE" },
  gallery_spot: { id: "gallery_spot", x: (545 / W) * 100, y: (425 / H) * 100, label: "Holo-Curator" },
  gift_spot: { id: "gift_spot", x: (830 / W) * 100, y: (425 / H) * 100, label: "Vault Master" },
  stairs_bottom: { id: "stairs_bottom", x: (688 / W) * 100, y: (365 / H) * 100, label: "Tangga Altar" },
  altar_stage: { id: "altar_stage", x: (685 / W) * 100, y: (290 / H) * 100, label: "Pelaminan Mempelai" },
  gazebo_avenue: { id: "gazebo_avenue", x: (410 / W) * 100, y: (475 / H) * 100, label: "Jalan Gazebo" },
  gazebo_steps: { id: "gazebo_steps", x: (330 / W) * 100, y: (440 / H) * 100, label: "Tangga Gazebo" },
  gazebo_spot: { id: "gazebo_spot", x: (271 / W) * 100, y: (415 / H) * 100, label: "Android Barista" },
  clock_door: { id: "clock_door", x: (1025 / W) * 100, y: (460 / H) * 100, label: "Citadel Herald" },
};

export const EDGES: [string, string][] = [
  ["spawn", "gate"],
  ["gate", "fountain_south"],
  ["fountain_south", "guide_spot"],
  ["fountain_south", "messages_spot"],
  ["guide_spot", "plaza_sw"],
  ["messages_spot", "plaza_se"],
  ["plaza_sw", "gallery_spot"],
  ["plaza_se", "gift_spot"],
  ["gallery_spot", "stairs_bottom"],
  ["gift_spot", "stairs_bottom"],
  ["stairs_bottom", "altar_stage"],
  ["plaza_sw", "gazebo_avenue"],
  ["gazebo_avenue", "gazebo_steps"],
  ["gazebo_steps", "gazebo_spot"],
  ["plaza_se", "clock_door"],
];

// Smart Pathfinding (Dijkstra)
export function findShortestPath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): { x: number; y: number; id: string }[] {
  if (hasLineOfSight(fromX, fromY, toX, toY)) {
    return [{ x: toX, y: toY, id: "target" }];
  }

  const dist = (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
    Math.hypot(p1.x - p2.x, p1.y - p2.y);

  let nearestFrom: string | null = null;
  let minDistFrom = Infinity;
  let nearestTo: string | null = null;
  let minDistTo = Infinity;

  for (const [id, wpt] of Object.entries(WAYPOINTS)) {
    const dF = dist({ x: fromX, y: fromY }, wpt);
    const visibleF = hasLineOfSight(fromX, fromY, wpt.x, wpt.y);
    const scoreF = dF + (visibleF ? 0 : 50);
    if (scoreF < minDistFrom) {
      minDistFrom = scoreF;
      nearestFrom = id;
    }

    const dT = dist({ x: toX, y: toY }, wpt);
    const visibleT = hasLineOfSight(toX, toY, wpt.x, wpt.y);
    const scoreT = dT + (visibleT ? 0 : 50);
    if (scoreT < minDistTo) {
      minDistTo = scoreT;
      nearestTo = id;
    }
  }

  if (!nearestFrom || !nearestTo) {
    return [{ x: toX, y: toY, id: "target" }];
  }

  const graph: Record<string, { to: string; weight: number }[]> = {};
  for (const id of Object.keys(WAYPOINTS)) graph[id] = [];
  for (const [u, v] of EDGES) {
    const d = dist(WAYPOINTS[u], WAYPOINTS[v]);
    graph[u].push({ to: v, weight: d });
    graph[v].push({ to: u, weight: d });
  }

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set(Object.keys(WAYPOINTS));

  for (const id of Object.keys(WAYPOINTS)) {
    distances[id] = Infinity;
    previous[id] = null;
  }
  distances[nearestFrom] = 0;

  while (unvisited.size > 0) {
    let current: string | null = null;
    let minD = Infinity;
    for (const id of unvisited) {
      if (distances[id] < minD) {
        minD = distances[id];
        current = id;
      }
    }
    if (!current || minD === Infinity || current === nearestTo) break;
    unvisited.delete(current);

    for (const neighbor of graph[current]) {
      if (unvisited.has(neighbor.to)) {
        const alt = distances[current] + neighbor.weight;
        if (alt < distances[neighbor.to]) {
          distances[neighbor.to] = alt;
          previous[neighbor.to] = current;
        }
      }
    }
  }

  const wptPath: string[] = [];
  let curr: string | null = nearestTo;
  while (curr) {
    wptPath.unshift(curr);
    curr = previous[curr];
  }

  let startIdx = 0;
  if (wptPath.length > 1) {
    const secondWpt = WAYPOINTS[wptPath[1]];
    if (hasLineOfSight(fromX, fromY, secondWpt.x, secondWpt.y)) {
      startIdx = 1;
    }
  }

  const result: { x: number; y: number; id: string }[] = [];
  for (let i = startIdx; i < wptPath.length; i++) {
    const id = wptPath[i];
    result.push({ x: WAYPOINTS[id].x, y: WAYPOINTS[id].y, id });
  }

  if (result.length > 0) {
    const lastWpt = result[result.length - 1];
    if (dist(lastWpt, { x: toX, y: toY }) < 1.2) {
      result.pop();
    }
  }

  result.push({ x: toX, y: toY, id: "target" });
  return result;
}

// 7 Interactive Cyberpunk NPCs
export const CYBER_NPCS: NPCEntity[] = [
  {
    id: "guide",
    type: "guide",
    name: "CS-Enforcer",
    title: "PENGAWAL SANCTUARY & PEMANDU",
    badge: "🧭 PEMANDU",
    icon: "🧭",
    x: (543 / W) * 100,
    y: (536 / H) * 100,
    interactionPoint: { x: (520 / W) * 100, y: (555 / H) * 100, facing: "up" },
    avatar:
      "/assets/templates/pixel-cyberpunk/characters/npcs/npc-bouncer.png",
    greeting:
      "Selamat datang di Skyline Neo-District! Silakan jelajahi rooftop plaza dan temui para sahabat di sekitar kota untuk melihat profil kedua mempelai, jadwal acara & hitung mundur, galeri foto, buku tamu (RSVP), doa restu, dan kado digital.",
    actionLabel: "TUTUP",
    stationId: "guide",
  },
  {
    id: "couple",
    type: "couple",
    name: "Kedua Mempelai",
    title: "MEMPELAI BAHAGIA (OUR STORY)",
    badge: "👑 KEDUA MEMPELAI",
    icon: "👑",
    x: (685 / W) * 100,
    y: (252 / H) * 100,
    interactionPoint: { x: (685 / W) * 100, y: (290 / H) * 100, facing: "up" },
    avatar:
      "/assets/templates/pixel-cyberpunk/characters/portraits/portrait-bride.png",
    greeting:
      "Selamat datang di hari bahagia kami di Skyline Neo-District! Kehadiran dan doa restu Anda adalah kehormatan terbesar bagi kami. Kami ingin berbagi profil dan babak kisah perjalanan cinta kami denganmu.",
    actionLabel: "BUKA KISAH CINTA",
    stationId: "couple",
  },
  {
    id: "event",
    type: "event",
    name: "Penjaga Waktu",
    title: "PENJAGA WAKTU & PROTOKOL ACARA",
    badge: "⏳ PENJAGA WAKTU",
    icon: "⏳",
    x: (1068 / W) * 100,
    y: (460 / H) * 100,
    interactionPoint: { x: (1025 / W) * 100, y: (460 / H) * 100, facing: "right" },
    avatar: "/assets/templates/pixel-cyberpunk/characters/npcs/npc-guard.png",
    greeting:
      "Titah dan protokol perayaan resmi diumumkan! Saksikan hitung mundur hari bahagia, jadwal prosesi akad dan resepsi agung, serta peta rute navigasi menuju lokasi acara di sini!",
    actionLabel: "LIHAT JADWAL ACARA",
    stationId: "event",
  },
  {
    id: "rsvp",
    type: "rsvp",
    name: "Android Barista",
    title: "BUKU TAMU & RESERVASI KEHADIRAN",
    badge: "📜 BUKU TAMU / RSVP",
    icon: "📜",
    x: (271 / W) * 100,
    y: (380 / H) * 100,
    interactionPoint: { x: (271 / W) * 100, y: (415 / H) * 100, facing: "up" },
    avatar:
      "/assets/templates/pixel-cyberpunk/characters/npcs/npc-barista.png",
    greeting:
      "Salam hormat dari Skyline Lounge! Mohon konfirmasikan kehadiran Anda pada pesta ini agar kami dapat mempersiapkan kursi VIP dan jamuan terbaik untuk Anda sekeluarga.",
    actionLabel: "ISI KONFIRMASI RSVP",
    stationId: "rsvp",
  },
  {
    id: "messages",
    type: "messages",
    name: "Quantum Nymph",
    title: "KOTAK UCAPAN & DOA RESTU",
    badge: "✉️ KOTAK UCAPAN",
    icon: "✉️",
    x: (827 / W) * 100,
    y: (545 / H) * 100,
    interactionPoint: { x: (850 / W) * 100, y: (555 / H) * 100, facing: "up" },
    avatar: "/assets/templates/pixel-cyberpunk/characters/npcs/npc-guest.png",
    greeting:
      "Pancarkan untaian kata dan doa restu yang hangat untuk kedua mempelai agar terukir abadi dalam Quantum Matrix langit kota. Setiap doa restu Anda sangat berarti bagi mereka.",
    actionLabel: "TULIS UCAPAN & DOA",
    stationId: "messages",
  },
  {
    id: "gift",
    type: "gift",
    name: "Vault Master",
    title: "AMPLOP DIGITAL & TANDA KASIH",
    badge: "🎁 TANDA KASIH",
    icon: "🎁",
    x: (793 / W) * 100,
    y: (412 / H) * 100,
    interactionPoint: { x: (830 / W) * 100, y: (425 / H) * 100, facing: "left" },
    avatar: "/assets/templates/pixel-cyberpunk/characters/npcs/npc-droid.png",
    greeting:
      "Bagi sahabat yang ingin memberikan tanda kasih dan hadiah pernikahan, nomor rekening resmi kedua mempelai serta QRIS dapat diakses melalui brankas digital aman ini.",
    actionLabel: "BUKA REKENING KADO",
    stationId: "gift",
  },
  {
    id: "gallery",
    type: "gallery",
    name: "Holo-Curator",
    title: "KURATOR POTRET HOLOGRAM (PHOTO GALLERY)",
    badge: "🎨 GALERI FOTO",
    icon: "🎨",
    x: (581 / W) * 100,
    y: (411 / H) * 100,
    interactionPoint: { x: (545 / W) * 100, y: (425 / H) * 100, facing: "right" },
    avatar:
      "/assets/templates/pixel-cyberpunk/characters/npcs/npc-archivist.png",
    greeting:
      "Selamat datang di Holo-Galeri! Setiap senyuman manis dan momen indah kedua mempelai telah diabadikan dalam kanvas hologram. Mari nikmati galeri foto prewedding mereka!",
    actionLabel: "LIHAT GALERI FOTO",
    stationId: "gallery",
  },
];

// Smooth NPC Circular Collision
export function resolveNPCCollision(
  curX: number,
  curY: number,
  targetX: number,
  targetY: number
): { x: number; y: number } {
  let resolvedX = targetX;
  let resolvedY = targetY;
  const ASPECT = W / H;
  const RADIUS = 1.6;

  for (const npc of CYBER_NPCS) {
    const dx = (resolvedX - npc.x) * ASPECT;
    const dy = resolvedY - npc.y;
    const dist = Math.hypot(dx, dy);

    if (dist < RADIUS) {
      if (dist > 0.0001) {
        const pushedDx = (dx / dist) * RADIUS;
        const pushedDy = (dy / dist) * RADIUS;
        const candidateX = npc.x + pushedDx / ASPECT;
        const candidateY = npc.y + pushedDy;

        if (isWalkable(candidateX, candidateY)) {
          resolvedX = candidateX;
          resolvedY = candidateY;
        } else if (isWalkable(candidateX, curY)) {
          resolvedX = candidateX;
          resolvedY = curY;
        } else if (isWalkable(curX, candidateY)) {
          resolvedX = curX;
          resolvedY = candidateY;
        } else {
          resolvedX = curX;
          resolvedY = curY;
        }
      } else {
        resolvedX = curX;
        resolvedY = curY;
      }
    }
  }
  return { x: resolvedX, y: resolvedY };
}

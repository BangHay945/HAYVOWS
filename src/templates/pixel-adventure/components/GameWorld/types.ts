// Data-driven navigation graph, collision detection & NPC entities for Pixel Adventure
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

// Exact Walkable Polygons Mapped Strictly to User-Defined Path (Y-Shaped Pattern)
export const WALKABLE_POLYGONS: { x: number; y: number }[][] = [
  [
    // 1. South Bridge & Entrance Walkway
    { x: (634 / W) * 100, y: (768 / H) * 100 },
    { x: (634 / W) * 100, y: (461 / H) * 100 },
    { x: (605 / W) * 100, y: (434 / H) * 100 },
    { x: (585 / W) * 100, y: (396 / H) * 100 },
    { x: (578 / W) * 100, y: (349 / H) * 100 },
    
    // 2. Gazebo Arm (Left Branch)
    { x: (530 / W) * 100, y: (323 / H) * 100 },
    { x: (502 / W) * 100, y: (296 / H) * 100 },
    { x: (544 / W) * 100, y: (273 / H) * 100 },
    { x: (605 / W) * 100, y: (303 / H) * 100 },
    { x: (640 / W) * 100, y: (328 / H) * 100 },

    // 3. Center Flowerbed Front Edge
    { x: (775 / W) * 100, y: (328 / H) * 100 },

    // 4. Castle Arm (Right Branch)
    { x: (833 / W) * 100, y: (303 / H) * 100 },
    { x: (956 / W) * 100, y: (257 / H) * 100 },
    { x: (984 / W) * 100, y: (276 / H) * 100 },
    { x: (874 / W) * 100, y: (342 / H) * 100 },
    
    // 5. East Plaza & Bridge Return
    { x: (812 / W) * 100, y: (380 / H) * 100 },
    { x: (791 / W) * 100, y: (422 / H) * 100 },
    { x: (746 / W) * 100, y: (461 / H) * 100 },
    { x: (746 / W) * 100, y: (768 / H) * 100 },
  ],
];

// Point-in-polygon raycasting algorithm
export function isPointInPoly(
  x: number,
  y: number,
  poly: { x: number; y: number }[]
): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x,
      yi = poly[i].y;
    const xj = poly[j].x,
      yj = poly[j].y;
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// 100% Exact Walkable Path Check
export function isWalkable(x: number, y: number): boolean {
  for (const poly of WALKABLE_POLYGONS) {
    if (isPointInPoly(x, y, poly)) return true;
  }
  return false;
}

// Raycast Line of Sight
export function hasLineOfSight(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  steps = 14
): boolean {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    if (!isWalkable(x, y)) return false;
  }
  return true;
}

export const WAYPOINTS: Record<string, Waypoint> = {
  bridge_spawn: { id: "bridge_spawn", x: (690 / W) * 100, y: (745 / H) * 100, label: "Jembatan Masuk" },
  bridge_guide: { id: "bridge_guide", x: (690 / W) * 100, y: (580 / H) * 100, label: "Pos Pemandu" },
  path_mid: { id: "path_mid", x: (690 / W) * 100, y: (520 / H) * 100, label: "Jalan Setapak" },
  plaza_south: { id: "plaza_south", x: (690 / W) * 100, y: (475 / H) * 100, label: "Pintu Masuk Plaza" },
  plaza_center: { id: "plaza_center", x: (690 / W) * 100, y: (415 / H) * 100, label: "Pusat Plaza" },
  plaza_west: { id: "plaza_west", x: (645 / W) * 100, y: (430 / H) * 100, label: "Plaza Barat" },
  plaza_east: { id: "plaza_east", x: (735 / W) * 100, y: (430 / H) * 100, label: "Plaza Timur" },
  plaza_north: { id: "plaza_north", x: (690 / W) * 100, y: (360 / H) * 100, label: "Plaza Utara" },
  gazebo_entry: { id: "gazebo_entry", x: (640 / W) * 100, y: (400 / H) * 100, label: "Akses Gazebo" },
  gazebo_path: { id: "gazebo_path", x: (607 / W) * 100, y: (335 / H) * 100, label: "Jalan Gazebo" },
  gazebo_stairs: { id: "gazebo_stairs", x: (565 / W) * 100, y: (301 / H) * 100, label: "Tangga Gazebo" },
  gazebo_deck: { id: "gazebo_deck", x: (550 / W) * 100, y: (291 / H) * 100, label: "Pavilion Mempelai" },
  castle_entry: { id: "castle_entry", x: (790 / W) * 100, y: (365 / H) * 100, label: "Akses Istana" },
  castle_ramp: { id: "castle_ramp", x: (865 / W) * 100, y: (310 / H) * 100, label: "Tanjakan Istana" },
  castle_gate: { id: "castle_gate", x: (940 / W) * 100, y: (265 / H) * 100, label: "Gerbang Istana" },
};

export const EDGES: [string, string][] = [
  ["bridge_spawn", "bridge_guide"],
  ["bridge_guide", "path_mid"],
  ["path_mid", "plaza_south"],
  ["plaza_south", "plaza_center"],
  ["plaza_center", "plaza_west"],
  ["plaza_center", "plaza_east"],
  ["plaza_center", "plaza_north"],
  ["plaza_center", "gazebo_entry"],
  ["gazebo_entry", "gazebo_path"],
  ["gazebo_path", "gazebo_stairs"],
  ["gazebo_stairs", "gazebo_deck"],
  ["plaza_center", "castle_entry"],
  ["castle_entry", "castle_ramp"],
  ["castle_ramp", "castle_gate"],
];

// Smart Pathfinding (Direct Line-of-Sight or Dijkstra through Waypoints)
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

// Defined NPCs on Floating Island with Exact Coordinates
export const NPCS: NPCEntity[] = [
  {
    id: "guide",
    type: "guide",
    name: "Guide Aria",
    title: "PEMANDU WISATA KERAJAAN",
    badge: "🧭 PEMANDU",
    icon: "🧭",
    x: (730 / W) * 100,
    y: (580 / H) * 100,
    interactionPoint: {
      x: (690 / W) * 100,
      y: (580 / H) * 100,
      facing: "right",
    },
    avatar: "/assets/templates/pixel-adventure/characters/npcs/guide_portrait.png",
    sprite: "/assets/templates/pixel-adventure/characters/npcs/guide_sprite.png",
    greeting:
      "Selamat datang di Pulau Langit Kerajaan! Silakan jelajahi pulau dan bicara dengan para sahabat di sekitar istana untuk melihat kisah cinta, jadwal acara, galeri foto, RSVP, dan tanda kasih.",
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
    x: (530 / W) * 100,
    y: (280 / H) * 100,
    interactionPoint: {
      x: (550 / W) * 100,
      y: (291 / H) * 100,
      facing: "up",
    },
    avatar: "/assets/templates/pixel-adventure/characters/npcs/couple_portrait.png",
    sprite: "/assets/templates/pixel-adventure/characters/npcs/couple_sprite.png",
    greeting:
      "Hai Sahabat Tersayang! Terima kasih telah berkunjung ke gazebo kenangan kami. Kami ingin berbagi kisah perjalanan cinta dan potret bahagia kami denganmu.",
    actionLabel: "BUKA KISAH CINTA",
    stationId: "couple",
  },
  {
    id: "event",
    type: "event",
    name: "Herald Valen",
    title: "PENGAWAL AGUNG ISTANA (WEDDING DAY)",
    badge: "🏰 JADWAL & PETA",
    icon: "🏰",
    x: (940 / W) * 100,
    y: (280 / H) * 100,
    interactionPoint: {
      x: (920 / W) * 100,
      y: (295 / H) * 100,
      facing: "up",
    },
    avatar: "/assets/templates/pixel-adventure/characters/npcs/herald_portrait.png",
    sprite: "/assets/templates/pixel-adventure/characters/npcs/herald_sprite.png",
    greeting:
      "Titah Kerajaan! Resepsi pernikahan agung akan diselenggarakan di Aula Utama Istana. Saksikan hitung mundur hari bahagia, jadwal prosesi, dan peta navigasi di sini!",
    actionLabel: "LIHAT JADWAL ACARA",
    stationId: "event",
  },
  {
    id: "rsvp",
    type: "rsvp",
    name: "Steward Budi",
    title: "BUKU TAMU & RESERVASI KEHADIRAN",
    badge: "📜 BUKU TAMU / RSVP",
    icon: "📜",
    x: (760 / W) * 100,
    y: (430 / H) * 100,
    interactionPoint: {
      x: (735 / W) * 100,
      y: (430 / H) * 100,
      facing: "right",
    },
    avatar: "/assets/templates/pixel-adventure/characters/npcs/steward_portrait.png",
    sprite: "/assets/templates/pixel-adventure/characters/npcs/steward_sprite.png",
    greeting:
      "Salam hormat! Mohon konfirmasikan kehadiran Anda pada pesta kerajaan ini agar kami dapat mempersiapkan tempat duduk dan jamuan terbaik untuk Anda sekeluarga.",
    actionLabel: "ISI KONFIRMASI RSVP",
    stationId: "rsvp",
  },
  {
    id: "messages",
    type: "messages",
    name: "Postmaster Pip",
    title: "KOTAK UCAPAN & DOA RESTU",
    badge: "✉️ KOTAK UCAPAN",
    icon: "✉️",
    x: (620 / W) * 100,
    y: (430 / H) * 100,
    interactionPoint: {
      x: (645 / W) * 100,
      y: (430 / H) * 100,
      facing: "left",
    },
    avatar: "/assets/templates/pixel-adventure/characters/npcs/postmaster_portrait.png",
    sprite: "/assets/templates/pixel-adventure/characters/npcs/postmaster_sprite.png",
    greeting:
      "Bawalah doa terbaikmu! Kirimkan untaian kata dan doa restu yang hangat untuk kedua mempelai dalam lembaran buku kenangan abadi ini.",
    actionLabel: "TULIS UCAPAN & DOA",
    stationId: "messages",
  },
  {
    id: "gift",
    type: "gift",
    name: "Peti Tanda Kasih",
    title: "AMPLOP DIGITAL & KADO PERNIKAHAN",
    badge: "🎁 TANDA KASIH",
    icon: "🎁",
    x: (650 / W) * 100,
    y: (580 / H) * 100,
    interactionPoint: {
      x: (690 / W) * 100,
      y: (580 / H) * 100,
      facing: "left",
    },
    avatar: "/assets/templates/pixel-adventure/ui/dialog_frame.png",
    greeting:
      "Bagi sahabat yang ingin memberikan tanda kasih dan hadiah pernikahan, nomor rekening resmi kedua mempelai serta QRIS dapat diakses di sini.",
    actionLabel: "BUKA REKENING KADO",
    stationId: "gift",
  },
  {
    id: "gallery",
    type: "gallery",
    name: "Master Remi",
    title: "PELUKIS AGUNG ISTANA (PHOTO GALLERY)",
    badge: "🎨 GALERI FOTO",
    icon: "🎨",
    x: (705 / W) * 100,
    y: (350 / H) * 100,
    interactionPoint: {
      x: (705 / W) * 100,
      y: (375 / H) * 100,
      facing: "up",
    },
    avatar: "/assets/templates/pixel-adventure/characters/npcs/artist_portrait.png",
    sprite: "/assets/templates/pixel-adventure/characters/npcs/artist_sprite.png",
    greeting:
      "Selamat datang di Galeri Potret Kerajaan! Saya telah mengabadikan setiap momen indah dan senyuman penuh cinta kedua mempelai dalam kanvas-kanvas kenangan ini. Mari nikmati galeri foto prewedding mereka!",
    actionLabel: "LIHAT GALERI FOTO",
    stationId: "gallery",
  },
];

// Smooth NPC Circular Collision & Tangent Sliding
export function resolveNPCCollision(
  curX: number,
  curY: number,
  targetX: number,
  targetY: number
): { x: number; y: number } {
  let resolvedX = targetX;
  let resolvedY = targetY;
  const ASPECT = W / H;
  const RADIUS = 1.5;

  for (const npc of NPCS) {
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

export interface PresetMusicItem {
  id: string;
  title: string;
  artist: string;
  genre: string;
  badge: string;
  description: string;
  fileUrl: string;
}

export const PRESET_MUSICS: PresetMusicItem[] = [
  {
    id: "pixel-bgm-default",
    title: "Pixel Wedding Romance (Bawaan Tema)",
    artist: "Retro Game Master",
    genre: "8-Bit Retro",
    badge: "🎮 Tema Pixel Game",
    description: "Soundtrack petualangan retro 8-bit ceria & romantis bawaan tema, serasi dengan Pixel Adventure dan Cyberpunk.",
    fileUrl: "/wedding-bgm.mp3",
  },
  {
    id: "canon-harp-1",
    title: "Canon in D Major (Harp & Strings)",
    artist: "Akashic Records (Royalty-Free)",
    genre: "Klasik & Harpa",
    badge: "🎻 Harpa & Dawai",
    description: "Aransemen lembut instrumen harpa dan orkestra dawai Pachelbel Canon in D yang elegan, sakral, dan khidmat.",
    fileUrl: "/music/presets/canon-harp-strings.mp3",
  },
  {
    id: "canon-music-box-1",
    title: "Canon in D (Music Box / Kotak Musik)",
    artist: "Classic Melodies (Royalty-Free)",
    genre: "Kotak Musik",
    badge: "✨ Kotak Musik Romantis",
    description: "Dentang melodi kotak musik (music box) klasik yang manis, lembut, dan menghangatkan suasana pernikahan.",
    fileUrl: "/music/presets/canon-music-box.mp3",
  },
];

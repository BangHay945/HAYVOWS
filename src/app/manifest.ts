import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hayvows - Platform Undangan Pernikahan Digital & Resepsi Pintar",
    short_name: "Hayvows",
    description:
      "Platform undangan pernikahan digital modern, interaktif 2D Pixel RPG, dan sistem manajemen resepsi pintar terdepan di Indonesia.",
    start_url: "/",
    display: "standalone",
    background_color: "#2d4a3e",
    theme_color: "#2d4a3e",
    icons: [
      {
        src: "/icon-48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/icon-96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";

const geist = Geist({ subsets: ["latin"] });

const baseUrl = process.env.NEXTAUTH_URL || "https://hayvows.com";

export const viewport: Viewport = {
  themeColor: "#2d4a3e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Hayvows - Platform Undangan Pernikahan Digital & Resepsi Pintar",
    template: "%s | Hayvows",
  },
  description:
    "Platform undangan pernikahan digital interaktif #1 di Indonesia. Hadir dengan tema unik 2D Pixel RPG, Adat Nusantara Batik Jawa, dan Luxury Noir. Dilengkapi sistem buku tamu digital QR Code, live display resepsi TV, dan RSVP WhatsApp.",
  keywords: [
    "undangan digital",
    "undangan pernikahan digital",
    "undangan website",
    "undangan game rpg",
    "undangan pixel art",
    "buku tamu digital qr code",
    "resepsi pintar",
    "hayvows",
    "undangan nikah adat jawa",
    "undangan pernikahan online",
    "wedding invitation online",
  ],
  authors: [{ name: "Hayvows", url: "https://hayvows.com" }],
  creator: "Hayvows",
  publisher: "Hayvows",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hayvows - Platform Undangan Pernikahan Digital & Resepsi Pintar",
    description:
      "Platform undangan pernikahan digital interaktif dengan tema 2D Pixel RPG, Adat Nusantara, dan sistem buku tamu QR Code live display.",
    url: baseUrl,
    siteName: "Hayvows",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Hayvows - Digital Wedding Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hayvows - Platform Undangan Pernikahan Digital & Resepsi Pintar",
    description:
      "Platform undangan pernikahan digital interaktif dengan tema 2D Pixel RPG, Adat Nusantara, dan sistem buku tamu QR Code live display.",
    images: ["/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <JsonLd />
      </head>
      <body className={geist.className}>{children}</body>
    </html>
  );
}

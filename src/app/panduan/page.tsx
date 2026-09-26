import type { Metadata } from "next";
import PanduanClient from "./PanduanClient";

const baseUrl = process.env.NEXTAUTH_URL || "https://hayvows.com";

export const metadata: Metadata = {
  title: "Pusat Panduan & Dokumentasi Fitur | Hayvows Digital Wedding",
  description:
    "Panduan lengkap cara menggunakan fitur Hayvows: Buku Tamu Digital QR Code, Layar Sapa TV Resepsi, Personalisasi Tamu WhatsApp, dan Undangan Interaktif 2D Pixel RPG.",
  keywords: [
    "panduan undangan digital",
    "cara pakai buku tamu digital",
    "buku tamu qr code resepsi",
    "cara hubungkan display tv resepsi",
    "undangan digital game rpg",
    "tutorial sebar undangan whatsapp",
    "panduan hayvows",
  ],
  alternates: {
    canonical: "/panduan",
  },
  openGraph: {
    title: "Pusat Panduan & Fitur | Hayvows Digital Wedding",
    description:
      "Pelajari langkah mudah menggunakan seluruh fitur inovatif Hayvows dari persiapan undangan hingga hari H resepsi pernikahan.",
    url: `${baseUrl}/panduan`,
    siteName: "Hayvows",
    locale: "id_ID",
    type: "article",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Hayvows Panduan & Fitur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pusat Panduan & Fitur | Hayvows Digital Wedding",
    description:
      "Pelajari langkah mudah menggunakan seluruh fitur inovatif Hayvows dari persiapan undangan hingga hari H resepsi pernikahan.",
    images: ["/icon-512.png"],
  },
};

export default function PanduanPage() {
  const guideSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: "https://hayvows.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Pusat Panduan & Fitur",
            item: "https://hayvows.com/panduan",
          },
        ],
      },
      {
        "@type": "HowTo",
        name: "Cara Menggunakan Sistem Buku Tamu & QR Code Resepsi Hayvows",
        description:
          "Panduan penggunaan buku tamu digital ber-QR Code untuk memverifikasi kehadiran tamu pernikahan secara instan dan bebas antre.",
        step: [
          {
            "@type": "HowToStep",
            name: "Tamu Menerima Tiket QR Otomatis",
            text: "Setiap undangan personal memiliki kode QR unik beresolusi tinggi yang dapat disimpan oleh tamu.",
          },
          {
            "@type": "HowToStep",
            name: "Panitia Membuka Scanner Kamera",
            text: "Panitia meja resepsi membuka scanner via browser ponsel/tablet tanpa perlu instal aplikasi.",
          },
          {
            "@type": "HowToStep",
            name: "Scan QR Cepat 1 Detik",
            text: "Kamera diarahkan ke QR tamu, data kehadiran dan jatah souvenir otomatis terverifikasi secara real-time.",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideSchema) }}
      />
      <PanduanClient />
    </>
  );
}

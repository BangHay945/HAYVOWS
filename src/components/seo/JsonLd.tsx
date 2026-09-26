import React from "react";

export default function JsonLd() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://hayvows.com/#organization",
        name: "Hayvows",
        url: "https://hayvows.com",
        logo: "https://hayvows.com/icon-512.png",
        description:
          "Platform undangan pernikahan digital modern, interaktif 2D Pixel RPG, dan sistem manajemen resepsi pintar terdepan di Indonesia.",
        sameAs: [
          "https://instagram.com/hayvows",
          "https://tiktok.com/@hayvows",
        ],
      },
      {
        "@type": "WebApplication",
        "@id": "https://hayvows.com/#webapp",
        name: "Hayvows - Digital Wedding Platform",
        url: "https://hayvows.com",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web, Android, iOS",
        description:
          "Platform pembuatan undangan pernikahan online interaktif dengan tema 2D Pixel RPG, Adat Nusantara, dan sistem buku tamu digital QR Code terintegrasi.",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "IDR",
          lowPrice: "0",
          highPrice: "149000",
          offerCount: "3",
          offers: [
            {
              "@type": "Offer",
              name: "Paket Free Trial",
              price: "0",
              priceCurrency: "IDR",
              description: "Coba seluruh fitur undangan dan editor secara gratis.",
            },
            {
              "@type": "Offer",
              name: "Paket Premium",
              price: "99000",
              priceCurrency: "IDR",
              description: "Fitur lengkap, tamu unlimited, musik kustom, dan ekspor RSVP.",
            },
            {
              "@type": "Offer",
              name: "Paket Eksklusif Resepsi Pintar",
              price: "149000",
              priceCurrency: "IDR",
              description: "Semua fitur Premium ditambah Sistem Check-in QR Code dan Layar Sapa Resepsi TV Live.",
            },
          ],
        },
        featureList: [
          "Undangan Interaktif 2D Pixel RPG (Bisa dimainkan)",
          "Buku Tamu Digital & QR Code Check-in Resepsi",
          "Layar Sapa Resepsi Live untuk TV/Videotron Gedung",
          "Amplop Digital & Hadiah Transfer Bebas Biaya Admin (0%)",
          "Desain Adat Nusantara (Batik Jawa, Gamelan)",
          "Desain Mewah Monokrom & Royal Emerald",
          "Konfirmasi Kehadiran (RSVP) & Ucapan Anti-Spam",
          "Kirim Tautan Khusus Tamu WhatsApp Otomatis",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://hayvows.com/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Apa itu Hayvows dan apa keunggulannya dibanding undangan digital lain?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Hayvows adalah platform undangan pernikahan digital interaktif dan sistem manajemen resepsi pintar di Indonesia. Keunggulannya meliputi tema eksklusif yang inovatif seperti 2D Pixel RPG (bisa dimainkan seperti game retro), tema Adat Nusantara Batik Jawa dengan ornamen otentik, tema Royal Emerald mewah, serta fitur buku tamu digital dengan scan QR Code dan layar sapa resepsi live untuk TV gedung.",
            },
          },
          {
            "@type": "Question",
            name: "Apakah ada batasan jumlah nama tamu yang bisa dibuatkan undangan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Tidak ada batasan (Unlimited). Anda dapat memasukkan ratusan hingga ribuan nama tamu. Sistem Hayvows secara otomatis membuatkan tautan khusus dengan nama tamu tertera personal di sampul undangan dan teks WhatsApp.",
            },
          },
          {
            "@type": "Question",
            name: "Bagaimana cara kerja Sistem Buku Tamu & QR Code Resepsi Hayvows?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Setiap tamu mendapatkan tiket digital ber-QR Code unik. Di meja resepsi pernikahan, panitia cukup memindai QR Code tamu menggunakan kamera smartphone atau tablet. Data kehadiran langsung tercatat real-time dan nama tamu otomatis tersapa di layar TV atau videotron resepsi.",
            },
          },
          {
            "@type": "Question",
            name: "Apakah ada potongan biaya (admin fee) pada amplop digital?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sama sekali tidak ada potongan (0% Admin Fee). Nomor rekening bank maupun QRIS langsung terhubung ke rekening pribadi pengantin sehingga seluruh hadiah dari tamu masuk 100% utuh tanpa perantara.",
            },
          },
          {
            "@type": "Question",
            name: "Berapa lama waktu yang dibutuhkan untuk membuat undangan digital di Hayvows?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Hanya butuh waktu sekitar 5 menit. Pengantin cukup memilih tema, melengkapi data mempelai, waktu acara, serta foto prewedding, dan tautan undangan langsung aktif siap dibagikan.",
            },
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://hayvows.com/#website",
        url: "https://hayvows.com",
        name: "Hayvows",
        description: "Platform Undangan Pernikahan Digital & Resepsi Pintar",
        publisher: {
          "@id": "https://hayvows.com/#organization",
        },
        inLanguage: "id-ID",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

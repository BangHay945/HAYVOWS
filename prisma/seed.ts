import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Template Pixel Adventure
  const tplPixel = await prisma.template.upsert({
    where: { slug: "pixel-adventure" },
    update: {},
    create: {
      slug: "pixel-adventure",
      name: "Pixel Adventure",
      description: "Wedding invitation dengan pengalaman seperti game RPG 8-bit retro.",
      isPremium: false,
      isActive: true,
      version: "1.0.0",
    },
  });
  console.log("✅ Seeded template: Pixel Adventure");

  // 1.5. Seed Template Pixel Cyberpunk (Neo-District 2077)
  const tplCyber = await prisma.template.upsert({
    where: { slug: "pixel-cyberpunk" },
    update: {},
    create: {
      slug: "pixel-cyberpunk",
      name: "Cyberpunk Neo-District",
      description: "Wedding invitation RPG 16-bit futuristik bertema kota neon 2077 dengan sistem kedalaman Y-sorting.",
      isPremium: false,
      isActive: true,
      version: "1.0.0",
    },
  });
  console.log("✅ Seeded template: Pixel Cyberpunk");

  // 1.6. Seed Template Nature Floral
  const tplFloral = await prisma.template.upsert({
    where: { slug: "nature-floral" },
    update: {},
    create: {
      slug: "nature-floral",
      name: "Nature Floral",
      description: "Tema pernikahan estetik bernuansa botani & bunga dengan tipografi serif elegan dan 11 komponen interaktif lengkap.",
      isPremium: false,
      isActive: true,
      version: "1.0.0",
    },
  });
  console.log("✅ Seeded template: Nature Floral");

  // 1.7. Seed Template Modern Monogram (Paket Basic)
  const tplMonogram = await prisma.template.upsert({
    where: { slug: "modern-monogram" },
    update: {},
    create: {
      slug: "modern-monogram",
      name: "Modern Monogram",
      description: "Tema pernikahan minimalis editorial elegan khusus Paket Basic dengan inisial monogram artistik, navigasi Google Maps, dan musik preset romantis bawaan.",
      isPremium: false,
      isActive: true,
      version: "1.0.0",
    },
  });
  console.log("✅ Seeded template: Modern Monogram");

  // 1.8. Seed Template Eternal Noir (Luxury Premium)
  const tplNoir = await prisma.template.upsert({
    where: { slug: "eternal-noir" },
    update: {},
    create: {
      slug: "eternal-noir",
      name: "Eternal Noir",
      description:
        "Tema pernikahan mewah premium bernuansa editorial hitam-putih dengan tipografi Cormorant Garamond, efek grayscale otomatis, hover reveal warna galeri, dot navigation sidebar, dan smooth full-page scroll sinematik.",
      isPremium: true,
      isActive: true,
      version: "1.0.0",
    },
  });
  console.log("✅ Seeded template: Eternal Noir");

  // 1.9. Seed Template Batik Jawa Heritage (Paket Populer / Adat)
  const tplBatikJawa = await prisma.template.upsert({
    where: { slug: "batik-jawa" },
    update: {},
    create: {
      slug: "batik-jawa",
      name: "Batik Jawa Heritage",
      description:
        "Tema pernikahan adat Jawa Kraton dengan ornamen gunungan & kawung SVG, tipografi prasasti, palet merah saga & emas kraton, serta alunan gamelan Jawa.",
      isPremium: true,
      isActive: true,
      version: "1.0.0",
    },
  });
  console.log("✅ Seeded template: Batik Jawa Heritage");

  // 1.10. Seed Template Royal Emerald & Gold (Pilar Haute Luxury)
  const tplRoyalEmerald = await prisma.template.upsert({
    where: { slug: "royal-emerald" },
    update: {},
    create: {
      slug: "royal-emerald",
      name: "Royal Emerald & Gold",
      description:
        "Kemewahan aristokrat bernuansa hijau zamrud (emerald velvet) dipadukan dengan aksen emas bangsawan, ornamen mahkota kerajaan, dan tata letak split desktop sinematik.",
      isPremium: true,
      isActive: true,
      version: "1.0.0",
    },
  });
  console.log("✅ Seeded template: Royal Emerald & Gold");

  // 2. Seed Demo User (password: admin123)
  const hashedPassword =
    "$2b$10$4MuM4.FCi.peWO9TY74b8.xdVK28yVfW5sCo4DXKbW.965Mh8qm0y";
  const demoUser = await prisma.user.upsert({
    where: { email: "admin@hayvows.com" },
    update: { plan: "luxury", role: "admin" },
    create: {
      email: "admin@hayvows.com",
      name: "Super Admin Hayvows",
      password: hashedPassword,
      role: "admin",
      plan: "luxury",
    },
  });
  console.log("Seeded user: admin@hayvows.com (password: admin123)");

  // 4. Seed Demo Wedding: alex-sara
  const demoWedding = await prisma.wedding.upsert({
    where: { slug: "alex-sara" },
    update: {},
    create: {
      userId: demoUser.id,
      slug: "alex-sara",
      templateId: tplPixel.id,
      status: "published",
      messageMode: "auto",
      couple: {
        create: {
          groomName: "Alexander Pratama, S.T.",
          groomNickname: "Alex",
          groomFather: "Bpk. Hendra Pratama",
          groomMother: "Ibu Ratna Dewi",
          groomInstagram: "alex_pratama",
          brideName: "Sara Wijaya, S.Kom.",
          brideNickname: "Sara",
          brideFather: "Bpk. Bambang Wijaya",
          brideMother: "Ibu Sri Rahayu",
          brideInstagram: "sara_wijaya",
        },
      },
      events: {
        create: [
          {
            title: "Akad Nikah",
            date: "2026-10-18",
            startTime: "08:00",
            endTime: "10:00",
            venue: "Masjid Al-Barkah",
            address: "Jl. Melati No. 12, Jakarta Selatan",
            mapsUrl: "https://maps.google.com",
            description: "Prosesi ijab kabul sakral keluarga",
            sortOrder: 1,
          },
          {
            title: "Resepsi Pernikahan",
            date: "2026-10-18",
            startTime: "11:00",
            endTime: "14:00",
            venue: "Grand Ballroom Hotel Harmoni",
            address: "Jl. Sudirman Kav. 25, Jakarta Pusat",
            mapsUrl: "https://maps.google.com",
            description: "Jamuan makan dan ramah tamah bersama para tamu",
            sortOrder: 2,
          },
        ],
      },
      stories: {
        create: [
          {
            title: "First Encounter",
            date: "2020",
            description: "Pertama kali berkenalan di perpustakaan kampus saat mengerjakan skripsi.",
            sortOrder: 1,
          },
          {
            title: "Started Dating",
            date: "2022",
            description: "Memutuskan untuk bersama dan memulai petualangan baru berdua.",
            sortOrder: 2,
          },
          {
            title: "She Said Yes!",
            date: "2025",
            description: "Momen lamaran di puncak bukit saat matahari terbenam.",
            sortOrder: 3,
          },
        ],
      },
      giftAccounts: {
        create: [
          {
            bankName: "BCA",
            accountName: "Alexander Pratama",
            accountNo: "8820192831",
            type: "bank",
            sortOrder: 1,
          },
          {
            bankName: "Mandiri",
            accountName: "Sara Wijaya",
            accountNo: "1370019283741",
            type: "bank",
            sortOrder: 2,
          },
        ],
      },
    },
  });
  console.log("✅ Seeded demo wedding: /invitation/alex-sara");

  // 4b. Seed Demo Music
  await prisma.music.deleteMany({ where: { weddingId: demoWedding.id } });
  await prisma.music.create({
    data: {
      weddingId: demoWedding.id,
      title: "Pixel Wedding BGM",
      fileUrl: "/wedding-bgm.mp3",
      isActive: true,
    },
  });
  console.log("✅ Seeded demo music: /wedding-bgm.mp3");

  // 5. Seed Demo Guest: Budi Santoso
  const demoGuest = await prisma.guest.upsert({
    where: {
      weddingId_slug: {
        weddingId: demoWedding.id,
        slug: "budi-santoso",
      },
    },
    update: {},
    create: {
      weddingId: demoWedding.id,
      name: "Budi Santoso",
      slug: "budi-santoso",
      phone: "081234567890",
      category: "VIP",
      guestCount: 2,
    },
  });
  console.log("✅ Seeded demo guest: /invitation/alex-sara/budi-santoso");

  // 6. Seed Demo Ucapan
  await prisma.guestMessage.deleteMany({ where: { weddingId: demoWedding.id } });
  await prisma.guestMessage.createMany({
    data: [
      {
        weddingId: demoWedding.id,
        guestId: demoGuest.id,
        message: "Selamat menempuh hidup baru Alex & Sara! Semoga langgeng dan selalu berbahagia! 🎉",
        status: "approved",
        isPinned: true,
      },
    ],
  });
  console.log("✅ Seeded demo guest message");

  // 7. Seed Demo Cyberpunk Wedding: neo-2077
  const cyberWedding = await prisma.wedding.upsert({
    where: { slug: "neo-2077" },
    update: {},
    create: {
      userId: demoUser.id,
      slug: "neo-2077",
      templateId: tplCyber.id,
      status: "published",
      messageMode: "auto",
      couple: {
        create: {
          groomName: "Liam Vance, S.T.",
          groomNickname: "Liam",
          groomFather: "Bpk. Ronald Vance",
          groomMother: "Ibu Sarah Vance",
          groomInstagram: "liam_vance",
          groomPhoto:
            "/assets/templates/pixel-cyberpunk/characters/portraits/portrait-groom.png",
          brideName: "Elara Chen, S.Ds.",
          brideNickname: "Elara",
          brideFather: "Bpk. Marcus Chen",
          brideMother: "Ibu Meilani Chen",
          brideInstagram: "elara_chen",
          bridePhoto:
            "/assets/templates/pixel-cyberpunk/characters/portraits/portrait-bride.png",
        },
      },
      events: {
        create: [
          {
            title: "Holy Matrimony Protocol",
            date: "2026-11-20",
            startTime: "09:00",
            endTime: "11:00",
            venue: "Neo-Tokyo Sky Cathedral",
            address: "District 7, Cyber Rooftop Level 88",
            mapsUrl: "https://maps.google.com",
            description: "Prosesi sakral pernikahan di altar langit distrik neon",
            sortOrder: 1,
          },
          {
            title: "Cyberpunk Gala Reception",
            date: "2026-11-20",
            startTime: "18:00",
            endTime: "22:00",
            venue: "Omni Plaza Rooftop Garden",
            address: "Cyberpunk Boulevard No. 77",
            mapsUrl: "https://maps.google.com",
            description: "Pesta perjamuan malam hari bertabur lampu neon dan musik synthwave",
            sortOrder: 2,
          },
        ],
      },
      stories: {
        create: [
          {
            title: "Neural Network Meeting",
            date: "2021",
            description: "Pertama kali bertemu saat kompetisi hackathon teknologi masa depan di Neo-Tokyo.",
            sortOrder: 1,
          },
          {
            title: "Synchronized Heartbeats",
            date: "2023",
            description: "Menemukan ritme hidup yang seirama di tengah gemerlap lampu kota masa depan.",
            sortOrder: 2,
          },
          {
            title: "The Eternal Promise",
            date: "2026",
            description: "Janji suci di bawah bayang pohon sakura neon untuk bersama selamanya.",
            sortOrder: 3,
          },
        ],
      },
      galleries: {
        create: [
          {
            imageUrl:
              "/assets/templates/pixel-cyberpunk/characters/portraits/portrait-groom.png",
            caption: "Groom Liam",
            sortOrder: 1,
          },
          {
            imageUrl:
              "/assets/templates/pixel-cyberpunk/characters/portraits/portrait-bride.png",
            caption: "Bride Elara",
            sortOrder: 2,
          },
          {
            imageUrl:
              "/assets/templates/pixel-cyberpunk/maps/skyline-district-v1/ground-map.png",
            caption: "Skyline Neo-District",
            sortOrder: 3,
          },
        ],
      },
      giftAccounts: {
        create: [
          { bankName: "BCA Cyber-Vault", accountNo: "8720192831", accountName: "LIAM VANCE", type: "bank", sortOrder: 1 },
          { bankName: "Bank Mandiri Neo", accountNo: "1370019283712", accountName: "ELARA CHEN", type: "bank", sortOrder: 2 },
        ],
      },
    },
  });

  const cyberGuest = await prisma.guest.upsert({
    where: {
      weddingId_slug: {
        weddingId: cyberWedding.id,
        slug: "budi-santoso",
      },
    },
    update: {},
    create: {
      weddingId: cyberWedding.id,
      name: "Budi Santoso",
      slug: "budi-santoso",
      phone: "081234567890",
      category: "VIP",
      guestCount: 2,
    },
  });

  await prisma.guestMessage.deleteMany({ where: { weddingId: cyberWedding.id } });
  await prisma.guestMessage.createMany({
    data: [
      {
        weddingId: cyberWedding.id,
        guestId: cyberGuest.id,
        message: "Selamat untuk Liam & Elara! Pernikahan masa depan paling spektakuler! 🚀💍",
        status: "approved",
        isPinned: true,
      },
    ],
  });
  console.log("✅ Seeded demo cyber wedding: /invitation/neo-2077/budi-santoso");

  // 8. Seed Demo Nature Floral Wedding: dimas-anindya
  const floralWedding = await prisma.wedding.upsert({
    where: { slug: "dimas-anindya" },
    update: { templateId: tplFloral.id },
    create: {
      userId: demoUser.id,
      slug: "dimas-anindya",
      templateId: tplFloral.id,
      status: "published",
      messageMode: "auto",
      couple: {
        create: {
          groomName: "Dimas Wicaksono, S.T.",
          groomNickname: "Dimas",
          groomFather: "Bpk. Ir. H. Bambang Wicaksono",
          groomMother: "Ibu Hj. Ratna Juwita",
          groomInstagram: "dimas_wicaksono",
          groomPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
          brideName: "Anindya Kirana, S.Ds.",
          brideNickname: "Anindya",
          brideFather: "Bpk. Drs. H. Suryo Pranoto",
          brideMother: "Ibu Hj. Endang Rahayu",
          brideInstagram: "anindya_kirana",
          bridePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        },
      },
      events: {
        create: [
          {
            title: "Akad Nikah Sakral",
            date: "2026-11-08",
            startTime: "08:00",
            endTime: "10:00",
            venue: "Plataran Pine Garden Lembang",
            address: "Jl. Raya Tangkuban Perahu No. 50, Bandung Barat",
            mapsUrl: "https://maps.google.com",
            description: "Ijab kabul khidmat di tengah sejuknya hamparan pohon pinus dan alam asri",
            sortOrder: 1,
          },
          {
            title: "Resepsi Botanical Dinner",
            date: "2026-11-08",
            startTime: "11:30",
            endTime: "15:00",
            venue: "Glasshouse Ballroom Plataran",
            address: "Jl. Raya Tangkuban Perahu No. 50, Bandung Barat",
            mapsUrl: "https://maps.google.com",
            description: "Jamuan makan siang intim bersama keluarga besar dan sahabat tercinta",
            sortOrder: 2,
          },
        ],
      },
      stories: {
        create: [
          {
            title: "Pertemuan di Kebun Raya",
            date: "2021",
            description: "Berawal dari pandangan pertama di bawah rindangnya kanopi Kebun Raya.",
            sortOrder: 1,
          },
          {
            title: "Tumbuh Bersama",
            date: "2023",
            description: "Menemukan arti cinta sejati dalam setiap obrolan santai dan impian masa depan bersama.",
            sortOrder: 2,
          },
          {
            title: "Janji di Puncak Pinus",
            date: "2025",
            description: "Di bawah langit sore Lembang yang teduh, sebuah cincin tersemat sebagai janji hidup selamanya.",
            sortOrder: 3,
          },
        ],
      },
      galleries: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
            caption: "Janji Suci di Bawah Teduhnya Alam",
            sortOrder: 1,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
            caption: "Genggaman Kasih Selamanya",
            sortOrder: 2,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
            caption: "Tawa & Bahagia Berdua",
            sortOrder: 3,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
            caption: "Langkah Menuju Hari Bahagia",
            sortOrder: 4,
          },
        ],
      },
      giftAccounts: {
        create: [
          { bankName: "BCA", accountNo: "7720198821", accountName: "DIMAS WICAKSONO", type: "bank", sortOrder: 1 },
          { bankName: "Bank Mandiri", accountNo: "1370019284451", accountName: "ANINDYA KIRANA", type: "bank", sortOrder: 2 },
        ],
      },
    },
  });

  const floralGuest = await prisma.guest.upsert({
    where: {
      weddingId_slug: {
        weddingId: floralWedding.id,
        slug: "budi-santoso",
      },
    },
    update: {},
    create: {
      weddingId: floralWedding.id,
      name: "Budi Santoso",
      slug: "budi-santoso",
      phone: "081234567890",
      category: "VIP",
      guestCount: 2,
    },
  });

  await prisma.guestMessage.deleteMany({ where: { weddingId: floralWedding.id } });
  await prisma.guestMessage.createMany({
    data: [
      {
        weddingId: floralWedding.id,
        guestId: floralGuest.id,
        message: "Barakallahu lakuma wa baraka alaikuma untuk Dimas & Anindya. Semoga rumah tangganya senantiasa penuh berkah dan cinta yang menyejukkan.",
        status: "approved",
        isPinned: true,
      },
    ],
  });
  console.log("✅ Seeded demo floral wedding: /invitation/dimas-anindya/budi-santoso");

  // 9. Seed Demo Modern Monogram Wedding: adrian-nadia
  const monogramWedding = await prisma.wedding.upsert({
    where: { slug: "adrian-nadia" },
    update: { templateId: tplMonogram.id },
    create: {
      userId: demoUser.id,
      slug: "adrian-nadia",
      templateId: tplMonogram.id,
      status: "published",
      messageMode: "auto",
      couple: {
        create: {
          groomName: "Adrian Hartanto, B.B.A.",
          groomNickname: "Adrian",
          groomFather: "Bpk. Hendra Hartanto",
          groomMother: "Ibu Lilian Hartanto",
          groomInstagram: "adrian_hartanto",
          groomPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
          brideName: "Nadia Sasmita, B.A.",
          brideNickname: "Nadia",
          brideFather: "Bpk. Gunawan Sasmita",
          brideMother: "Ibu Veronica Sasmita",
          brideInstagram: "nadia_sasmita",
          bridePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
          couplePhoto: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        },
      },
      events: {
        create: [
          {
            title: "Pemberkatan Pernikahan",
            date: "2026-12-12",
            startTime: "10:00",
            endTime: "12:00",
            venue: "The Glass Pavilion Bandung",
            address: "Jl. Dago Giri No. 102, Bandung",
            mapsUrl: "https://maps.google.com",
            description: "Prosesi pemberkatan sakral pernikahan kudus di hadapan keluarga",
            sortOrder: 1,
          },
          {
            title: "Intimate Dinner Reception",
            date: "2026-12-12",
            startTime: "17:00",
            endTime: "21:00",
            venue: "The Glasshouse Conservatory",
            address: "Jl. Dago Giri No. 102, Bandung",
            mapsUrl: "https://maps.google.com",
            description: "Perjamuan malam santai, iringan musik romantis, dan doa restu para sahabat",
            sortOrder: 2,
          },
        ],
      },
      stories: {
        create: [
          {
            title: "Pertemuan Pertama",
            date: "2022",
            description: "Sebuah obrolan sederhana di kafe sudut kota yang membuka lembaran kisah baru.",
            sortOrder: 1,
          },
          {
            title: "Langkah Pasti",
            date: "2024",
            description: "Menemukan satu sama lain sebagai rumah terbaik untuk saling pulang.",
            sortOrder: 2,
          },
          {
            title: "Menuju Keabadian",
            date: "2026",
            description: "Memantapkan hati untuk menyatukan dua keluarga dalam satu ikatan suci selamanya.",
            sortOrder: 3,
          },
        ],
      },
      galleries: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
            caption: "Potret Minimalis Adrian & Nadia",
            sortOrder: 1,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
            caption: "Kehangatan Senyum Bersama",
            sortOrder: 2,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
            caption: "Genggaman Kasih Selamanya",
            sortOrder: 3,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
            caption: "Momen Sakral Penuh Makna",
            sortOrder: 4,
          },
        ],
      },
      giftAccounts: {
        create: [
          {
            bankName: "BCA",
            accountName: "Adrian Hartanto",
            accountNo: "8820194852",
            type: "bank",
            sortOrder: 1,
          },
          {
            bankName: "Bank Mandiri",
            accountName: "Nadia Sasmita",
            accountNo: "1370019284411",
            type: "bank",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  const monogramGuest = await prisma.guest.upsert({
    where: {
      weddingId_slug: {
        weddingId: monogramWedding.id,
        slug: "budi-santoso",
      },
    },
    update: {},
    create: {
      weddingId: monogramWedding.id,
      name: "Budi Santoso",
      slug: "budi-santoso",
      phone: "081234567890",
      category: "VIP",
      guestCount: 2,
    },
  });

  await prisma.guestMessage.deleteMany({ where: { weddingId: monogramWedding.id } });
  await prisma.guestMessage.createMany({
    data: [
      {
        weddingId: monogramWedding.id,
        guestId: monogramGuest.id,
        message: "Selamat atas pernikahan Adrian & Nadia! Semoga cinta kasih kalian senantiasa mekar dan diberkati kebahagiaan seumur hidup.",
        status: "approved",
        isPinned: true,
      },
    ],
  });
  console.log("✅ Seeded demo monogram wedding: /invitation/adrian-nadia/budi-santoso");

  // 10. Seed Eternal Noir Demo Wedding: eleanor-xavier
  const noirWedding = await prisma.wedding.upsert({
    where: { slug: "eleanor-xavier" },
    update: {},
    create: {
      userId: demoUser.id,
      slug: "eleanor-xavier",
      templateId: tplNoir.id,
      status: "published",
      messageMode: "auto",
      couple: {
        create: {
          groomName: "Xavier Arindra, M.Arch.",
          groomNickname: "Xavier",
          groomFather: "Bpk. Arindra Putra",
          groomMother: "Ibu Serena Maharani",
          groomInstagram: "xavier.arindra",
          brideName: "Eleanor Cassandra, S.Sn.",
          brideNickname: "Eleanor",
          brideFather: "Bpk. Cassandra Halim",
          brideMother: "Ibu Miriam Sastra",
          brideInstagram: "eleanor.cassandra",
          couplePhoto: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
          groomPhoto: "https://images.unsplash.com/photo-1553267751-1c148a7280a1?auto=format&fit=crop&w=600&q=80",
          bridePhoto: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=600&q=80",
        },
      },
      events: {
        create: [
          {
            title: "Akad Nikah",
            date: "2026-11-14",
            startTime: "09:00",
            endTime: "11:00",
            venue: "The Ritz-Carlton Jakarta",
            address: "Jl. DR. Soetomo No.68, Jakarta Pusat",
            mapsUrl: "https://maps.google.com",
            description: "Prosesi ijab kabul sakral dalam balutan nuansa eksklusif",
            sortOrder: 1,
          },
          {
            title: "Resepsi Gala Dinner",
            date: "2026-11-14",
            startTime: "18:00",
            endTime: "22:00",
            venue: "The Ritz-Carlton Ballroom",
            address: "Jl. DR. Soetomo No.68, Jakarta Pusat",
            mapsUrl: "https://maps.google.com",
            description: "Jamuan malam eksklusif bersama para sahabat dan keluarga",
            sortOrder: 2,
          },
        ],
      },
      stories: {
        create: [
          {
            title: "Pertemuan di Galeri Seni",
            date: "2021",
            description: "Sebuah perjumpaan tak terduga di pembukaan pameran seni Jakarta membuka babak baru dari kisah kami.",
            sortOrder: 1,
          },
          {
            title: "Perjalanan Paris",
            date: "2023",
            description: "Di bawah cahaya kota lampu yang abadi, kami memahami bahwa kami adalah rumah satu sama lain.",
            sortOrder: 2,
          },
          {
            title: "Sebuah Janji Seumur Hidup",
            date: "2025",
            description: "Di tepi pantai saat matahari terbenam, Xavier menyematkan cincin dan Eleanor menjawab ya dengan sepenuh hati.",
            sortOrder: 3,
          },
        ],
      },
      galleries: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80",
            caption: "Berdua di Bawah Cahaya Emas",
            sortOrder: 1,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
            caption: "Kehangatan Tatap Mata",
            sortOrder: 2,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
            caption: "Ikatan Abadi",
            sortOrder: 3,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
            caption: "Potret Hitam Putih Bersama",
            sortOrder: 4,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
            caption: "Momen Menuju Altar",
            sortOrder: 5,
          },
        ],
      },
      giftAccounts: {
        create: [
          {
            bankName: "BCA",
            accountName: "Xavier Arindra",
            accountNo: "7720193847",
            type: "bank",
            sortOrder: 1,
          },
          {
            bankName: "Mandiri",
            accountName: "Eleanor Cassandra",
            accountNo: "1390027364829",
            type: "bank",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  const noirGuest = await prisma.guest.upsert({
    where: {
      weddingId_slug: {
        weddingId: noirWedding.id,
        slug: "budi-santoso",
      },
    },
    update: {},
    create: {
      weddingId: noirWedding.id,
      name: "Budi Santoso",
      slug: "budi-santoso",
      phone: "081234567890",
      category: "VIP",
      guestCount: 2,
    },
  });

  await prisma.guestMessage.deleteMany({ where: { weddingId: noirWedding.id } });
  await prisma.guestMessage.createMany({
    data: [
      {
        weddingId: noirWedding.id,
        guestId: noirGuest.id,
        message:
          "Selamat atas pernikahan Xavier & Eleanor yang begitu elegan dan istimewa. Semoga cinta abadi kalian senantiasa bercahaya.",
        status: "approved",
        isPinned: true,
      },
    ],
  });
  console.log("✅ Seeded demo noir wedding: /invitation/eleanor-xavier/budi-santoso");

  // 11. Seed Batik Jawa Heritage Demo Wedding: prasetyo-kinanti
  const batikWedding = await prisma.wedding.upsert({
    where: { slug: "prasetyo-kinanti" },
    update: {},
    create: {
      userId: demoUser.id,
      slug: "prasetyo-kinanti",
      templateId: tplBatikJawa.id,
      status: "published",
      messageMode: "auto",
      couple: {
        create: {
          groomName: "Raden Prasetyo Wibowo, S.T.",
          groomNickname: "Prasetyo",
          groomFather: "Bpk. Suryo Wibowo",
          groomMother: "Ibu Endah Rahayu",
          groomInstagram: "prasetyo.wibowo",
          brideName: "Raden Roro Kinanti Larasati, S.Pd.",
          brideNickname: "Kinanti",
          brideFather: "Bpk. Heri Larasati",
          brideMother: "Ibu Wulandari",
          brideInstagram: "kinanti.larasati",
          couplePhoto: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
          groomPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
          bridePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        },
      },
      events: {
        create: [
          {
            title: "Upacara Panggih & Akad Nikah",
            date: "2026-12-05",
            startTime: "08:00",
            endTime: "10:30",
            venue: "Ndalem Ngabean Keraton Yogyakarta",
            address: "Jl. Alun-Alun Kidul No.17, Kraton, Yogyakarta",
            mapsUrl: "https://maps.google.com",
            description: "Prosesi ijab kabul dan adat panggih pengantin gaya Yogyakarta Hadiningrat",
            sortOrder: 1,
          },
          {
            title: "Pahargyan Pahargyan (Resepsi Adat)",
            date: "2026-12-05",
            startTime: "11:00",
            endTime: "14:00",
            venue: "Pendopo Sasana Hinggil Dwi Abad",
            address: "Kawasan Alun-Alun Kidul, Yogyakarta",
            mapsUrl: "https://maps.google.com",
            description: "Jamuan makan adat kembul bujana diiringi gamelan gending Jawa",
            sortOrder: 2,
          },
        ],
      },
      stories: {
        create: [
          {
            title: "Awal Pepanggihan di Selokan Mataram",
            date: "2020",
            description: "Takdir mempertemukan kami di sudut kota budaya, diawali dari diskusi kecil tentang sastra dan sejarah Jawa hingga bersemi rasa saling menghormati.",
            sortOrder: 1,
          },
          {
            title: "Nglamar & Sungkeman Kulawarga",
            date: "2024",
            description: "Dengan restu kedua orang tua dan leluhur, sebuah niat tulus diikat dalam prosesi lamaran adat yang hangat dan penuh kidung doa.",
            sortOrder: 2,
          },
          {
            title: "Manunggal Ing Roso",
            date: "2026",
            description: "Kini kami siap melangkah bersama dalam mahligai rumah tangga yang sakinah, mawaddah, warahmah, nyawiji ing katresnan.",
            sortOrder: 3,
          },
        ],
      },
      galleries: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80",
            caption: "Busana Kanigaran Kasultanan",
            sortOrder: 1,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
            caption: "Tatapan Katresnan",
            sortOrder: 2,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
            caption: "Janji Suci ing Ngayogyakarta",
            sortOrder: 3,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80",
            caption: "Kidung Asmaradana",
            sortOrder: 4,
          },
        ],
      },
      giftAccounts: {
        create: [
          {
            bankName: "BCA",
            accountName: "Raden Prasetyo Wibowo",
            accountNo: "8820194821",
            type: "bank",
            sortOrder: 1,
          },
          {
            bankName: "Mandiri",
            accountName: "Rr Kinanti Larasati",
            accountNo: "1370098472619",
            type: "bank",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  const batikGuest = await prisma.guest.upsert({
    where: {
      weddingId_slug: {
        weddingId: batikWedding.id,
        slug: "budi-santoso",
      },
    },
    update: {},
    create: {
      weddingId: batikWedding.id,
      name: "Budi Santoso",
      slug: "budi-santoso",
      phone: "081234567890",
      category: "VIP",
      guestCount: 2,
    },
  });

  await prisma.guestMessage.deleteMany({ where: { weddingId: batikWedding.id } });
  await prisma.guestMessage.createMany({
    data: [
      {
        weddingId: batikWedding.id,
        guestId: batikGuest.id,
        message:
          "Nderek mangayubagya dumateng Mas Prasetyo & Mbak Kinanti. Mugi tansah pinaringan berkah dalem Gusti, ayem tentrem, lan langgeng dumugi kaken-kaken ninen-ninen.",
        status: "approved",
        isPinned: true,
      },
    ],
  });

  // Seed Demo Music untuk Batik Jawa
  await prisma.music.deleteMany({ where: { weddingId: batikWedding.id } });
  await prisma.music.create({
    data: {
      weddingId: batikWedding.id,
      title: "Gamelan Kraton Ngayogyakarta",
      fileUrl: "/music/presets/gamelan-jawa.mp3",
      isActive: true,
    },
  });
  console.log("✅ Seeded demo batik-jawa wedding: /invitation/prasetyo-kinanti/budi-santoso");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

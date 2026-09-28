import { prisma } from "@/lib/prisma";

export async function ensureDemoWeddingSeeded(slug: string): Promise<boolean> {
  const normalizedSlug = slug.toLowerCase().trim();

  // Handle arthur-guinevere auto-seed
  if (normalizedSlug === "arthur-guinevere") {
    try {
      // 1. Ensure royal-emerald template exists
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

      // 2. Ensure demo user exists
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

      // 3. Upsert arthur-guinevere wedding
      const royalWedding = await prisma.wedding.upsert({
        where: { slug: "arthur-guinevere" },
        update: { templateId: tplRoyalEmerald.id, status: "published" },
        create: {
          userId: demoUser.id,
          slug: "arthur-guinevere",
          templateId: tplRoyalEmerald.id,
          status: "published",
          messageMode: "auto",
          couple: {
            create: {
              groomName: "Arthur Pendragon, B.A.",
              groomNickname: "Arthur",
              groomFather: "Lord Uther Pendragon",
              groomMother: "Lady Igraine Pendragon",
              groomInstagram: "arthur.pendragon",
              groomPhoto:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
              brideName: "Guinevere Leodegrance, M.Sc.",
              brideNickname: "Guinevere",
              brideFather: "Lord Leodegrance of Cameliard",
              brideMother: "Lady Eleanor Leodegrance",
              brideInstagram: "guinevere.leodegrance",
              bridePhoto:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
              couplePhoto:
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
            },
          },
          events: {
            create: [
              {
                title: "Holy Matrimony & Royal Blessings",
                date: "2026-11-28",
                startTime: "09:00",
                endTime: "11:30",
                venue: "The Grand Emerald Cathedral",
                address: "Jl. Diponegoro No. 88, Menteng, Jakarta Pusat",
                mapsUrl: "https://maps.google.com",
                description:
                  "Prosesi sakral pemberkatan pernikahan agung di hadapan keluarga terhormat dan kerabat terkasih",
                sortOrder: 1,
              },
              {
                title: "Royal Emerald Gala Dinner & Ball",
                date: "2026-11-28",
                startTime: "18:30",
                endTime: "22:00",
                venue: "Grand Ballroom The Ritz-Carlton Jakarta",
                address:
                  "Jl. DR. Ide Anak Agung Gde Agung Kav. E.1.1, Mega Kuningan, Jakarta Selatan",
                mapsUrl: "https://maps.google.com",
                description:
                  "Jamuan malam gala bertabur kemewahan zamrud dan emas bangsawan bersama para sahabat",
                sortOrder: 2,
              },
            ],
          },
          stories: {
            create: [
              {
                title: "Pertemuan di Galeri Seni Klasik",
                date: "2021",
                description:
                  "Sebuah perjumpaan tak terduga di pameran seni rupa klasik membuka babak baru dalam perjalanan cinta kami.",
                sortOrder: 1,
              },
              {
                title: "Janji Suci di Bawah Menara Paris",
                date: "2024",
                description:
                  "Di bawah kilau gemerlap malam kota cahaya, sebuah janji terpatri teguh untuk melangkah bersama selamanya.",
                sortOrder: 2,
              },
              {
                title: "Menuju Singgasana Mahligai Cinta",
                date: "2026",
                description:
                  "Dengan restu kedua keluarga terhormat, kami melangkah menuju hari sakral yang abadi dan penuh keberkahan.",
                sortOrder: 3,
              },
            ],
          },
          galleries: {
            create: [
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80",
                caption: "Kemegahan Balutan Busana Kerajaan",
                sortOrder: 1,
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
                caption: "Tatapan Penuh Ketulusan",
                sortOrder: 2,
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
                caption: "Ikatan Abadi Emas & Zamrud",
                sortOrder: 3,
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
                caption: "Potret Bersama Menjelang Altar",
                sortOrder: 4,
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
                caption: "Langkah Sakral Menuju Kebahagiaan",
                sortOrder: 5,
              },
            ],
          },
          giftAccounts: {
            create: [
              {
                bankName: "BCA",
                accountName: "Arthur Pendragon",
                accountNo: "8820194829",
                type: "bank",
                sortOrder: 1,
              },
              {
                bankName: "Mandiri",
                accountName: "Guinevere Leodegrance",
                accountNo: "1370098471629",
                type: "bank",
                sortOrder: 2,
              },
            ],
          },
        },
      });

      // 4. Ensure budi-santoso guest exists
      const royalGuest = await prisma.guest.upsert({
        where: {
          weddingId_slug: {
            weddingId: royalWedding.id,
            slug: "budi-santoso",
          },
        },
        update: {},
        create: {
          weddingId: royalWedding.id,
          name: "Budi Santoso",
          slug: "budi-santoso",
          phone: "081234567890",
          category: "VIP",
          guestCount: 2,
        },
      });

      // 5. Ensure guest message exists
      const msgCount = await prisma.guestMessage.count({
        where: { weddingId: royalWedding.id },
      });
      if (msgCount === 0) {
        await prisma.guestMessage.create({
          data: {
            weddingId: royalWedding.id,
            guestId: royalGuest.id,
            message:
              "Selamat atas pernikahan agung Arthur & Guinevere. Semoga mahligai rumah tangga kalian senantiasa dilimpahi kemuliaan, keberkahan, dan cinta abadi layaknya permata zamrud kerajaan.",
            status: "approved",
            isPinned: true,
          },
        });
      }

      // 6. Ensure music exists
      const musicCount = await prisma.music.count({
        where: { weddingId: royalWedding.id },
      });
      if (musicCount === 0) {
        await prisma.music.create({
          data: {
            weddingId: royalWedding.id,
            title: "Royal Symphony & Canon in D",
            fileUrl: "/music/presets/canon-in-d.mp3",
            isActive: true,
          },
        });
      }

      return true;
    } catch (err) {
      console.error("Failed to auto-seed demo wedding:", err);
      return false;
    }
  }

  // Handle julian-claire auto-seed (The Wedding Journal - Cinematic Editorial)
  if (normalizedSlug === "julian-claire") {
    try {
      // 1. Ensure cinematic-editorial template exists
      const tplEditorial = await prisma.template.upsert({
        where: { slug: "cinematic-editorial" },
        update: {},
        create: {
          slug: "cinematic-editorial",
          name: "The Wedding Journal",
          description:
            "Desain majalah mode editorial kelas atas (Vogue & Kinfolk vibes) dengan tipografi megah, slideshow foto prewedding sinematik otomatis, dan background galeri dinamis.",
          isPremium: true,
          isActive: true,
          version: "1.0.0",
        },
      });

      // 2. Ensure demo user exists
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

      // 3. Upsert julian-claire wedding
      const editorialWedding = await prisma.wedding.upsert({
        where: { slug: "julian-claire" },
        update: { templateId: tplEditorial.id, status: "published" },
        create: {
          userId: demoUser.id,
          slug: "julian-claire",
          templateId: tplEditorial.id,
          status: "published",
          messageMode: "auto",
          couple: {
            create: {
              groomName: "Julian Bradley, B.Arch.",
              groomNickname: "Julian",
              groomFather: "Richard Bradley",
              groomMother: "Catherine Bradley",
              groomInstagram: "julian.bradley",
              groomPhoto:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
              brideName: "Claire Vance, M.A.",
              brideNickname: "Claire",
              brideFather: "Arthur Vance",
              brideMother: "Victoria Vance",
              brideInstagram: "claire.vance",
              bridePhoto:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
              couplePhoto:
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
            },
          },
          events: {
            create: [
              {
                title: "The Solemnization Ceremony",
                date: "2026-10-24",
                startTime: "09:00",
                endTime: "11:00",
                venue: "The Glasshouse Conservatory",
                address: "Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan",
                mapsUrl: "https://maps.google.com",
                description:
                  "Prosesi ikrar janji suci pernikahan di hadapan keluarga dan para saksi terkasih",
                sortOrder: 1,
              },
              {
                title: "The Editorial Wedding Soirée",
                date: "2026-10-24",
                startTime: "18:00",
                endTime: "22:00",
                venue: "Grand Pavilion Ballroom",
                address:
                  "Jl. Jenderal Sudirman Kav. 52-53, SCBD, Jakarta Selatan",
                mapsUrl: "https://maps.google.com",
                description:
                  "Jamuan malam elegan, toast perayaan cinta, dan live jazz performance",
                sortOrder: 2,
              },
            ],
          },
          stories: {
            create: [
              {
                title: "A Serendipitous Encounter",
                date: "2021",
                description:
                  "Sebuah pertemuan tak disengaja di sudut galeri arsitektur membuka lembaran kisah cinta yang tak terduga.",
                sortOrder: 1,
              },
              {
                title: "Under The Autumn Skies",
                date: "2023",
                description:
                  "Di bawah naungan dedaunan musim gugur, kami menyadari bahwa langkah ini ditakdirkan untuk beriringan selamanya.",
                sortOrder: 2,
              },
              {
                title: "The Lifetime Promise",
                date: "2025",
                description:
                  "Sebuah komitmen tulus terucap untuk mengarungi bahtera kehidupan bersama dalam cinta dan ketulusan abadi.",
                sortOrder: 3,
              },
            ],
          },
          galleries: {
            create: [
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
                caption: "Issue Cover: Editorial Prewedding",
                sortOrder: 1,
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
                caption: "Timeless Moments in Black & White",
                sortOrder: 2,
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
                caption: "The Symphony of Two Hearts",
                sortOrder: 3,
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
                caption: "Golden Sunset Reflections",
                sortOrder: 4,
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
                caption: "Haute Couture Wedding Portraits",
                sortOrder: 5,
              },
            ],
          },
          giftAccounts: {
            create: [
              {
                bankName: "BCA",
                accountName: "Julian Bradley",
                accountNo: "8821948201",
                type: "bank",
                sortOrder: 1,
              },
              {
                bankName: "Mandiri",
                accountName: "Claire Vance",
                accountNo: "1370098273619",
                type: "bank",
                sortOrder: 2,
              },
            ],
          },
        },
      });

      // 4. Ensure demo guest exists
      const demoGuest = await prisma.guest.upsert({
        where: {
          weddingId_slug: {
            weddingId: editorialWedding.id,
            slug: "budi-santoso",
          },
        },
        update: {},
        create: {
          weddingId: editorialWedding.id,
          name: "Budi Santoso",
          slug: "budi-santoso",
          phone: "081234567890",
          category: "VIP",
          guestCount: 2,
        },
      });

      // 5. Ensure guest message exists
      const msgCount = await prisma.guestMessage.count({
        where: { weddingId: editorialWedding.id },
      });
      if (msgCount === 0) {
        await prisma.guestMessage.create({
          data: {
            weddingId: editorialWedding.id,
            guestId: demoGuest.id,
            message:
              "Selamat atas pernikahan Julian & Claire! Konsep editorial majalahnya sangat memukau, berkelas, dan elegan. Semoga cinta kalian senantiasa mekar abadi.",
            status: "approved",
            isPinned: true,
          },
        });
      }

      // 6. Ensure music exists
      const musicCount = await prisma.music.count({
        where: { weddingId: editorialWedding.id },
      });
      if (musicCount === 0) {
        await prisma.music.create({
          data: {
            weddingId: editorialWedding.id,
            title: "Canon in D — Cinematic Strings",
            fileUrl: "/music/presets/canon-harp-strings.mp3",
            isActive: true,
          },
        });
      }

      return true;
    } catch (err) {
      console.error("Failed to auto-seed julian-claire demo wedding:", err);
      return false;
    }
  }

  // Handle prasetyo-kinanti auto-seed (Batik Jawa Heritage)
  if (normalizedSlug === "prasetyo-kinanti") {
    try {
      // 1. Ensure batik-jawa template exists
      const tplBatikJawa = await prisma.template.upsert({
        where: { slug: "batik-jawa" },
        update: {},
        create: {
          slug: "batik-jawa",
          name: "Batik Jawa Heritage",
          description:
            "Kemegahan pernikahan adat Jawa bernuansa kraton Jogja-Solo dengan motif parang, kawung, ornamen wayang gunungan, serta gending gamelan sakral.",
          isPremium: false,
          isActive: true,
          version: "1.0.0",
        },
      });

      // 2. Ensure demo user exists
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

      // 3. Upsert prasetyo-kinanti wedding
      const batikWedding = await prisma.wedding.upsert({
        where: { slug: "prasetyo-kinanti" },
        update: { templateId: tplBatikJawa.id, status: "published" },
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
              couplePhoto:
                "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
              groomPhoto:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
              bridePhoto:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
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

      // 4. Ensure demo guest exists
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

      // 5. Ensure demo message exists
      const msgCount = await prisma.guestMessage.count({
        where: { weddingId: batikWedding.id },
      });
      if (msgCount === 0) {
        await prisma.guestMessage.create({
          data: {
            weddingId: batikWedding.id,
            guestId: batikGuest.id,
            message:
              "Nderek mangayubagya dumateng Mas Prasetyo & Mbak Kinanti. Mugi tansah pinaringan berkah dalem Gusti, ayem tentrem, lan langgeng dumugi kaken-kaken ninen-ninen.",
            status: "approved",
            isPinned: true,
          },
        });
      }

      // 6. Ensure music exists
      const musicCount = await prisma.music.count({
        where: { weddingId: batikWedding.id },
      });
      if (musicCount === 0) {
        await prisma.music.create({
          data: {
            weddingId: batikWedding.id,
            title: "Gamelan Kraton Ngayogyakarta",
            fileUrl: "/music/presets/gamelan-jawa.mp3",
            isActive: true,
          },
        });
      }

      return true;
    } catch (err) {
      console.error("Failed to auto-seed prasetyo-kinanti demo wedding:", err);
      return false;
    }
  }

  // Handle alexander-sara auto-seed (Cinematic Ivory - Dark Luxury)
  if (normalizedSlug === "alexander-sara") {
    try {
      // 1. Ensure cinematic-ivory template exists in DB
      const tplIvory = await prisma.template.upsert({
        where: { slug: "cinematic-ivory" },
        update: {},
        create: {
          slug: "cinematic-ivory",
          name: "Cinematic Ivory",
          description:
            "Kemewahan sinematik gelap pekat dengan aksen ivory & champagne gold. Animasi opening stagger Ken Burns, portrait editorial mempelai, timeline storytelling tanpa card, dan galeri asimetris.",
          isPremium: true,
          isActive: true,
          version: "1.0.0",
        },
      });

      // 2. Ensure demo user exists
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

      // 3. Upsert alexander-sara wedding
      const ivoryWedding = await prisma.wedding.upsert({
        where: { slug: "alexander-sara" },
        update: { templateId: tplIvory.id, status: "published" },
        create: {
          userId: demoUser.id,
          slug: "alexander-sara",
          templateId: tplIvory.id,
          status: "published",
          messageMode: "auto",
          couple: {
            create: {
              groomName: "Alexander Hayes, M.Sc.",
              groomNickname: "Alexander",
              groomFather: "Jonathan Hayes",
              groomMother: "Eleanor Hayes",
              groomInstagram: "alexander.hayes",
              groomPhoto:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
              brideName: "Sara Montgomery, B.Des.",
              brideNickname: "Sara",
              brideFather: "William Montgomery",
              brideMother: "Katherine Montgomery",
              brideInstagram: "sara.montgomery",
              bridePhoto:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
              couplePhoto:
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
            },
          },
          events: {
            create: [
              {
                title: "Sacred Matrimony & Vows",
                date: "2026-11-14",
                startTime: "09:30",
                endTime: "11:30",
                venue: "St. Regis Private Sanctuary",
                address: "Jl. Rajawali Selatan No. 12, Senayan, Jakarta Pusat",
                mapsUrl: "https://maps.google.com",
                description:
                  "Pengucapan janji suci dan penukaran cincin dalam suasana intim nan khidmat",
                sortOrder: 1,
              },
              {
                title: "Cinematic Noir Gala Dinner",
                date: "2026-11-14",
                startTime: "18:30",
                endTime: "22:00",
                venue: "The Grand Astor Ballroom",
                address: "The St. Regis Jakarta, Kuningan, Jakarta Selatan",
                mapsUrl: "https://maps.google.com",
                description:
                  "Malam perayaan bertabur kehangatan, jamuan istimewa, dan alunan quartet klasik",
                sortOrder: 2,
              },
            ],
          },
          stories: {
            create: [
              {
                title: "The Silent Glance",
                date: "2020",
                description:
                  "Sebuah tatap mata singkat di tengah hiruk pikuk kota menjadi awal dari kisah yang tak pernah kami duga.",
                sortOrder: 1,
              },
              {
                title: "Two Solitudes That Protect",
                date: "2022",
                description:
                  "Belajar saling melengkapi dalam diam dan saling menjaga ruang untuk bertumbuh bersama.",
                sortOrder: 2,
              },
              {
                title: "The Eternal Chapter",
                date: "2025",
                description:
                  "Ketika seluruh keraguan runtuh dan yang tersisa hanyalah kepastian untuk melangkah berdampingan selamanya.",
                sortOrder: 3,
              },
            ],
          },
          galleries: {
            create: [
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
                caption: "The Opening Overture",
                sortOrder: 1,
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
                caption: "Whispers of Devotion",
                sortOrder: 2,
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
                caption: "Velvet Reflections",
                sortOrder: 3,
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
                caption: "Sunset Soliloquy",
                sortOrder: 4,
              },
              {
                imageUrl:
                  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
                caption: "Timeless Embrace",
                sortOrder: 5,
              },
            ],
          },
          giftAccounts: {
            create: [
              {
                bankName: "BCA",
                accountName: "Alexander Hayes",
                accountNo: "7310892716",
                type: "bank",
                sortOrder: 1,
              },
              {
                bankName: "Mandiri",
                accountName: "Sara Montgomery",
                accountNo: "1240098263152",
                type: "bank",
                sortOrder: 2,
              },
            ],
          },
        },
      });

      // 4. Ensure demo guest exists
      const demoGuest = await prisma.guest.upsert({
        where: {
          weddingId_slug: {
            weddingId: ivoryWedding.id,
            slug: "budi-santoso",
          },
        },
        update: {},
        create: {
          weddingId: ivoryWedding.id,
          name: "Budi Santoso & Keluarga",
          slug: "budi-santoso",
          phone: "081234567890",
          category: "VIP",
          guestCount: 2,
        },
      });

      // 5. Ensure guest message exists
      const msgCount = await prisma.guestMessage.count({
        where: { weddingId: ivoryWedding.id },
      });
      if (msgCount === 0) {
        await prisma.guestMessage.create({
          data: {
            weddingId: ivoryWedding.id,
            guestId: demoGuest.id,
            message:
              "Selamat menempuh hidup baru untuk Alexander & Sara. Semoga pernikahan kalian dipenuhi berkah, kedamaian, dan kehangatan abadi.",
            status: "approved",
            isPinned: true,
          },
        });
      }

      // 6. Ensure music exists
      const musicCount = await prisma.music.count({
        where: { weddingId: ivoryWedding.id },
      });
      if (musicCount === 0) {
        await prisma.music.create({
          data: {
            weddingId: ivoryWedding.id,
            title: "Canon in D — Harp & Strings Quartet",
            fileUrl: "/music/presets/canon-harp-strings.mp3",
            isActive: true,
          },
        });
      }

      return true;
    } catch (err) {
      console.error("Failed to auto-seed alexander-sara demo wedding:", err);
      return false;
    }
  }

  return false;
}

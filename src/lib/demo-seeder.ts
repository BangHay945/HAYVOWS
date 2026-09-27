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

  return false;
}

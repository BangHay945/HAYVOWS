import { prisma } from "../src/lib/prisma";

async function seedMessages() {
  const wedding = await prisma.wedding.findFirst({
    where: { slug: "alex-sara" },
  });

  if (!wedding) {
    console.log("Wedding alex-sara not found");
    return;
  }

  const guests = await prisma.guest.findMany({
    where: { weddingId: wedding.id },
  });

  console.log("Found guests:", guests.map((g) => `${g.name} (${g.slug})`));

  // Clear existing messages for this wedding to remove duplicate sample messages
  await prisma.guestMessage.deleteMany({
    where: { weddingId: wedding.id },
  });

  const sampleWishes = [
    {
      slug: "fw9x5sq",
      message: "Baarakallahu laka wa baaraka alaika wa jamaa bainakuma fii khoir. Selamat menempuh hidup baru Alex & Sara!",
    },
    {
      slug: "citra-lestari",
      message: "Selamat ya Alex & Sara! Semoga cintanya abadi sampai kakek-nenek dan bahagia selalu selamanya!",
    },
    {
      slug: "hendra-wijaya",
      message: "Happy wedding brother! Sukses acaranya dan selamat mengarungi bahtera rumah tangga yang sakinah.",
    },
    {
      slug: "budi-santoso",
      message: "Selamat menempuh hidup baru Alex & Sara! Semoga langgeng dan selalu dilimpahkan keberkahan.",
    },
  ];

  for (const w of sampleWishes) {
    const g = guests.find((guest) => guest.slug === w.slug);
    if (g) {
      await prisma.guestMessage.create({
        data: {
          weddingId: wedding.id,
          guestId: g.id,
          message: w.message,
          status: "approved",
          isPinned: true,
        },
      });
      console.log(`Created message for: ${g.name}`);
    }
  }

  console.log("Seeding wishes complete!");
}

seedMessages()
  .catch(console.error)
  .finally(() => process.exit(0));

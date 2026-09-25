import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import WeddingEditor from "./WeddingEditor";

export default async function EditWeddingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const wedding = await prisma.wedding.findFirst({
    where: { id, userId: session.user.id },
    include: {
      couple: true,
      events: { orderBy: { sortOrder: "asc" } },
      stories: { orderBy: { sortOrder: "asc" } },
      galleries: { orderBy: { sortOrder: "asc" } },
      musics: true,
      giftAccounts: { orderBy: { sortOrder: "asc" } },
      template: true,
    },
  });

  if (!wedding) notFound();

  return <WeddingEditor initialWedding={wedding} />;
}

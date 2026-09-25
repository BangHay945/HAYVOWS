import { prisma } from "@/lib/prisma";

export async function submitMessage(data: {
  weddingId: string;
  guestId: string;
  message: string;
  autoApprove?: boolean;
}) {
  return prisma.guestMessage.create({
    data: {
      weddingId: data.weddingId,
      guestId: data.guestId,
      message: data.message,
      status: data.autoApprove ? "approved" : "pending",
    },
  });
}

export async function getApprovedMessages(weddingId: string, take = 20, skip = 0) {
  return prisma.guestMessage.findMany({
    where: { weddingId, status: "approved" },
    include: { guest: { select: { name: true } } },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    take,
    skip,
  });
}

export async function updateMessageStatus(id: string, status: "approved" | "hidden") {
  return prisma.guestMessage.update({ where: { id }, data: { status } });
}

export async function pinMessage(id: string, isPinned: boolean) {
  return prisma.guestMessage.update({ where: { id }, data: { isPinned } });
}

export async function deleteMessage(id: string) {
  return prisma.guestMessage.delete({ where: { id } });
}

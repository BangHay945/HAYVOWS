import { prisma } from "@/lib/prisma";

export type AnalyticsEventType =
  | "invitation_view"
  | "invitation_open"
  | "music_play"
  | "music_pause"
  | "gallery_view"
  | "rsvp_open"
  | "rsvp_submit"
  | "message_submit"
  | "message_view"
  | "gift_view"
  | "gift_confirm"
  | "map_click";

export async function trackEvent(data: {
  weddingId: string;
  guestId?: string;
  event: AnalyticsEventType;
  metadata?: Record<string, unknown>;
}) {
  return prisma.analyticsEvent.create({
    data: {
      weddingId: data.weddingId,
      guestId: data.guestId,
      event: data.event,
      metadata: JSON.stringify(data.metadata ?? {}),
    },
  });
}

export async function getAnalyticsSummary(weddingId: string) {
  const events = await prisma.analyticsEvent.groupBy({
    by: ["event"],
    where: { weddingId },
    _count: { event: true },
  });

  const summary: Record<string, number> = {};
  for (const e of events) {
    summary[e.event] = e._count.event;
  }
  return summary;
}

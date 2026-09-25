import { NextResponse } from "next/server";
import { trackEvent, getAnalyticsSummary } from "@/lib/analytics";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.weddingId || !body.event) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }
    await trackEvent(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to track event:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const weddingId = searchParams.get("weddingId");
  if (!weddingId) {
    return NextResponse.json({ error: "weddingId required" }, { status: 400 });
  }

  const summary = await getAnalyticsSummary(weddingId);
  return NextResponse.json(summary);
}

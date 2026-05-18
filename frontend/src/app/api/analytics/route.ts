import { NextResponse } from "next/server";
import { trackSessionEvent, AnalyticsStatus } from "@/lib/analytics-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionId?: string;
      status?: AnalyticsStatus;
      lyrics?: string;
      theme?: string | null;
      genre?: string | null;
      mood?: string | null;
      duration?: number;
      basePrompt?: string | null;
      email?: string | null;
    };

    const { sessionId, status } = body;

    console.log(`[Analytics POST] Received event - sessionId: ${sessionId}, status: ${status}`);

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
    }

    if (!status || !["started", "email_viewed", "completed"].includes(status)) {
      return NextResponse.json({ error: "Valid status is required." }, { status: 400 });
    }

    await trackSessionEvent({
      sessionId,
      status,
      lyrics: body.lyrics,
      theme: body.theme,
      genre: body.genre,
      mood: body.mood,
      duration: body.duration,
      basePrompt: body.basePrompt,
      email: body.email,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

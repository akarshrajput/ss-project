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

    const userAgent = request.headers.get("user-agent") || null;
    
    // Determine country code from Vercel / Cloudflare headers, with fallback to Accept-Language locale
    let country = request.headers.get("x-vercel-ip-country") || 
                  request.headers.get("cf-ipcountry") || 
                  null;
                  
    if (!country) {
      const acceptLanguage = request.headers.get("accept-language");
      if (acceptLanguage) {
        // Match language-region code, e.g. "en-US" and extract region "US"
        const match = acceptLanguage.match(/[a-z]{2}-([A-Z]{2})/);
        if (match && match[1]) {
          country = match[1];
        }
      }
    }
    
    country = country ? country.toUpperCase().slice(0, 2) : "Unknown";

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
      country,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { trackPageview } from "@/lib/analytics-store";

function parseUserAgent(ua: string | null) {
  if (!ua) return { browser: "Unknown", os: "Unknown", device: "Desktop" };

  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

  // Device classification
  if (/mobile/i.test(ua)) {
    device = "Mobile";
  } else if (/tablet|ipad/i.test(ua)) {
    device = "Tablet";
  }

  // OS detection
  if (/windows/i.test(ua)) {
    os = "Windows";
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = "macOS";
  } else if (/android/i.test(ua)) {
    os = "Android";
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    os = "iOS";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
  }

  // Browser detection
  if (/chrome|crios/i.test(ua) && !/edge|edg/i.test(ua) && !/opr|opera/i.test(ua)) {
    browser = "Chrome";
  } else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) {
    browser = "Safari";
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Firefox";
  } else if (/edge|edg/i.test(ua)) {
    browser = "Edge";
  } else if (/opr|opera/i.test(ua)) {
    browser = "Opera";
  }

  return { browser, os, device };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      pathname?: string;
      referrer?: string;
      sessionId?: string;
    };

    const { pathname, referrer, sessionId } = body;

    if (!pathname || !sessionId) {
      return NextResponse.json({ error: "pathname and sessionId are required" }, { status: 400 });
    }

    const ua = request.headers.get("user-agent");
    const { browser, os, device } = parseUserAgent(ua);

    // Geolocation detection
    let country = request.headers.get("x-vercel-ip-country") || 
                  request.headers.get("cf-ipcountry") || 
                  null;

    if (!country) {
      const acceptLang = request.headers.get("accept-language");
      if (acceptLang) {
        const match = acceptLang.match(/[a-z]{2}-([A-Z]{2})/);
        if (match && match[1]) {
          country = match[1];
        }
      }
    }

    country = country ? country.toUpperCase().slice(0, 2) : "Unknown";

    await trackPageview({
      pathname,
      referrer: referrer || "direct",
      sessionId,
      country,
      browser,
      os,
      device
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

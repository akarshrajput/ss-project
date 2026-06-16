import { NextResponse } from "next/server";
import { getRichAnalyticsData } from "@/lib/analytics-store";
import { getAppUserProfile } from "@/lib/app-store";
import { getUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    const profile = await getAppUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "7d";

    const data = await getRichAnalyticsData(range);
    return NextResponse.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

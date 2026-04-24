import { NextResponse } from "next/server";
import { isUsernameAvailable } from "@/lib/song-queue-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username")?.trim();

  if (!username || username.length < 3) {
    return NextResponse.json({ available: false, reason: "Too short" });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return NextResponse.json({ available: false, reason: "Invalid characters" });
  }

  const available = await isUsernameAvailable(username);
  return NextResponse.json({ available });
}

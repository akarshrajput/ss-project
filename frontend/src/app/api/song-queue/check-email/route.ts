import { NextResponse } from "next/server";
import { getSongQueueByEmail } from "@/lib/song-queue-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email")?.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ exists: false, reason: "Invalid email" });
  }

  const entry = await getSongQueueByEmail(email);

  return NextResponse.json({
    exists: Boolean(entry),
    username: entry?.username ?? null,
    songId: entry?.songId ?? null,
    songTitle: entry?.songTitle ?? null,
  });
}
import { NextResponse } from "next/server";
import { getSongQueueBySongId } from "@/lib/song-queue-store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ songId: string }> }
) {
  try {
    const { songId } = await params;
    const entry = await getSongQueueBySongId(songId);

    if (!entry) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    return NextResponse.json(entry, { status: 200 });
  } catch (error) {
    console.error("Error fetching song:", error);
    const msg = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

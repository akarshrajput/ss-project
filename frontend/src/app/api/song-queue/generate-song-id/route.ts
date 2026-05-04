import { NextResponse } from "next/server";

function generateSongId(): string {
  const now = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${now}-${rand}`;
}

export async function GET() {
  try {
    const songId = generateSongId();
    return NextResponse.json({ songId }, { status: 200 });
  } catch (error) {
    console.error("Error generating song ID:", error);
    return NextResponse.json({ error: "Failed to generate song ID" }, { status: 500 });
  }
}

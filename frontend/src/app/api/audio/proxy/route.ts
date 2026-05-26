import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    const response = await fetch(fileUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch remote audio: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.arrayBuffer();

    return new Response(data, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "audio/mpeg",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Proxy error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const nextPath = searchParams.get("next") || "/dashboard";

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Google Client ID is missing")}`, origin));
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || origin}/api/auth/google/callback`;

  const state = crypto.randomBytes(16).toString("hex");
  
  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=openid%20email%20profile&state=${state}`
  );

  response.cookies.set("oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 10 });
  response.cookies.set("oauth_next", nextPath, { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 10 });

  return response;
}

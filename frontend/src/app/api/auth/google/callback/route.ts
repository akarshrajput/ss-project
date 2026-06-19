import { NextRequest, NextResponse } from "next/server";
import { signInWithGoogle } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const storedState = request.cookies.get("oauth_state")?.value;
  const nextPath = request.cookies.get("oauth_next")?.value || "/dashboard";

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, origin));
  }

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Invalid OAuth state. Please try again.")}`, origin));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Google OAuth is not fully configured.")}`, origin));
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || origin}/api/auth/google/callback`;

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData);
      throw new Error("Failed to exchange code for token");
    }

    const { id_token } = tokenData;

    // Decode ID token (JWT) to get user profile.
    const payloadBase64 = id_token.split('.')[1];
    const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const profile = JSON.parse(payloadJson);

    const email = profile.email;
    const name = profile.name || profile.given_name || email.split("@")[0];

    const { error: signInError } = await signInWithGoogle({ email, name });

    if (signInError) {
      throw new Error(signInError.message);
    }

    const response = NextResponse.redirect(new URL(nextPath, origin));
    response.cookies.delete("oauth_state");
    response.cookies.delete("oauth_next");
    return response;

  } catch (err: any) {
    console.error("Google OAuth Error:", err);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(err.message || "An error occurred during Google sign-in.")}`, origin));
  }
}

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/library", "/account", "/admin"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  // Simplified check for session token cookie
  const sessionToken = request.cookies.get("session_token");

  if (!sessionToken || !sessionToken.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request
  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/dashboard/:path*", "/library/:path*", "/account/:path*", "/admin/:path*"],
};

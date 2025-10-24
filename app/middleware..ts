// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const hasSession =
    req.cookies.get("sb-access-token") ||
    req.cookies.get("supabase-auth-token") ||
    req.cookies.get("sb:token");

  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/auth");

  // 🚫 If user not logged in and not on an auth route, redirect to /login
  if (!hasSession && !isAuthRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ✅ Allow /auth/*, /login, and logged-in users to continue
  return NextResponse.next();
}

export const config = {
  // ✅ Exclude Next.js internals + auth routes from middleware
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth).*)",
  ],
};

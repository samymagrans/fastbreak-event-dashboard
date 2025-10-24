// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Detect Supabase session cookies (auth helpers use these)
  const hasSession =
    req.cookies.get("sb-pbvpgqxshlxjcsphxwam-auth-token") ||
    req.cookies.get("sb-access-token") ||
    req.cookies.get("supabase-auth-token") ||
    req.cookies.get("sb:token");

  // ✅ Publicly accessible routes
  const isPublicRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/_next");

  // ✅ Redirect unauthenticated users trying to access protected pages
  if (!hasSession && !isPublicRoute) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Prevent logged-in users from seeing /login again
  if (hasSession && pathname === "/login") {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// ✅ Apply middleware to all routes except static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};

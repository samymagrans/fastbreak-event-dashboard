// /app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: Request) {
  // ✅ In Next.js 15, cookies() may return a Promise depending on context
  //    so we explicitly await it for safety
  const cookieStore = await cookies();

  // ✅ Pass cookies as a callback — matches helper signature
  // @ts-expect-error  temporary Supabase type mismatch (safe at runtime)
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // ✅ Extract ?code=... from callback URL
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    console.error("❌ No auth code found in callback URL");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Correct usage: pass the string, not the whole Request
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  console.log("exchangeCodeForSession result:", { data, error });

  if (error) {
    console.error("❌ Auth exchange failed:", error.message);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Redirect home after success
  return NextResponse.redirect(new URL("/", request.url));
}

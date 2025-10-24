// /app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: Request) {
  // ✅ Await cookies for Next.js 15 consistency
  const cookieStore = await cookies();

  // ✅ Correct Supabase client
  // @ts-expect-error Supabase types slightly lag Next 15 API
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // ✅ Extract the code from the callback URL
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    console.error("❌ No auth code in callback URL");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Exchange code for session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  console.log("exchangeCodeForSession result:", { data, error });

  if (error) {
    console.error("❌ Auth exchange failed:", error.message);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Redirect home after success
  return NextResponse.redirect(new URL("/", request.url));
}

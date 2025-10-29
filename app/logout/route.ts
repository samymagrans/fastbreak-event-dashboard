// /app/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET() {
  //  Access cookies in Next.js 15 (async-safe)
  const cookieStore = await cookies();

  // Use the same Supabase route handler client used in /auth/callback
  // @ts-expect-error — type mismatch harmless at runtime
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // This removes the session + clears auth cookies
  await supabase.auth.signOut();

  //  Redirect back to login (works both locally and on Vercel)
  const redirectUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return NextResponse.redirect(`${redirectUrl}/login`);
}

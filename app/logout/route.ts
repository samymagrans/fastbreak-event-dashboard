// /app/logout/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  await supabase.auth.signOut();

  // Dynamically detect domain (works both locally & on Vercel)
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/login`);
}

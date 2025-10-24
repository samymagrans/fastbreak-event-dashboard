import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  // ✅ Always await cookies() in Next.js 15
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (err) {
            console.warn("Could not set cookie:", err);
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (err) {
            console.warn("Could not remove cookie:", err);
          }
        },
      },
    }
  );

  // ✅ Extract the ?code=... from the URL
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code);
    console.log("exchangeCodeForSession result:", result);

    if (result.error) {
      console.error("❌ Auth exchange failed:", result.error.message);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    console.error("❌ No code parameter in callback URL");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Redirect to home after successful exchange
  return NextResponse.redirect(new URL("/", request.url));
}

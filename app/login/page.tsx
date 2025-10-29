"use client";
import { useEffect, useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false); // toggle between login/register

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  // Redirect to home if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/");
    });
  }, [router, supabase]);

  // Login or Register with email/password
  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();

    if (isRegister) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
      });

      if (error) alert(error.message);
      else {
        alert("Check your email to confirm your registration.");
        setIsRegister(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else router.push("/");
    }
  }

  // Google login
  async function handleGoogle() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${siteUrl}/auth/callback` },
    });
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {isRegister ? "Create Account" : "Login"}
      </h1>

      <form onSubmit={handleAuth} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleGoogle}
        className="mt-3 w-full border py-2 rounded hover:bg-gray-100"
      >
        Continue with Google
      </button>

      <p className="mt-4 text-center text-sm">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className="text-blue-600 underline"
            >
              Login
            </button>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className="text-blue-600 underline"
            >
              Register
            </button>
          </>
        )}
      </p>
    </main>
  );
}

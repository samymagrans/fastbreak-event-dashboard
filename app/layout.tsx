import "./globals.css";
import { Toaster } from "sonner";

export const metadata = { 
  title: "Fastbreak Event Dashboard" 
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <header className="border-b p-4 flex justify-between items-center">
          <a href="/" className="font-bold">🏀 Fastbreak Dashboard</a>
          <form action="/logout" method="get" noValidate>
            <button type="submit" className="underline">Logout</button>
          </form>
        </header>

        <main className="container mx-auto p-6">
          {children}
        </main>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
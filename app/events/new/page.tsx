// app/events/new/page.tsx
import Link from "next/link";
import { getVenues } from "../actions";
import { NewEventForm } from "./ui/NewEventForm";

export default async function NewEventPage() {
  // ✅ Fetch all venues server-side (no client Supabase calls)
  const venues = await getVenues();

  return (
    <div className="max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">➕ Add New Event</h1>
        <Link
          href="/"
          className="underline text-blue-600 hover:text-blue-800"
        >
          ← Back to Dashboard
        </Link>
      </header>

      {/* ✅ Client form (uses shadcn Form + react-hook-form + zod) */}
      <NewEventForm venues={venues} />
    </div>
  );
}

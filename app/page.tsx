// /app/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabaseServer";
import FormattedDate from "@/components/FormattedDate";
import { deleteEventAction } from "@/app/events/actions";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sport?: string }>;
}) {
  // ✅ Create Supabase client
  const supabase = await getServerSupabase();

  // ✅ Check if user is logged in
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    // 🚫 Redirect logged-out users
    redirect("/login");
  }

  // ✅ Continue existing dashboard logic
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const sport = (params.sport ?? "").trim();

  let query = supabase
    .from("events")
    .select("id,name,sport,datetime,description,event_venues(venues(name))")
    .order("datetime", { ascending: true });

  if (q) query = query.ilike("name", `%${q}%`);
  if (sport) query = query.eq("sport", sport);

  const { data: events, error } = await query;
  if (error) throw new Error(error.message);

  const sports = Array.from(new Set((events ?? []).map((e) => e.sport))).sort();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">🏀 Fastbreak Dashboard</h1>
        <Link
          href="/events/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Event
        </Link>
      </div>

      {/* Search + Filter */}
      <form className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name…"
          className="border rounded px-3 py-2 flex-1"
        />
        <select
          name="sport"
          defaultValue={sport}
          className="border rounded px-3 py-2"
        >
          <option value="">All sports</option>
          {sports.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button className="border rounded px-4 py-2 hover:bg-gray-50">
          Apply
        </button>
      </form>

      {/* Event Cards */}
      {!events?.length ? (
        <p className="text-gray-500 text-center">No events found.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="border p-4 rounded bg-white shadow-sm hover:shadow-md transition space-y-2"
            >
              <h3 className="font-semibold text-lg">{ev.name}</h3>
              <p className="text-sm text-gray-600">Sport: {ev.sport}</p>
              <p className="text-sm text-gray-600">
                Venues:{" "}
                {ev.event_venues
                  ?.map((v: any) => v.venues?.name)
                  .join(", ") || "—"}
              </p>
              <p className="text-gray-700">
                <FormattedDate date={ev.datetime} />
              </p>
              {ev.description && (
                <p className="text-gray-700">{ev.description}</p>
              )}

              {/* Edit / Delete Buttons */}
              <div className="flex gap-2 mt-3">
                <Link
                  href={`/events/${ev.id}/edit`}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </Link>

                <form
                  action={async () => {
                    "use server";
                    await deleteEventAction(ev.id);
                  }}
                >
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

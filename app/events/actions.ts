"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabaseServer";
import { eventSchema } from "@/lib/validation";
import { safeAction, type ActionResult } from "@/lib/action-helpers";
import { redirect } from "next/navigation";

/**
 * Fetch all venues (deduplicated + alphabetically sorted)
 */
export async function getVenues(): Promise<{ id: string; name: string }[]> {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("venues")
    .select("id,name")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  // dedupe by name (case-insensitive)
  return Array.from(new Map((data ?? []).map(v => [v.name.toLowerCase(), v])).values())
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Add new venue (case-insensitive upsert)
 */
export async function addVenueAction(_: any, formData: FormData): Promise<ActionResult<null>> {
  return safeAction(async () => {
    const supabase = await getServerSupabase();
    const name = String(formData.get("newVenue") ?? "").trim();
    if (!name) throw new Error("Venue name required");

    const { error } = await supabase.from("venues").upsert({ name }, { onConflict: "name" });
    if (error) throw new Error(error.message);

    revalidatePath("/events/new");
    return null;
  });
}

/**
 * Create new event
 */
export async function createEventAction(_: any, formData: FormData): Promise<ActionResult<null>> {
  return safeAction(async () => {
    const parsed = eventSchema.parse({
      name: formData.get("name"),
      sport: formData.get("sport"),
      datetime: formData.get("datetime"),
      description: formData.get("description") ?? "",
      venues: formData.getAll("venues") as string[],
    });

    const supabase = await getServerSupabase();

    // store as UTC ISO
    const iso = new Date(parsed.datetime).toISOString();

    const { data: ev, error } = await supabase
      .from("events")
      .insert({
        name: parsed.name,
        sport: parsed.sport,
        datetime: iso,
        description: parsed.description,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    // link venues
    for (const venueName of parsed.venues ?? []) {
      const { data: venue, error: vErr } = await supabase
        .from("venues")
        .upsert({ name: venueName }, { onConflict: "name" })
        .select("id")
        .single();
      if (vErr) throw new Error(vErr.message);

      await supabase.from("event_venues").insert({ event_id: ev.id, venue_id: venue!.id });
    }

    revalidatePath("/");
    return null;
  });
}

/**
 * Update event (and its venues)
 */
export async function updateEventAction(
  formData: FormData
): Promise<ActionResult<void>> {
  return safeAction(async () => {
    const id = String(formData.get("id") ?? "").trim();
    if (!id) throw new Error("Event ID missing");

    const parsed = eventSchema.parse({
      name: formData.get("name"),
      sport: formData.get("sport"),
      datetime: formData.get("datetime"),
      description: formData.get("description") ?? "",
      venues: formData.getAll("venues") as string[],
    });

    const supabase = await getServerSupabase();
    const iso = new Date(parsed.datetime).toISOString();

    const { error: updateErr } = await supabase
      .from("events")
      .update({
        name: parsed.name,
        sport: parsed.sport,
        datetime: iso,
        description: parsed.description,
      })
      .eq("id", id);

    if (updateErr) throw new Error(updateErr.message);

    await supabase.from("event_venues").delete().eq("event_id", id);

    for (const venueName of parsed.venues ?? []) {
      const { data: venue, error: vErr } = await supabase
        .from("venues")
        .upsert({ name: venueName }, { onConflict: "name" })
        .select("id")
        .single();
      if (vErr) throw new Error(vErr.message);

      await supabase.from("event_venues").insert({ event_id: id, venue_id: venue!.id });
    }

    revalidatePath("/", "layout");
    redirect("/");
  });
}


/**
 * Delete event
 */
export async function deleteEventAction(id: string): Promise<ActionResult<null>> {
  return safeAction(async () => {
    const supabase = await getServerSupabase();

    // cascade delete event_venues first (if needed)
    await supabase.from("event_venues").delete().eq("event_id", id);

    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/");
    return null;
  });
}

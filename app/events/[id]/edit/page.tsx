import { getServerSupabase } from "@/lib/supabaseServer";
import { updateEventAction } from "../../actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getServerSupabase();

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !event)
    return <p className="text-red-600">Event not found.</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Event</h1>

      <form action={updateEventAction} className="space-y-4">
  {/* hidden ID input */}
  <input type="hidden" name="id" value={id} />

        <Input
          name="name"
          defaultValue={event.name}
          required
          placeholder="Event name"
        />
        <Input
          name="sport"
          defaultValue={event.sport}
          required
          placeholder="Sport type"
        />
        <Input
          type="datetime-local"
          name="datetime"
          defaultValue={event.datetime.slice(0, 16)}
          required
        />
        <Textarea
          name="description"
          defaultValue={event.description ?? ""}
          rows={3}
          placeholder="Description"
        />

        <div className="flex gap-2">
          <Button type="submit">Save changes</Button>
          <a href="/" className="border px-4 py-2 rounded">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
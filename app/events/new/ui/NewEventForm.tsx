"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import { toast } from "sonner";
import { createEventAction, addVenueAction } from "../../actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, type EventInput } from "../../../../lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Props = { venues: { id: string; name: string }[] };

export function NewEventForm({ venues }: Props) {
  const [state, submitAction] = useActionState(createEventAction, { ok: false, message: "" });
  const [addState, addVenue] = useActionState(addVenueAction, { ok: false, message: "" });
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [newVenue, setNewVenue] = useState("");

  const form = useForm<EventInput>({
  resolver: zodResolver(eventSchema),
  defaultValues: {
    name: "",
    sport: "",
    datetime: "",
    description: "",
    venues: [],
  },
});


  // 🔔 Event creation feedback
  useEffect(() => {
    if (state.message) state.ok ? toast.success("Event created") : toast.error(state.message);
  }, [state]);

  // 🔔 Venue creation feedback
  useEffect(() => {
    if (addState.message) addState.ok ? toast.success("Venue added") : toast.error(addState.message);
  }, [addState]);

  // ✅ Create event
  const onSubmit = (values: EventInput) => {
  const fd = new FormData();
  fd.set("name", values.name);
  fd.set("sport", values.sport);
  fd.set("datetime", values.datetime);
  fd.set("description", values.description ?? "");
  selectedVenues.forEach((v) => fd.append("venues", v));

  startTransition(() => {
    submitAction(fd);
  });

  form.reset({ name: "", sport: "", datetime: "", description: "", venues: [] });
  setSelectedVenues([]);
};

  const onAddVenue = () => {
    if (!newVenue.trim()) return;

    const fd = new FormData();
    fd.set("newVenue", newVenue.trim());

    startTransition(() => {
      addVenue(fd);
    });

    setNewVenue("");
  };

  // Remove duplicates
  const uniqueVenues = [...new Map(venues.map(v => [v.name.toLowerCase(), v])).values()]
    .sort((a, b) => a.name.localeCompare(b.name));

  const toggleVenue = (name: string) =>
    setSelectedVenues((prev) =>
      prev.includes(name) ? prev.filter(v => v !== name) : [...prev, name]
    );

  return (
    <div className="border p-4 rounded bg-gray-50 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Event name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., City Finals" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sport select */}
          <FormField
            control={form.control}
            name="sport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sport</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["Basketball", "Soccer", "Tennis", "Volleyball", "Baseball", "Other"].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date/time */}
          <FormField
            control={form.control}
            name="datetime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date & time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Venues */}
          <div className="space-y-2">
            <div className="font-medium">Venues</div>
            <div className="flex flex-wrap gap-2">
              {uniqueVenues.map(v => {
                const checked = selectedVenues.includes(v.name);
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => toggleVenue(v.name)}
                    className={`px-3 py-1 rounded border text-sm ${
                      checked ? "bg-blue-600 text-white border-blue-600" : "bg-white"
                    }`}
                    aria-pressed={checked}
                  >
                    {v.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add venue inline */}
          <div className="flex gap-2">
            <Input
              placeholder="Add new venue…"
              value={newVenue}
              onChange={(e) => setNewVenue(e.target.value)}
            />
            <Button type="button" variant="secondary" onClick={onAddVenue}>
              Add venue
            </Button>
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="Optional notes…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit">Create event</Button>
            <a href="/" className="px-4 py-2 border rounded">Cancel</a>
          </div>
        </form>
      </Form>
    </div>
  );
}
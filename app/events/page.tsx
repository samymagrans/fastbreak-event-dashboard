// app/events/page.tsx
import { redirect } from "next/navigation";

export default function EventsRedirect() {
  redirect("/events/new");
}
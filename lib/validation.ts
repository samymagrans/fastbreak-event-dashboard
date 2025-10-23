import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  sport: z.string().min(1, "Sport type is required"),
  datetime: z.string().min(1, "Date and time are required"),
  description: z.string().default(""),       // ✅ make required
  venues: z.array(z.string()).default([]),   // ✅ make required
});

export type EventInput = z.infer<typeof eventSchema>;

import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sport: z.string().min(1, "Sport is required"),
  datetime: z.string().min(1, "Date/time is required"),
  description: z.string().default(""),
  venues: z.array(z.string()).default([]),
});

export type EventInput = z.infer<typeof eventSchema>;

// lib/validation.ts
import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  sport: z.string().min(2, "Sport is required"),
  datetime: z.string().min(1, "Date & time required"),
  description: z.string().optional().default(""),
  venues: z.array(z.string()).optional().default([]),
});
export type EventInput = z.infer<typeof eventSchema>;

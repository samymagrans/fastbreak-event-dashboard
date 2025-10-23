import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  sport: z.string().min(1, "Sport type is required"),
  datetime: z.string().min(1, "Date and time are required"),
  description: z
    .string()
    .optional()
    .transform((val) => val ?? ""), // ✅ input can be undefined, but output always string
  venues: z
    .array(z.string())
    .optional()
    .transform((val) => val ?? []), // ✅ same idea for arrays
});


export type EventInput = z.infer<typeof eventSchema>;

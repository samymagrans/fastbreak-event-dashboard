// components/FormattedDate.tsx
"use client";

export default function FormattedDate({ date }: { date?: string | null }) {
  if (!date) return <span>—</span>;

  // ✅ Ensure this returns stable markup, no undefined / NaN
  const formatted = new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return <span suppressHydrationWarning>{formatted}</span>;
}
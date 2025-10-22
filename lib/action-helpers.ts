// lib/action-helpers.ts
"use server";

export type ActionResult<T> = { ok: true; data: T } | { ok: false; message: string };

export async function safeAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (e: any) {
    const message = e?.message ?? "Unexpected error";
    return { ok: false, message };
  }
}

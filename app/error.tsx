"use client";
export default function Error({ error }: { error: Error }) {
  return <div className="text-red-600">Something went wrong: {error.message}</div>;
}

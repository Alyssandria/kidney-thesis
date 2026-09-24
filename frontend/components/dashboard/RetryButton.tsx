"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RetryButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className="h-11 rounded-xl border border-kc-line bg-white px-4 text-sm font-semibold text-kc-ink-soft hover:bg-kc-canvas disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kc-primary"
    >
      {isPending ? "Trying again…" : "Try again"}
    </button>
  );
}

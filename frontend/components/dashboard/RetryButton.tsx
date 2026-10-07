"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export function RetryButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className="h-11 rounded-lg px-4 font-semibold"
    >
      {isPending ? "Trying again…" : "Try again"}
    </Button>
  );
}

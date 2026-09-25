import { Suspense } from "react";
import { connection } from "next/server";
import { ChartColumn, Info } from "lucide-react";
import { buildCountedFacts, MIN_MEALS_FOR_FACTS } from "@/lib/dashboardFacts";
import { USER_TIMEZONE, lastDaysRange } from "@/lib/dates";
import { DashboardSummary } from "@/schemas/dashboardSummary";
import { getDashboardSummary } from "@/services/dashboardService";
import { DashboardCard } from "./DashboardCard";
import { RetryButton } from "./RetryButton";

const DAYS = 7;

function CountedBadge() {
  return (
    <p className="inline-flex items-center gap-1.5 self-start rounded-lg bg-white py-1 pl-2 pr-2.5 text-[12.5px] font-extrabold text-kc-green-ink">
      <ChartColumn size={14} strokeWidth={2.2} aria-hidden="true" />
      Counted from your log
    </p>
  );
}

async function CountedFactsPanel() {
  await connection();

  let summary: DashboardSummary;
  try {
    const { from, to } = lastDaysRange(DAYS, USER_TIMEZONE);
    summary = await getDashboardSummary(from, to);
  } catch {
    return (
      <div className="flex flex-col items-start gap-3 rounded-[20px] bg-kc-green-soft p-5">
        <p className="text-sm font-semibold text-kc-ink">We couldn&apos;t load these facts</p>
        <RetryButton />
      </div>
    );
  }

  const facts = buildCountedFacts(summary, "in the last 7 days");

  return (
    <div className="flex flex-col gap-2.5 rounded-[20px] bg-kc-green-soft p-5">
      <CountedBadge />
      {facts ? (
        <>
          <p className="text-base font-semibold leading-relaxed text-kc-ink">{facts.headline}</p>
          {facts.details.map((detail) => (
            <p key={detail} className="text-sm leading-relaxed text-kc-primary-strong">
              {detail}
            </p>
          ))}
        </>
      ) : (
        <p className="text-sm leading-relaxed text-kc-ink">
          Save at least {MIN_MEALS_FOR_FACTS} meals in a week and simple counts from your log will
          appear here.
        </p>
      )}
    </div>
  );
}

export function WhatToNotice() {
  return (
    <DashboardCard id="notice" title="What to notice">
      <Suspense fallback={<CountedFactsSkeleton />}>
        <CountedFactsPanel />
      </Suspense>
      <p className="flex items-start gap-2 text-[13.5px] leading-relaxed text-kc-muted">
        <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        These notes describe the meals you logged, not your health. Your doctor or renal dietitian
        can tell you which limits apply to you.
      </p>
    </DashboardCard>
  );
}

function CountedFactsSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 rounded-[20px] bg-kc-green-soft p-5" aria-hidden="true">
      <div className="h-6 w-40 animate-pulse rounded-lg bg-white/70" />
      <div className="h-4 w-full animate-pulse rounded bg-white/70" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-white/70" />
    </div>
  );
}


import Link from "next/link";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { USER_TIMEZONE, formatTime, lastDaysRange } from "@/lib/dates";
import { MealType } from "@/schemas/mealFormSchema";
import { MealListItem, MealListResponse } from "@/schemas/mealList";
import { listMeals } from "@/services/mealService";
import { RetryButton } from "./RetryButton";

const SLOTS: { type: MealType; label: string; emptyText: string }[] = [
  { type: "BREAKFAST", label: "Breakfast", emptyText: "Not logged yet" },
  { type: "LUNCH", label: "Lunch", emptyText: "Not logged yet" },
  { type: "DINNER", label: "Dinner", emptyText: "Not logged yet" },
  { type: "SNACK", label: "Snack", emptyText: "Optional" },
];

// More than a day's worth of meals; the card only needs today's.
const TODAY_LIMIT = 50;

function CardShell({ children }: { children: ReactNode }) {
  return (
    <section
      aria-labelledby="today-heading"
      className="flex flex-col gap-4 rounded-[28px] bg-kc-peach p-6 text-kc-ink sm:p-7"
    >
      <h2
        id="today-heading"
        className="text-[13px] font-bold uppercase tracking-[0.1em] text-kc-peach-ink"
      >
        Today
      </h2>
      {children}
    </section>
  );
}

function MealSlot({
  label,
  emptyText,
  meals,
}: {
  label: string;
  emptyText: string;
  meals: MealListItem[];
}) {
  // Items arrive newest first.
  const [latest] = meals;

  if (!latest) {
    return (
      <li className="flex flex-col gap-1.5 rounded-2xl border-[1.5px] border-dashed border-kc-peach-line p-3.5 text-kc-peach-text">
        <span className="text-[13px] font-bold text-kc-ink">{label}</span>
        <span className="text-sm">{emptyText}</span>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={`/meals/${latest.id}`}
        className="flex h-full flex-col gap-1.5 rounded-2xl bg-white p-3.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kc-primary"
      >
        <span className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-kc-ink-soft">{label}</span>
          <Check size={18} strokeWidth={2.6} className="text-kc-primary" aria-label="Logged" />
        </span>
        <span className="line-clamp-2 text-sm font-semibold leading-snug">{latest.description}</span>
        <span className="text-[12.5px] text-kc-subtle">
          {formatTime(latest.createdAt, USER_TIMEZONE)}
          {meals.length > 1 && ` · +${meals.length - 1} more`}
        </span>
      </Link>
    </li>
  );
}

export async function TodayCard() {
  await connection();

  let today: MealListResponse;
  try {
    today = await listMeals({ ...lastDaysRange(1, USER_TIMEZONE), limit: TODAY_LIMIT });
  } catch {
    return (
      <CardShell>
        <p className="text-sm font-semibold">We couldn&apos;t load today&apos;s meals</p>
        <p className="text-sm text-kc-peach-text">Your saved meals are safe. Please try again.</p>
        <div>
          <RetryButton />
        </div>
      </CardShell>
    );
  }

  const meals = today.items;
  const [latest] = meals;

  return (
    <CardShell>
      <p className="text-4xl font-extrabold leading-none tracking-tight">
        {meals.length === 0
          ? "No meals logged yet"
          : `${meals.length} ${meals.length === 1 ? "meal" : "meals"} logged`}
      </p>

      <ul aria-label="Today's meals by meal type" className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {SLOTS.map((slot) => (
          <MealSlot
            key={slot.type}
            label={slot.label}
            emptyText={slot.emptyText}
            meals={meals.filter((meal) => meal.mealType === slot.type)}
          />
        ))}
      </ul>

      <p className="mt-auto line-clamp-2 text-sm text-kc-peach-text">
        {latest ? (
          <>
            Latest:{" "}
            <Link
              href={`/meals/${latest.id}`}
              className="font-semibold text-kc-ink underline-offset-4 hover:underline"
            >
              {latest.description}
            </Link>{" "}
            · saved {formatTime(latest.createdAt, USER_TIMEZONE)}
          </>
        ) : (
          "Meals you save today will appear here."
        )}
      </p>
    </CardShell>
  );
}

export function TodayCardSkeleton() {
  return (
    <CardShell>
      <div className="h-9 w-56 animate-pulse rounded bg-white/60" aria-hidden="true" />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" aria-hidden="true">
        {SLOTS.map((slot) => (
          <div key={slot.type} className="h-[92px] animate-pulse rounded-2xl bg-white/60" />
        ))}
      </div>
      <p className="sr-only" role="status">Loading today&apos;s meals…</p>
    </CardShell>
  );
}

import Link from "next/link";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { ChevronRight, Moon, Soup, Sun, Sunrise, Utensils } from "lucide-react";
import { NutrientLevelChip, notableNutrients } from "@/components/meals/NutrientLevelChip";
import { CONDIMENTS } from "@/lib/constants";
import { USER_TIMEZONE, formatDayLabel, formatTime } from "@/lib/dates";
import { MealType } from "@/schemas/mealFormSchema";
import { MealListItem, MealListResponse } from "@/schemas/mealList";
import { listMeals } from "@/services/mealService";
import { RetryButton } from "./RetryButton";

const RECENT_LIMIT = 4;

const MEAL_TYPE_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
};

function MealIcon({ meal }: { meal: MealListItem }) {
  if (meal.isSoup) {
    return <IconTile className="bg-kc-green-bg text-kc-green-ink" icon={<Soup size={24} />} />;
  }
  switch (meal.mealType) {
    case "BREAKFAST":
      return <IconTile className="bg-kc-amber-bg text-kc-amber-ink" icon={<Sunrise size={24} />} />;
    case "LUNCH":
      return <IconTile className="bg-kc-blue-bg text-kc-blue-ink" icon={<Sun size={24} />} />;
    case "DINNER":
      return <IconTile className="bg-kc-lilac-bg text-kc-lilac-ink" icon={<Moon size={24} />} />;
    default:
      return <IconTile className="bg-kc-mist text-kc-ink-soft" icon={<Utensils size={24} />} />;
  }
}

function IconTile({ className, icon }: { className: string; icon: ReactNode }) {
  return (
    <span
      className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl ${className}`}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}

function mealDetails(meal: MealListItem): string {
  const parts = [
    meal.mealType ? MEAL_TYPE_LABELS[meal.mealType] : null,
    `${formatDayLabel(meal.createdAt, USER_TIMEZONE)}, ${formatTime(meal.createdAt, USER_TIMEZONE)}`,
    meal.isSoup ? (meal.consumedSoup ? "Soup, broth eaten" : "Soup, broth not eaten") : null,
    meal.condiments.length > 0
      ? meal.condiments
          .map((id) => CONDIMENTS.find((condiment) => condiment.id === id)?.label ?? id)
          .join(", ")
      : null,
  ];
  return parts.filter((part) => part !== null).join(" · ");
}

function MealRow({ meal }: { meal: MealListItem }) {
  const notable = notableNutrients(meal.nutrientLevels);

  return (
    <li>
      <Link
        href={`/meals/${meal.id}`}
        className="-mx-3.5 flex items-center gap-4 rounded-[18px] p-3.5 text-kc-ink hover:bg-kc-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kc-primary"
      >
        <MealIcon meal={meal} />
        <span className="flex min-w-0 flex-grow flex-col gap-1.5">
          <span className="line-clamp-2 text-base font-bold leading-snug">{meal.description}</span>
          <span className="text-[13px] font-medium text-kc-subtle">{mealDetails(meal)}</span>
          {notable.length > 0 ? (
            <span className="flex flex-wrap gap-1.5">
              {notable.map((item) => (
                <NutrientLevelChip key={item.nutrient} {...item} />
              ))}
            </span>
          ) : (
            <span className="text-[13px] text-kc-subtle">No nutrients stood out</span>
          )}
        </span>
        <ChevronRight size={20} className="shrink-0 text-kc-faint" aria-hidden="true" />
      </Link>
    </li>
  );
}

export async function RecentMeals() {
  await connection();

  let recent: MealListResponse;
  try {
    recent = await listMeals({ limit: RECENT_LIMIT });
  } catch {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm font-semibold text-kc-ink">We couldn&apos;t load your recent meals</p>
        <p className="text-sm text-kc-muted">Your saved meals are safe. Please try again.</p>
        <RetryButton />
      </div>
    );
  }

  if (recent.items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm font-semibold text-kc-ink">No saved meals yet</p>
        <p className="text-sm text-kc-muted">
          Analyze a meal and save it to your log. Your latest meals will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {recent.items.map((meal) => (
        <MealRow key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}

export function RecentMealsSkeleton() {
  return (
    <div className="flex flex-col" aria-hidden="true">
      {Array.from({ length: RECENT_LIMIT }, (_, n) => (
        <div key={n} className="flex items-center gap-4 py-3.5">
          <div className="h-[52px] w-[52px] shrink-0 animate-pulse rounded-2xl bg-kc-line" />
          <div className="flex flex-grow flex-col gap-2">
            <div className="h-4 w-3/5 animate-pulse rounded bg-kc-line" />
            <div className="h-3 w-2/5 animate-pulse rounded bg-kc-line" />
          </div>
        </div>
      ))}
    </div>
  );
}

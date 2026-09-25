import Link from "next/link";
import { connection } from "next/server";
import { NutrientLevelChip, notableNutrients } from "@/components/meals/NutrientLevelChip";
import { dayRange, formatLongDate } from "@/lib/calendar";
import { USER_TIMEZONE, formatTime } from "@/lib/dates";
import { MEAL_TYPE_LABELS } from "@/lib/constants";
import { MealListResponse } from "@/schemas/mealList";
import { listMeals } from "@/services/mealService";
import { RetryButton } from "./RetryButton";

// More than a day's worth of meals, so the list is never cut short.
const DAY_LIMIT = 50;

export async function DayMealsPanel({ day, today }: { day: string; today: string }) {
  await connection();

  const title = `${day === today ? "Today · " : ""}${formatLongDate(day)}`;

  let result: MealListResponse;
  try {
    result = await listMeals({ ...dayRange(day, USER_TIMEZONE), limit: DAY_LIMIT });
  } catch {
    return (
      <div className="flex flex-col items-start gap-3">
        <h3 className="text-[15px] font-bold">{title}</h3>
        <p className="text-sm text-kc-muted">We couldn&apos;t load this day&apos;s meals.</p>
        <RetryButton />
      </div>
    );
  }

  const meals = result.items;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-bold">{title}</h3>
        <span className="text-[13px] font-semibold text-kc-subtle">
          {meals.length === 1 ? "1 meal" : `${meals.length} meals`}
        </span>
      </div>

      {meals.length === 0 ? (
        <p className="rounded-[14px] border-[1.5px] border-dashed border-kc-line p-3.5 text-sm leading-relaxed text-kc-muted">
          Nothing logged on this day. Gaps are normal; the calendar only shows meals you saved.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {meals.map((meal) => {
            const [topNutrient] = notableNutrients(meal.nutrientLevels);
            const meta = [
              meal.mealType ? MEAL_TYPE_LABELS[meal.mealType] : null,
              formatTime(meal.createdAt, USER_TIMEZONE),
            ]
              .filter((part) => part !== null)
              .join(" · ");

            return (
              <li key={meal.id}>
                <Link
                  href={`/meals/${meal.id}`}
                  className="flex flex-col gap-1.5 rounded-[14px] bg-kc-canvas px-3 py-2.5 text-kc-ink hover:bg-kc-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kc-primary"
                >
                  <span className="line-clamp-2 text-sm font-bold leading-snug">{meal.description}</span>
                  <span className="flex flex-wrap items-center gap-2 text-[12.5px] text-kc-subtle">
                    {meta}
                    {topNutrient ? (
                      <NutrientLevelChip {...topNutrient} />
                    ) : (
                      <span>· No nutrients stood out</span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function DayMealsPanelSkeleton() {
  return (
    <div className="flex flex-col gap-2.5" aria-hidden="true">
      <div className="h-4 w-48 animate-pulse rounded bg-kc-line" />
      <div className="h-14 animate-pulse rounded-[14px] bg-kc-mist" />
    </div>
  );
}

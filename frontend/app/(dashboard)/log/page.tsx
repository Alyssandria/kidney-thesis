import type { Metadata } from "next";
import { connection } from "next/server";
import { RetryButton } from "@/components/dashboard/RetryButton";
import { PageHeader } from "@/components/layout/PageHeader";
import { LogFoodView } from "@/components/log/LogFoodView";
import { nextMealType } from "@/lib/foodFlags";
import type { FoodListResponse } from "@/schemas/foods";
import type { FoodLogDay } from "@/schemas/foodLog";
import { MealTypeSchema, type MealType } from "@/schemas/mealFormSchema";
import type { NutrientAmounts } from "@/schemas/nutrition";
import { listFoods } from "@/services/foodService";
import { getFoodLogDay } from "@/services/foodLogService";

export const metadata: Metadata = {
  title: "Log food",
};

const FOOD_LIMIT = 100;

function referencesFrom(day: FoodLogDay): NutrientAmounts {
  const reference = (nutrient: keyof NutrientAmounts) =>
    day.nutrients.find((result) => result.nutrient === nutrient)?.reference ?? 0;
  return {
    SODIUM: reference("SODIUM"),
    POTASSIUM: reference("POTASSIUM"),
    PHOSPHORUS: reference("PHOSPHORUS"),
    PROTEIN: reference("PROTEIN"),
    ENERGY: reference("ENERGY"),
    FLUID: reference("FLUID"),
  };
}

export default async function LogFoodPage({ searchParams }: PageProps<"/log">) {
  await connection();
  const { meal } = await searchParams;

  let foods: FoodListResponse;
  let today: FoodLogDay;
  try {
    [foods, today] = await Promise.all([listFoods({ limit: FOOD_LIMIT }), getFoodLogDay()]);
  } catch {
    return (
      <>
        <PageHeader title="Log food" description="Pick foods from the K-WAIS database." />
        <div className="flex flex-col items-start gap-3 rounded-xl bg-card p-5 shadow-card ring-1 ring-border">
          <p className="font-semibold">We couldn&apos;t load the food list</p>
          <p className="text-sm text-muted-foreground">Nothing was lost. Please try again.</p>
          <RetryButton />
        </div>
      </>
    );
  }

  const count = (mealType: MealType) =>
    today.meals.find((group) => group.mealType === mealType)?.items.length ?? 0;
  const loggedCounts: Record<MealType, number> = {
    BREAKFAST: count("BREAKFAST"),
    LUNCH: count("LUNCH"),
    DINNER: count("DINNER"),
    SNACK: count("SNACK"),
  };
  const requestedMeal = MealTypeSchema.safeParse(meal);

  return (
    <>
      <PageHeader
        title="Log food"
        description="Pick foods from the K-WAIS database and check the impact before logging."
      />
      <LogFoodView
        foods={foods.items}
        references={referencesFrom(today)}
        loggedCounts={loggedCounts}
        initialMeal={requestedMeal.success ? requestedMeal.data : nextMealType(loggedCounts)}
      />
    </>
  );
}

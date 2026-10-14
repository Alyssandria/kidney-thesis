"use client";

import { useMemo, useState } from "react";
import { Cookie, Moon, Search, Sun, Sunrise, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LOW_SODIUM_MG, HIGH_SHARE, filterFoods } from "@/lib/foodFlags";
import { MEAL_TYPE_LABELS } from "@/lib/constants";
import { FOOD_CATEGORY_LABELS } from "@/lib/nutrients";
import type { Food } from "@/schemas/foods";
import type { MealType } from "@/schemas/mealFormSchema";
import { FOOD_CATEGORIES, type FoodCategory, type NutrientAmounts } from "@/schemas/nutrition";
import { FoodRow } from "./FoodRow";

const MEALS: { type: MealType; icon: typeof Sun }[] = [
  { type: "BREAKFAST", icon: Sunrise },
  { type: "LUNCH", icon: Sun },
  { type: "DINNER", icon: Moon },
  { type: "SNACK", icon: Cookie },
];

type CategoryFilter = FoodCategory | "ALL";

const isCategoryFilter = (value: unknown): value is CategoryFilter =>
  value === "ALL" || FOOD_CATEGORIES.some((category) => category === value);

const isMealType = (value: unknown): value is MealType =>
  MEALS.some((meal) => meal.type === value);

export function LogFoodView({
  foods,
  references,
  loggedCounts,
  initialMeal,
}: {
  foods: Food[];
  references: NutrientAmounts;
  loggedCounts: Record<MealType, number>;
  initialMeal: MealType;
}) {
  const [meal, setMeal] = useState<MealType>(initialMeal);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("ALL");

  const visible = useMemo(() => filterFoods(foods, { query, category }), [foods, query, category]);
  const categories = FOOD_CATEGORIES.map((value) => ({
    value,
    count: foods.filter((food) => food.category === value).length,
  })).filter(({ count }) => count > 0);

  return (
    <div className="flex flex-col gap-5">
      <section aria-labelledby="meal-heading" className="flex flex-col gap-2">
        <h2 id="meal-heading" className="font-sans text-sm font-bold">
          Which meal?
        </h2>
        <ToggleGroup
          value={[meal]}
          onValueChange={(values) => {
            const [next] = values;
            if (isMealType(next)) setMeal(next);
          }}
          aria-labelledby="meal-heading"
          className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {MEALS.map(({ type, icon: Icon }) => {
            const count = loggedCounts[type];
            return (
              <ToggleGroupItem
                key={type}
                value={type}
                className="h-auto justify-start gap-3 rounded-xl border border-border bg-card p-3 text-left data-[pressed]:border-primary data-[pressed]:bg-brand-soft"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-bold">{MEAL_TYPE_LABELS[type]}</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {count === 0 ? "Nothing yet" : `${count} logged`}
                  </span>
                </span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </section>

      <section aria-labelledby="foods-heading" className="flex flex-col gap-3">
        <h2 id="foods-heading" className="sr-only">
          Foods
        </h2>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search foods: rice, tilapia, sayote…"
            aria-label="Search foods"
            className="h-11 rounded-lg bg-card pr-11 pl-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-1.5 -translate-y-1/2"
            >
              <X />
            </Button>
          )}
        </div>

        <ToggleGroup
          value={[category]}
          onValueChange={(values) => {
            const [next] = values;
            setCategory(isCategoryFilter(next) ? next : "ALL");
          }}
          aria-label="Food categories"
          className="flex flex-wrap gap-1.5"
        >
          {[{ value: "ALL" as const, count: foods.length }, ...categories].map(({ value, count }) => (
            <ToggleGroupItem
              key={value}
              value={value}
              size="sm"
              className="h-9 rounded-full border border-border bg-card px-3.5 text-[13px] font-semibold data-[pressed]:border-primary data-[pressed]:bg-primary data-[pressed]:text-primary-foreground"
            >
              {value === "ALL" ? "All" : FOOD_CATEGORY_LABELS[value]}
              <span className="ml-1 opacity-70">{count}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="rounded-xl bg-card px-4 shadow-card ring-1 ring-border" aria-live="polite">
          {visible.length > 0 ? (
            <ul className="divide-y divide-border">
              {visible.map((food) => (
                <li key={food.id}>
                  <FoodRow food={food} references={references} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-2 py-8">
              <p className="font-semibold">No food found</p>
              <p className="text-sm text-muted-foreground">
                Nothing matches{query ? ` “${query.trim()}”` : " this category"}. Try another word or
                a similar food. Foods are added to the K-WAIS database by the administrator.
              </p>
              {(query || category !== "ALL") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setCategory("ALL");
                  }}
                  className="mt-1 h-10 rounded-lg"
                >
                  Show all foods
                </Button>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          “High” means one serving gives {HIGH_SHARE * 100}% or more of your daily reference. “Low
          sodium” means {LOW_SODIUM_MG} mg or less per serving.
        </p>
      </section>
    </div>
  );
}

import { describe, expect, it } from "vitest";
import type { Food } from "../db/schema/index.js";
import { buildDatabaseItems } from "./meal-items.js";

const RICE_ID = "11111111-1111-4111-8111-111111111111";
const EGG_ID = "22222222-2222-4222-8222-222222222222";
const MISSING_ID = "33333333-3333-4333-8333-333333333333";

function food(id: string, name: string, overrides: Partial<Food> = {}): Food {
  return {
    id,
    name,
    category: "GRAINS",
    servingSize: 1,
    servingUnit: "cup",
    energyKcal: 205,
    sodiumMg: 2,
    potassiumMg: 55,
    phosphorusMg: 68,
    proteinG: 4.3,
    fluidMl: 0,
    source: "test",
    isActive: true,
    createdAt: new Date("2026-10-01T00:00:00Z"),
    updatedAt: new Date("2026-10-01T00:00:00Z"),
    ...overrides,
  };
}

describe("buildDatabaseItems", () => {
  const foods = [food(RICE_ID, "White rice, cooked"), food(EGG_ID, "Boiled egg", { sodiumMg: 62 })];

  it("copies food values and keeps the requested order and servings", () => {
    const result = buildDatabaseItems(
      [
        { foodId: EGG_ID, servings: 2 },
        { foodId: RICE_ID, servings: 0.5 },
      ],
      foods,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.items.map((item) => [item.foodName, item.servings])).toEqual([
      ["Boiled egg", 2],
      ["White rice, cooked", 0.5],
    ]);
    expect(result.items[0]).toMatchObject({
      foodId: EGG_ID,
      source: "DATABASE",
      servingSize: 1,
      servingUnit: "cup",
      sodiumMg: 62,
    });
  });

  it("reports every food that wasn't found", () => {
    const result = buildDatabaseItems(
      [
        { foodId: RICE_ID, servings: 1 },
        { foodId: MISSING_ID, servings: 1 },
      ],
      foods,
    );
    expect(result).toEqual({ ok: false, missingFoodIds: [MISSING_ID] });
  });
});

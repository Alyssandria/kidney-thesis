import { describe, expect, it } from "vitest";
import {
  analyzeDay,
  contributors,
  dayAlerts,
  limitStatus,
  sumNutrients,
  type FoodEntry,
  type NutrientAmounts,
} from "./daily-analysis.js";

const REFERENCES: NutrientAmounts = {
  SODIUM: 2000,
  POTASSIUM: 2000,
  PHOSPHORUS: 800,
  PROTEIN: 60,
  ENERGY: 1800,
  FLUID: 1500,
};

function food(foodName: string, servings: number, perServing: Partial<NutrientAmounts>): FoodEntry {
  return {
    foodName,
    servings,
    perServing: { SODIUM: 0, POTASSIUM: 0, PHOSPHORUS: 0, PROTEIN: 0, ENERGY: 0, FLUID: 0, ...perServing },
  };
}

const rice = (servings = 1) => food("White rice, cooked", servings, { SODIUM: 2, PROTEIN: 4.3, ENERGY: 205 });
const noodles = (servings = 1) => food("Instant noodles", servings, { SODIUM: 1600, PROTEIN: 8, ENERGY: 380 });
const adobo = (servings = 1) => food("Pork adobo", servings, { SODIUM: 1100, PROTEIN: 30, ENERGY: 400 });

const find = <T extends { nutrient: string }>(items: T[], nutrient: string) =>
  items.find((item) => item.nutrient === nutrient);

describe("sumNutrients", () => {
  it("returns zeros for an empty day", () => {
    expect(sumNutrients([])).toEqual({
      SODIUM: 0,
      POTASSIUM: 0,
      PHOSPHORUS: 0,
      PROTEIN: 0,
      ENERGY: 0,
      FLUID: 0,
    });
  });

  it("multiplies per-serving values by servings and adds entries", () => {
    const totals = sumNutrients([rice(2), noodles(0.5)]);
    expect(totals.SODIUM).toBeCloseTo(2 * 2 + 0.5 * 1600);
    expect(totals.PROTEIN).toBeCloseTo(2 * 4.3 + 0.5 * 8);
    expect(totals.ENERGY).toBeCloseTo(2 * 205 + 0.5 * 380);
  });
});

describe("limitStatus", () => {
  it.each([
    [0, "WITHIN"],
    [79.99, "WITHIN"],
    [80, "APPROACHING"],
    [99.99, "APPROACHING"],
    [100, "ABOVE"],
    [250, "ABOVE"],
  ] as const)("%d%% is %s", (percent, status) => {
    expect(limitStatus(percent)).toBe(status);
  });
});

describe("analyzeDay", () => {
  it("reports every nutrient in a fixed order, with energy as information only", () => {
    const analysis = analyzeDay([noodles(2)], REFERENCES);
    expect(analysis.map((a) => a.nutrient)).toEqual([
      "SODIUM",
      "POTASSIUM",
      "PHOSPHORUS",
      "PROTEIN",
      "ENERGY",
      "FLUID",
    ]);
    expect(find(analysis, "SODIUM")).toMatchObject({ total: 3200, reference: 2000, percent: 160, status: "ABOVE" });
    expect(find(analysis, "ENERGY")).toMatchObject({ total: 760, status: "INFO" });
  });

  it("marks a nutrient approaching from 80% of its reference", () => {
    const analysis = analyzeDay([noodles(1)], REFERENCES);
    expect(find(analysis, "SODIUM")).toMatchObject({ percent: 80, status: "APPROACHING" });
  });
});

describe("contributors", () => {
  it("combines repeated foods and sorts by amount", () => {
    const result = contributors([rice(), adobo(), rice(), noodles()], "SODIUM");
    expect(result.map((c) => c.foodName)).toEqual(["Instant noodles", "Pork adobo", "White rice, cooked"]);
    expect(result[2]).toMatchObject({ amount: 4 });
  });

  it("gives each food's share of the total", () => {
    const result = contributors([noodles(), adobo()], "SODIUM");
    expect(result[0]?.sharePercent).toBeCloseTo((1600 / 2700) * 100);
    expect(result.reduce((sum, c) => sum + c.sharePercent, 0)).toBeCloseTo(100);
  });

  it("leaves out foods that add none of the nutrient", () => {
    expect(contributors([rice(), food("Water", 1, { FLUID: 250 })], "FLUID")).toEqual([
      { foodName: "Water", amount: 250, sharePercent: 100 },
    ]);
  });

  it("returns an empty list when nothing contributed", () => {
    expect(contributors([rice()], "FLUID")).toEqual([]);
  });
});

describe("dayAlerts", () => {
  it("returns nothing when every limited nutrient is within reference", () => {
    expect(dayAlerts([rice()], REFERENCES)).toEqual([]);
  });

  it("never alerts on energy", () => {
    const alerts = dayAlerts([food("Cake", 1, { ENERGY: 5000 })], REFERENCES);
    expect(alerts).toEqual([]);
  });

  it("lists approaching and above nutrients, most exceeded first, with top contributors", () => {
    // Sodium 3252 mg (163%), protein 57.3 g (96%)
    const alerts = dayAlerts([noodles(), adobo(1.5), rice()], REFERENCES);
    expect(alerts.map((a) => [a.nutrient, a.status])).toEqual([
      ["SODIUM", "ABOVE"],
      ["PROTEIN", "APPROACHING"],
    ]);
    expect(alerts[0]?.topContributors.map((c) => c.foodName)).toEqual([
      "Pork adobo",
      "Instant noodles",
      "White rice, cooked",
    ]);
  });

  it("keeps only the requested number of contributors", () => {
    const alerts = dayAlerts([noodles(), adobo(), rice()], REFERENCES, 2);
    expect(alerts[0]?.topContributors).toHaveLength(2);
  });
});

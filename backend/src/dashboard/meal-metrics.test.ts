import { describe, expect, it } from "vitest";
import {
  computeMealSummary,
  condimentCounts,
  dailyCounts,
  mealTypeCounts,
  nutrientLevelCounts,
  soupCounts,
  toLocalDate,
  type MealMetricRow,
} from "./meal-metrics.js";

const MANILA = "Asia/Manila";

function row(overrides: Partial<MealMetricRow> = {}): MealMetricRow {
  return {
    createdAt: new Date("2026-09-24T04:00:00Z"),
    mealType: "LUNCH",
    isSoup: false,
    consumedSoup: null,
    condiments: [],
    sodiumLevel: "LOW",
    potassiumLevel: "LOW",
    phosphorusLevel: "LOW",
    proteinLevel: "OPTIMAL",
    ...overrides,
  };
}

describe("toLocalDate", () => {
  it("uses the given timezone, not UTC", () => {
    // 23 Sep 16:30 UTC is 24 Sep 00:30 in Manila (UTC+8).
    expect(toLocalDate(new Date("2026-09-23T16:30:00Z"), MANILA)).toBe("2026-09-24");
    expect(toLocalDate(new Date("2026-09-23T15:59:00Z"), MANILA)).toBe("2026-09-23");
  });
});

describe("dailyCounts", () => {
  it("groups meals by local day and sorts by date", () => {
    const rows = [
      row({ createdAt: new Date("2026-09-24T01:00:00Z") }),
      row({ createdAt: new Date("2026-09-22T01:00:00Z") }),
      row({ createdAt: new Date("2026-09-24T10:00:00Z") }),
    ];
    expect(dailyCounts(rows, MANILA)).toEqual([
      { date: "2026-09-22", count: 1 },
      { date: "2026-09-24", count: 2 },
    ]);
  });

  it("puts a meal saved just after local midnight on the new day", () => {
    const rows = [row({ createdAt: new Date("2026-09-23T16:05:00Z") })];
    expect(dailyCounts(rows, MANILA)).toEqual([{ date: "2026-09-24", count: 1 }]);
  });
});

describe("nutrientLevelCounts", () => {
  it("counts every level, including ones with no meals", () => {
    const rows = [
      row({ sodiumLevel: "HIGH" }),
      row({ sodiumLevel: "HIGH", potassiumLevel: "MODERATE" }),
      row({ phosphorusLevel: "CRITICAL" }),
    ];
    expect(nutrientLevelCounts(rows)).toEqual({
      sodium: { LOW: 1, MODERATE: 0, HIGH: 2, CRITICAL: 0 },
      potassium: { LOW: 2, MODERATE: 1, HIGH: 0, CRITICAL: 0 },
      phosphorus: { LOW: 2, MODERATE: 0, HIGH: 0, CRITICAL: 1 },
    });
  });
});

describe("condimentCounts", () => {
  it("counts meals that used each condiment, once per meal", () => {
    const rows = [
      row({ condiments: ["patis", "salt"] }),
      row({ condiments: ["patis", "patis"] }),
      row(),
    ];
    const counts = condimentCounts(rows);
    expect(counts.patis).toBe(2);
    expect(counts.salt).toBe(1);
    expect(counts.bagoong).toBe(0);
  });
});

describe("soupCounts", () => {
  it("only counts broth for soup meals", () => {
    const rows = [
      row({ isSoup: true, consumedSoup: true }),
      row({ isSoup: true, consumedSoup: false }),
      row({ isSoup: false, consumedSoup: true }),
    ];
    expect(soupCounts(rows)).toEqual({ soupMeals: 2, brothConsumed: 1 });
  });
});

describe("mealTypeCounts", () => {
  it("groups meals without a type under NOT_SET", () => {
    const rows = [row({ mealType: "BREAKFAST" }), row({ mealType: null }), row({ mealType: null })];
    expect(mealTypeCounts(rows)).toEqual({
      BREAKFAST: 1,
      LUNCH: 0,
      DINNER: 0,
      SNACK: 0,
      NOT_SET: 2,
    });
  });
});

describe("computeMealSummary", () => {
  it("returns zeros for an empty log", () => {
    const summary = computeMealSummary([], MANILA);
    expect(summary.mealCount).toBe(0);
    expect(summary.daysLogged).toBe(0);
    expect(summary.dailyCounts).toEqual([]);
    expect(summary.soup).toEqual({ soupMeals: 0, brothConsumed: 0 });
    expect(Object.values(summary.condiments).every((count) => count === 0)).toBe(true);
  });

  it("counts days logged from distinct local dates", () => {
    const rows = [
      row({ createdAt: new Date("2026-09-24T01:00:00Z") }),
      row({ createdAt: new Date("2026-09-24T05:00:00Z") }),
      row({ createdAt: new Date("2026-09-25T01:00:00Z") }),
    ];
    const summary = computeMealSummary(rows, MANILA);
    expect(summary.mealCount).toBe(3);
    expect(summary.daysLogged).toBe(2);
  });
});

import { describe, expect, it } from "vitest";
import { daysInclusive, eachDate } from "./calendar-dates.js";

describe("eachDate", () => {
  it("includes both ends", () => {
    expect(eachDate("2026-10-12", "2026-10-14")).toEqual(["2026-10-12", "2026-10-13", "2026-10-14"]);
  });

  it("crosses month and leap-day boundaries", () => {
    expect(eachDate("2028-02-28", "2028-03-01")).toEqual(["2028-02-28", "2028-02-29", "2028-03-01"]);
  });

  it("returns one date when from equals to, and none when reversed", () => {
    expect(eachDate("2026-10-14", "2026-10-14")).toEqual(["2026-10-14"]);
    expect(eachDate("2026-10-14", "2026-10-13")).toEqual([]);
  });
});

describe("daysInclusive", () => {
  it("counts both ends", () => {
    expect(daysInclusive("2026-10-01", "2026-10-31")).toBe(31);
    expect(daysInclusive("2026-10-14", "2026-10-14")).toBe(1);
  });
});

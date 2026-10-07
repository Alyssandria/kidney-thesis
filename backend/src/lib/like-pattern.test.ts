import { describe, expect, it } from "vitest";
import { containsPattern } from "./like-pattern.js";

describe("containsPattern", () => {
  it("wraps plain text in wildcards", () => {
    expect(containsPattern("rice")).toBe("%rice%");
  });

  it("escapes LIKE wildcards and the escape character", () => {
    expect(containsPattern("100%_fat\\free")).toBe("%100\\%\\_fat\\\\free%");
  });
});

import { MealListItem } from "@/schemas/mealList";

type NutrientLevels = MealListItem["nutrientLevels"];
type MineralLevel = NutrientLevels["sodium"];
type ProteinLevel = NutrientLevels["protein"];

export type NotableNutrient =
  | { nutrient: "sodium" | "potassium" | "phosphorus"; level: Exclude<MineralLevel, "LOW"> }
  | { nutrient: "protein"; level: Exclude<ProteinLevel, "OPTIMAL"> };

const NUTRIENT_LABELS = {
  sodium: "Sodium",
  potassium: "Potassium",
  phosphorus: "Phosphorus",
  protein: "Protein",
} as const;

const LEVEL_STYLES = {
  MODERATE: { label: "Moderate", className: "bg-kc-mist text-kc-ink-soft" },
  HIGH: { label: "High", className: "bg-kc-amber-bg text-kc-amber-ink" },
  CRITICAL: { label: "Very high", className: "bg-kc-coral-bg text-kc-coral-ink" },
  TOO_HIGH: { label: "Above range", className: "bg-kc-blue-bg text-kc-blue-ink" },
  TOO_LOW: { label: "Below range", className: "bg-kc-blue-bg text-kc-blue-ink" },
} as const;

// Most important first, so the chips read in order of attention.
const LEVEL_ORDER = ["CRITICAL", "HIGH", "TOO_HIGH", "TOO_LOW", "MODERATE"] as const;

/**
 * Nutrients worth showing on a meal card. LOW and OPTIMAL are left out to keep
 * cards short; the full analysis still shows every level.
 */
export function notableNutrients(levels: NutrientLevels): NotableNutrient[] {
  const notable: NotableNutrient[] = [];
  for (const nutrient of ["sodium", "potassium", "phosphorus"] as const) {
    const level = levels[nutrient];
    if (level !== "LOW") notable.push({ nutrient, level });
  }
  if (levels.protein !== "OPTIMAL") notable.push({ nutrient: "protein", level: levels.protein });
  return notable.sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));
}

/** Shape plus word, so the level never depends on colour alone. */
function LevelIcon({ level }: { level: NotableNutrient["level"] }) {
  switch (level) {
    case "MODERATE":
      return (
        <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2.4 1.6" />
      );
    case "HIGH":
      return (
        <>
          <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 1.5a4.5 4.5 0 0 1 0 9z" fill="currentColor" />
        </>
      );
    case "CRITICAL":
      return <circle cx="6" cy="6" r="5" fill="currentColor" />;
    case "TOO_HIGH":
      return (
        <path d="M6 10V2M2.5 5.5L6 2l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      );
    case "TOO_LOW":
      return (
        <path d="M6 2v8M2.5 6.5L6 10l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      );
  }
}

export function NutrientLevelChip({ nutrient, level }: NotableNutrient) {
  const style = LEVEL_STYLES[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full py-0.75 pl-1.75 pr-2.25 text-[12.5px] font-bold ${style.className}`}
    >
      <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
        <LevelIcon level={level} />
      </svg>
      {NUTRIENT_LABELS[nutrient]} · {style.label}
    </span>
  );
}

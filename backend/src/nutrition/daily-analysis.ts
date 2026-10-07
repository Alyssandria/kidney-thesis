import { GUIDELINE_NUTRIENTS, type GuidelineNutrient } from "../schemas/guideline.schema.js";

export type NutrientAmounts = Record<GuidelineNutrient, number>;

/** One logged food: its per-serving nutrient values and how many servings were eaten. */
export type FoodEntry = {
  foodName: string;
  servings: number;
  perServing: NutrientAmounts;
};

export const APPROACHING_PERCENT = 80;
export const ABOVE_PERCENT = 100;

/** Nutrients with a daily limit. Energy is shown against its reference but never alerts. */
export const LIMITED_NUTRIENTS = [
  "SODIUM",
  "POTASSIUM",
  "PHOSPHORUS",
  "PROTEIN",
  "FLUID",
] as const satisfies readonly GuidelineNutrient[];

export type LimitStatus = "WITHIN" | "APPROACHING" | "ABOVE";
export type NutrientStatus = LimitStatus | "INFO";

export type NutrientAnalysis = {
  nutrient: GuidelineNutrient;
  total: number;
  reference: number;
  /** total as a percentage of reference */
  percent: number;
  status: NutrientStatus;
};

export type Contributor = {
  foodName: string;
  amount: number;
  /** Share of the nutrient's total, 0–100. */
  sharePercent: number;
};

export type NutrientAlert = {
  nutrient: GuidelineNutrient;
  status: Exclude<LimitStatus, "WITHIN">;
  total: number;
  reference: number;
  percent: number;
  topContributors: Contributor[];
};

const LIMITED = new Set<GuidelineNutrient>(LIMITED_NUTRIENTS);

function emptyAmounts(): NutrientAmounts {
  return { SODIUM: 0, POTASSIUM: 0, PHOSPHORUS: 0, PROTEIN: 0, ENERGY: 0, FLUID: 0 };
}

export function sumNutrients(entries: readonly FoodEntry[]): NutrientAmounts {
  const totals = emptyAmounts();
  for (const entry of entries) {
    for (const nutrient of GUIDELINE_NUTRIENTS) {
      totals[nutrient] += entry.perServing[nutrient] * entry.servings;
    }
  }
  return totals;
}

export function limitStatus(percent: number): LimitStatus {
  if (percent >= ABOVE_PERCENT) return "ABOVE";
  if (percent >= APPROACHING_PERCENT) return "APPROACHING";
  return "WITHIN";
}

export function analyzeDay(
  entries: readonly FoodEntry[],
  references: NutrientAmounts,
): NutrientAnalysis[] {
  const totals = sumNutrients(entries);
  return GUIDELINE_NUTRIENTS.map((nutrient) => {
    const total = totals[nutrient];
    const reference = references[nutrient];
    const percent = reference > 0 ? (total / reference) * 100 : 0;
    return {
      nutrient,
      total,
      reference,
      percent,
      status: LIMITED.has(nutrient) ? limitStatus(percent) : "INFO",
    };
  });
}

/** Foods that added to a nutrient, largest first. Repeated foods are combined. */
export function contributors(entries: readonly FoodEntry[], nutrient: GuidelineNutrient): Contributor[] {
  const byFood = new Map<string, number>();
  for (const entry of entries) {
    const amount = entry.perServing[nutrient] * entry.servings;
    if (amount > 0) byFood.set(entry.foodName, (byFood.get(entry.foodName) ?? 0) + amount);
  }

  const total = [...byFood.values()].reduce((sum, amount) => sum + amount, 0);
  return [...byFood.entries()]
    .map(([foodName, amount]) => ({ foodName, amount, sharePercent: (amount / total) * 100 }))
    .sort((a, b) => b.amount - a.amount || a.foodName.localeCompare(b.foodName));
}

/** Limited nutrients at or past the approaching threshold, most exceeded first. */
export function dayAlerts(
  entries: readonly FoodEntry[],
  references: NutrientAmounts,
  maxContributors = 3,
): NutrientAlert[] {
  return analyzeDay(entries, references)
    .flatMap(({ nutrient, total, reference, percent, status }) =>
      status === "APPROACHING" || status === "ABOVE"
        ? [
            {
              nutrient,
              status,
              total,
              reference,
              percent,
              topContributors: contributors(entries, nutrient).slice(0, maxContributors),
            },
          ]
        : [],
    )
    .sort((a, b) => b.percent - a.percent);
}

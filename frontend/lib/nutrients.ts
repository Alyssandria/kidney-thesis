import type { FoodCategory, Nutrient, NutrientStatus } from "@/schemas/nutrition";

export const NUTRIENT_LABELS: Record<Nutrient, string> = {
  SODIUM: "Sodium",
  POTASSIUM: "Potassium",
  PHOSPHORUS: "Phosphorus",
  PROTEIN: "Protein",
  ENERGY: "Calories",
  FLUID: "Fluid",
};

/** Short forms for tight spaces such as food chips. */
export const NUTRIENT_SHORT_LABELS: Record<Nutrient, string> = {
  SODIUM: "Na",
  POTASSIUM: "K",
  PHOSPHORUS: "P",
  PROTEIN: "Protein",
  ENERGY: "kcal",
  FLUID: "Fluid",
};

export const NUTRIENT_UNITS: Record<Nutrient, "mg" | "g" | "kcal" | "mL"> = {
  SODIUM: "mg",
  POTASSIUM: "mg",
  PHOSPHORUS: "mg",
  PROTEIN: "g",
  ENERGY: "kcal",
  FLUID: "mL",
};

export const STATUS_LABELS: Record<NutrientStatus, string> = {
  WITHIN: "Within reference",
  APPROACHING: "Approaching",
  ABOVE: "Above reference",
  INFO: "Energy",
};

export const FOOD_CATEGORY_LABELS: Record<FoodCategory, string> = {
  GRAINS: "Grains",
  PROTEIN: "Protein",
  VEGETABLES: "Vegetables",
  FRUIT: "Fruit",
  SOUPS: "Soups",
  PROCESSED: "Processed",
  BEVERAGES: "Beverages",
  MIXED_DISHES: "Mixed dishes",
};

const numberFormat = new Intl.NumberFormat("en-PH", { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat("en-PH", { maximumFractionDigits: 1 });

/** Protein shows one decimal; every other nutrient is a whole number. */
export function formatAmount(nutrient: Nutrient, value: number): string {
  return (nutrient === "PROTEIN" ? oneDecimal : numberFormat).format(value);
}

export function formatAmountWithUnit(nutrient: Nutrient, value: number): string {
  return `${formatAmount(nutrient, value)} ${NUTRIENT_UNITS[nutrient]}`;
}

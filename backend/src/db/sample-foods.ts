import type { NewFood } from "./schema/index.js";

const SOURCE =
  "Sample values for testing. Replace with Philippine Food Composition Tables (FNRI) values before deployment.";

// [name, category, serving size, unit, kcal, sodium mg, potassium mg, phosphorus mg, protein g, fluid mL]
type Row = [
  NewFood["name"],
  NewFood["category"],
  number,
  string,
  number,
  number,
  number,
  number,
  number,
  number,
];

const ROWS: Row[] = [
  ["White rice, cooked", "GRAINS", 1, "cup", 205, 2, 55, 68, 4.3, 0],
  ["Garlic fried rice", "GRAINS", 1, "cup", 280, 380, 70, 80, 5, 0],
  ["Pandesal", "GRAINS", 2, "pieces", 150, 260, 50, 45, 4.5, 0],
  ["White bread", "GRAINS", 2, "slices", 160, 290, 70, 60, 5, 0],
  ["Pancit bihon", "GRAINS", 1, "cup", 280, 720, 210, 110, 12, 0],
  ["Boiled egg", "PROTEIN", 1, "piece", 78, 62, 63, 86, 6.3, 0],
  ["Egg whites, cooked", "PROTEIN", 2, "pieces", 34, 110, 108, 10, 7.2, 0],
  ["Chicken breast, grilled", "PROTEIN", 100, "g", 165, 74, 256, 228, 31, 0],
  ["Tilapia, steamed", "PROTEIN", 100, "g", 128, 56, 380, 204, 26, 0],
  ["Bangus (milkfish), fried", "PROTEIN", 100, "g", 190, 90, 420, 230, 23, 0],
  ["Pork adobo", "PROTEIN", 1, "cup", 400, 1100, 450, 250, 30, 0],
  ["Chicken tinola", "SOUPS", 1, "bowl", 220, 780, 520, 210, 22, 300],
  ["Instant noodles", "PROCESSED", 1, "pack", 380, 1600, 180, 110, 8, 0],
  ["Hotdog", "PROCESSED", 1, "piece", 150, 500, 80, 60, 5, 0],
  ["Corned beef, canned", "PROCESSED", 0.5, "cup", 210, 860, 140, 110, 23, 0],
  ["Longganisa", "PROCESSED", 2, "pieces", 260, 680, 200, 120, 12, 0],
  ["Cabbage, boiled", "VEGETABLES", 1, "cup", 34, 12, 196, 50, 1.9, 0],
  ["Sayote, boiled", "VEGETABLES", 1, "cup", 38, 2, 277, 46, 1, 0],
  ["Ampalaya, sautéed", "VEGETABLES", 1, "cup", 40, 90, 200, 40, 1.4, 0],
  ["Saba banana, boiled", "FRUIT", 1, "piece", 110, 1, 360, 25, 1.2, 0],
  ["Apple", "FRUIT", 1, "medium", 95, 2, 195, 20, 0.5, 0],
  ["Pineapple", "FRUIT", 1, "cup", 82, 2, 180, 13, 0.9, 0],
  ["Water", "BEVERAGES", 250, "mL", 0, 0, 0, 0, 0, 250],
  ["Milk, whole", "BEVERAGES", 1, "cup", 150, 105, 320, 250, 8, 240],
  ["Coffee, black", "BEVERAGES", 1, "cup", 2, 5, 116, 7, 0.3, 240],
  ["Cola soft drink", "BEVERAGES", 1, "can", 140, 45, 10, 40, 0, 330],
  ["Calamansi juice", "BEVERAGES", 1, "glass", 60, 5, 100, 10, 0.4, 250],
];

export const SAMPLE_FOODS: NewFood[] = ROWS.map(
  ([name, category, servingSize, servingUnit, energyKcal, sodiumMg, potassiumMg, phosphorusMg, proteinG, fluidMl]) => ({
    name,
    category,
    servingSize,
    servingUnit,
    energyKcal,
    sodiumMg,
    potassiumMg,
    phosphorusMg,
    proteinG,
    fluidMl,
    source: SOURCE,
  }),
);

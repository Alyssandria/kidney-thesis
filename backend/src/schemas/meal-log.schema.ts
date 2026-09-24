import z from "zod";
import type { CondimentId, MEAL_TYPES } from "./meal.schema.js";
import type { PatientDetailsType } from "./patient.schema.js";
import type {
  MealAnalysisResponse,
  NUTRIENT_LEVELS,
  PROTEIN_LEVELS,
} from "./prompt-analysis.schema.js";

export const MealIdParamsSchema = z.strictObject({
  id: z.uuid(),
});

export type MealIdParams = z.infer<typeof MealIdParamsSchema>;

export type MealLogDetail = {
  id: string;
  createdAt: string;
  meal: {
    description: string;
    mealType: (typeof MEAL_TYPES)[number] | null;
    isSoup: boolean;
    consumedSoup: boolean | null;
    condiments: CondimentId[];
  };
  patientDetails: PatientDetailsType;
  analysis: MealAnalysisResponse;
};

export const MealListQuerySchema = z
  .strictObject({
    from: z.iso.datetime({ offset: true }).optional(),
    to: z.iso.datetime({ offset: true }).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .refine((query) => !query.from || !query.to || new Date(query.from) < new Date(query.to), {
    error: '"from" must be earlier than "to"',
    path: ["to"],
  });

export type MealListQuery = z.infer<typeof MealListQuerySchema>;

type NutrientLevel = (typeof NUTRIENT_LEVELS)[number];

export type MealLogListItem = {
  id: string;
  createdAt: string;
  description: string;
  mealType: (typeof MEAL_TYPES)[number] | null;
  isSoup: boolean;
  consumedSoup: boolean | null;
  condiments: CondimentId[];
  summary: string;
  nutrientLevels: {
    sodium: NutrientLevel;
    potassium: NutrientLevel;
    phosphorus: NutrientLevel;
    protein: (typeof PROTEIN_LEVELS)[number];
  };
};

export type MealLogListResponse = {
  items: MealLogListItem[];
  hasMore: boolean;
};

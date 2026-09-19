import z from "zod";

export const MealTypeSchema = z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']);

export const MealSchema = z.strictObject({
  description: z.string().min(3, "Meal Description is Required"),
  mealType: MealTypeSchema.optional(),
  isSoup: z.boolean(),
  consumedSoup: z.boolean().optional(),
  ingredients: z.array(z.string()),
  ckdStage: z
  .number()
  .int()
  .min(1)
  .max(5, "CKD Stage is not valid"),
  isDialysis: z.boolean(),
})

export type MealFormValues = z.infer<typeof MealSchema>;
export type MealType = z.infer<typeof MealTypeSchema>

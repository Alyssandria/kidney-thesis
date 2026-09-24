import z from "zod";

export const SaveMealResponseSchema = z.object({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
});

export type SaveMealResponse = z.infer<typeof SaveMealResponseSchema>;

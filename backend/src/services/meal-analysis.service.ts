import z from "zod";
import { ENV } from "../lib/config.js";
import { AI } from "../lib/gemini.js";
import { getMealAnalysisPrompts } from "../prompts/mealAnalysis.prompt.js";
import { MealType } from "../schemas/meal.schema.js";
import { PatientDetailsType } from "../schemas/patient.schema.js";
import { MealAnalysisResponseSchema } from "../schemas/prompt-analysis.schema.js";

export const GenerateMealAnalysis = async ({
  meal,
  patientDetails,
}: {
  meal: MealType;
  patientDetails: PatientDetailsType;
}) => {

  const { systemInstruction, userPrompt } = getMealAnalysisPrompts({
    meal,
    patientDetails,
  });
  const interaction = await AI.interactions.create({
    model: ENV.AI_MODEL,
    system_instruction: systemInstruction,
    input: userPrompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: z.toJSONSchema(MealAnalysisResponseSchema),
    },
  });

  return MealAnalysisResponseSchema.parse(JSON.parse(interaction.output_text ?? ''));
};
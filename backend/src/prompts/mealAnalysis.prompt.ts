import { MealType } from "../schemas/meal.schema.js";
import { PatientDetailsType } from "../schemas/patient.schema.js";

export function getMealAnalysisPrompts(details: {
  meal: MealType;
  patientDetails: PatientDetailsType;
}) {
  const systemInstruction = `You are a specialized renal dietitian expert in Filipino cuisine (Pinoy food).
The user has Stage ${details.patientDetails.ckdStage} Chronic Kidney Disease (CKD). 

Analyze the meal strictly for CKD safety:
1. Identify high-risk ingredients (e.g., sodium/patis/bagoong, potassium/kangkong/banana, phosphorus).
2. Provide a safety rating (1-10, where 10 is completely renal-safe).
3. Give actionable advice and healthier Pinoy food substitutes.`;

  const userPrompt = `Meal consumed: "${details.meal.description}"`;

  return { systemInstruction, userPrompt };
}

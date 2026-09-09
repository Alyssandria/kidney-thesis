import { Request, Response } from "express";
import { AI } from "../lib/gemini.js";
import { ENV } from "../lib/config.js";
import { getMealAnalysisPrompts } from "../prompts/mealAnalysis.prompt.js";
import { MealType } from "../schemas/meal.schema.js";
import { PatientDetailsType } from "../schemas/patient.schema.js";
import { GenerateMealAnalysis } from "../services/meal-analysis.service.js";

export const getResults = async (
  req: Request<
    unknown,
    unknown,
    {
      meal: MealType;
      patientDetails: PatientDetailsType;
    }
  >,
  res: Response,
) => {
  const { meal, patientDetails } = req.body;

  try {
    const result = await GenerateMealAnalysis({ meal, patientDetails });
    return res.send(result);
  } catch (error: unknown) {
    return res.status(500).send({
      message: "Something went wrong",
      error,
    });
  }
};
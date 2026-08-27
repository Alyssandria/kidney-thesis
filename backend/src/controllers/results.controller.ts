import { Request, Response } from "express";
import { AI } from "../lib/gemini.js";
import { ENV } from "../lib/config.js";
import { getMealAnalysisPrompts } from "../prompts/mealAnalysis.prompt.js";

export const getResults = async (req: Request, res: Response) => {
    const { prompt } = req.body;
    console.log(prompt);
    const {systemInstruction, userPrompt} = getMealAnalysisPrompts(prompt);
    const interaction = await AI.interactions.create({
        model: ENV.AI_MODEL,
        system_instruction: systemInstruction,
        input: userPrompt
    });

    res.status(200).json(interaction);
}
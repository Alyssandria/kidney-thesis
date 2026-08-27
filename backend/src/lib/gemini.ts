import { GoogleGenAI } from "@google/genai";
import { ENV } from "./config.js";


export const AI = new GoogleGenAI({
    apiKey: ENV.AI_API_KEY,
});
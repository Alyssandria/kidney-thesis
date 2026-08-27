import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    AI_API_KEY: process.env.AI_API_KEY || "",
    AI_MODEL: process.env.AI_MODEL || "gemini-3.7-flash",
    PORT: Number(process.env.PORT) || 3001,
}
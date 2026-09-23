import { GoogleGenAI } from "@google/genai";
import z from "zod";
import { ENV } from "./config.js";
import { AppError } from "./errors.js";

const client = new GoogleGenAI({ apiKey: ENV.AI_API_KEY });

/**
 * @throws AppError("AI_UNAVAILABLE") if the request fails.
 * @throws AppError("AI_INVALID_RESPONSE") if the output doesn't match `schema`.
 */
export async function generateStructured<T>({
  systemInstruction,
  input,
  schema,
}: {
  systemInstruction: string;
  input: string;
  schema: z.ZodType<T>;
}): Promise<{ data: T; model: string }> {
  let outputText: string | undefined;

  try {
    const interaction = await client.interactions.create({
      model: ENV.AI_MODEL,
      system_instruction: systemInstruction,
      input,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: z.toJSONSchema(schema),
      },
    });
    outputText = interaction.output_text;
  } catch (cause) {
    throw new AppError("AI_UNAVAILABLE", { cause });
  }

  if (!outputText) {
    throw new AppError("AI_INVALID_RESPONSE", {
      cause: new Error("AI returned an empty response"),
    });
  }

  let json: unknown;
  try {
    json = JSON.parse(outputText);
  } catch (cause) {
    throw new AppError("AI_INVALID_RESPONSE", { cause });
  }

  const result = schema.safeParse(json);
  if (!result.success) {
    throw new AppError("AI_INVALID_RESPONSE", { cause: result.error });
  }

  return { data: result.data, model: ENV.AI_MODEL };
}

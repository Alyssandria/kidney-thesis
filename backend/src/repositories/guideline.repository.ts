import { db } from "../db/client.js";
import { nutrientGuidelines, type NutrientGuideline } from "../db/schema/index.js";

export async function findAllGuidelines(): Promise<NutrientGuideline[]> {
  return db.select().from(nutrientGuidelines);
}

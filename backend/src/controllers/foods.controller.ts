import type { Request, Response } from "express";
import { FoodListQuerySchema, type FoodListResponse } from "../schemas/food.schema.js";
import { listFoods } from "../services/food.service.js";

export const getFoods = async (req: Request, res: Response<FoodListResponse>) => {
  // Already validated by middleware; parsing again applies coercion and defaults,
  // since Express 5 doesn't let the middleware replace req.query.
  const query = FoodListQuerySchema.parse(req.query);
  res.json(await listFoods(query));
};

import { Router } from "express";
import { sql } from "drizzle-orm";
import { db } from "../db/client.js";
import { AppError } from "../lib/errors.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    await db.execute(sql`select 1`);
  } catch (cause) {
    throw new AppError("DATABASE_UNAVAILABLE", { cause });
  }
  res.json({ status: "ok", database: "connected" });
});

export default router;

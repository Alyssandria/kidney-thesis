import type { Request } from "express";
import { DEV_USER } from "../db/dev-user.js";

export function getCurrentUserId(_req: Request): string {
  return DEV_USER.id;
}

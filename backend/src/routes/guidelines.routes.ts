import { Router } from "express";
import { getGuidelines } from "../controllers/guidelines.controller.js";

const router = Router();

router.get("/", getGuidelines);

export default router;

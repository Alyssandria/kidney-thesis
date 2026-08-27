import { Router } from "express";
import { getResults } from "../controllers/results.controller.js";

const router = Router();

router.post("/", getResults);

export default router;
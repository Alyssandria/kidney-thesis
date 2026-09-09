import { Router } from "express";
import resultRoutes from './results.routes.js'

const router = Router();

/** RESULTS ROUTES */
router.use(
  "/results",
  resultRoutes,
);

export default router;
import cors from "cors";
import express from "express";
import { ENV } from "./lib/config.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import appRouter from "./routes/index.routes.js";

const app = express();
app.use(cors({ origin: ENV.CORS_ORIGIN }));
app.use(express.json({ limit: "100kb" }));

app.use("/api", appRouter);

app.use(errorHandler);

app.listen(ENV.PORT, () => {
  console.log(`backend listening on http://localhost:${ENV.PORT}`);
});

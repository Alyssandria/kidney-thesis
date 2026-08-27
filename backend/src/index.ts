import "dotenv/config";
import cors from "cors";
import express from "express";
import resultsRoutes from "./routes/results.routes.js";
const PORT = Number(process.env.PORT) || 3001;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/results", resultsRoutes);

app.listen(PORT, () => {
  console.log(`backend listening on http://localhost:${PORT}`);
});
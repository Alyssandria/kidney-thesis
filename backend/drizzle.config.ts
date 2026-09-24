import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Migrations need a session-mode connection; the app can use transaction mode.
const url = process.env.MIGRATION_DATABASE_URL || process.env.DATABASE_URL;
if (!url) {
  throw new Error("Set MIGRATION_DATABASE_URL or DATABASE_URL in backend/.env");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});

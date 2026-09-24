import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ENV } from "../lib/config.js";

// Transaction-mode poolers don't support prepared statements.
export const queryClient = postgres(ENV.DATABASE_URL, { prepare: false });

export const db = drizzle({ client: queryClient });

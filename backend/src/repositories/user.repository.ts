import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { users } from "../db/schema/index.js";

export async function findUserTimezone(userId: string): Promise<string | undefined> {
  const [row] = await db
    .select({ timezone: users.timezone })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return row?.timezone;
}

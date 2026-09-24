import { db, queryClient } from "./client.js";
import { DEV_USER } from "./dev-user.js";
import { users } from "./schema/index.js";

async function seed() {
  const inserted = await db
    .insert(users)
    .values(DEV_USER)
    .onConflictDoNothing({ target: users.id })
    .returning({ id: users.id });

  console.log(
    inserted.length > 0
      ? `Created test user ${DEV_USER.email} (${DEV_USER.id})`
      : `Test user ${DEV_USER.email} already exists`,
  );
}

try {
  await seed();
} finally {
  await queryClient.end();
}

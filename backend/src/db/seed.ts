import { db, queryClient } from "./client.js";
import { DEV_USER } from "./dev-user.js";
import { SAMPLE_FOODS } from "./sample-foods.js";
import { SAMPLE_GUIDELINES } from "./sample-guidelines.js";
import { foods, nutrientGuidelines, users } from "./schema/index.js";

async function seedDevUser() {
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

async function seedFoods() {
  const inserted = await db
    .insert(foods)
    .values(SAMPLE_FOODS)
    .onConflictDoNothing({ target: foods.name })
    .returning({ id: foods.id });

  console.log(
    `Added ${inserted.length} sample foods (${SAMPLE_FOODS.length - inserted.length} already existed)`,
  );
}

async function seedGuidelines() {
  const inserted = await db
    .insert(nutrientGuidelines)
    .values(SAMPLE_GUIDELINES)
    .onConflictDoNothing({ target: nutrientGuidelines.nutrient })
    .returning({ nutrient: nutrientGuidelines.nutrient });

  console.log(
    `Added ${inserted.length} nutrient guidelines (${SAMPLE_GUIDELINES.length - inserted.length} already existed)`,
  );
}

try {
  await seedDevUser();
  await seedFoods();
  await seedGuidelines();
} finally {
  await queryClient.end();
}

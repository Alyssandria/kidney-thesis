CREATE TYPE "public"."meal_entry_method" AS ENUM('SEARCH', 'DESCRIBE');--> statement-breakpoint
CREATE TYPE "public"."meal_item_source" AS ENUM('DATABASE', 'AI_ESTIMATE');--> statement-breakpoint
CREATE TABLE "meals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"log_date" date NOT NULL,
	"meal_type" "meal_type" NOT NULL,
	"entry_method" "meal_entry_method" NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "meals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meal_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meal_id" uuid NOT NULL,
	"food_id" uuid,
	"source" "meal_item_source" NOT NULL,
	"food_name" text NOT NULL,
	"serving_size" numeric(8, 2) NOT NULL,
	"serving_unit" text NOT NULL,
	"servings" numeric(6, 2) NOT NULL,
	"energy_kcal" numeric(8, 1) NOT NULL,
	"sodium_mg" numeric(8, 1) NOT NULL,
	"potassium_mg" numeric(8, 1) NOT NULL,
	"phosphorus_mg" numeric(8, 1) NOT NULL,
	"protein_g" numeric(6, 1) NOT NULL,
	"fluid_ml" numeric(8, 1) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meal_items_database_has_food" CHECK ("meal_items"."source" <> 'DATABASE' OR "meal_items"."food_id" IS NOT NULL),
	CONSTRAINT "meal_items_servings_positive" CHECK ("meal_items"."servings" > 0),
	CONSTRAINT "meal_items_serving_size_positive" CHECK ("meal_items"."serving_size" > 0),
	CONSTRAINT "meal_items_nutrients_non_negative" CHECK ("meal_items"."energy_kcal" >= 0 AND "meal_items"."sodium_mg" >= 0 AND "meal_items"."potassium_mg" >= 0 AND "meal_items"."phosphorus_mg" >= 0 AND "meal_items"."protein_g" >= 0 AND "meal_items"."fluid_ml" >= 0)
);
--> statement-breakpoint
ALTER TABLE "meal_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "meals" ADD CONSTRAINT "meals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_items" ADD CONSTRAINT "meal_items_meal_id_meals_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_items" ADD CONSTRAINT "meal_items_food_id_foods_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."foods"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "meals_user_log_date_idx" ON "meals" USING btree ("user_id","log_date");--> statement-breakpoint
CREATE INDEX "meal_items_meal_idx" ON "meal_items" USING btree ("meal_id");--> statement-breakpoint
CREATE INDEX "meal_items_food_idx" ON "meal_items" USING btree ("food_id");
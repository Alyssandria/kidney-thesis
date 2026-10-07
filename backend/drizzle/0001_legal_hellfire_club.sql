CREATE TYPE "public"."food_category" AS ENUM('GRAINS', 'PROTEIN', 'VEGETABLES', 'FRUIT', 'SOUPS', 'PROCESSED', 'BEVERAGES', 'MIXED_DISHES');--> statement-breakpoint
CREATE TABLE "foods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" "food_category" NOT NULL,
	"serving_size" numeric(8, 2) NOT NULL,
	"serving_unit" text NOT NULL,
	"energy_kcal" numeric(8, 1) NOT NULL,
	"sodium_mg" numeric(8, 1) NOT NULL,
	"potassium_mg" numeric(8, 1) NOT NULL,
	"phosphorus_mg" numeric(8, 1) NOT NULL,
	"protein_g" numeric(6, 1) NOT NULL,
	"fluid_ml" numeric(8, 1) DEFAULT 0 NOT NULL,
	"source" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "foods_name_unique" UNIQUE("name"),
	CONSTRAINT "foods_serving_size_positive" CHECK ("foods"."serving_size" > 0),
	CONSTRAINT "foods_nutrients_non_negative" CHECK ("foods"."energy_kcal" >= 0 AND "foods"."sodium_mg" >= 0 AND "foods"."potassium_mg" >= 0 AND "foods"."phosphorus_mg" >= 0 AND "foods"."protein_g" >= 0 AND "foods"."fluid_ml" >= 0)
);
--> statement-breakpoint
ALTER TABLE "foods" ENABLE ROW LEVEL SECURITY;
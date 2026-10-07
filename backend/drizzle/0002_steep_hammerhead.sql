CREATE TYPE "public"."guideline_nutrient" AS ENUM('SODIUM', 'POTASSIUM', 'PHOSPHORUS', 'PROTEIN', 'ENERGY', 'FLUID');--> statement-breakpoint
CREATE TABLE "nutrient_guidelines" (
	"nutrient" "guideline_nutrient" PRIMARY KEY NOT NULL,
	"daily_value" numeric(8, 1) NOT NULL,
	"source" text NOT NULL,
	"effective_date" date NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "nutrient_guidelines_daily_value_positive" CHECK ("nutrient_guidelines"."daily_value" > 0)
);
--> statement-breakpoint
ALTER TABLE "nutrient_guidelines" ENABLE ROW LEVEL SECURITY;
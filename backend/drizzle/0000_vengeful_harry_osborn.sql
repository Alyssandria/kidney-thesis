CREATE TYPE "public"."meal_type" AS ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');--> statement-breakpoint
CREATE TYPE "public"."nutrient_level" AS ENUM('LOW', 'MODERATE', 'HIGH', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."protein_level" AS ENUM('OPTIMAL', 'TOO_LOW', 'TOO_HIGH');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"ckd_stage" smallint NOT NULL,
	"is_dialysis" boolean DEFAULT false NOT NULL,
	"timezone" text DEFAULT 'Asia/Manila' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_ckd_stage_range" CHECK ("users"."ckd_stage" BETWEEN 1 AND 5)
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meal_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text NOT NULL,
	"meal_type" "meal_type",
	"is_soup" boolean NOT NULL,
	"consumed_soup" boolean,
	"condiments" text[] DEFAULT '{}'::text[] NOT NULL,
	"ckd_stage" smallint NOT NULL,
	"is_dialysis" boolean NOT NULL,
	"sodium_level" "nutrient_level" NOT NULL,
	"potassium_level" "nutrient_level" NOT NULL,
	"phosphorus_level" "nutrient_level" NOT NULL,
	"protein_level" "protein_level" NOT NULL,
	"analysis" jsonb NOT NULL,
	"model" text NOT NULL,
	"prompt_version" text NOT NULL,
	CONSTRAINT "meal_logs_ckd_stage_range" CHECK ("meal_logs"."ckd_stage" BETWEEN 1 AND 5)
);
--> statement-breakpoint
ALTER TABLE "meal_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "meal_logs" ADD CONSTRAINT "meal_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "meal_logs_user_created_idx" ON "meal_logs" USING btree ("user_id","created_at");
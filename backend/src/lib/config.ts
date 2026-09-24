import "dotenv/config";
import z from "zod";

// `KEY=` in .env yields ""; treat it as unset so defaults apply.
const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const EnvSchema = z.object({
  PORT: z.preprocess(emptyToUndefined, z.coerce.number().int().positive().default(3001)),
  CORS_ORIGIN: z.preprocess(emptyToUndefined, z.string().default("http://localhost:3000")),

  AI_API_KEY: z.string().min(1, "AI_API_KEY is required"),
  AI_MODEL: z.preprocess(emptyToUndefined, z.string().default("gemini-3.7-flash")),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine((url) => /^postgres(ql)?:\/\//.test(url), {
      error: "DATABASE_URL must start with postgres:// or postgresql://",
    }),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    `Invalid environment variables in backend/.env:\n${z.prettifyError(parsed.error)}`,
  );
  process.exit(1);
}

export const ENV = parsed.data;

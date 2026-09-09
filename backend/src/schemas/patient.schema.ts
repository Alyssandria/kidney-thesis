import z from "zod";
import { ERROR_MESSAGES } from "../lib/errors.js";

export const PatientSchema = z.strictObject({
  ckdStage: z
    .number()
    .int()
    .min(1)
    .max(5, ERROR_MESSAGES.VALIDATION.CKD_STAGE_INVALID),
  isDialysis: z.boolean().default(false),
});

export type PatientDetailsType = z.infer<typeof PatientSchema>;
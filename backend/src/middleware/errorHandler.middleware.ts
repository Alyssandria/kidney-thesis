import type { NextFunction, Request, Response } from "express";
import { AppError, ERROR_MESSAGES, type ApiErrorBody } from "../lib/errors.js";

/** express.json() throws this when the body isn't valid JSON. */
function isMalformedJsonError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    error.type === "entity.parse.failed"
  );
}

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response<ApiErrorBody>,
  // Express identifies error handlers by arity; keep all four parameters.
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    if (error.status >= 500) {
      console.error(`[${error.code}]`, error.cause ?? error);
    }
    return res.status(error.status).json({
      error: { code: error.code, message: error.message },
    });
  }

  if (isMalformedJsonError(error)) {
    return res.status(400).json({
      error: { code: "MALFORMED_JSON", message: ERROR_MESSAGES.HTTP.MALFORMED_JSON },
    });
  }

  console.error("[UNHANDLED]", error);
  return res.status(500).json({
    error: { code: "INTERNAL", message: ERROR_MESSAGES.HTTP.INTERNAL_SERVER_ERROR },
  });
};

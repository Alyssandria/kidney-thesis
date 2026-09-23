import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, type ApiErrorBody } from "../lib/errors.js";
import type { validateRequestMiddlewareParams } from "../types/middleware.types.js";

export const validateRequestMiddleware = (validateParams: validateRequestMiddlewareParams) => {
    return (req: Request, res: Response<ApiErrorBody>, next: NextFunction) => {
        try {
            // Replace raw input with parsed output so transforms and defaults apply.
            if (validateParams.paramsSchema) {
                req.params = validateParams.paramsSchema.parse(req.params) as Request["params"];
            }

            // req.query is read-only in Express 5, so it is validated but not replaced.
            if (validateParams.querySchema) {
                validateParams.querySchema.parse(req.query);
            }

            if (validateParams.bodySchema) {
                req.body = validateParams.bodySchema.parse(req.body);
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: {
                        code: "VALIDATION_ERROR",
                        message: ERROR_MESSAGES.HTTP.BAD_REQUEST,
                        issues: error.issues,
                    },
                });
            }

            next(error);
        }
    };
};

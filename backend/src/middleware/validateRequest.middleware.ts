import { NextFunction, Request, Response } from "express";
import type { validateRequestMiddlewareParams } from "../types/middleware.types.js";
import { ZodError } from "zod";
import { ERROR_MESSAGES } from "../lib/errors.js";

export const validateRequestMiddleware = (validateParams: validateRequestMiddlewareParams) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (validateParams.paramsSchema) {
                validateParams.paramsSchema.parse(req.params);
            }

            if (validateParams.querySchema) {
                validateParams.querySchema.parse(req.query);
            }

            if (validateParams.bodySchema) {
                validateParams.bodySchema.parse(req.body);
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: ERROR_MESSAGES.HTTP.BAD_REQUEST,
                    errors: error.issues,
                });
            }

            next(error);
        }
    }
}
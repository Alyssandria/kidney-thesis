import z from "zod"

export type validateRequestMiddlewareParams = {
    bodySchema?: z.ZodType,
    paramsSchema?: z.ZodType,
    querySchema?: z.ZodType
}
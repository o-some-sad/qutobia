import { z } from "zod";



export const ApiErrorValidator = z.object({
    message: z.string(),
    meta: z.record(z.any()).optional()
})
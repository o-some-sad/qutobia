import { z } from "zod";



export const BookValidator = z.object({
    _id: z.string(),
    title: z.string(),
    author: z.string().array(),
    price: z.number().positive(),
    description: z.string(),
    stock: z.number().positive().int(),
    image: z.string(),
    deletedAt: z.date().or(z.null()).default(null)
})
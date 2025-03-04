import mongoose from "mongoose";
import { z } from "zod";

const ZodObjectId = z.instanceof(mongoose.Types.ObjectId).or(z.string())

export const CartItemValidator = z.object({
    book: ZodObjectId,
    quantity: z.number().positive().default(1)
})


export const CartValidator = z.object({
    user: ZodObjectId,
    books: CartItemValidator.array().default([])
})

//TODO: reuse book validator when it's done
export const CartPopulatedValidator = CartValidator.omit({ books: true }).extend({
    books: z.object({
        book: z.object({
            _id: ZodObjectId,
            title: z.string(),
            price: z.number()
        }),
        quantity: z.number()
    }).array().default([])
})
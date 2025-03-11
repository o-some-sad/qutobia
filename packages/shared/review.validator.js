import mongoose from "mongoose";
import { z } from "zod";
const ZodObjectId = z.instanceof(mongoose.Types.ObjectId).or(z.string());

export const reviewValidator = z.object({
  user: ZodObjectId,
  book: ZodObjectId,
  rating: z
    .number()
    .gte(1, { message: "rating can't be lower than 1" })
    .lte(5, { message: "rating can't be higher than 5" }),
  review: z
    .string()
    .min(5, { message: "review has to be at least 5 charaters long" })
    .max(500, { message: "review has to be 500 characters at max" }),
});

import { z } from "zod";

export const registerValidator = z.object({
    name: z.string()
    .min(2,{message: "Username must be at least 6 characters."}),
    email: z.string()
    .email("this is not a valid email format."),
    password: z.string()
})
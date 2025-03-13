import { z } from "zod";



export const PaymentCreateResponse = z.object({
    url: z.string()
})
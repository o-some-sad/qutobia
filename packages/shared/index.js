import { z } from 'zod'


export const main = z.object({
    name: z.string()
})
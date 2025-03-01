import { z } from 'zod'

export const main = z.object({
    name: z.string()
});

export const createUserValidation = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['admin', 'user']),
});
export const updateUserValidation = createUserValidation.partial();

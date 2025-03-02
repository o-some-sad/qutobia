import {z, ZodError} from 'zod';

export {ZodError};
export const main = z.object({
  name: z.string()
});

export const userValidator = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'user']),
});

export const userPasswordValidator = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmPassword,
  {
    message: 'New password and confirm password must match',
    path: ['confirmPassword'],
  }
);

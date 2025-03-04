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

export const orderValidator = z.object({
  user: z.string().min(1, "User ID is required"),
  books: z.array(
      z.object({
          book: z.string().min(1, "Book ID is required"),
          quantity: z.number().min(1, "Quantity must be at least 1"),
          price:z.number().min(0, "price must be a positive number"),
      })
  ).nonempty("At least one book is required"),
  totalPrice: z.number().min(0, "Total price must be a positive number"),
  status: z.enum(['pending', 'completed', 'canceled'])
});

export const updateOrderValidator = z.object({
  user: z.string().optional(),
  books: z.array(
      z.object({
          book: z.string().min(1, "Book ID is required"),
          quantity: z.number().min(0, "Quantity must be at least 0"),
          price: z.number().min(0, "Price must be a positive number")
      })
  ).optional(),
  totalPrice: z.number().min(0, "Total price must be a positive number").optional(),
  status: z.enum(["pending", "completed", "canceled"]).optional()
});

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('The email format is invalid.'),
  password: z
    .string()
    .min(8, 'The password must be at least 8 characters long.'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Minimum 2 characters')
    .max(80, 'Maximum 80 characters'),
  email: z.email('Invalid email'),
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .max(72, 'Maximum 72 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

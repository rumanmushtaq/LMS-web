import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(255),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 6 characters")
    .max(128),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
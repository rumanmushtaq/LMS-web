import { z } from "zod";

export const newPasswordSchema = z
  .object({


    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters")
      .max(128)
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    confirmPassword: z.string().trim().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Error will show under confirmPassword field
  });

export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;
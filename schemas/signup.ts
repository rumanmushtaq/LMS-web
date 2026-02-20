import { z } from "zod";

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name is required")
      .max(100, "Full name is too long"),

    email: z.string().trim().email("Please enter a valid email").max(255),

    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters")
      .max(128)
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    confirmPassword: z.string().trim().min(8, "Please confirm your password"),

    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms and Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Error will show under confirmPassword field
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

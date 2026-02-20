import { z } from "zod";

export const forgotSchema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(255)
});

export type ForgotFormValues = z.infer<typeof forgotSchema>;
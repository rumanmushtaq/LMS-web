"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";

/* -------------------- Schema -------------------- */
const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(20).optional(),
  subject: z.enum(["general", "technical", "billing", "other"]),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/* -------------------- Custom Hook -------------------- */
export const useContactForm = () => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "general",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await axiosInstance.post("/auth/contact", data);
      toast.success("Message sent successfully! We'll get back to you soon.");
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return {
    ...form,
    onSubmit,
  };
};

"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormValues, signupSchema } from "@/schemas/signup";
import authService from "@/services/auth";
import { useRouter } from "next/navigation";

const useSignup = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<"student" | "tutor">(
    "student",
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      terms: undefined,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Only send fields the backend expects (exclude terms & confirmPassword)
      const { terms, confirmPassword, ...signupPayload } = data;
      await authService.signupApi(signupPayload);

      // Store the email in sessionStorage so the check-email page can resend if needed
      sessionStorage.setItem("pending_verification_email", data.email);

      // Redirect to check-email page
      router.push("/check-email");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Sign up failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    selectedRole,
    setSelectedRole,
    loading,
    error,
  };
};

export default useSignup;

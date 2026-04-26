"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormValues, signupSchema } from "@/schemas/signup";
import authService from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

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
  const { login } = useAuthStore();

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Only send fields the backend expects (exclude terms & confirmPassword)
      const { terms, confirmPassword, ...signupPayload } = data;
      const res = await authService.signupApi(signupPayload);
      console.log("Signup response:", res);

      // Access tokens and user from the 'data' wrapper in the response
      const responseData = res?.data;

      // If tokens are returned (for Tutors), log them in and redirect to contract
      if (responseData?.tokens && responseData?.user) {
        console.log(
          "Tutor detected, logging in and redirecting to contract...",
        );
        login(
          responseData.user,
          responseData.tokens.accessToken,
          responseData.tokens.refreshToken,
        );
        router.push("/independent-contract");
        return;
      }
      console.log("No tokens in response, redirecting to check-email...");

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

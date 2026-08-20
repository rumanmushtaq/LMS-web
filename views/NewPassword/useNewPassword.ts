"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  NewPasswordFormValues,
  newPasswordSchema,
} from "@/schemas/new-password";
import authService from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";

const useNewPassword = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  // Token is passed as a query param: /new-password?token=<value>
  const token = searchParams.get("token") || "";

  const form = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  /** No token means the page was opened directly, not from the reset email. */
  const hasToken = token.trim().length > 0;

  const onSubmit = async (data: NewPasswordFormValues) => {
    // Without this the form posts an empty token and the API answers with a
    // generic "invalid or expired" — which reads as a broken reset link
    // rather than "you opened this page the wrong way".
    if (!hasToken) {
      setError(
        "This reset link is missing its token. Open the link from your email, or request a new one.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.resetPasswordApi({
        token,
        newPassword: data.password,
      });

      // The backend clears refreshTokenHash on reset, so every existing
      // session is already dead — sending them to login is correct.
      router.push("/login?reset=success");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Password reset failed. The link may have expired.";
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
    loading,
    error,
    token,
    hasToken,
  };
};

export default useNewPassword;

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

  const onSubmit = async (data: NewPasswordFormValues) => {
    setLoading(true);
    setError(null);

    try {
      await authService.resetPasswordApi({
        token,
        newPassword: data.password,
      });

      // Redirect to login with success message
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
  };
};

export default useNewPassword;

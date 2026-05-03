"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/schemas/login";
import authService from "@/services/auth";
import { useAuthStore } from "@/store/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { getTutorRedirectPath } from "@/utils/onboarding-redirect";

const useLogin = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const storeLogin = useAuthStore((state) => state.login);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const res = await authService.loginApi(data);

      // Backend returns { data: { user, tokens: { accessToken, refreshToken } } }
      const userData = res?.data?.user;
      const accessToken = res?.data?.tokens?.accessToken;
      const refreshToken = res?.data?.tokens?.refreshToken;

      if (!userData || !accessToken || !refreshToken) {
        throw new Error("Invalid response from server");
      }

      storeLogin(userData, accessToken, refreshToken);

      // Handle redirect based on user role and onboarding status
      let finalRedirect = redirectUrl;
      if (userData.role === "tutor") {
        finalRedirect = getTutorRedirectPath(userData);
      }

      // Redirect to home/dashboard or the previous page after successful login
      router.push(finalRedirect);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { form, onSubmit, showPassword, setShowPassword, loading, error };
};

export default useLogin;

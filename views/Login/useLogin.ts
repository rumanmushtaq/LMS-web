"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/schemas/login";
import authService from "@/services/auth";
import { useAuthStore } from "@/store/auth";
import { useRouter, useSearchParams } from "next/navigation";

const useLogin = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
 
    setError(null);

    try {
      const res = await authService.loginApi(data);

      // Backend returns { user, accessToken, refreshToken }
      storeLogin(res.data.user, res.data.tokens.accessToken, res.data.tokens.refreshToken);

      // A deep link the user was bounced off takes priority. Otherwise send
      // them to /dashboard, which routes to the right one for their role.
      router.push(redirectUrl === "/" ? "/dashboard" : redirectUrl);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } 
  };

  return { form, onSubmit, showPassword, setShowPassword, error };
};

export default useLogin;

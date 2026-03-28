"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/schemas/login";
import authService from "@/services/auth";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

const useLogin = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const storeLogin = useAuthStore((state) => state.login);
  const router = useRouter();

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

      // Backend returns { user, accessToken, refreshToken }
      storeLogin(res.user, res.accessToken, res.refreshToken);

      // Redirect to home/dashboard after successful login
      router.push("/");
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

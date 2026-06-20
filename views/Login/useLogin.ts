"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/schemas/login";
import authService from "@/services/auth";
import { useAuthStore } from "@/store/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { USER } from "@/constants/userRole";

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

      console.log("res", res);

      // Backend returns { user, accessToken, refreshToken }
      storeLogin(res.data.user, res.data.tokens.accessToken, res.data.tokens.refreshToken);

      const user = useAuthStore.getState().user;

      console.log("user", user);

      if(user?.role === USER.STUDENT){
        router.push("/instructors");
      } else {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } 
  };

  return { form, onSubmit, showPassword, setShowPassword, error };
};

export default useLogin;

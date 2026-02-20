"use client";
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginFormValues, loginSchema } from '@/schemas/login';

const useLogin = () => {
      const [showPassword, setShowPassword] = useState<boolean>(false);
    
      const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
          email: "",
          password: "",
          rememberMe: false,
        },
      });
    
      const onSubmit = async (data: LoginFormValues) => {
        console.log("Login submitted:", {
          email: data.email,
          rememberMe: data.rememberMe,
        });
    
        // 👉 Here you can call:
        // await signIn()
        // await fetch("/api/login")
        // or your auth service
      };
  return {form, onSubmit, showPassword, setShowPassword}
}

export default useLogin

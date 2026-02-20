"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordFormValues, newPasswordSchema } from "@/schemas/new-password";

const useNewPassword = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const form = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: NewPasswordFormValues) => {
    console.log("Login submitted:", {
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    // 👉 Here you can call:
    // await signIn()
    // await fetch("/api/login")
    // or your auth service
  };
  return { form, onSubmit, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword };
};

export default useNewPassword;



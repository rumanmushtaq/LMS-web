"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormValues, signupSchema } from "@/schemas/signup";

const useSignup = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    console.log("Login submitted:", {
      email: data.email,
      terms: data.terms,
    });

    // 👉 Here you can call:
    // await signIn()
    // await fetch("/api/login")
    // or your auth service
  };
  return { form, onSubmit, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword };
};

export default useSignup;

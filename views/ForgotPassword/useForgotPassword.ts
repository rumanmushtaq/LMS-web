import { ForgotFormValues, forgotSchema } from "@/schemas/forgot-password";
import React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";


const useForgotPassword = () => {
  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    console.log("Login submitted:", {
      email: data.email,
    });

    // 👉 Here you can call:
    // await signIn()
    // await fetch("/api/login")
    // or your auth service
  };
  return {form, onSubmit};
};

export default useForgotPassword;

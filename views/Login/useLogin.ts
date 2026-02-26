"use client";
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from '@/schemas/login';
import authService from "@/services/auth"

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
    
        try{
          const res = await authService.loginApi(data)
        }catch(error){

        }
      };
  return {form, onSubmit, showPassword, setShowPassword}
}

export default useLogin

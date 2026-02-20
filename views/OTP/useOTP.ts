"use client";
import React from 'react'
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OtpFormValues, otpSchema } from "@/schemas/otp";


const useOTP = () => {

    const [timeLeft, setTimeLeft] = useState(359);
      const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    
      const form = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
          otp: "",
        },
      });
    
      // Timer
      useEffect(() => {
        if (timeLeft <= 0) return;
    
        const timer = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
    
        return () => clearInterval(timer);
      }, [timeLeft]);
    
      const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
      };
    
      const handleChange = (
        value: string,
        index: number,
        currentOtp: string
      ) => {
        if (!/^\d?$/.test(value)) return;
    
        const otpArray = currentOtp.split("");
        otpArray[index] = value;
    
        const newOtp = otpArray.join("");
        form.setValue("otp", newOtp);
    
        if (value && index < 3) {
          inputsRef.current[index + 1]?.focus();
        }
      };
    
      const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
      ) => {
        const currentOtp = form.getValues("otp");
    
        if (e.key === "Backspace" && !currentOtp[index] && index > 0) {
          inputsRef.current[index - 1]?.focus();
        }
      };
    
      const onSubmit = (data: OtpFormValues) => {
        console.log("Final OTP:", data.otp);
      };
    
      const handleResend = () => {
        setTimeLeft(359);
        form.reset({ otp: "" });
        inputsRef.current[0]?.focus();
      };

      
  return {handleResend,onSubmit , handleKeyDown, form, handleChange, formatTime, inputsRef, timeLeft}
}

export default useOTP

"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OtpFormValues, otpSchema } from "@/schemas/otp";
import authService from "@/services/auth";
import { useRouter } from "next/navigation";

const useOTP = () => {
  const [timeLeft, setTimeLeft] = useState(359);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Countdown timer
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

  const handleChange = (value: string, index: number, currentOtp: string) => {
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
    index: number,
  ) => {
    const currentOtp = form.getValues("otp");

    if (e.key === "Backspace" && !currentOtp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: OtpFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // The OTP (token) comes from the verification email
      await authService.otpVerificationApi(data.otp);

      const otpFlow = sessionStorage.getItem("otp_flow");

      if (otpFlow === "forgot-password") {
        // After verifying reset token, redirect to new-password page passing the token
        router.push(`/new-password?token=${data.otp}`);
      } else {
        // Email verification completed – go to login
        router.push("/login");
      }

      sessionStorage.removeItem("otp_flow");
      sessionStorage.removeItem("pending_verification_email");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Invalid or expired token. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = sessionStorage.getItem("pending_verification_email");
    if (!email) return;

    setResendLoading(true);
    try {
      await authService.resendVerificationEmail(email);
      // Reset timer
      setTimeLeft(359);
      form.reset({ otp: "" });
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      console.error("Resend error:", err);
    } finally {
      setResendLoading(false);
    }
  };

  return {
    handleResend,
    onSubmit,
    handleKeyDown,
    form,
    handleChange,
    formatTime,
    inputsRef,
    timeLeft,
    loading,
    error,
    resendLoading,
  };
};

export default useOTP;

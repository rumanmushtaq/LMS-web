import { useState } from "react";
import { ForgotFormValues, forgotSchema } from "@/schemas/forgot-password";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import authService from "@/services/auth";
import { useRouter } from "next/navigation";

const useForgotPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authService.forgetPasswordApi(data);

      // Store email so OTP page can resend + mark flow as password-reset
      sessionStorage.setItem("pending_verification_email", data.email);
      sessionStorage.setItem("otp_flow", "forgot-password");

      setSuccess(true);
      // Redirect to OTP page where user enters the reset token
      router.push("/otp");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Failed to send reset email. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { form, onSubmit, loading, error, success };
};

export default useForgotPassword;

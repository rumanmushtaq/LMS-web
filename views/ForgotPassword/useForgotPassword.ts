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

      // Reset is a magic-link flow: the email carries a 64-character token
      // that the user never types. Sending them to /otp asked for a 4-digit
      // code that does not exist, so the flow could not be completed.
      sessionStorage.setItem("pending_reset_email", data.email);

      setSuccess(true);
      router.push("/check-email?mode=reset");
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

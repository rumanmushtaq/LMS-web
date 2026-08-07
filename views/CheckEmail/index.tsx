"use client";

import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import authService from "@/services/auth";

const CheckEmailPage = () => {
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const email =
    typeof window !== "undefined"
      ? sessionStorage.getItem("pending_verification_email")
      : null;

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setResendSuccess(false);
    try {
      await authService.resendVerificationEmail(email);
      setResendSuccess(true);
    } catch (err) {
      console.error("Resend error:", err);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">D</span>
          </div>
          <span className="text-xl font-bold text-foreground">
            Varona <span className="text-primary">Academy</span>
          </span>
        </div>
        <Link
          href="/"
          className="text-primary font-medium hover:underline text-sm"
        >
          Back to Home
        </Link>
      </div>

      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="w-10 h-10 text-primary" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground mb-3 text-center">
        Check Your Email
      </h1>
      <p className="text-muted-foreground text-sm mb-2 text-center">
        We've sent a verification link to
      </p>
      {email && (
        <p className="text-foreground font-semibold text-center mb-6">
          {email}
        </p>
      )}
      <p className="text-muted-foreground text-sm mb-8 text-center">
        Click the link in your email to verify your account. If you don't see
        it, check your spam folder.
      </p>

      {/* Resend */}
      <div className="text-center space-y-4">
        <Button
          variant="outline"
          className="w-full h-12 rounded-full font-medium"
          onClick={handleResend}
          disabled={resending || !email}
        >
          {resending ? "Resending..." : "Resend Verification Email"}
        </Button>

        {resendSuccess && (
          <p className="text-sm text-green-600 font-medium">
            ✓ Verification email resent successfully!
          </p>
        )}

        <Link href="/login">
          <Button className="w-full h-12 text-base font-semibold rounded-full gap-1 mt-3">
            Go to Login <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Sign Up link */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Wrong email?{" "}
        <Link
          href="/signup"
          className="text-primary font-medium hover:underline"
        >
          Sign up again
        </Link>
      </p>
    </div>
  );
};

export default CheckEmailPage;

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import authService from "@/services/auth";
import { useAuthStore } from "@/store/auth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const storeLogin = useAuthStore((state) => state.login);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await authService.otpVerificationApi(token);
        setStatus("success");
        setMessage(
          res?.message || "Your email has been verified successfully!",
        );

        // If tokens are returned (Tutor onboarding flow)
        if (res.tokens && res.user) {
          // Store tokens in auth store
          storeLogin(res.user, res.tokens.accessToken, res.tokens.refreshToken);

          // Use a small delay so user can see the success message
          setTimeout(() => {
            if (res.user.role === "tutor") {
              router.push("/onboarding/tax-forms");
            }
          }, 2000);
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ||
            "Verification failed. The link may be expired or invalid.",
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Verifying your email…
            </h2>
            <p className="mt-2 text-gray-500">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-7 w-7 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Email Verified!
            </h2>
            <p className="mt-2 text-gray-500">{message}</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 text-white font-medium hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-7 w-7 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Verification Failed
            </h2>
            <p className="mt-2 text-gray-500">{message}</p>
            <button
              onClick={() => router.push("/signup")}
              className="mt-6 w-full rounded-lg bg-gray-800 py-2.5 text-white font-medium hover:bg-gray-900 transition"
            >
              Back to Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

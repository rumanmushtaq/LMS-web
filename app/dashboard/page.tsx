"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";

/**
 * Unified /dashboard route.
 * - tutor → /instructor/dashboard
 * - student (or anything else) → /student/dashboard
 *
 * Backend emails link here (email.service.ts builds `${frontendUrl}/dashboard`),
 * so this path has to resolve for both roles.
 */
export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const hydrated = useAuthHydrated();

  useEffect(() => {
    // Deciding before the store has rehydrated sends signed-in users to /login.
    if (!hydrated) return;

    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    if (user?.role === "tutor") {
      router.replace("/instructor/dashboard");
    } else {
      router.replace("/student/dashboard");
    }
  }, [hydrated, user, isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}

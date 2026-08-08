"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";
import { Loader2 } from "lucide-react";

/**
 * Unified /profile route.
 * Reads the logged-in user's role and redirects to the correct profile page.
 * - tutor  → /instructor/profile
 * - student (or anything else) → /student/profile
 */
export default function ProfileRedirectPage() {
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
      router.replace("/instructor/profile");
    } else {
      router.replace("/student/profile");
    }
  }, [hydrated, user, isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}

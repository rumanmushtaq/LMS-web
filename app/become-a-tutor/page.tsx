import type { Metadata } from "next";
import { Suspense } from "react";
import BecomeTutorPage from "@/views/become-a-tutor/BecomeTutorPage";

export const metadata: Metadata = {
  title: "Become a Tutor | Varona Academy",
  description:
    "Join our global team of expert tutors and start teaching students worldwide. Set your own hours, hourly rate, and curriculum.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-muted-foreground font-semibold">Loading Page...</p>
          </div>
        </div>
      }
    >
      <BecomeTutorPage />
    </Suspense>
  );
}

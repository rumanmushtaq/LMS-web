import type { Metadata } from "next";
import { Suspense } from "react";
import InstructorsPage from "@/views/instructors/InstructorsPage";

export const metadata: Metadata = {
  title: "Instructor List | Dreams LMS",
  description:
    "Browse our expert instructors. Filter by category, level, price, and more to find the perfect teacher for your learning journey.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <InstructorsPage />
    </Suspense>
  );
}

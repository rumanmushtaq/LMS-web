import type { Metadata } from "next";
import { Suspense } from "react";
import InstructorDetailPage from "@/views/instructors/InstructorDetailPage";

export const metadata: Metadata = {
  title: "Instructor Detail | Varona Academy",
  description: "View the details and courses of the instructor.",
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <InstructorDetailPage instructorSlug={slug} />
    </Suspense>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import InstructorDetailPage from "@/views/instructors/InstructorDetailPage";

export const metadata: Metadata = {
  title: "Instructor Detail | Dreams LMS",
  description: "View the details and courses of the instructor.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <InstructorDetailPage instructorId={id} />
    </Suspense>
  );
}

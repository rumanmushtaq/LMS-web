import { Suspense } from "react";
import type { Metadata } from "next";
import InstructorMaterialsPage from "@/views/instructor/materials/InstructorMaterialsPage";
import InstructorLayout from "@/views/instructor/InstructorLayout";

export const metadata: Metadata = {
  title: "Materials & Notes | Varona Academy",
  description: "Manage your digital products, PDFs, and books available for students.",
};

export default function Page() {
  return (
    <InstructorLayout>
      {/* useSearchParams (the ?edit=<id> deep link) requires a Suspense
          boundary for static prerendering — the build fails without it. */}
      <Suspense>
        <InstructorMaterialsPage />
      </Suspense>
    </InstructorLayout>
  );
}

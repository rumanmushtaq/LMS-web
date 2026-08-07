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
      <InstructorMaterialsPage />
    </InstructorLayout>
  );
}

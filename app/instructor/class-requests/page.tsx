import type { Metadata } from "next";
import ClassRequestsPage from "@/views/instructor/ClassRequestsPage";
import InstructorLayout from "@/views/instructor/InstructorLayout";

export const metadata: Metadata = {
  title: "Class Requests | Varona Academy",
  description: "Review and respond to class session requests from your students.",
};

export default function Page() {
  return (
    <InstructorLayout>
      <ClassRequestsPage />
    </InstructorLayout>
  );
}

import type { Metadata } from "next";
import StudentsGridPage from "@/views/instructor/students/StudentsGridPage";

export const metadata: Metadata = {
  title: "Students | Varona Academy",
  description: "Manage your enrolled students.",
};

export default function Page() {
  return <StudentsGridPage />;
}

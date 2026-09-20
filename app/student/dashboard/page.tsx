import type { Metadata } from "next";
import StudentDashboardPage from "@/views/student/dashboard/StudentDashboardPage";
import StudentLayout from "@/views/student/StudentLayout";

export const metadata: Metadata = {
  title: "Dashboard | Varona Academy",
  description: "Your upcoming classes and learning at a glance.",
};

export default function Page() {
  return (
    <StudentLayout>
      <StudentDashboardPage />
    </StudentLayout>
  );
}

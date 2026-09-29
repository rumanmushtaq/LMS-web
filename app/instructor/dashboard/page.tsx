import type { Metadata } from "next";
import InstructorDashboardPage from "@/views/instructor/dashboard/InstructorDashboardPage";
import InstructorLayout from "@/views/instructor/InstructorLayout";

export const metadata: Metadata = {
  title: "Dashboard | Varona Academy",
  description: "Your classes, requests and earnings at a glance.",
};

export default function Page() {
  return (
    <InstructorLayout>
      <InstructorDashboardPage />
    </InstructorLayout>
  );
}

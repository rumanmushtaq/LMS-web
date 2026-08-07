import type { Metadata } from "next";
import StudentProfilePage from "@/views/student/profile/StudentProfilePage";

export const metadata: Metadata = {
  title: "My Profile | Varona Academy",
  description: "View and manage your student profile details.",
};

export default function Page() {
  return <StudentProfilePage />;
}

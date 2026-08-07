import type { Metadata } from "next";
import InstructorProfilePage from "@/views/instructor/profile/InstructorProfilePage";

export const metadata: Metadata = {
  title: "My Profile | Varona Academy",
  description: "View and manage your instructor profile.",
};

export default function Page() {
  return <InstructorProfilePage />;
}

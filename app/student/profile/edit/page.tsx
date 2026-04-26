import type { Metadata } from "next";
import EditProfilePage from "@/views/student/profile/EditProfilePage";

export const metadata: Metadata = {
  title: "Edit Profile | Dreams LMS",
  description: "Update your personal information and student profile details.",
};

export default function Page() {
  return <EditProfilePage />;
}

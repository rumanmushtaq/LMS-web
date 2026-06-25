import type { Metadata } from "next";
import EditProfilePage from "@/views/instructor/profile/EditProfilePage";

export const metadata: Metadata = {
  title: "Edit Profile | Varona Academy",
  description: "Update your instructor profile information.",
};

export default function Page() {
  return <EditProfilePage />;
}

import type { Metadata } from "next";
import StudentClasses from "@/views/student/classes";

export const metadata: Metadata = {
  title: "My Classes | Varona Academy",
  description:
    "View and manage your scheduled and requested class sessions with your instructors.",
};

export default function Page() {
  return <StudentClasses />;
}

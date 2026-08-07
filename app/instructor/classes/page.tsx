import type { Metadata } from "next";
import InstructorClasses from "@/views/instructor/classes";

export const metadata: Metadata = {
  title: "My Classes | Varona Academy",
  description: "Manage your classes and start live broadcasts.",
};

export default function Page() {
  return <InstructorClasses />;
}

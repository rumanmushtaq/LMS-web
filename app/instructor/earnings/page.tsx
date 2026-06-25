import type { Metadata } from "next";
import EarningsPage from "@/views/instructor/earnings/EarningsPage";
import InstructorLayout from "@/views/instructor/InstructorLayout";

export const metadata: Metadata = {
  title: "Earnings | Varona Academy",
  description: "View your instructor earnings and recent transactions.",
};

export default function Page() {
  return (
    <InstructorLayout>
      <EarningsPage />
    </InstructorLayout>
  );
}

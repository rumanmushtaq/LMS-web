import type { Metadata } from "next";
import PayoutPage from "@/views/instructor/payout/PayoutPage";
import InstructorLayout from "@/views/instructor/InstructorLayout";

export const metadata: Metadata = {
  title: "Teacher Account | Dreams LMS",
  description: "Manage your payout and bank account details.",
};

export default function Page() {
  return (
    <InstructorLayout>
      <PayoutPage />
    </InstructorLayout>
  );
}

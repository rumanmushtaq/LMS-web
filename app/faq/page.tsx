import type { Metadata } from "next";
import FAQSection from "@/components/organisms/Auth/landingPAge/FAQSection";

export const metadata: Metadata = {
  title: "FAQ | Varona Academy",
  description: "Answers to the questions students and tutors ask most often.",
};

export default function Page() {
  return <FAQSection />;
}

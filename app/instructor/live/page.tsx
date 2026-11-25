import type { Metadata } from "next";
import TutorStreamView from "@/views/live/TutorStreamView";

export const metadata: Metadata = {
  title: "Go Live | Varona Academy",
  description: "Stream live to every student and answer their questions.",
};

export default function Page() {
  return <TutorStreamView />;
}

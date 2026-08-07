import type { Metadata } from "next";
import TutorLiveClassView from "@/views/live/TutorLiveClassView";

export const metadata: Metadata = {
  title: "Go Live | Varona Academy",
  description: "Broadcast your live class and answer student questions.",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TutorLiveClassView classId={id} />;
}

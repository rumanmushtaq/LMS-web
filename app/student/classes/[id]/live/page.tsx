import type { Metadata } from "next";
import StudentLiveClassView from "@/views/live/StudentLiveClassView";

export const metadata: Metadata = {
  title: "Live Class | Varona Academy",
  description: "Watch your live class and ask questions in real time.",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentLiveClassView classId={id} />;
}

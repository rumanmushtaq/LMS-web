import type { Metadata } from "next";
import StudentStreamView from "@/views/live/StudentStreamView";

export const metadata: Metadata = {
  title: "Live Stream | Varona Academy",
  description: "Watch your teacher live and ask questions in real time.",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentStreamView streamId={id} />;
}

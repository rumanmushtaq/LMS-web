import type { Metadata } from "next";
import ClassRosterPage from "@/views/instructor/classes/ClassRosterPage";

export const metadata: Metadata = {
  title: "Class Roster | Varona Academy",
  description: "See who has joined your group class and who has left it.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClassRosterPage classId={id} />;
}

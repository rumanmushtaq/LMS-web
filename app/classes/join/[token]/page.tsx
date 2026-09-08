import type { Metadata } from "next";
import JoinGroupClassPage from "@/views/classes/JoinGroupClassPage";

export const metadata: Metadata = {
  title: "Join a Group Class | Varona Academy",
  description: "Reserve your seat in a live group class.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <JoinGroupClassPage token={token} />;
}

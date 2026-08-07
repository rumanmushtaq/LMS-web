import type { Metadata } from "next";
import ChatPage from "@/views/chat/ChatPage";

export const metadata: Metadata = {
  title: "Messages | Varona Academy",
  description: "Chat with your instructors and students on Varona Academy.",
};

export default function Page() {
  return <ChatPage />;
}

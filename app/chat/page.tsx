import type { Metadata } from "next";
import ChatPage from "@/views/chat/ChatPage";

export const metadata: Metadata = {
  title: "Messages | Dreams LMS",
  description: "Chat with your instructors and students on Dreams LMS.",
};

export default function Page() {
  return <ChatPage />;
}

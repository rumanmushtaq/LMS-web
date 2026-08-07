import NotificationsPage from "@/views/notifications/NotificationsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications | Varona Academy",
  description: "View your account notifications and alerts.",
};

export default function Page() {
  return <NotificationsPage />;
}

import NotificationsPage from "@/views/notifications/NotificationsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications | Dreams LMS",
  description: "View your account notifications and alerts.",
};

export default function Page() {
  return <NotificationsPage />;
}

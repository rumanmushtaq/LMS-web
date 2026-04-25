import type { Metadata } from "next";
import MyCertificatesPage from "@/views/student/certificates/MyCertificatesPage";

export const metadata: Metadata = {
  title: "My Certificates | Dreams LMS",
  description: "View and download your earned certificates.",
};

export default function Page() {
  return <MyCertificatesPage />;
}

"use client";

import { useState, useEffect } from "react";
import { Loader2, Eye, Download, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import certificatesService, { Certificate } from "@/services/certificates";
import StudentLayout from "../StudentLayout";

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    certificatesService
      .getMyCertificates()
      .then(setCertificates)
      .catch((err) => setError("Failed to load certificates."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-white to-blue-50 dark:from-rose-950/20 dark:via-background dark:to-blue-950/20 border-b border-border/50">
        <div className="container mx-auto px-6 py-10 text-center relative">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            My Certificates
          </h1>
          <nav className="flex items-center justify-center gap-2 text-[14px] text-muted-foreground">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#FF4667]" />
            <span className="text-foreground font-medium">My Certificates</span>
          </nav>
        </div>
      </section>

      <StudentLayout>
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-foreground">
            My Certificates
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[300px] bg-card rounded-2xl border border-border/60 shadow-sm">
            <Loader2 className="h-10 w-10 animate-spin text-[#FF4667]" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[300px] bg-card rounded-2xl border border-border/60 shadow-sm text-destructive font-medium">
            {error}
          </div>
        ) : certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-card rounded-2xl border border-border/60 shadow-sm text-muted-foreground">
            <p>You haven't earned any certificates yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden auto-cols-auto overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-muted/50 border-b border-border/60">
                  <th className="px-6 py-4 font-bold text-foreground text-[15px] whitespace-nowrap">
                    ID
                  </th>
                  <th className="px-6 py-4 font-bold text-foreground text-[15px] whitespace-nowrap">
                    Course Name
                  </th>
                  <th className="px-6 py-4 font-bold text-foreground text-[15px] whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-6 py-4 font-bold text-foreground text-[15px] whitespace-nowrap">
                    Marks
                  </th>
                  <th className="px-6 py-4 font-bold text-foreground text-[15px] whitespace-nowrap">
                    Out of
                  </th>
                  <th className="px-6 py-4 font-bold text-foreground text-[15px] text-right whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert, index) => {
                  // Format '01', '02' based on index per screenshot
                  const displayId = String(index + 1).padStart(2, "0");
                  const dateObj = new Date(cert.date);
                  const dateStr = !isNaN(dateObj.getTime())
                    ? new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(dateObj)
                    : cert.date;

                  return (
                    <tr
                      key={cert._id || index}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-6 py-5 text-muted-foreground font-medium text-[15px]">
                        {displayId}
                      </td>
                      <td className="px-6 py-5 text-foreground font-semibold text-[15px]">
                        {cert.courseName}
                      </td>
                      <td className="px-6 py-5 text-muted-foreground text-[14px]">
                        {dateStr}
                      </td>
                      <td className="px-6 py-5 text-muted-foreground text-[14px]">
                        {cert.marks}
                      </td>
                      <td className="px-6 py-5 text-muted-foreground text-[14px]">
                        {cert.outOf}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            className="bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground h-9 w-9 rounded-full flex items-center justify-center transition-colors border border-border/50"
                            title="Preview Certificate"
                            onClick={() =>
                              window.open(cert.downloadUrl, "_blank")
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground h-9 w-9 rounded-full flex items-center justify-center transition-colors border border-border/50"
                            title="Download Certificate"
                            onClick={() =>
                              window.open(cert.downloadUrl, "_blank")
                            }
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </StudentLayout>
    </>
  );
}

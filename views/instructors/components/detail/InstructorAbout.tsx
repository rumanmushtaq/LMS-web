import React from "react";
import { SectionHeading } from "./SectionHeading";

export function InstructorAbout({ aboutMe }: { aboutMe: string }) {
  const hasAboutMe = aboutMe && aboutMe.trim() !== "";

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 24,
      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)",
      padding: "36px 40px",
      position: "relative",
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: 40, right: 40,
        height: "2px",
        background: "linear-gradient(90deg, #4f46e5 0%, transparent 100%)",
        opacity: 0.1,
      }} />
      <SectionHeading>Professional Summary</SectionHeading>
      {hasAboutMe ? (
        <p style={{
          color: "#475569", fontSize: 15, lineHeight: 1.8,
          letterSpacing: "0.01em", margin: 0,
          maxWidth: "900px" // Limits line length for better readability
        }}>
          {aboutMe}
        </p>
      ) : (
        <div style={{
          padding: "24px 16px", borderRadius: 16,
          background: "#f8fafc", border: "1px dashed #cbd5e1",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8
        }}>
          <p style={{ margin: 0, fontSize: 14, color: "#64748b", fontWeight: 500 }}>
            No professional summary provided yet.
          </p>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { BookOpen } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

interface EducationItem {
  degree: string;
  institution: string;
  period: string;
}

export function InstructorEducation({ education }: { education: EducationItem[] | string }) {
  const hasEducation = (Array.isArray(education) && education.length > 0) || (typeof education === 'string' && education.trim().length > 0);
  const isString = typeof education === 'string';

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 24,
      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)",
      padding: "36px 40px",
    }}>
      <SectionHeading>Education</SectionHeading>
      {hasEducation ? (
        <div style={{
          position: "relative",
          paddingLeft: 22,
          borderLeft: "1.5px solid #e2e8f0",
          marginLeft: 6,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}>
          {isString ? (
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: -29, top: 5,
                width: 12, height: 12, borderRadius: "50%",
                background: "#fff",
                border: "2px solid #6366f1",
                boxShadow: "0 0 0 3px rgba(99,102,241,0.12)",
                display: "inline-block",
              }} />
              <p style={{ fontSize: 14, color: "#475569", fontWeight: 500, margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {education as string}
              </p>
            </div>
          ) : (
            (education as EducationItem[]).map((edu, i) => (
              <div key={i} style={{ position: "relative" }}>
                {/* Node */}
                <span style={{
                  position: "absolute", left: -29, top: 5,
                  width: 12, height: 12, borderRadius: "50%",
                  background: "#fff",
                  border: "2px solid #6366f1",
                  boxShadow: "0 0 0 3px rgba(99,102,241,0.12)",
                  display: "inline-block",
                }} />
                <h4 style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.35, marginBottom: 3 }}>
                  {edu.degree}
                </h4>
                <p style={{ fontSize: 12, color: "#64748b", fontWeight: 500, margin: 0 }}>
                  {edu.institution}
                  <span style={{ color: "#e2e8f0", margin: "0 6px" }}>|</span>
                  {edu.period}
                </p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div style={{
          padding: "24px 16px", borderRadius: 16,
          background: "#f8fafc", border: "1px dashed #cbd5e1",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8
        }}>
          <BookOpen size={32} color="#94a3b8" />
          <p style={{ margin: 0, fontSize: 14, color: "#64748b", fontWeight: 500 }}>
            No education details provided yet.
          </p>
        </div>
      )}
    </div>
  );
}

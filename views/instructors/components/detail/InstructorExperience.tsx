import React from "react";
import { Briefcase } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

interface ExperienceItem {
  role?: string;
  title?: string;
  company: string;
  period: string;
}

export function InstructorExperience({ experience }: { experience: ExperienceItem[] | string }) {
  const hasExperience = (Array.isArray(experience) && experience.length > 0) || (typeof experience === 'string' && experience.trim().length > 0);
  const isString = typeof experience === 'string';

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 24,
      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)",
      padding: "36px 40px",
    }}>
      <SectionHeading>Experience</SectionHeading>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {hasExperience ? (
          isString ? (
            <div
              style={{
                display: "flex", gap: 14, alignItems: "center",
                padding: "16px", borderRadius: 14,
                background: "#f8fafc", border: "1px solid #e2e8f0",
                transition: "all 0.18s ease",
              }}
            >
              <div style={{
                width: 40, height: 40, flexShrink: 0, borderRadius: 11,
                background: "linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%)",
                border: "1px solid rgba(99,102,241,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Briefcase style={{ width: 15, height: 15, color: "#4f46e5" }} />
              </div>
              <p style={{ fontSize: 14, color: "#475569", fontWeight: 500, margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {experience as string}
              </p>
            </div>
          ) : (
            (experience as ExperienceItem[]).map((exp, i) => (
              <div
                key={i}
                style={{
                  display: "flex", gap: 14, alignItems: "center",
                  padding: "12px 14px", borderRadius: 14,
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                  transition: "all 0.18s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "#fff"; el.style.borderColor = "#c7d2fe";
                  el.style.boxShadow = "0 2px 12px rgba(99,102,241,0.06)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "#f8fafc"; el.style.borderColor = "#e2e8f0";
                  el.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: 40, height: 40, flexShrink: 0, borderRadius: 11,
                  background: "linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%)",
                  border: "1px solid rgba(99,102,241,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Briefcase style={{ width: 15, height: 15, color: "#4f46e5" }} />
                </div>
                <div>
                  <h4 style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: 2 }}>
                    {exp.role ?? exp.title}
                  </h4>
                  <p style={{ fontSize: 12, color: "#64748b", fontWeight: 500, margin: 0 }}>
                    {exp.company}
                    <span style={{ color: "#e2e8f0", margin: "0 6px" }}>|</span>
                    {exp.period}
                  </p>
                </div>
              </div>
            ))
          )
        ) : (
          <div style={{
            padding: "24px 16px", borderRadius: 16,
            background: "#f8fafc", border: "1px dashed #cbd5e1",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8
          }}>
            <Briefcase size={32} color="#94a3b8" />
            <p style={{ margin: 0, fontSize: 14, color: "#64748b", fontWeight: 500 }}>
              No experience details provided yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

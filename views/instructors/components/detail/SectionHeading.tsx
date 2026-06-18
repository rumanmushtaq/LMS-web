import React from "react";

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <div style={{
        width: 3, height: 14, borderRadius: 2, flexShrink: 0,
        background: "linear-gradient(180deg, #6366f1, #4f46e5)",
      }} />
      <h3 style={{
        fontSize: 11, fontWeight: 800, color: "#64748b",
        letterSpacing: "0.1em", textTransform: "uppercase",
        margin: 0, lineHeight: 1.2,
      }}>
        {children}
      </h3>
    </div>
  );
}

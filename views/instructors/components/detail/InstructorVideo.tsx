import React from "react";
import { SectionHeading } from "./SectionHeading";
import { PlayCircle } from "lucide-react";

interface InstructorVideoProps {
  videoUrl?: string | null;
}

export function InstructorVideo({ videoUrl }: InstructorVideoProps) {
  if (!videoUrl) return null; // Wait, I should show an empty state if no video is provided, to match the professional UX of the other sections. Or should I return null? If no video is uploaded, it's fine to skip the video section or show an empty state. Let's show an empty state just like the other components do!

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
        background: "linear-gradient(90deg, #ec4899 0%, transparent 100%)",
        opacity: 0.1,
      }} />
      <SectionHeading>Introduction Video</SectionHeading>
      
      {videoUrl ? (
        <div style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 Aspect Ratio
          borderRadius: 16,
          overflow: "hidden",
          background: "#0f172a",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
        }}>
          <video
            src={videoUrl}
            controls
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ) : (
        <div style={{
          padding: "32px 16px", borderRadius: 16,
          background: "#f8fafc", border: "1px dashed #cbd5e1",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12
        }}>
          <PlayCircle size={32} color="#94a3b8" />
          <p style={{ margin: 0, fontSize: 14, color: "#64748b", fontWeight: 500 }}>
            No introduction video provided.
          </p>
        </div>
      )}
    </div>
  );
}

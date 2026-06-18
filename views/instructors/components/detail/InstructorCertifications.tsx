import React from "react";
import { Award } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

export function InstructorCertifications({ certifications }: { certifications: string[] }) {
  const hasCertifications = certifications && certifications.length > 0;

  const formatCertName = (cert: string) => {
    if (cert.startsWith("http")) {
      try {
        const url = new URL(cert);
        const pathname = url.pathname;
        const filenameWithPrefix = pathname.substring(pathname.lastIndexOf('/') + 1);
        const decodedFilename = decodeURIComponent(filenameWithPrefix);
        
        // Remove timestamp prefix like "1780779746438-"
        const match = decodedFilename.match(/^\d+-+(.+)$/);
        if (match) {
          return match[1];
        }
        return decodedFilename;
      } catch (e) {
        return cert;
      }
    }
    return cert;
  };

  return (
    <div className="rounded-3xl" style={{
      background: "#ffffff",
      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)",
      padding: "32px",
      height: "100%",
    }}>
      <SectionHeading>Certifications</SectionHeading>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {hasCertifications ? (
          certifications.map((cert, i) => {
            const displayName = formatCertName(cert);
            
            return (
              <div 
                key={i} 
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "16px", borderRadius: 16,
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#4f46e5", border: "1px solid rgba(99, 102, 241, 0.1)"
                }}>
                  <Award size={24} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ 
                    margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a", 
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    lineHeight: 1.2
                  }}>
                    {displayName}
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                    Official Certificate
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{
            padding: "24px 16px", borderRadius: 16,
            background: "#f8fafc", border: "1px dashed #cbd5e1",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8
          }}>
            <Award size={32} color="#94a3b8" />
            <p style={{ margin: 0, fontSize: 14, color: "#64748b", fontWeight: 500 }}>
              No certifications uploaded yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

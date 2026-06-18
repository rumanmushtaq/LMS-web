import React from "react";
import { Mail, MapPin, Phone, ExternalLink, Contact, Globe, Languages } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

interface InstructorContactProps {
  email: string;
  phone: string;
  address: string;
  country?: string | null;
  nativeLanguage?: string | null;
  spokenLanguages?: string[];
}

const contactConfig = [
  { key: "email" as const,   Icon: Mail,   label: "Email",   color: "#6366f1", bg: "#f0f1ff", border: "#e0e7ff" },
  { key: "country" as const, Icon: Globe,  label: "Country", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  { key: "address" as const, Icon: MapPin, label: "Address", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0" },
  { key: "phone" as const,   Icon: Phone,  label: "Phone",   color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  { key: "languages" as const, Icon: Languages, label: "Languages", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
];

export function InstructorContact({ email, phone, address, country, nativeLanguage, spokenLanguages }: InstructorContactProps) {
  const allLanguages = Array.from(new Set([nativeLanguage, ...(spokenLanguages || [])].filter(Boolean))).join(", ");
  const values: Record<string, string> = { email, address, phone, country: country || "", languages: allLanguages };
  const contactItems = contactConfig.filter(c => values[c.key]);

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 24,
      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)",
      padding: "32px",
      height: "100%",
    }}>
      <SectionHeading>Contact Details</SectionHeading>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {contactItems.length > 0 ? (
          contactItems.map(({ key, Icon, label, color, bg, border }) => (
            <div key={key} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              padding: "12px 14px", borderRadius: 12,
              background: bg, border: `1px solid ${border}`,
            }}>
              <div style={{
                width: 36, height: 36, flexShrink: 0, borderRadius: 9,
                background: "#fff", border: `1px solid ${border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 2px 8px ${color}20`,
              }}>
                <Icon style={{ width: 15, height: 15, color }} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: color, letterSpacing: "0.04em", textTransform: "uppercase", margin: "0 0 2px" }}>{label}</p>
                <p style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.55, letterSpacing: "0.005em", margin: 0, fontWeight: 500 }}>
                  {values[key]}
                </p>
              </div>
              {key === "email" && (
                <ExternalLink style={{ width: 13, height: 13, color: "#9ca3af", marginLeft: "auto", flexShrink: 0, marginTop: 2 }} />
              )}
            </div>
          ))
        ) : (
          <div style={{
            padding: "24px 16px", borderRadius: 16,
            background: "#f8fafc", border: "1px dashed #cbd5e1",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8
          }}>
            <Contact size={32} color="#94a3b8" />
            <p style={{ margin: 0, fontSize: 14, color: "#64748b", fontWeight: 500 }}>
              No contact details provided yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

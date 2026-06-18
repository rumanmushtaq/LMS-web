import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen, Users, Heart, Star,
  Facebook, Instagram, Twitter, Youtube, Linkedin, BadgeCheck,
} from "lucide-react";

const CARD_STYLE: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 24,
  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)",
  overflow: "hidden",
  position: "relative",
};

const socialDefs = [
  { key: "facebook",  Icon: Facebook,  hover: "#1877f2", label: "Facebook"  },
  { key: "instagram", Icon: Instagram, hover: "#e1306c", label: "Instagram" },
  { key: "twitter",   Icon: Twitter,   hover: "#0f1419", label: "Twitter"   },
  { key: "youtube",   Icon: Youtube,   hover: "#ff0000", label: "YouTube"   },
  { key: "linkedin",  Icon: Linkedin,  hover: "#0a66c2", label: "LinkedIn"  },
];

interface InstructorProfileCardProps {
  name: string;
  title: string;
  rating: number;
  reviewCount: number;
  bio: string;
  lessonCount: number;
  studentCount: number;
  photoUrl: string;
  social: Record<string, string>;
  introVideoUrl?: string;
}

export function InstructorProfileCard({
  name, title, rating, reviewCount, bio, lessonCount, studentCount, photoUrl, social, introVideoUrl
}: InstructorProfileCardProps) {
  return (
    <div className="group" style={CARD_STYLE}>
      <div className="flex flex-col md:flex-row">

        {/* ─── Avatar ─── */}
        <div className="w-full md:w-[210px]" style={{ flexShrink: 0, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "relative", width: "100%", height: 240, background: "#f1f5f9" }}>
            <div style={{ position: "absolute", inset: 0, transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)" }}
              className="group-hover:scale-[1.04]">
              <Image src={photoUrl} alt={name} fill className="object-cover object-top" sizes="210px" priority />
            </div>

            {/* Wishlist */}
            <button aria-label="Favourite"
              style={{
                position: "absolute", top: 14, left: 14, zIndex: 1,
                width: 34, height: 34, borderRadius: "50%",
                background: "rgba(255,255,255,0.88)", backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.7)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "transform 0.18s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
              <Heart style={{ width: 13, height: 13, color: "#ef4444", fill: "#ef4444" }} />
            </button>

            {/* Verified chip */}
            <div style={{
              position: "absolute", bottom: 12, left: 12, zIndex: 1,
              display: "flex", alignItems: "center", gap: 4,
              padding: "4px 9px", borderRadius: 7,
              background: "rgba(255,255,255,0.94)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(16,185,129,0.18)",
              boxShadow: "0 1px 6px rgba(16,185,129,0.08)",
            }}>
              <BadgeCheck style={{ width: 11, height: 11, color: "#10b981" }} />
              <span style={{ fontSize: 8.5, fontWeight: 800, color: "#065f46", letterSpacing: "0.1em" }}>VERIFIED</span>
            </div>
          </div>
        </div>

        {/* ─── Details ─── */}
        <div style={{ flex: 1, padding: "26px 28px", display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Tag row */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 10 }}>
            {title && (
              <span style={{
                background: "#ede9fe", color: "#5b21b6", fontWeight: 700, fontSize: 10.5,
                padding: "3px 11px", borderRadius: 20, border: "1px solid #ddd6fe",
                letterSpacing: "0.02em",
              }}>
                {title}
              </span>
            )}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} style={{
                  width: 11, height: 11,
                  color: s <= Math.round(rating) ? "#f59e0b" : "#e5e7eb",
                  fill:  s <= Math.round(rating) ? "#f59e0b" : "#e5e7eb",
                }} />
              ))}
              <span style={{ fontSize: 12.5, fontWeight: 800, color: "#0f172a", marginLeft: 4 }}>{rating.toFixed(1)}</span>
              <span style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 500, marginLeft: 2 }}>({reviewCount})</span>
            </span>
          </div>

          {/* Name */}
          <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.15, margin: "0 0 10px" }}>
            {name}
          </h2>

          {/* Bio */}
          {bio ? (
            <p style={{ color: "#475569", fontSize: 13.5, lineHeight: 1.8, letterSpacing: "0.003em", margin: 0, flex: 1 }}>
              {bio}
            </p>
          ) : (
            <p style={{ color: "#94a3b8", fontSize: 13, fontStyle: "italic", margin: 0, flex: 1 }}>
              No professional summary provided yet.
            </p>
          )}

          {/* Footer row */}
          <div style={{
            marginTop: 20, paddingTop: 18,
            borderTop: "1px solid #f1f5f9",
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            {/* Stats */}
            <div style={{ display: "flex", gap: 20 }}>
              {[
                { Icon: BookOpen, count: `${lessonCount}+`, label: "LESSONS", bg: "#fefce8", border: "#fde68a", color: "#b45309" },
                { Icon: Users,    count: studentCount,      label: "STUDENTS", bg: "#f0fdf4", border: "#bbf7d0", color: "#065f46" },
              ].map(({ Icon, count, label, bg, border, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: bg, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon style={{ width: 13, height: 13, color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{count}</div>
                    <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.07em", marginTop: 2 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 5 }}>
              {socialDefs.map(({ key, Icon, hover, label }) => (
                <Link key={key} href={social[key] || "#"} aria-label={label}
                  style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: "#f8fafc", color: "#94a3b8",
                    border: "1px solid #e2e8f0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textDecoration: "none", transition: "all 0.18s ease",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = hover; el.style.color = "#fff";
                    el.style.borderColor = hover; el.style.transform = "translateY(-2px)";
                    el.style.boxShadow = `0 4px 10px ${hover}33`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "#f8fafc"; el.style.color = "#94a3b8";
                    el.style.borderColor = "#e2e8f0"; el.style.transform = "none";
                    el.style.boxShadow = "none";
                  }}>
                  <Icon style={{ width: 12, height: 12 }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

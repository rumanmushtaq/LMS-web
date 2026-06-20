"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Mail,
  MapPin,
  Phone,
  Heart,
  Star,
  Briefcase,
} from "lucide-react";

import { useInstructorDetail } from "./hooks/useInstructorDetail";
import {
  socialLinks,
  education,
  experience,
  certBadges,
} from "@/constants/instructorConstants";
import { useChatStore } from "@/store/chat";
import { useAuthStore } from "@/store/auth";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface InstructorDetailPageProps {
  instructorSlug: string;
}

export default function InstructorDetailPage({ instructorSlug }: InstructorDetailPageProps) {
  const router = useRouter();
  const { instructor: data, loading, error } = useInstructorDetail(instructorSlug);
  const { openChat } = useChatStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated());
  const [hydrated, setHydrated] = React.useState(false);

  // Wait for Zustand to rehydrate from localStorage before checking auth.
  // Without this, isAuthenticated() returns false on first render even for
  // logged-in users, causing a spurious redirect.
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading profile...</div>;
  }

  if (error || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">{error || "Not found"}</div>;
  }

  const {
    fullName,
    title,
    rating,
    reviewCount,
    aboutMe,
    lessonCount,
    studentCount,
    avatar,
    hourlyRate,
    createdAt
  } = data;

  console.log("data", data);

  const joinDate = new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Use backend data or fall back to the static arrays defined above if empty
  const activeEducation = data.education?.length ? data.education : education;
  const activeExperience = data.experience?.length ? data.experience : experience;
  const activeCertifications = data.certifications?.length ? data.certifications : certBadges.map(() => "Certification"); // simplification for now, will handle below properly
  const activeSocial = data.social || {};

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(160deg, #f8f9fc 0%, #f3f4f8 100%)",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* ─── Hero Banner ─── */}
      <section
        style={{
          background:
            "linear-gradient(110deg, #fff5f5 0%, #f4f7ff 50%, #eaf1ff 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="container mx-auto px-6 py-16 text-center">
          <h1
            className="mb-3"
            style={{
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#0d1117",
              lineHeight: 1.15,
            }}
          >
            Instructor Detail
          </h1>

          <nav
            className="flex items-center justify-center gap-2"
            style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, letterSpacing: "0.01em" }}
          >
            <Link
              href="/"
              className="transition-colors"
              style={{ color: "#6b7280" }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#0d1117")}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#6b7280")}
            >
              Home
            </Link>
            {/* arrow divider */}
            <svg width="5" height="8" viewBox="0 0 5 8" fill="none" className="opacity-40">
              <path d="M1 1l3 3-3 3" stroke="#f66962" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ color: "#374151" }}>Instructor Detail</span>
          </nav>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <div className="container mx-auto px-4 sm:px-6 py-10" style={{ maxWidth: 1180 }}>
        <div className="grid grid-cols-12 gap-5 lg:gap-7">

          {/* ═══ LEFT COLUMN ═══ */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">

            {/* ── Profile Card ── */}
            <div
              className="flex flex-col md:flex-row gap-7 rounded-2xl overflow-hidden"
              style={{
                background: "#fff",
                border: "1px solid #edeef2",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(0,0,0,0.07)",
              }}
            >
              {/* Avatar */}
              <div className="relative shrink-0" style={{ width: "100%", maxWidth: 220 }}>
                <div className="relative w-full md:w-[220px] h-[220px] overflow-hidden bg-gray-100 flex items-center justify-center">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={fullName}
                      fill
                      className="object-cover object-top"
                    />
                  ) : (
                    <span className="text-4xl text-gray-400">{fullName.charAt(0)}</span>
                  )}
                  {/* gradient overlay bottom */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-12 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.18), transparent)" }}
                  />
                  {/* Heart */}
                  <button
                    aria-label="Add to wishlist"
                    className="absolute top-3 left-3 flex items-center justify-center"
                    style={{
                      width: 34, height: 34,
                      background: "#fff",
                      borderRadius: "50%",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
                      border: "none",
                      cursor: "pointer",
                      transition: "transform 0.15s ease",
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
                  >
                    <Heart style={{ width: 14, height: 14, color: "#f66962", fill: "#f66962" }} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col min-w-0 px-2 py-5 pr-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-0.022em", color: "#0d1117", lineHeight: 1.2 }}>
                    {fullName}
                  </h2>
                  <button
                    onClick={() => openChat(data?._id, fullName)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f66962] text-white text-xs font-semibold rounded-lg hover:bg-[#e04d47] transition-colors"
                  >
                    <MessageCircle size={14} />
                    Chat
                  </button>
                </div>

                {/* Title + Rating row */}
                <div className="flex flex-wrap items-center gap-2 mb-4" style={{ fontSize: 13 }}>
                  {title && (
                    <span
                      style={{
                        background: "linear-gradient(90deg, #fff0f0, #ffe4e4)",
                        color: "#c23b2e",
                        fontWeight: 600,
                        fontSize: 12,
                        padding: "2px 10px",
                        borderRadius: 20,
                        border: "1px solid #fecaca",
                      }}
                    >
                      {title}
                    </span>
                  )}
                  {title && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#d1d5db", flexShrink: 0, display: "inline-block" }} />}
                  <span className="flex items-center gap-1">
                    <Star style={{ width: 13, height: 13, color: "#f59e0b", fill: "#f59e0b" }} />
                    <strong style={{ color: "#1f2937", fontWeight: 700, fontSize: 13 }}>{rating.toFixed(1)}</strong>
                    <span style={{ color: "#9ca3af", fontSize: 12.5 }}>({reviewCount} Reviews)</span>
                  </span>
                </div>

                <p style={{ color: "#4b5563", fontSize: 13.5, lineHeight: 1.78, letterSpacing: "0.004em", marginBottom: 0 }}>
                  {aboutMe || "This instructor has not added an 'About Me' section yet."}
                </p>

                {/* Stats + Socials */}
                <div
                  className="mt-auto flex flex-wrap items-center justify-between gap-3"
                  style={{ paddingTop: 18, borderTop: "1px solid #f3f4f6", marginTop: 20 }}
                >
                  {/* Stats */}
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5">
                      <BookOpen style={{ width: 14, height: 14, color: "#f66962" }} />
                      <strong style={{ fontSize: 13, fontWeight: 700, color: "#1f2937" }}>{lessonCount}</strong>
                      <span style={{ fontSize: 12.5, color: "#9ca3af" }}>Lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users style={{ width: 14, height: 14, color: "#f66962" }} />
                      <strong style={{ fontSize: 13, fontWeight: 700, color: "#1f2937" }}>{studentCount}</strong>
                      <span style={{ fontSize: 12.5, color: "#9ca3af" }}>Students</span>
                    </div>
                  </div>

                  {/* Social Icons */}
                  <div className="flex items-center gap-1.5">
                    {socialLinks.map(({ Icon, hover, label }, i) => {
                      const linkKey = label.toLowerCase() as keyof typeof activeSocial;
                      const url = activeSocial[linkKey];
                      if (!url) return null;
                      
                      return (
                        <Link
                          key={i}
                          href={url}
                          target="_blank"
                          aria-label={label}
                          className="flex items-center justify-center transition-all duration-200"
                          style={{
                            width: 30, height: 30,
                            borderRadius: 7,
                            background: "#f3f4f6",
                            color: "#6b7280",
                            border: "1px solid transparent",
                          }}
                          onMouseEnter={e => {
                            const el = e.currentTarget as HTMLAnchorElement;
                            el.style.background = hover;
                            el.style.color = "#fff";
                            el.style.transform = "translateY(-1px)";
                            el.style.boxShadow = `0 4px 12px ${hover}40`;
                          }}
                          onMouseLeave={e => {
                            const el = e.currentTarget as HTMLAnchorElement;
                            el.style.background = "#f3f4f6";
                            el.style.color = "#6b7280";
                            el.style.transform = "none";
                            el.style.boxShadow = "none";
                          }}
                        >
                          <Icon style={{ width: 12.5, height: 12.5 }} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── About Me ── */}
            <div
              className="rounded-2xl"
              style={{
                background: "#fff",
                border: "1px solid #edeef2",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(0,0,0,0.07)",
                padding: "26px 28px",
              }}
            >
              <SectionHeading>About Me</SectionHeading>
              <p style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.8, letterSpacing: "0.004em", marginBottom: 16 }}>
                {aboutMe || "This instructor has not added an 'About Me' section yet."}
              </p>
              <button
                className="transition-colors duration-150"
                style={{
                  fontSize: 13, fontWeight: 600,
                  color: "#f66962",
                  background: "none", border: "none", cursor: "pointer",
                  textDecoration: "underline", textUnderlineOffset: 4,
                  textDecorationThickness: 1.5,
                  letterSpacing: "0.01em",
                  padding: 0,
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#c23b2e")}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "#f66962")}
              >
                Read More
              </button>
            </div>

            {/* ── Education ── */}
            <div
              className="rounded-2xl"
              style={{
                background: "#fff",
                border: "1px solid #edeef2",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(0,0,0,0.07)",
                padding: "26px 28px",
              }}
            >
              <SectionHeading>Education</SectionHeading>
              <div style={{ position: "relative", paddingLeft: 20, borderLeft: "2px solid #e5e7eb", marginLeft: 6, display: "flex", flexDirection: "column", gap: 24 }}>
                {activeEducation?.map(({ degree, institution, period, meta }: any, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    {/* Timeline dot */}
                    <span
                      style={{
                        position: "absolute",
                        left: -29,
                        top: 4,
                        width: 13,
                        height: 13,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #00c97a, #00a86b)",
                        border: "2.5px solid #fff",
                        boxShadow: "0 0 0 3px rgba(0,201,122,0.15)",
                        display: "inline-block",
                      }}
                    />
                    <h4 style={{ fontSize: 13.5, fontWeight: 600, color: "#111827", letterSpacing: "-0.005em", lineHeight: 1.35, marginBottom: 3 }}>
                      {degree}
                    </h4>
                    <p style={{ fontSize: 12.5, color: "#9ca3af", letterSpacing: "0.005em" }}>
                      {meta || `${institution}  ·  ${period}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Experience ── */}
            <div
              className="rounded-2xl"
              style={{
                background: "#fff",
                border: "1px solid #edeef2",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(0,0,0,0.07)",
                padding: "26px 28px",
              }}
            >
              <SectionHeading>Experience</SectionHeading>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {activeExperience.map(({ title, role, company, period, meta }: any, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div
                      style={{
                        width: 44, height: 44, flexShrink: 0,
                        background: "linear-gradient(135deg, #f8f9fb, #f0f1f5)",
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                      }}
                    >
                      <Briefcase style={{ width: 16, height: 16, color: "#374151" }} />
                    </div>
                    <div style={{ paddingTop: 2 }}>
                      <h4 style={{ fontSize: 13.5, fontWeight: 600, color: "#111827", letterSpacing: "-0.005em", lineHeight: 1.35, marginBottom: 3 }}>
                        {title || role}
                      </h4>
                      <p style={{ fontSize: 12.5, color: "#9ca3af", letterSpacing: "0.005em" }}>
                        {meta || `${company}  ·  ${period}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ RIGHT COLUMN ═══ */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">

            {/* ── Certifications ── */}
            <div
              className="rounded-2xl"
              style={{
                background: "#fff",
                border: "1px solid #edeef2",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(0,0,0,0.07)",
                padding: "22px 24px",
              }}
            >
              <SectionHeading>Certifications</SectionHeading>
              <div className="flex flex-wrap gap-3">
                {certBadges.map(({ src, bg }, i) => (
                  <div
                    key={i}
                    style={{
                      width: 50, height: 50,
                      borderRadius: "50%",
                      background: bg,
                      border: "1.5px solid #e5e7eb",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      overflow: "hidden",
                      position: "relative",
                      transition: "transform 0.18s ease, box-shadow 0.18s ease",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = "translateY(-2px) scale(1.05)";
                      el.style.boxShadow = "0 6px 16px rgba(0,0,0,0.13)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = "none";
                      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                    }}
                  >
                    <Image src={src} alt="Certification badge" fill className="object-cover p-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Contact Details ── */}
            <div
              className="rounded-2xl"
              style={{
                background: "linear-gradient(160deg, #f9fafb 0%, #f4f5f9 100%)",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                padding: "22px 24px",
              }}
            >
              <SectionHeading>Contact & Additional Info</SectionHeading>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                
                <div className="flex gap-3.5 items-start">
                  <div
                    style={{
                      width: 40, height: 40, flexShrink: 0,
                      background: "linear-gradient(135deg, #1e2230, #2d3452)",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(30,34,48,0.22)",
                    }}
                  >
                    <Mail style={{ width: 15, height: 15, color: "#fff" }} />
                  </div>
                  <div style={{ paddingTop: 1 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", letterSpacing: "-0.005em", marginBottom: 2 }}>
                      Email
                    </h4>
                    <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.55, letterSpacing: "0.005em" }}>
                      {data.email}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div
                    style={{
                      width: 40, height: 40, flexShrink: 0,
                      background: "linear-gradient(135deg, #1e2230, #2d3452)",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(30,34,48,0.22)",
                    }}
                  >
                    <MapPin style={{ width: 15, height: 15, color: "#fff" }} />
                  </div>
                  <div style={{ paddingTop: 1 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", letterSpacing: "-0.005em", marginBottom: 2 }}>
                      Address
                    </h4>
                    <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.55, letterSpacing: "0.005em" }}>
                      {data.address || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div
                    style={{
                      width: 40, height: 40, flexShrink: 0,
                      background: "linear-gradient(135deg, #1e2230, #2d3452)",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(30,34,48,0.22)",
                    }}
                  >
                    <Phone style={{ width: 15, height: 15, color: "#fff" }} />
                  </div>
                  <div style={{ paddingTop: 1 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", letterSpacing: "-0.005em", marginBottom: 2 }}>
                      Phone
                    </h4>
                    <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.55, letterSpacing: "0.005em" }}>
                      {data.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div
                    style={{
                      width: 40, height: 40, flexShrink: 0,
                      background: "linear-gradient(135deg, #1e2230, #2d3452)",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(30,34,48,0.22)",
                    }}
                  >
                    <Star style={{ width: 15, height: 15, color: "#fff" }} />
                  </div>
                  <div style={{ paddingTop: 1 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", letterSpacing: "-0.005em", marginBottom: 2 }}>
                      Joined Date
                    </h4>
                    <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.55, letterSpacing: "0.005em" }}>
                      {joinDate}
                    </p>
                  </div>
                </div>

                {hourlyRate !== null && hourlyRate > 0 && (
                  <div className="flex gap-3.5 items-start">
                    <div
                      style={{
                        width: 40, height: 40, flexShrink: 0,
                        background: "linear-gradient(135deg, #1e2230, #2d3452)",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(30,34,48,0.22)",
                      }}
                    >
                      <span className="text-white font-bold">$</span>
                    </div>
                    <div style={{ paddingTop: 1 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", letterSpacing: "-0.005em", marginBottom: 2 }}>
                        Hourly Rate
                      </h4>
                      <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.55, letterSpacing: "0.005em" }}>
                        ${hourlyRate}/hour
                      </p>
                    </div>
                  </div>
                )}
                
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable Section Heading ─── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span
        style={{
          display: "inline-block",
          width: 3,
          height: 18,
          borderRadius: 2,
          background: "linear-gradient(180deg, #f66962, #e04d47)",
          flexShrink: 0,
        }}
      />
      <h3
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#111827",
          letterSpacing: "-0.015em",
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {children}
      </h3>
    </div>
  );
}

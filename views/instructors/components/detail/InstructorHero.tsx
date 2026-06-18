"use client";
import React from "react";
import Link from "next/link";
import { ChevronRight, GraduationCap } from "lucide-react";

export function InstructorHero() {
  return (
    <section style={{
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f5f3ff 100%)",
      borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
    }}>
      {/* Radial glow blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: -100, right: "10%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
          filter: "blur(30px)",
        }} />
        <div style={{
          position: "absolute", bottom: -80, left: "3%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          filter: "blur(20px)",
        }} />
        {/* Dot-grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }} />
      </div>

      <div className="container mx-auto px-6" style={{ position: "relative", padding: "52px 24px" }}>
        <div style={{ textAlign: "center" }}>
          {/* Eyebrow pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 40,
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(99,102,241,0.14)",
            boxShadow: "0 2px 12px rgba(99,102,241,0.07)",
            backdropFilter: "blur(8px)",
            marginBottom: 18,
          }}>
            <GraduationCap style={{ width: 13, height: 13, color: "#6366f1" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#4f46e5", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Instructor Workspace
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "#0f172a", lineHeight: 1.1, margin: "0 0 18px",
          }}>
            Instructor Detail
          </h1>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "7px 18px", borderRadius: 30,
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(226,232,240,0.7)",
            backdropFilter: "blur(6px)",
          }}>
            <Link href="/" style={{ fontSize: 12.5, color: "#64748b", fontWeight: 600, textDecoration: "none", transition: "color 0.18s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#4f46e5"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"; }}>
              Home
            </Link>
            <ChevronRight style={{ width: 11, height: 11, color: "#cbd5e1", flexShrink: 0 }} />
            <Link href="/instructors" style={{ fontSize: 12.5, color: "#64748b", fontWeight: 600, textDecoration: "none", transition: "color 0.18s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#4f46e5"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"; }}>
              Instructors
            </Link>
            <ChevronRight style={{ width: 11, height: 11, color: "#cbd5e1", flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: "#1e1b4b", fontWeight: 700 }}>Profile</span>
          </nav>
        </div>
      </div>
    </section>
  );
}

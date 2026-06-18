"use client";

import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import instructorsService, { InstructorProfile } from "@/services/instructors";

// ── Domain-scoped sub-components (Clean Architecture) ──────────────────────
import { InstructorHero }            from "./components/detail/InstructorHero";
import { InstructorProfileCard }     from "./components/detail/InstructorProfileCard";

import { InstructorAbout }           from "./components/detail/InstructorAbout";
import { InstructorEducation }       from "./components/detail/InstructorEducation";
import { InstructorExperience }      from "./components/detail/InstructorExperience";
import { InstructorAvailabilityCard} from "./components/detail/InstructorAvailabilityCard";
import { InstructorCertifications }  from "./components/detail/InstructorCertifications";
import { InstructorVideo }           from "./components/detail/InstructorVideo";
import { InstructorContact }         from "./components/detail/InstructorContact";
// ── Props ───────────────────────────────────────────────────────────────────
interface InstructorDetailPageProps {
  instructorId: string;
}

export default function InstructorDetailPage({ instructorId }: InstructorDetailPageProps) {
  const [instructor, setInstructor] = useState<InstructorProfile | null>(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    instructorsService.getInstructorById(instructorId)
      .then(setInstructor)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [instructorId]);

  // ── Derived display values (safe-access with robust defaults) ──────────────
  const name         = instructor?.fullName   ?? "Instructor";
  const title        = instructor?.title      ?? "Instructor";
  const bio          = instructor?.bio        ?? "";
  const aboutMe      = (instructor as any)?.aboutMe ?? bio;
  const rating       = instructor?.rating     ?? 0;
  const reviewCount  = instructor?.reviewCount  ?? 0;
  const lessonCount  = instructor?.lessonCount  ?? 0;
  const studentCount = instructor?.studentCount ?? 0;
  const photoUrl     = instructor?.photoUrl || instructor?.avatar || "/avatar_rolands.png";
  const email        = instructor?.email      ?? "";
  const phone        = (instructor as any)?.phone   ?? "";
  const address      = (instructor as any)?.address ?? "";
  const social       = (instructor as any)?.social  ?? {};
  const introVideoUrl = instructor?.introVideoUrl || instructor?.video || (instructor as any)?.kycData?.introVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4";

  // Array.isArray guards prevent the "map is not a function" crash
  // Pass education and experience as-is (could be string from KYC or array of objects)
  const education      = (instructor as any)?.education || [];
  const experience     = (instructor as any)?.experience || [];
  const certifications = Array.isArray((instructor as any)?.certifications) ? (instructor as any).certifications : [];
  const availability   = Array.isArray((instructor as any)?.availability)   ? (instructor as any).availability   : [];
  const timezone       = (instructor as any)?.timezone ?? null;
  const country        = (instructor as any)?.country ?? null;
  const nativeLanguage = (instructor as any)?.nativeLanguage ?? null;
  const spokenLanguages= Array.isArray((instructor as any)?.spokenLanguages) ? (instructor as any).spokenLanguages : [];
  const pricePerHour   = (instructor as any)?.pricePerHour ?? null;

  // ── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            border: "3px solid #e5e7eb", borderTopColor: "#4f46e5",
            animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
          }} />
          <p style={{ fontSize: 14, color: "#9ca3af", fontWeight: 500 }}>Loading instructor profile…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f7fc",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Hero Banner */}
      <InstructorHero />

      {/* Main Modular Dashboard Layout */}
      <div className="container mx-auto px-4 sm:px-6 py-12" style={{ maxWidth: 1200 }}>
        <div className="flex flex-col gap-8">

          {/* 1. Hero Profile Banner (Full Width) */}
          <InstructorProfileCard
            name={name}
            title={title}
            rating={rating}
            reviewCount={reviewCount}
            bio={bio}
            lessonCount={lessonCount}
            studentCount={studentCount}
            photoUrl={photoUrl}
            social={social}
            introVideoUrl={introVideoUrl}
          />

          {/* 2. Professional 2-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* MAIN CONTENT COLUMN (Left) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <InstructorAbout aboutMe={aboutMe} />
              <InstructorExperience experience={experience} />
              <InstructorEducation education={education} />
              <InstructorCertifications certifications={certifications} />
              <InstructorVideo videoUrl={introVideoUrl} />
            </div>

            {/* SIDEBAR COLUMN (Right) */}
            <div className="lg:col-span-4 flex flex-col gap-8 sticky top-8">
              <InstructorAvailabilityCard availability={availability} pricePerHour={pricePerHour} timezone={timezone} />
              <InstructorContact 
                email={email} 
                phone={phone} 
                address={address} 
                country={country} 
                nativeLanguage={nativeLanguage} 
                spokenLanguages={spokenLanguages} 
              />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

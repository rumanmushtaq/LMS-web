"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Plus,
  PenSquare,
  ChevronRight,
  Home,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import usersService, { StudentProfile } from "@/services/users";
import StudentLayout from "../StudentLayout";
import { cn } from "@/lib/utils";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    usersService
      .getProfile()
      .then((data) => setProfile(data))
      .catch((err) => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-[#FF4667]" />
        </div>
      </StudentLayout>
    );
  }

  if (error || !profile) {
    return (
      <StudentLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-destructive font-medium">
            {error || "Profile not found."}
          </p>
        </div>
      </StudentLayout>
    );
  }

  const { firstName, lastName, email, createdAt, kycData } = profile;
  const fullName = `${firstName} ${lastName}`;
  const userName = email.split("@")[0]; // Mock username since model doesn't explicitly store username separately yet

  // Calculations
  const dobStr = kycData?.dob
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(kycData.dob))
    : "-";
  let age = "-";
  if (kycData?.dob) {
    const bDate = new Date(kycData.dob);
    age = String(new Date().getFullYear() - bDate.getFullYear());
  }

  return (
    <>
      {/* Top breadcrumb hero outside layout if we want, or put everything in layout. The screenshot has a hero for "My Profile". */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-white to-blue-50 dark:from-rose-950/20 dark:via-background dark:to-blue-950/20 border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,70,103,0.08),_transparent_60%)]" />
        <div className="container mx-auto px-6 py-10 sm:py-14 text-center relative">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            My Profile
          </h1>
          <nav className="flex items-center justify-center gap-2 text-[14px] text-muted-foreground">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#FF4667]" />
            <span className="text-foreground font-medium">My Profile</span>
          </nav>
        </div>
      </section>

      <StudentLayout>
        {/* Banner with Profile Box */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 border border-border/60 mb-8 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-5 z-10 w-full md:w-auto">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden bg-background border-4 border-white shrink-0">
              {kycData?.avatar ? (
                <Image
                  src={kycData.avatar}
                  alt={fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500 font-bold text-3xl">
                  {fullName.charAt(0)}
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full h-5 w-5 border-2 border-white flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                {fullName}
                <Link href="/student/profile/edit">
                  <PenSquare className="h-4 w-4 text-white/70 hover:text-white cursor-pointer" />
                </Link>
              </h2>
              <p className="text-white/80 font-medium text-[15px] mt-1">
                Student
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 z-10 w-full md:w-auto mt-4 md:mt-0">
            <Link href="/instructors">
              <button className="px-5 py-2.5 rounded-full bg-white text-blue-900 text-sm font-bold shadow hover:bg-gray-100 transition whitespace-nowrap">
                Become an Instructor
              </button>
            </Link>
            <button className="px-5 py-2.5 rounded-full bg-[#FF4667] text-white text-sm font-bold shadow hover:bg-[#E63E5C] transition whitespace-nowrap">
              Instructor Dashboard
            </button>
          </div>

          {/* Abstract circles decoration inside banner */}
          <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-blue-400/20 blur-xl pointer-events-none" />
          <div className="absolute top-10 right-40 h-20 w-20 rounded-full bg-indigo-500/30 blur-lg pointer-events-none" />
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-border/50 pb-5 mb-6">
            <h3 className="text-xl font-bold text-foreground">My Profile</h3>
            <Link
              href="/student/profile/edit"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-muted/40 hover:bg-muted text-foreground transition"
            >
              <PenSquare className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            {/* Field block */}
            <div className="space-y-1.5">
              <p className="text-[14px] font-bold text-foreground">
                First Name
              </p>
              <p className="text-[14px] text-muted-foreground">
                {firstName || "-"}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[14px] font-bold text-foreground">Last Name</p>
              <p className="text-[14px] text-muted-foreground">
                {lastName || "-"}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[14px] font-bold text-foreground">
                Registration Date
              </p>
              <p className="text-[14px] text-muted-foreground">
                {createdAt
                  ? new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }).format(new Date(createdAt))
                  : "-"}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[14px] font-bold text-foreground">User Name</p>
              <p className="text-[14px] text-muted-foreground">{userName}</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[14px] font-bold text-foreground">
                Phone Number
              </p>
              <p className="text-[14px] text-muted-foreground">
                {kycData?.phone || "-"}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[14px] font-bold text-foreground">Email</p>
              <p className="text-[14px] text-muted-foreground">
                {email || "-"}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[14px] font-bold text-foreground">Gender</p>
              <p className="text-[14px] text-muted-foreground capitalize">
                {kycData?.gender || "-"}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[14px] font-bold text-foreground">DOB</p>
              <p className="text-[14px] text-muted-foreground">{dobStr}</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[14px] font-bold text-foreground">Age</p>
              <p className="text-[14px] text-muted-foreground">{age}</p>
            </div>

            {/* Full width Bio */}
            <div className="md:col-span-2 space-y-2 mt-2">
              <p className="text-[14px] font-bold text-foreground">Bio</p>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                {kycData?.bio || "No bio added yet."}
              </p>
            </div>
          </div>
        </div>
      </StudentLayout>
    </>
  );
}

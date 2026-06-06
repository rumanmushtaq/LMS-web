"use client";

import { Heart, Star, BookOpen, Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { InstructorProfile } from "@/services/instructors";
import { cn } from "@/lib/utils";

interface InstructorListCardProps {
  instructor: InstructorProfile;
}

function formatDuration(minutes: number): string {
  if (!minutes) return "0hr 0min";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}hr ${m}min`;
}

export default function InstructorListCard({
  instructor,
}: InstructorListCardProps) {
  const {
    _id,
    fullName,
    title,
    bio,
    avatar,
    rating,
    reviewCount,
    lessonCount,
    totalDurationMinutes,
    studentCount,
    specialties,
  } = instructor;

  return (
    <div className="group flex gap-5 rounded-2xl border border-border/60 bg-card p-4 sm:p-5 hover:shadow-lg hover:shadow-black/5 hover:border-border transition-all duration-300">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Link href={`/instructors/${_id}`}>
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-xl overflow-hidden bg-muted ring-2 ring-border/30 group-hover:ring-[var(--primary)]/30 transition-all">
            {avatar || instructor.photoUrl ? (
              <Image
                src={avatar || (instructor.photoUrl as string)}
                alt={fullName}
                fill
                className="object-cover"
                sizes="128px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 text-3xl font-bold text-[var(--primary)]">
                {fullName.charAt(0)}
              </div>
            )}
          </div>
        </Link>
        {/* Wishlist button */}
        <button
          aria-label="Add to wishlist"
          className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background border border-border shadow-sm hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all"
        >
          <Heart className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <Link
              href={`/instructors/${_id}`}
              className="text-[16px] font-bold text-foreground hover:text-[var(--primary)] transition-colors line-clamp-1"
            >
              {fullName}
            </Link>
            {title && (
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {title}
              </p>
            )}
          </div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-[13px] whitespace-nowrap">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">
              {rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">
              ({reviewCount.toLocaleString()} Reviews)
            </span>
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <p className="mt-2 text-[13px] text-foreground/70 leading-relaxed line-clamp-2">
            {bio}
          </p>
        )}

        {/* Stats & Tags row */}
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {/* Stats */}
          <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[var(--primary)]" />
              <span className="font-medium text-foreground">
                {lessonCount}+
              </span>{" "}
              Lesson
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              {formatDuration(totalDurationMinutes)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-green-500" />
              {studentCount.toLocaleString()} Students
            </span>
          </div>

          {/* Specialty tags */}
          {specialties.length > 0 && (
            <div className="flex flex-wrap gap-1.5 ml-auto">
              {specialties.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-border bg-muted/50 text-foreground/70 hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

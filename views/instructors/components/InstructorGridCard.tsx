"use client";

import { Heart, Star, BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { InstructorProfile } from "@/services/instructors";

interface InstructorGridCardProps {
  instructor: InstructorProfile;
}

function formatDuration(minutes: number): string {
  if (!minutes) return "0hr 0min";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}hr ${m}min`;
}

export default function InstructorGridCard({
  instructor,
}: InstructorGridCardProps) {
  const {
    _id,
    fullName,
    title,
    avatar,
    rating,
    reviewCount,
    lessonCount,
    totalDurationMinutes,
    photoUrl,
  } = instructor;

  return (
    <div className="group rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-xl hover:shadow-black/8 hover:border-border hover:-translate-y-1 transition-all duration-300">
      {/* Avatar section */}
      <div className="relative overflow-hidden bg-muted aspect-[4/3]">
        <Link href={`/instructors/${_id}`}>
          {avatar || photoUrl ? (
            <Image
              src={avatar || (photoUrl as string)}
              alt={fullName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)]/15 to-purple-600/15 text-5xl font-bold text-[var(--primary)]">
              {fullName.charAt(0)}
            </div>
          )}
        </Link>
        {/* Wishlist button */}
        <button
          aria-label="Add to wishlist"
          className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm border border-border/40 shadow-sm hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all"
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* Rating overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[12px] font-semibold shadow-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{rating.toFixed(1)}</span>
          {reviewCount > 0 && (
            <span className="text-muted-foreground font-normal">
              ({reviewCount})
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link
          href={`/instructors/${_id}`}
          className="text-[15px] font-bold text-foreground hover:text-[var(--primary)] transition-colors line-clamp-1 block"
        >
          {fullName}
        </Link>
        {title && (
          <p className="text-[13px] text-[var(--primary)] font-medium mt-0.5 line-clamp-1">
            {title}
          </p>
        )}

        {/* Stats */}
        <div className="mt-3 flex items-center gap-4 text-[12px] text-muted-foreground border-t border-border/50 pt-3">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span className="font-semibold text-foreground">
              {lessonCount}+
            </span>{" "}
            Lesson
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-blue-500" />
            {formatDuration(totalDurationMinutes)}
          </span>
        </div>
      </div>
    </div>
  );
}

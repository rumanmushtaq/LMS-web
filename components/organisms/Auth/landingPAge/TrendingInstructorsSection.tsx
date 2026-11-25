"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Star } from "lucide-react";
import instructorsService, { InstructorProfile } from "@/services/instructors";

/** The grid holds two rows of four on desktop. */
const MAX_TRENDING = 8;

const initials = (t: InstructorProfile) =>
  `${t.firstName?.[0] ?? ""}${t.lastName?.[0] ?? ""}`.toUpperCase() || "T";

/**
 * Home page "Trending Instructors": the tutors an admin starred in the admin
 * panel (Teachers → ⭐), most recently starred first. Hidden while no tutor is
 * trending, rather than showing placeholder people.
 */
export default function TrendingInstructorsSection() {
  const { data, isPending } = useQuery({
    queryKey: ["instructors", "trending"],
    queryFn: () =>
      instructorsService.getInstructors({ trending: true, limit: MAX_TRENDING }),
    staleTime: 5 * 60 * 1000,
  });

  const tutors = data?.data ?? [];
  if (!isPending && tutors.length === 0) return null;

  return (
    <section className="py-14 container mx-auto px-4 flex flex-col items-center">
      <div className="text-center space-y-4 mb-10 max-w-3xl">
        <p className="text-primary font-bold bg-primary/10 px-4 py-1 rounded-full inline-block">
          Trending Instructors
        </p>
        <h2 className="text-4xl lg:text-5xl font-black">
          Top Class & Professional Instructors
        </h2>
        <p className="text-muted-foreground">
          Empowering Change: Stories from Those Who Took the Leap
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        {isPending
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-card p-6 rounded-[40px] border border-border/50 flex flex-col items-center gap-6 animate-pulse"
              >
                <div className="w-40 h-40 rounded-full bg-muted" />
                <div className="h-5 w-32 rounded bg-muted" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
            ))
          : tutors.map((t) => {
              const photo = t.photoUrl || t.avatar;
              const subject = t.title || t.categories?.[0] || t.specialties?.[0];
              return (
                <Link
                  key={t._id}
                  href={`/instructors/${t.slug || t._id}`}
                  className="bg-card p-6 rounded-[40px] border border-border/50 text-center space-y-6 hover:shadow-xl transition-all group flex flex-col items-center"
                >
                  <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-background shadow-lg bg-primary/10">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={t.fullName}
                        fill
                        sizes="160px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-primary">
                        {initials(t)}
                      </span>
                    )}
                    <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center border-2 border-white">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black">{t.fullName}</h3>
                    {subject && (
                      <p className="text-sm text-muted-foreground font-medium">
                        {subject}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-center items-center gap-2 text-yellow-500">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= Math.round(t.rating || 0) ? "fill-current" : ""}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-foreground ml-1">
                      {t.reviewCount > 0
                        ? `${(t.rating || 0).toFixed(1)} (${t.reviewCount})`
                        : "New"}
                    </span>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { getLiveTeachers, LiveTeacher } from "@/services/teacherStreams";

export const LIVE_TEACHERS_KEY = ["teacher-streams", "live"] as const;

/**
 * Which teachers are live right now, keyed by tutor id. One shared query for
 * every card on a page, polled so badges appear and disappear on their own.
 */
export function useLiveTeachers() {
  const query = useQuery({
    queryKey: LIVE_TEACHERS_KEY,
    queryFn: getLiveTeachers,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  const byTutor = new Map<string, LiveTeacher>();
  for (const s of query.data ?? []) byTutor.set(s.tutorId, s);
  return byTutor;
}

/** The live stream of one teacher, or undefined. */
export function useTeacherLiveStream(tutorId: string | undefined) {
  const byTutor = useLiveTeachers();
  return tutorId ? byTutor.get(tutorId) : undefined;
}

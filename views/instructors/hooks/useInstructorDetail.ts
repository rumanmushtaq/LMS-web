"use client";

import { useState, useEffect, useCallback } from "react";
import instructorsService, {
  InstructorDetailData,
} from "@/services/instructors";

interface UseInstructorDetailReturn {
  instructor: InstructorDetailData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useInstructorDetail(id: string): UseInstructorDetailReturn {
  const [instructor, setInstructor] = useState<InstructorDetailData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstructor = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await instructorsService.getInstructorBySlugOrId(id);
      setInstructor(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load instructor.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInstructor();
  }, [fetchInstructor]);

  return { instructor, loading, error, refetch: fetchInstructor };
}

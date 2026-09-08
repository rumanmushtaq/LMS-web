"use client";

import { useEffect, useState } from "react";
import { getPlaybackToken } from "@/services/classes";

/**
 * For self-hosted streams: exchange the session for a short-lived,
 * class-scoped playback token and build the HLS URL. The token is a path
 * segment, so the player resolves every segment under it automatically.
 */
export function useSelfPlayback(classId: string, enabled: boolean) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || src) return;
    let cancelled = false;
    getPlaybackToken(classId)
      .then(({ token }) => {
        if (cancelled) return;
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        setSrc(`${API}/api/v1/live-hls/${classId}/${token}/index.m3u8`);
      })
      .catch(() => {
        /* the page keeps its waiting state; a refresh retries */
      });
    return () => {
      cancelled = true;
    };
  }, [classId, enabled, src]);

  return src;
}

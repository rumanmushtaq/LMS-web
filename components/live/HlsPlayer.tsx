"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * In-site player for self-hosted live streams (HLS).
 *
 * Safari plays HLS natively; everywhere else hls.js is loaded on demand.
 * The playlist 404s until ffmpeg writes the first segments, so the loader
 * keeps retrying quietly instead of giving up while the teacher connects.
 */
export default function HlsPlayer({ src, title }: { src: string; title?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState(false);
  // Browsers only allow autoplay when muted — start silent and let the
  // viewer enable sound with one tap, instead of sitting paused on black.
  const [muted, setMuted] = useState(true);
  // True until the first frames arrive — the teacher's first HLS segment can
  // trail "Go Live" by several seconds, and a black box reads as broken.
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setFailed(false);

    let cancelled = false;
    let hls: { destroy: () => void } | null = null;

    // Prefer hls.js wherever MSE exists: Chrome's canPlayType can claim
    // native HLS support it does not actually have, leaving a black player.
    // Native <video src> is only the fallback (iOS Safari), where it works.
    import("hls.js")
      .then(({ default: Hls }) => {
        if (cancelled) return;
        if (!Hls.isSupported()) {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            video.play().catch(() => {});
          } else {
            setFailed(true);
          }
          return;
        }
        const instance = new Hls({
          liveDurationInfinity: true,
          manifestLoadingMaxRetry: 30,
          manifestLoadingRetryDelay: 2000,
          levelLoadingMaxRetry: 10,
        });
        hls = instance;
        instance.loadSource(src);
        instance.attachMedia(video);
        instance.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
        instance.on(Hls.Events.ERROR, (_event, data) => {
          if (!data?.fatal) return;
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            // A manifest that never loaded (stream not started yet) is not
            // recovered by startLoad(); reload the source and keep waiting.
            if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR ||
                data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT) {
              setTimeout(() => { if (!cancelled) instance.loadSource(src); }, 3000);
            } else {
              instance.startLoad();
            }
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            instance.recoverMediaError();
          } else {
            setFailed(true);
          }
        });
      })
      .catch(() => setFailed(true));

    const onPlaying = () => setWaiting(false);
    const onWaiting = () => setWaiting(true);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("waiting", onWaiting);

    return () => {
      cancelled = true;
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", onWaiting);
      hls?.destroy();
    };
  }, [src]);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
      <video
        ref={videoRef}
        title={title}
        controls
        autoPlay
        muted={muted}
        playsInline
        className="w-full h-full object-contain"
      />
      {muted && !failed && (
        <button
          type="button"
          onClick={() => {
            const video = videoRef.current;
            if (video) {
              video.muted = false;
              video.play().catch(() => {});
            }
            setMuted(false);
          }}
          className="absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-semibold hover:bg-black/90"
        >
          🔊 Tap for sound
        </button>
      )}
      {waiting && !failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/70 text-sm pointer-events-none">
          <span className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          Connecting to the live video…
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm">
          This browser cannot play the live stream.
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/auth";

export type BroadcastState = "idle" | "preview" | "connecting" | "live" | "error";

/**
 * H.264 first: the server can then relay the video without transcoding
 * (near-zero CPU). VP9/VP8 still work — the relay transcodes them.
 */
const MIME_CANDIDATES = [
  "video/webm;codecs=h264,opus",
  "video/webm;codecs=h264",
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
];

export function pickRecorderMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  return MIME_CANDIDATES.find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
}

/**
 * Broadcast the laptop camera + mic to the class's live stream without OBS:
 * capture → MediaRecorder (1s webm chunks) → socket `/ingest` → server-side
 * ffmpeg → RTMP to the provisioned provider.
 *
 * States: idle → preview (camera on, not sending) → connecting → live.
 * `stop()` returns to preview; `stopAll()` also releases the camera.
 */
export function useBrowserBroadcast({
  classId,
  onLive,
  onStopped,
}: {
  classId: string;
  /** Fired once the relay confirms frames are flowing. */
  onLive?: () => void;
  /** Fired when the relay reports the broadcast finished. */
  onStopped?: () => void;
}) {
  const token = useAuthStore((s) => s.accessToken);
  const [state, setState] = useState<BroadcastState>("idle");
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<Socket | null>(null);
  // Latest callbacks, read from socket handlers without re-subscribing.
  const onLiveRef = useRef(onLive);
  const onStoppedRef = useRef(onStopped);
  useEffect(() => {
    onLiveRef.current = onLive;
    onStoppedRef.current = onStopped;
  }, [onLive, onStopped]);

  const stopRecorder = useCallback(() => {
    const rec = recorderRef.current;
    recorderRef.current = null;
    if (rec && rec.state !== "inactive") {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    }
  }, []);

  const releaseEverything = useCallback(() => {
    stopRecorder();
    socketRef.current?.disconnect();
    socketRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, [stopRecorder]);

  // Leaving the page must always turn the camera light off.
  useEffect(() => releaseEverything, [releaseEverything]);

  const startPreview = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setState("preview");
    } catch {
      setError(
        "Camera or microphone permission was denied. Allow access in the browser and try again.",
      );
      setState("error");
    }
  }, []);

  const goLive = useCallback(() => {
    const stream = streamRef.current;
    if (!stream || !token) return;
    setState("connecting");
    setError(null);

    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const mimeType = pickRecorderMime();
    const socket = io(`${SOCKET_URL}/ingest`, {
      auth: { token },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => socket.emit("startIngest", { classId, mimeType }));

    socket.on("ingestReady", () => {
      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
        videoBitsPerSecond: 2_500_000,
        audioBitsPerSecond: 128_000,
        // Chrome otherwise emits a keyframe only every 5-10s; HLS segments
        // can only start on keyframes, so students would wait that long for
        // a first picture. Unsupported browsers simply ignore the option.
        videoKeyFrameIntervalDuration: 2000,
      } as MediaRecorderOptions);
      recorderRef.current = recorder;
      recorder.ondataavailable = async (e) => {
        if (e.data.size > 0 && socket.connected) {
          socket.emit("ingestChunk", { classId, chunk: await e.data.arrayBuffer() });
        }
      };
      recorder.start(1000); // 1s chunks: small enough for the socket, smooth enough for RTMP
      setState("live");
      onLiveRef.current?.();
    });

    socket.on("ingestError", (payload: { message?: string }) => {
      stopRecorder();
      setError(payload?.message || "The broadcast failed. Try again.");
      setState("error");
    });

    socket.on("ingestEnded", () => {
      stopRecorder();
      setState("preview");
      onStoppedRef.current?.();
    });

    socket.on("connect_error", (err) => {
      setError(err?.message || "Could not reach the streaming server.");
      setState("error");
    });
  }, [classId, token, stopRecorder]);

  const stop = useCallback(() => {
    stopRecorder();
    socketRef.current?.emit("stopIngest", { classId });
    socketRef.current?.disconnect();
    socketRef.current = null;
    setState(streamRef.current ? "preview" : "idle");
  }, [classId, stopRecorder]);

  const stopAll = useCallback(() => {
    stop();
    releaseEverything();
    setState("idle");
  }, [stop, releaseEverything]);

  return { state, error, videoRef, startPreview, goLive, stop, stopAll };
}

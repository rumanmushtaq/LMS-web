"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Radio,
  AlertCircle,
  ArrowLeft,
  Play,
  Square,
  Camera,
  CameraOff,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { LiveStatus } from "@/services/classes";
import {
  endStream,
  getMyStream,
  goLiveStream,
  startStream,
  StreamBroadcastInfo,
} from "@/services/teacherStreams";
import { useAuthStore } from "@/store/auth";
import { useLiveClass } from "@/hooks/useLiveClass";
import { useBrowserBroadcast } from "@/hooks/useBrowserBroadcast";
import { LIVE_TEACHERS_KEY } from "@/hooks/useLiveTeachers";
import LiveQnAPanel from "@/components/live/LiveQnAPanel";

const MY_STREAM_KEY = ["teacher-streams", "me"] as const;

const errorMessage = (e: unknown, fallback: string) =>
  (e as { response?: { data?: { message?: string } } })?.response?.data?.message || fallback;

function CopyLine({ label, value }: { label: string; value: string | null }) {
  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Couldn't copy — copy it manually.");
    }
  };
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <code className="flex-1 truncate rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs font-mono">
          {value ?? "—"}
        </code>
        <button
          onClick={copy}
          disabled={!value}
          className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-40"
          aria-label={`Copy ${label}`}
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/** Before a stream exists: name it and open it. */
function StartStreamCard({ onStart, busy }: { onStart: (title: string) => void; busy: boolean }) {
  const { register, handleSubmit } = useForm<{ title: string }>({ defaultValues: { title: "" } });
  return (
    <form
      onSubmit={handleSubmit(({ title }) => onStart(title))}
      className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-6 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Radio className="w-5 h-5 text-red-500" />
        <h1 className="text-lg font-bold text-foreground">Go live</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Stream to every student on Varona. While you are live, your teacher card and
        profile show a <strong>Join live</strong> button, and students who have had a class
        with you get a notification.
      </p>
      <div>
        <label htmlFor="stream-title" className="text-xs font-semibold text-muted-foreground">
          What is this stream about? (optional)
        </label>
        <input
          id="stream-title"
          {...register("title", { maxLength: 120 })}
          maxLength={120}
          placeholder="e.g. Algebra Q&A — ask me anything"
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
        Set up my stream
      </button>
    </form>
  );
}

/**
 * A teacher's own stream: set it up, preview the camera, go live, end it.
 * Mirrors the live-class broadcaster page, minus the schedule.
 */
export default function TutorStreamView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isAuthed = useAuthStore((s) => !!s.accessToken);

  useEffect(() => {
    if (!isAuthed) router.replace("/login?redirect=/instructor/live");
  }, [isAuthed, router]);

  const { data: stream, isLoading, error } = useQuery({
    queryKey: MY_STREAM_KEY,
    queryFn: getMyStream,
    enabled: isAuthed,
    staleTime: 60_000,
    retry: false,
  });

  const setStream = (next: StreamBroadcastInfo | null) =>
    queryClient.setQueryData(MY_STREAM_KEY, next);

  const start = useMutation({
    mutationFn: (title: string) => startStream(title),
    onSuccess: (data) => setStream(data),
    onError: (e) => toast.error(errorMessage(e, "Couldn't set up the stream.")),
  });

  const goLive = useMutation({
    mutationFn: (streamId: string) => goLiveStream(streamId),
    onSuccess: () => {
      if (stream) setStream({ ...stream, status: LiveStatus.LIVE });
      queryClient.invalidateQueries({ queryKey: LIVE_TEACHERS_KEY });
      toast.success("You're live — students can join from your card and profile.");
    },
    onError: (e) => toast.error(errorMessage(e, "Streaming, but couldn't mark you live. Try again.")),
  });

  const end = useMutation({
    mutationFn: (streamId: string) => endStream(streamId),
    onSuccess: () => {
      setStream(null);
      queryClient.invalidateQueries({ queryKey: LIVE_TEACHERS_KEY });
      toast.success("Stream ended.");
    },
    onError: (e) => toast.error(errorMessage(e, "Couldn't end the stream.")),
  });

  const streamId = stream?.streamId ?? "";
  // Destructured: the React compiler treats the whole hook result as a ref
  // once `videoRef` from it is attached, and then flags every read of state.
  const {
    state: broadcastState,
    error: broadcastError,
    videoRef,
    startPreview,
    goLive: startBroadcast,
    stopAll,
  } = useBrowserBroadcast({
    classId: streamId,
    // Frames confirmed flowing: only now do the cards light up.
    onLive: () => {
      if (streamId) goLive.mutate(streamId);
    },
  });

  const { messages, isConnected, typingUser, sendMessage, typing, stopTyping, currentUserId } =
    useLiveClass({ conversationId: stream?.conversationId ?? null });

  const finish = () => {
    if (!streamId) return;
    stopAll();
    end.mutate(streamId);
  };

  if (!isAuthed || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-6">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-foreground font-semibold max-w-md">
          {errorMessage(error, "Could not load your stream.")}
        </p>
        <button
          onClick={() => router.push("/instructor/dashboard")}
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </button>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="container mx-auto px-4 py-10">
        <StartStreamCard onStart={(title) => start.mutate(title)} busy={start.isPending} />
      </div>
    );
  }

  const isLive = stream.status === LiveStatus.LIVE;
  const isSelfHosted = stream.provider === "self";

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="min-w-0">
          <button
            onClick={() => router.push("/instructor/dashboard")}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </button>
          <h1 className="text-xl font-bold text-foreground truncate">{stream.title}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isLive && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-red-500">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE
            </span>
          )}
          {!isLive && !isSelfHosted && (
            // OBS flow: the teacher starts the encoder, then flips live here.
            <button
              onClick={() => goLive.mutate(streamId)}
              disabled={goLive.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50"
            >
              {goLive.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Go Live
            </button>
          )}
          <button
            onClick={finish}
            disabled={end.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gray-800 hover:bg-black disabled:opacity-50"
          >
            {end.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
            End stream
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 lg:h-[calc(100vh-250px)] lg:min-h-[520px]">
        <div className="flex flex-col gap-4 min-h-0 lg:h-full lg:overflow-y-auto">
          <div className="flex flex-col lg:flex-1 lg:min-h-0 rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Broadcast from this device</h2>
              </div>
              {broadcastState === "live" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-red-500">
                  <Radio className="w-3 h-3 animate-pulse" /> ON AIR
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">No software needed</span>
              )}
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black aspect-video lg:aspect-auto lg:flex-1 lg:min-h-[220px]">
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-contain" />
              {(broadcastState === "idle" || broadcastState === "error") && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/70">
                  <CameraOff className="w-8 h-8" />
                  <p className="text-sm">Turn on your camera to preview</p>
                </div>
              )}
              {broadcastState === "preview" && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500 text-black text-[11px] font-bold tracking-wide">
                  PREVIEW — STUDENTS CAN&apos;T SEE THIS YET
                </span>
              )}
              {broadcastState === "connecting" && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] font-semibold">
                  Connecting to the stream…
                </span>
              )}
            </div>

            {isLive && broadcastState !== "live" && broadcastState !== "connecting" && (
              <p className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                You are marked live, but your camera is not streaming. Turn it on and resume —
                a stream with no video for a few minutes ends on its own.
              </p>
            )}

            {broadcastError && (
              <p className="flex items-start gap-2 text-sm text-red-500">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {broadcastError}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {(broadcastState === "idle" || broadcastState === "error") && (
                <button
                  onClick={startPreview}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:opacity-90"
                >
                  <Camera className="w-4 h-4" /> Turn on camera
                </button>
              )}
              {broadcastState === "preview" && (
                <>
                  <button
                    onClick={startBroadcast}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 shadow-[0_0_0_4px_rgba(239,68,68,0.25)] animate-pulse"
                  >
                    <Play className="w-4 h-4" />
                    {isLive ? "Resume streaming" : "Go live from camera"}
                  </button>
                  <button
                    onClick={stopAll}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-border hover:bg-muted"
                  >
                    <CameraOff className="w-4 h-4" /> Turn off camera
                  </button>
                </>
              )}
              {broadcastState === "connecting" && (
                <button disabled className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 opacity-60">
                  <Loader2 className="w-4 h-4 animate-spin" /> Connecting to the stream…
                </button>
              )}
              {broadcastState === "live" && (
                <p className="text-xs text-muted-foreground">
                  Students see this with a few seconds of delay. Use <strong>End stream</strong> to finish.
                </p>
              )}
            </div>
          </div>

          {!isSelfHosted && !isLive && (
            <details className="rounded-2xl border border-border bg-card">
              <summary className="cursor-pointer list-none p-5 font-semibold text-foreground">
                Prefer OBS or an external encoder?
              </summary>
              <div className="px-5 pb-5 space-y-4">
                <CopyLine label="Server URL" value={stream.rtmpUrl} />
                <CopyLine label="Stream key" value={stream.streamKey} />
                <p className="text-sm text-muted-foreground">
                  Start streaming in OBS with these settings, then click <strong>Go Live</strong> above.
                </p>
              </div>
            </details>
          )}
        </div>

        <div className="min-h-0 h-[520px] lg:h-full">
          <LiveQnAPanel
            title="Student Q&A"
            messages={messages}
            currentUserId={currentUserId}
            conversationId={stream.conversationId}
            isConnected={isConnected}
            typingUser={typingUser}
            onSend={sendMessage}
            onTyping={typing}
            onStopTyping={stopTyping}
          />
        </div>
      </div>
    </div>
  );
}

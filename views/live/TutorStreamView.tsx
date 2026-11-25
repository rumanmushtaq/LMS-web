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
  MessageSquare,
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
import InstructorLayout from "@/views/instructor/InstructorLayout";

const MY_STREAM_KEY = ["teacher-streams", "me"] as const;

const errorMessage = (e: unknown, fallback: string) =>
  (e as { response?: { data?: { message?: string } } })?.response?.data
    ?.message || fallback;

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
      <label className="text-xs font-semibold text-muted-foreground">
        {label}
      </label>
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

/** Same gradient as the rest of the teacher dashboard's primary actions. */
const BRAND_BUTTON =
  "linear-gradient(135deg, oklch(0.45 0.22 300), oklch(0.7 0.15 210))";

const HOW_IT_WORKS = [
  {
    icon: Camera,
    title: "Turn on your camera",
    body: "Preview yourself first — nobody sees you yet.",
  },
  {
    icon: Radio,
    title: "Go live",
    body: "Your card and profile get a LIVE badge and a Join live button.",
  },
  {
    icon: MessageSquare,
    title: "Answer questions",
    body: "Students ask in the live chat beside the video.",
  },
];

/** Before a stream exists: name it and open it. */
function StartStreamCard({
  onStart,
  busy,
}: {
  onStart: (title: string) => void;
  busy: boolean;
}) {
  const { register, handleSubmit } = useForm<{ title: string }>({
    defaultValues: { title: "" },
  });
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <form
        onSubmit={handleSubmit(({ title }) => onStart(title))}
        className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-xl shadow-foreground/5 p-6 sm:p-8 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/15 grid place-items-center shrink-0">
            <Radio className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-foreground">Start a live stream</h2>
            <p className="text-sm text-muted-foreground">
              Open to every student. Students who have had a class with you get
              notified.
            </p>
          </div>
        </div>
        <div>
          <label
            htmlFor="stream-title"
            className="text-xs font-semibold text-muted-foreground"
          >
            What is this stream about? (optional)
          </label>
          <input
            id="stream-title"
            {...register("title", { maxLength: 120 })}
            maxLength={120}
            placeholder="e.g. Algebra Q&A — ask me anything"
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          style={{ background: BRAND_BUTTON }}
        >
          {busy ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          Set up my stream
        </button>
      </form>

      <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-xl shadow-foreground/5 p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          How it works
        </h3>
        {HOW_IT_WORKS.map(({ icon: Icon, title, body }, i) => (
          <div key={title} className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 grid place-items-center shrink-0">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {i + 1}. {title}
              </p>
              <p className="text-xs text-muted-foreground">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
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

  const {
    data: stream,
    isLoading,
    error,
  } = useQuery({
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
      toast.success(
        "You're live — students can join from your card and profile.",
      );
    },
    onError: (e) =>
      toast.error(
        errorMessage(e, "Streaming, but couldn't mark you live. Try again."),
      ),
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

  const {
    messages,
    isConnected,
    typingUser,
    sendMessage,
    typing,
    stopTyping,
    currentUserId,
  } = useLiveClass({ conversationId: stream?.conversationId ?? null });

  const finish = () => {
    if (!streamId) return;
    stopAll();
    end.mutate(streamId);
  };

  if (!isAuthed || isLoading) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
        </div>
      </InstructorLayout>
    );
  }

  if (error) {
    return (
      <InstructorLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
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
      </InstructorLayout>
    );
  }

  if (!stream) {
    return (
      <InstructorLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Go Live</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Stream from your camera to every student on Varona.
            </p>
          </div>
          <StartStreamCard
            onStart={(title) => start.mutate(title)}
            busy={start.isPending}
          />
        </div>
      </InstructorLayout>
    );
  }

  const isLive = stream.status === LiveStatus.LIVE;
  const isSelfHosted = stream.provider === "self";

  return (
    <InstructorLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground">Go Live</h1>
            <p className="text-sm text-muted-foreground mt-0.5 truncate">
              {stream.title}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isLive && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-red-500">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE
              </span>
            )}
            {!isLive && !isSelfHosted && broadcastState === "idle" && (
              // OBS flow: the teacher starts the encoder, then flips live here.
              <button
                onClick={() => goLive.mutate(streamId)}
                disabled={goLive.isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                style={{ background: BRAND_BUTTON }}
              >
                {goLive.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Go Live
              </button>
            )}
            <button
              onClick={finish}
              disabled={end.isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/5 transition-colors disabled:opacity-50"
            >
              {end.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              End stream
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-[1fr_360px] gap-6 2xl:h-[calc(100vh-250px)] 2xl:min-h-[520px]">
          <div className="flex flex-col gap-4 min-h-0 2xl:h-full 2xl:overflow-y-auto">
            <div className="flex flex-col 2xl:flex-1 2xl:min-h-0 bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-xl shadow-foreground/5 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-foreground">
                    Broadcast from this device
                  </h2>
                </div>
                {broadcastState === "live" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-red-500">
                    <Radio className="w-3 h-3 animate-pulse" /> ON AIR
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No software needed
                  </span>
                )}
              </div>

              <div className="relative rounded-xl overflow-hidden bg-black aspect-video 2xl:aspect-auto 2xl:flex-1 2xl:min-h-[220px]">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
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

              {isLive &&
                broadcastState !== "live" &&
                broadcastState !== "connecting" && (
                  <p className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    You are marked live, but your camera is not streaming. Turn
                    it on and resume — a stream with no video for a few minutes
                    ends on its own.
                  </p>
                )}

              {broadcastError && (
                <p className="flex items-start gap-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{" "}
                  {broadcastError}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {(broadcastState === "idle" || broadcastState === "error") && (
                  <button
                    onClick={startPreview}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: BRAND_BUTTON }}
                  >
                    <Camera className="w-4 h-4" /> Turn on camera
                  </button>
                )}
                {broadcastState === "preview" && (
                  <>
                    <button
                      onClick={startBroadcast}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/30"
                      style={{ background: BRAND_BUTTON }}
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
                  <button
                    disabled
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 opacity-60"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" /> Connecting to
                    the stream…
                  </button>
                )}
                {broadcastState === "live" && (
                  <p className="text-xs text-muted-foreground">
                    Students see this with a few seconds of delay. Use{" "}
                    <strong>End stream</strong> to finish.
                  </p>
                )}
              </div>
            </div>

            {!isSelfHosted && !isLive && (
              <details className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-xl shadow-foreground/5">
                <summary className="cursor-pointer list-none p-5 font-semibold text-foreground">
                  Prefer OBS or an external encoder?
                </summary>
                <div className="px-5 pb-5 space-y-4">
                  <CopyLine label="Server URL" value={stream.rtmpUrl} />
                  <CopyLine label="Stream key" value={stream.streamKey} />
                  <p className="text-sm text-muted-foreground">
                    Start streaming in OBS with these settings, then click{" "}
                    <strong>Go Live</strong> above.
                  </p>
                </div>
              </details>
            )}
          </div>

          <div className="min-h-0 h-[520px] 2xl:h-full">
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
    </InstructorLayout>
  );
}

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Radio,
  Copy,
  Check,
  AlertCircle,
  ArrowLeft,
  Play,
  Square,
  Eye,
  EyeOff,
  Info,
  Camera,
  CameraOff,
  Clock,
} from "lucide-react";
import {
  getBroadcastInfo,
  getClassById,
  startLive as startLiveApi,
  endLive as endLiveApi,
  LiveStatus,
  LiveBroadcastInfo,
} from "@/services/classes";
import { useAuthStore } from "@/store/auth";
import { useLiveClass } from "@/hooks/useLiveClass";
import { useBrowserBroadcast } from "@/hooks/useBrowserBroadcast";
import VimeoEmbed from "@/components/live/VimeoEmbed";
import LiveQnAPanel from "@/components/live/LiveQnAPanel";
import ClassCountdown from "@/components/live/ClassCountdown";
import { toast } from "sonner";

function CopyField({ label, value, secret = false }: { label: string; value: string | null; secret?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(!secret);

  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy — copy it manually.");
    }
  };

  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <code className="flex-1 truncate rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs font-mono">
          {value ? (revealed ? value : "•".repeat(Math.min(value.length, 32))) : "—"}
        </code>
        {secret && (
          <button
            onClick={() => setRevealed((r) => !r)}
            className="p-2 rounded-lg border border-border hover:bg-muted"
            aria-label={revealed ? "Hide" : "Reveal"}
          >
            {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        <button
          onClick={copy}
          disabled={!value}
          className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-40"
          aria-label="Copy"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function TutorLiveClassView({ classId }: { classId: string }) {
  const router = useRouter();
  const isAuthed = useAuthStore((s) => !!s.accessToken);

  const [info, setInfo] = useState<LiveBroadcastInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [liveStatus, setLiveStatus] = useState<LiveStatus>(LiveStatus.IDLE);

  // Schedule fetched separately when provisioning fails, so the page can
  // show a countdown instead of a wall of error before class time.
  const [classBasics, setClassBasics] = useState<{
    title: string;
    startTime: string;
  } | null>(null);

  // Provisions the broadcast (YouTube/Vimeo) + Q&A room, returns credentials.
  const loadBroadcast = useCallback(() => {
    return getBroadcastInfo(classId)
      .then((data) => {
        setInfo(data);
        setLiveStatus(data.status);
        setError(null);
      })
      .catch(async (e) => {
        setError(
          e?.response?.data?.message ||
            "Could not set up the broadcast. Check that the live provider is configured on the server.",
        );
        try {
          const res = (await getClassById(classId)) as {
            data?: { title?: string; startTime?: string };
            title?: string;
            startTime?: string;
          };
          const cls = res?.data ?? res;
          if (cls?.title && cls?.startTime) {
            setClassBasics({ title: cls.title, startTime: cls.startTime });
          }
        } catch {
          /* keep the plain error page */
        }
      })
      .finally(() => setLoading(false));
  }, [classId]);

  useEffect(() => {
    if (!isAuthed) {
      router.replace(`/login?redirect=/instructor/classes/${classId}/live`);
      return;
    }
    loadBroadcast();
  }, [classId, isAuthed, router, loadBroadcast]);

  // A provisioning hiccup before class time (provider outage, flaky network)
  // should fix itself: retry quietly once a minute while the countdown shows.
  useEffect(() => {
    if (!error || info) return;
    const timer = setInterval(loadBroadcast, 60_000);
    return () => clearInterval(timer);
  }, [error, info, loadBroadcast]);

  const { messages, isConnected, typingUser, sendMessage, typing, stopTyping, currentUserId } =
    useLiveClass({ conversationId: info?.conversationId ?? null });

  // Camera-in-browser broadcasting. Once the relay confirms frames are
  // flowing to the provider, the class is flipped live for students — the
  // same thing the manual "Go Live" button does in the OBS flow.
  const broadcast = useBrowserBroadcast({
    classId,
    onLive: async () => {
      try {
        await startLiveApi(classId);
        setLiveStatus(LiveStatus.LIVE);
        toast.success("You're live — students have been notified.");
      } catch {
        toast.error("Streaming, but students could not be notified. Click Go Live.");
      }
    },
  });

  const goLive = async () => {
    setBusy(true);
    try {
      await startLiveApi(classId);
      setLiveStatus(LiveStatus.LIVE);
      toast.success("You're live — students have been notified.");
    } catch {
      toast.error("Couldn't go live. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const endLive = async () => {
    setBusy(true);
    broadcast.stopAll();
    try {
      await endLiveApi(classId);
      setLiveStatus(LiveStatus.ENDED);
      toast.success("Broadcast ended.");
    } catch {
      toast.error("Couldn't end the broadcast.");
    } finally {
      setBusy(false);
    }
  };

  const isSelfHosted = info?.provider === "self";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
      </div>
    );
  }

  if (error || !info) {
    // Before class time, a technical hiccup is not the teacher's problem yet:
    // show the countdown, keep retrying in the background.
    if (classBasics && new Date(classBasics.startTime).getTime() > Date.now()) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground bg-muted">
            <Clock className="w-3.5 h-3.5" /> Scheduled
          </span>
          <h1 className="text-xl font-bold text-foreground">{classBasics.title}</h1>
          <ClassCountdown
            startTime={classBasics.startTime}
            label="Class starts in"
            className="text-4xl font-bold text-foreground"
          />
          <p className="text-sm text-muted-foreground max-w-md">
            The broadcast isn&apos;t set up yet — we&apos;ll keep retrying automatically so
            everything is ready before class time.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadBroadcast()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:opacity-90"
            >
              Retry now
            </button>
            <button
              onClick={() => router.push("/instructor/classes")}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-6">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-foreground font-semibold max-w-md">{error || "Class not found"}</p>
        <div className="mt-2 flex items-center gap-4">
          <button
            onClick={() => loadBroadcast()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Retry
          </button>
          <button
            onClick={() => router.push("/instructor/classes")}
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>
    );
  }

  const isLive = liveStatus === LiveStatus.LIVE;
  const hasEnded = liveStatus === LiveStatus.ENDED;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="min-w-0">
          <button
            onClick={() => router.push("/instructor/class-requests")}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Classes
          </button>
          <h1 className="text-xl font-bold text-foreground truncate">{info.title}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isLive && !hasEnded && info.startTime && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground bg-muted">
              <Clock className="w-3.5 h-3.5" />
              <ClassCountdown startTime={info.startTime} label="Starts in" fallback={<>Scheduled start passed</>} />
            </span>
          )}
          {isLive && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-red-500">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE
            </span>
          )}
          {!isLive && !hasEnded && broadcast.state === "idle" && !isSelfHosted && (
            <button
              onClick={goLive}
              disabled={busy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Go Live
            </button>
          )}
          {isLive && (
            <button
              onClick={endLive}
              disabled={busy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gray-800 hover:bg-black disabled:opacity-50"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
              End Class
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 min-h-[520px]">
        {/* Main column */}
        <div className="flex flex-col gap-4 min-h-0">
          {hasEnded ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-black text-white/70 aspect-video gap-2">
              <p className="font-medium">This class has ended.</p>
            </div>
          ) : isLive && broadcast.state === "idle" && !isSelfHosted ? (
            // OBS flow: the tutor watches their own stream in-page.
            <VimeoEmbed embedUrl={info.embedUrl!} title={info.title} />
          ) : (
            <>
              {/* Camera-in-browser broadcast (no OBS) */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    <h2 className="font-semibold text-foreground">Broadcast from this device</h2>
                  </div>
                  {broadcast.state === "live" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-red-500">
                      <Radio className="w-3 h-3 animate-pulse" /> ON AIR
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No software needed</span>
                  )}
                </div>

                <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                  <video
                    ref={broadcast.videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {(broadcast.state === "idle" || broadcast.state === "error") && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/70">
                      <CameraOff className="w-8 h-8" />
                      <p className="text-sm">Turn on your camera to preview</p>
                    </div>
                  )}
                  {broadcast.state === "preview" && (
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500 text-black text-[11px] font-bold tracking-wide">
                        PREVIEW — NOT LIVE YET
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-medium">
                        Students can&apos;t see this
                      </span>
                    </div>
                  )}
                  {broadcast.state === "connecting" && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] font-semibold">
                      Connecting to the stream…
                    </div>
                  )}
                </div>

                {isLive && broadcast.state !== "live" && broadcast.state !== "connecting" && (
                  <p className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    The class is marked live, but your camera is not streaming.
                    Turn on the camera and go live to resume the video.
                  </p>
                )}

                {broadcast.error && (
                  <p className="flex items-start gap-2 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {broadcast.error}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {(broadcast.state === "idle" || broadcast.state === "error") && (
                    <button
                      onClick={broadcast.startPreview}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:opacity-90"
                    >
                      <Camera className="w-4 h-4" /> Turn on camera
                    </button>
                  )}
                  {broadcast.state === "preview" && (
                    <>
                      <button
                        onClick={broadcast.goLive}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 shadow-[0_0_0_4px_rgba(239,68,68,0.25)] animate-pulse"
                      >
                        <Play className="w-4 h-4" />
                        {isLive ? "Resume streaming" : "Go Live from camera"}
                      </button>
                      <span className="text-xs text-muted-foreground">
                        Camera is on but nothing is being sent yet — click to start the class for students.
                      </span>
                      <button
                        onClick={broadcast.stopAll}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-border hover:bg-muted"
                      >
                        <CameraOff className="w-4 h-4" /> Turn off camera
                      </button>
                    </>
                  )}
                  {broadcast.state === "connecting" && (
                    <button
                      disabled
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 opacity-60"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" /> Connecting to the stream…
                    </button>
                  )}
                  {broadcast.state === "live" && (
                    <p className="text-xs text-muted-foreground">
                      Students see this with a few seconds of delay. Use <strong>End Class</strong> to finish.
                    </p>
                  )}
                </div>
              </div>

              {!isLive && !isSelfHosted && (
              <details className="rounded-2xl border border-border bg-card group">
                <summary className="cursor-pointer list-none p-5 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold text-foreground">
                    <Radio className="w-4 h-4 text-primary" /> Prefer OBS or an external encoder?
                  </span>
                  <span className="text-xs text-muted-foreground group-open:hidden">Show settings</span>
                </summary>
              <div className="px-5 pb-5 space-y-4">
              {/* Broadcast credentials */}
              <div className="space-y-4">
                <CopyField label="Server URL (RTMPS)" value={info.rtmpUrl} />
                <CopyField label="Stream key" value={info.streamKey} secret />
              </div>

              {/* OBS instructions */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 text-sm">
                    How to broadcast (with OBS Studio)
                  </h3>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-sm text-blue-900/80 dark:text-blue-200/80">
                  <li>Open OBS → <strong>Settings → Stream</strong>.</li>
                  <li>Service: <strong>Custom…</strong></li>
                  <li>Paste the <strong>Server URL</strong> and <strong>Stream key</strong> above.</li>
                  <li>Add your webcam / screen as a source, then click <strong>Start Streaming</strong> in OBS.</li>
                  <li>Once OBS is streaming, click <strong>Go Live</strong> here to notify students.</li>
                </ol>
              </div>
              </div>
              </details>
              )}
            </>
          )}
        </div>

        {/* Chat column */}
        <div className="min-h-0 h-[calc(100vh-180px)] min-h-[520px]">
          <LiveQnAPanel
            title="Student Q&A"
            messages={messages}
            currentUserId={currentUserId}
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

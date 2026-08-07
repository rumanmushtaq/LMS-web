"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import {
  getBroadcastInfo,
  startLive as startLiveApi,
  endLive as endLiveApi,
  LiveStatus,
  LiveBroadcastInfo,
} from "@/services/classes";
import { useAuthStore } from "@/store/auth";
import { useLiveClass } from "@/hooks/useLiveClass";
import VimeoEmbed from "@/components/live/VimeoEmbed";
import LiveQnAPanel from "@/components/live/LiveQnAPanel";
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

  useEffect(() => {
    if (!isAuthed) {
      router.replace(`/login?redirect=/instructor/classes/${classId}/live`);
      return;
    }
    // Provisions the Vimeo event + Q&A room on first load, returns credentials.
    getBroadcastInfo(classId)
      .then((data) => {
        setInfo(data);
        setLiveStatus(data.status);
      })
      .catch((e) =>
        setError(
          e?.response?.data?.message ||
            "Could not set up the broadcast. Check that Vimeo is configured on the server.",
        ),
      )
      .finally(() => setLoading(false));
  }, [classId, isAuthed, router]);

  const { messages, isConnected, typingUser, sendMessage, typing, stopTyping, currentUserId } =
    useLiveClass({ conversationId: info?.conversationId ?? null });

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-6">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-foreground font-semibold max-w-md">{error || "Class not found"}</p>
        <button
          onClick={() => router.push("/instructor/class-requests")}
          className="mt-2 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
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
          {isLive && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-red-500">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE
            </span>
          )}
          {!isLive && !hasEnded && (
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
          {isLive ? (
            <VimeoEmbed embedUrl={info.embedUrl!} title={info.title} />
          ) : hasEnded ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-black text-white/70 aspect-video gap-2">
              <p className="font-medium">This class has ended.</p>
            </div>
          ) : (
            <>
              {/* Broadcast credentials */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-foreground">Broadcast settings</h2>
                </div>
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

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Radio, Clock, AlertCircle, ArrowLeft, Video } from "lucide-react";
import { getLiveWatchInfo, LiveStatus, LiveWatchInfo } from "@/services/classes";
import { useAuthStore } from "@/store/auth";
import { useLiveClass } from "@/hooks/useLiveClass";
import VimeoEmbed from "@/components/live/VimeoEmbed";
import LiveQnAPanel from "@/components/live/LiveQnAPanel";
import ClassCountdown from "@/components/live/ClassCountdown";
import HlsPlayer from "@/components/live/HlsPlayer";
import { useSelfPlayback } from "@/hooks/useSelfPlayback";

export default function StudentLiveClassView({ classId }: { classId: string }) {
  const router = useRouter();
  const isAuthed = useAuthStore((s) => !!s.accessToken);

  const [info, setInfo] = useState<LiveWatchInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Live status is kept locally so socket pushes can flip it without a refetch.
  const [liveStatus, setLiveStatus] = useState<LiveStatus>(LiveStatus.IDLE);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthed) {
      router.replace(`/login?redirect=/student/classes/${classId}/live`);
      return;
    }
    getLiveWatchInfo(classId)
      .then((data) => {
        setInfo(data);
        setLiveStatus(data.live.status);
        setEmbedUrl(data.live.embedUrl);
      })
      .catch((e) => setError(e?.response?.data?.message || "Could not load this class."))
      .finally(() => setLoading(false));
  }, [classId, isAuthed, router]);

  const { messages, isConnected, typingUser, sendMessage, typing, stopTyping, currentUserId } =
    useLiveClass({
      conversationId: info?.live.conversationId ?? null,
      onLiveStatus: (status, url) => {
        setLiveStatus(status);
        if (url) setEmbedUrl(url);
      },
    });

  const isSelfHosted = info?.live.provider === "self";
  const selfSrc = useSelfPlayback(
    classId,
    liveStatus === LiveStatus.LIVE && isSelfHosted,
  );

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
        <p className="text-foreground font-semibold">{error || "Class not found"}</p>
        <button
          onClick={() => router.push("/student/classes")}
          className="mt-2 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to my classes
        </button>
      </div>
    );
  }

  const isLive = liveStatus === LiveStatus.LIVE && !!embedUrl;
  const hasEnded = liveStatus === LiveStatus.ENDED;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="min-w-0">
          <button
            onClick={() => router.push("/student/classes")}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> My Classes
          </button>
          <h1 className="text-xl font-bold text-foreground truncate">{info.title}</h1>
        </div>
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-red-500">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground bg-muted">
            <Clock className="w-3.5 h-3.5" /> {hasEnded ? "Ended" : "Waiting to start"}
          </span>
        )}
      </div>

      {/* Video + Chat grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 h-[calc(100vh-180px)] min-h-[520px]">
        {/* Video column */}
        <div className="flex flex-col gap-3 min-h-0">
          {isLive && isSelfHosted ? (
            selfSrc ? (
              <HlsPlayer src={selfSrc} title={info.title} />
            ) : (
              <div className="flex items-center justify-center rounded-2xl bg-black text-white/60 aspect-video text-sm">
                Connecting to the stream…
              </div>
            )
          ) : isLive ? (
            <VimeoEmbed embedUrl={embedUrl!} title={info.title} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-black text-white/70 aspect-video gap-3">
              <Video className="w-12 h-12 opacity-40" />
              {hasEnded ? (
                <p className="font-medium">This class has ended.</p>
              ) : (
                <>
                  <ClassCountdown
                    startTime={info.startTime}
                    label="Class starts in"
                    className="text-3xl font-bold text-white"
                    fallback={<p className="font-medium">The instructor hasn&apos;t started yet.</p>}
                  />
                  <p className="text-sm text-white/40">
                    The video will appear automatically when the class goes live.
                  </p>
                </>
              )}
              {hasEnded && info.live.recordingUrl && (
                <a
                  href={info.live.recordingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary underline"
                >
                  Watch the recording
                </a>
              )}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Note: live video runs a few seconds behind the teacher. Ask questions in the chat anytime — the
            instructor will answer live.
          </p>
        </div>

        {/* Chat column */}
        <div className="min-h-0">
          <LiveQnAPanel
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

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Radio, AlertCircle, ArrowLeft, Video } from "lucide-react";
import { LiveStatus } from "@/services/classes";
import { getStreamWatchInfo } from "@/services/teacherStreams";
import { useAuthStore } from "@/store/auth";
import { useLiveClass } from "@/hooks/useLiveClass";
import { useSelfPlayback } from "@/hooks/useSelfPlayback";
import VimeoEmbed from "@/components/live/VimeoEmbed";
import HlsPlayer from "@/components/live/HlsPlayer";
import LiveQnAPanel from "@/components/live/LiveQnAPanel";

/**
 * A student watching a teacher's open stream. Same player and Q&A as a live
 * class; the API decides who may join (students only) and this page just
 * shows its answer.
 */
export default function StudentStreamView({ streamId }: { streamId: string }) {
  const router = useRouter();
  const isAuthed = useAuthStore((s) => !!s.accessToken);

  useEffect(() => {
    if (!isAuthed) router.replace(`/login?redirect=/student/live/${streamId}`);
  }, [isAuthed, router, streamId]);

  const { data: info, isLoading, error } = useQuery({
    queryKey: ["teacher-streams", "watch", streamId],
    queryFn: () => getStreamWatchInfo(streamId),
    enabled: isAuthed,
    staleTime: 60_000,
    retry: false,
  });

  // Socket pushes flip these without a refetch.
  const [liveStatus, setLiveStatus] = useState<LiveStatus | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const status = liveStatus ?? info?.live.status ?? LiveStatus.IDLE;
  const url = embedUrl ?? info?.live.embedUrl ?? null;

  const { messages, isConnected, typingUser, sendMessage, typing, stopTyping, currentUserId } =
    useLiveClass({
      conversationId: info?.live.conversationId ?? null,
      onLiveStatus: (next, nextUrl) => {
        setLiveStatus(next);
        if (nextUrl) setEmbedUrl(nextUrl);
      },
    });

  const isSelfHosted = info?.live.provider === "self";
  const isLive = status === LiveStatus.LIVE && !!url;
  const hasEnded = status === LiveStatus.ENDED;
  const selfSrc = useSelfPlayback(streamId, isLive && isSelfHosted);

  if (!isAuthed || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
      </div>
    );
  }

  if (error || !info) {
    const message =
      (error as { response?: { data?: { message?: string } } } | null)?.response?.data
        ?.message || "Could not open this stream.";
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-6">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-foreground font-semibold max-w-md">{message}</p>
        <button
          onClick={() => router.push("/instructors")}
          className="mt-2 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to teachers
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="min-w-0">
          <button
            onClick={() => router.push("/instructors")}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Teachers
          </button>
          <h1 className="text-xl font-bold text-foreground truncate">{info.title}</h1>
          {info.tutor.name && (
            <p className="text-sm text-muted-foreground truncate">with {info.tutor.name}</p>
          )}
        </div>
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-red-500 shrink-0">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground bg-muted shrink-0">
            {hasEnded ? "Ended" : "Starting soon"}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 lg:h-[calc(100vh-250px)] lg:min-h-[520px]">
        <div className="flex flex-col gap-3 min-h-0">
          <p className="text-xs text-muted-foreground">
            Live video runs a few seconds behind the teacher. Ask questions in the chat anytime.
          </p>
          {isLive && isSelfHosted ? (
            selfSrc ? (
              <HlsPlayer src={selfSrc} title={info.title} className="lg:aspect-auto lg:flex-1 lg:min-h-0" />
            ) : (
              <div className="flex items-center justify-center rounded-2xl bg-black text-white/60 aspect-video text-sm lg:aspect-auto lg:flex-1 lg:min-h-0">
                Connecting to the stream…
              </div>
            )
          ) : isLive ? (
            <VimeoEmbed embedUrl={url!} title={info.title} className="lg:aspect-auto lg:flex-1 lg:min-h-0" />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-black text-white/70 aspect-video gap-3 lg:aspect-auto lg:flex-1 lg:min-h-0">
              <Video className="w-12 h-12 opacity-40" />
              {hasEnded ? (
                <>
                  <p className="font-medium">This stream has ended.</p>
                  <p className="text-sm text-white/40">
                    Look for the LIVE badge on the teacher&apos;s card next time.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">The teacher is getting ready.</p>
                  <p className="text-sm text-white/40">The video appears here automatically.</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="min-h-0 h-[520px] lg:h-full">
          <LiveQnAPanel
            messages={messages}
            currentUserId={currentUserId}
            conversationId={hasEnded ? null : info.live.conversationId}
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

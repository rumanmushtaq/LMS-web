import api from "../utils/axiosInstance";
import { LiveStatus } from "./classes";

// ─── Teacher live streams ────────────────────────────────────────────────────
// A teacher's open "go live" broadcast. It rides the live-class machinery
// (ingest socket, HLS gate, Q&A chat) with the stream id in the class-id slot.

export interface LiveTeacher {
  streamId: string;
  tutorId: string;
  tutorName: string;
  tutorPhoto: string | null;
  title: string;
  startedAt: string | null;
}

export interface StreamBroadcastInfo {
  streamId: string;
  title: string;
  status: LiveStatus;
  startedAt: string | null;
  provider?: string;
  rtmpUrl: string | null;
  streamKey: string | null;
  embedUrl: string | null;
  conversationId: string | null;
}

export interface StreamWatchInfo {
  streamId: string;
  title: string;
  status: LiveStatus;
  startedAt: string | null;
  tutor: { _id: string; name: string };
  live: {
    status: LiveStatus;
    provider?: string;
    embedUrl: string | null;
    conversationId: string | null;
  };
}

const unwrap = <T>(response: { data: { data?: T } | T }): T =>
  (response.data as { data?: T })?.data ?? (response.data as T);

/** Everyone: teachers live right now. */
export const getLiveTeachers = async (): Promise<LiveTeacher[]> => {
  const data = unwrap<LiveTeacher[]>(await api.get("/api/v1/teacher-streams/live"));
  return Array.isArray(data) ? data : [];
};

/** Teacher: their active stream, or null. */
export const getMyStream = async (): Promise<StreamBroadcastInfo | null> => {
  const data = unwrap<{ stream: StreamBroadcastInfo | null }>(
    await api.get("/api/v1/teacher-streams/me"),
  );
  return data?.stream ?? null;
};

/** Teacher: open (or reopen) their stream. */
export const startStream = async (title?: string): Promise<StreamBroadcastInfo> =>
  unwrap(await api.post("/api/v1/teacher-streams", { title }));

/** Teacher: video is flowing — show the stream as live. */
export const goLiveStream = async (streamId: string) =>
  unwrap(await api.post(`/api/v1/teacher-streams/${streamId}/live`));

/** Teacher: end the stream. */
export const endStream = async (streamId: string) =>
  unwrap(await api.post(`/api/v1/teacher-streams/${streamId}/end`));

/** Student: join a stream (teachers and admins are refused by the API). */
export const getStreamWatchInfo = async (streamId: string): Promise<StreamWatchInfo> =>
  unwrap(await api.get(`/api/v1/teacher-streams/${streamId}/watch`));

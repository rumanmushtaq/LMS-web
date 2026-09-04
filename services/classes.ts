import api from '../utils/axiosInstance';

export enum ClassStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  SCHEDULED = 'SCHEDULED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  MISSED = 'MISSED',
}

export interface ClassSession {
  _id: string;
  tutorId: any;
  requestedBy?: any;
  title: string;
  description: string;
  students: any[];
  courseId?: any;
  meetingLink?: string;
  startTime: string;
  endTime: string;
  status: ClassStatus;
  declineReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassPayload {
  title: string;
  description: string;
  courseId?: string;
  meetingLink?: string;
  startTime: string;
  endTime: string;
  status?: ClassStatus;
}

export interface RequestClassPayload {
  tutorId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export const getClasses = async () => {
  const response = await api.get('/api/v1/classes');
  return response.data;
};

export const getClassById = async (id: string) => {
  const response = await api.get(`/api/v1/classes/${id}`);
  return response.data;
};

export const createClass = async (payload: CreateClassPayload) => {
  const response = await api.post('/api/v1/classes', payload);
  return response.data;
};

/** Student: request a class from a specific tutor */
export const requestClass = async (payload: RequestClassPayload) => {
  const response = await api.post('/api/v1/classes/request', payload);
  return response.data;
};

/** Tutor: get all pending class requests for them */
export const getClassRequests = async () => {
  const response = await api.get('/api/v1/classes/requests');
  return response.data;
};

/** Tutor: approve a class request, optionally providing a meeting link */
export const approveClass = async (id: string, meetingLink?: string) => {
  const response = await api.patch(`/api/v1/classes/${id}/approve`, { meetingLink });
  return response.data;
};

/** Tutor: decline a class request with an optional reason */
export const declineClass = async (id: string, declineReason?: string) => {
  const response = await api.patch(`/api/v1/classes/${id}/decline`, { declineReason });
  return response.data;
};

export const updateClass = async (id: string, payload: Partial<CreateClassPayload>) => {
  const response = await api.patch(`/api/v1/classes/${id}`, payload);
  return response.data;
};

export const deleteClass = async (id: string) => {
  const response = await api.delete(`/api/v1/classes/${id}`);
  return response.data;
};

export const enrollInClass = async (id: string) => {
  const response = await api.post(`/api/v1/classes/${id}/enroll`);
  return response.data;
};

// ─── Live class (Vimeo broadcast + Q&A chat) ─────────────────────────────────

export enum LiveStatus {
  IDLE = "idle",
  LIVE = "live",
  ENDED = "ended",
}

export interface LiveWatchInfo {
  classId: string;
  title: string;
  status: ClassStatus;
  startTime: string;
  endTime: string;
  live: {
    status: LiveStatus;
    embedUrl: string | null;
    conversationId: string | null;
    recordingUrl: string | null;
    provider?: string;
  };
}

export interface LiveBroadcastInfo {
  classId: string;
  title: string;
  status: LiveStatus;
  startTime: string;
  endTime: string;
  provider?: string;
  rtmpUrl: string | null;
  streamKey: string | null;
  embedUrl: string | null;
  conversationId: string | null;
  vimeoEventId: string | null;
}

/** Student/tutor: get embed URL + Q&A room to watch a live class. */
export const getLiveWatchInfo = async (id: string): Promise<LiveWatchInfo> => {
  const response = await api.get(`/api/v1/classes/${id}/live/watch`);
  return response.data?.data ?? response.data;
};

/** Tutor: provision the Vimeo event + Q&A room (idempotent). */
export const setupLive = async (id: string): Promise<LiveBroadcastInfo> => {
  const response = await api.post(`/api/v1/classes/${id}/live/setup`);
  return response.data?.data ?? response.data;
};

/** Tutor: get RTMP ingest credentials for OBS. */
export const getBroadcastInfo = async (id: string): Promise<LiveBroadcastInfo> => {
  const response = await api.get(`/api/v1/classes/${id}/live/broadcast`);
  return response.data?.data ?? response.data;
};

/** Tutor: flip the broadcast live and notify students. */
export const startLive = async (id: string) => {
  const response = await api.post(`/api/v1/classes/${id}/live/start`);
  return response.data?.data ?? response.data;
};

/** Tutor: end the broadcast and complete the class. */
export const endLive = async (id: string) => {
  const response = await api.post(`/api/v1/classes/${id}/live/end`);
  return response.data?.data ?? response.data;
};

/** Self-hosted streams: short-lived, class-scoped token for the HLS player. */
export const getPlaybackToken = async (id: string): Promise<{ token: string }> => {
  const response = await api.get(`/api/v1/live-hls/${id}/token`);
  return response.data?.data ?? response.data;
};

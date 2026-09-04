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
  /** 'group' classes are sold by the seat; 'private' is the 1-to-1 product. */
  visibility?: 'private' | 'group';
  maxStudents?: number;
  price?: number;
  inviteToken?: string | null;
  leftStudents?: any[];
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

// ─── Group classes ───────────────────────────────────────────────────────────

export interface CreateGroupClassPayload {
  title: string;
  description: string;
  /** ISO 8601 — convert from a datetime-local input before sending. */
  startTime: string;
  endTime: string;
  maxStudents: number;
  price: number;
}

/** What the invite link shows to a student who has not paid yet. */
export interface GroupClassPreview {
  classId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  price: number;
  maxStudents: number;
  seatsLeft: number;
  open: boolean;
}

export interface ClassRoster {
  students: any[];
  /** Left or were removed — they cannot rejoin. */
  departed: any[];
  seatsLeft: number;
}

/**
 * Payment instructions returned when a seat purchase starts. `redirect` sends
 * the buyer to the provider; `client_secret` is confirmed in-page.
 */
export interface SeatPurchaseResult {
  paymentId: string;
  provider: string;
  grossMinor: number;
  currency: string;
  instruction:
    | { kind: "redirect"; redirectUrl: string }
    | { kind: "client_secret"; clientSecret: string; publishableKey?: string };
}

/** Tutor: open a group class. The response carries the `inviteToken`. */
export const createGroupClass = async (payload: CreateGroupClassPayload) => {
  const response = await api.post('/api/v1/classes/group', payload);
  return response.data;
};

/** Anyone with the link: the offer behind an invite token. */
export const getGroupClassInvite = async (
  token: string,
): Promise<GroupClassPreview> => {
  const response = await api.get(`/api/v1/classes/invite/${token}`);
  return response.data?.data ?? response.data;
};

/**
 * Student: pay for a seat. The seat is granted by the settled payment, not by
 * this call — there is no endpoint that enrols a student directly.
 */
export const purchaseSeat = async (
  id: string,
  paymentMethod: string,
): Promise<SeatPurchaseResult> => {
  const response = await api.post(`/api/v1/classes/${id}/purchase`, {
    paymentMethod,
  });
  return response.data?.data ?? response.data;
};

/** Student: leave a group class. Permanent — they cannot rejoin. */
export const leaveClass = async (id: string) => {
  const response = await api.post(`/api/v1/classes/${id}/leave`);
  return response.data;
};

/** Tutor: who is enrolled, and who has left. */
export const getClassRoster = async (id: string): Promise<ClassRoster> => {
  const response = await api.get(`/api/v1/classes/${id}/roster`);
  return response.data?.data ?? response.data;
};

/** Tutor: remove a student. Permanent, exactly like leaving. */
export const removeStudentFromClass = async (id: string, studentId: string) => {
  const response = await api.delete(`/api/v1/classes/${id}/students/${studentId}`);
  return response.data;
};

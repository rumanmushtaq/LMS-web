import apiEndpoints from "@/utils/apiConfig";
import { HTTP_CLIENT } from "@/utils/axiosClient";

/**
 * Shapes returned by GET /api/v1/dashboard/summary.
 *
 * Every field here is backed by data the product actually writes. Widgets that
 * looked obvious — course progress, certificates earned, tutor rating, student
 * roster, materials revenue — are absent because their collections are either
 * never written or hold mock values. See the design spec before adding to this.
 */

export interface DashboardClassRef {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  liveStatus: string | null;
}

export interface StudentNextClass extends DashboardClassRef {
  tutor: { _id: string; firstName: string; lastName: string } | null;
}

export interface TutorNextClass extends DashboardClassRef {
  enrolled: number;
  maxStudents: number | null;
  /**
   * `maxStudents` defaults to 1 for a private lesson, so it cannot tell a
   * booked 1-to-1 apart from a full one-seat group class. Seat counts are only
   * meaningful when this is true.
   */
  isGroup: boolean;
}

export interface UnreadCounts {
  notifications: number;
  messages: number;
}

export interface StudentSummary {
  role: "student";
  classes: {
    liveNow: number;
    upcoming: number;
    pendingApproval: number;
    completed: number;
    cancelled: number;
  };
  nextClasses: StudentNextClass[];
  scheduledMinutes: number;
  unread: UnreadCounts;
  materialsOwned: number;
  profileCompletenessPercent: number;
}

export interface TutorSummary {
  role: "tutor";
  classes: {
    liveNow: number;
    upcoming: number;
    pendingRequests: number;
    completed: number;
    missed: number;
  };
  nextClasses: TutorNextClass[];
  seats: { sold: number; capacity: number };
  students: { distinctTotal: number };
  earnings: {
    grossMinor: number;
    commissionMinor: number;
    netMinor: number;
    owedMinor: number;
    paymentCount: number;
    currency: string;
  };
  activityByMonth: { month: string; completed: number }[];
  unread: UnreadCounts;
  materialsPublished: number;
  onboarding: {
    step: string;
    status: string;
    strikes: { missed: number; limit: number };
  };
  profileCompletenessPercent: number;
}

export type DashboardSummary = StudentSummary | TutorSummary;

export function isTutorSummary(s: DashboardSummary): s is TutorSummary {
  return s.role === "tutor";
}

class DashboardService {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Dashboard.SUMMARY);
    // Controllers in this API sometimes wrap the payload in { data }.
    return data?.data ?? data;
  }
}

export default new DashboardService();

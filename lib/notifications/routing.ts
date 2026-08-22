/**
 * Where a notification should take you when clicked.
 *
 * Kept in one place because two screens act on notifications — the header bell
 * and the full notifications page — and previously only the bell did anything
 * at all, and only for chat. Splitting this logic across both would guarantee
 * they drift.
 *
 * The backend already puts everything needed in `actionPayload` (see
 * `pushNotification` in classes.service.ts); this only decides the destination.
 */

/** Roles as stored on the user record. */
type Role = string | undefined | null;

export type NotificationTarget =
  /** Chat opens the in-app widget rather than navigating. */
  | {
      type: "chat";
      senderId: string;
      senderName: string;
      conversationId: string | null;
    }
  /** Anything else navigates to a route. */
  | { type: "route"; href: string }
  | null;

interface NotificationLike {
  type?: string;
  title?: string;
  senderId?: string;
  actionPayload?: Record<string, any> | null;
}

const isTutor = (role: Role) => role === "tutor";

/** Class list for whoever is looking at it. */
const classesHref = (role: Role) =>
  isTutor(role) ? "/instructor/classes" : "/student/classes";

export function resolveNotificationTarget(
  notification: NotificationLike,
  role: Role,
): NotificationTarget {
  const payload = notification.actionPayload ?? {};

  // Chat is special: it opens a panel in place, so it never returns a route.
  // `actionPayload` is what survives a reload; the flat `senderId` only exists
  // on the live socket event.
  const senderId = payload.senderId ?? notification.senderId;
  if (notification.type === "chat_message" && senderId) {
    return {
      type: "chat",
      senderId,
      senderName: payload.senderName ?? notification.title ?? "Chat",
      conversationId: payload.conversationId ?? null,
    };
  }

  switch (payload.kind) {
    // A student asked for a class. The tutor acts on it from the requests
    // screen, which is where approve/decline live — not the class list.
    case "class_request":
      return { type: "route", href: "/instructor/class-requests" };

    // Outcomes of that request, which only ever reach the student.
    case "class_approved":
    case "class_declined":
      return { type: "route", href: "/student/classes" };

    // Either party can receive these, so the destination follows the reader.
    case "class_cancelled":
    case "class_missed":
      return { type: "route", href: classesHref(role) };

    // The live alerts already carry their own destination.
    case "class_starting":
    case "class_live":
      return typeof payload.joinUrl === "string"
        ? { type: "route", href: payload.joinUrl }
        : { type: "route", href: classesHref(role) };

    default:
      // Security notices (ip_auto_block, tutor_auto_suspended) are addressed to
      // admins, who work in the separate admin app — there is nowhere sensible
      // to send them from here, so the click stays inert rather than guessing.
      return null;
  }
}

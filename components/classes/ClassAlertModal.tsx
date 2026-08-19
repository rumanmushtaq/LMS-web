"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Radio, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/notification";
import { useAuthStore } from "@/store/auth";

/** The two class alerts the backend sends; anything else is ignored here. */
type ClassAlertKind = "class_starting" | "class_live";

interface ClassAlertPayload {
  kind: ClassAlertKind;
  classId: string;
  title: string;
  joinUrl: string;
}

const ALERT_KINDS: ClassAlertKind[] = ["class_starting", "class_live"];

const DISMISSED_KEY = "lms-dismissed-class-alerts";

/**
 * Identity of an alert for dismissal purposes: the class and which of the two
 * alerts it is. Kind is part of the key on purpose — dismissing "starting soon"
 * must not also swallow the later "your instructor is live" alert.
 */
const dismissalKey = (p: ClassAlertPayload) => `${p.classId}:${p.kind}`;

function isClassAlert(payload: unknown): payload is ClassAlertPayload {
  if (!payload || typeof payload !== "object") return false;
  const p = payload as Partial<ClassAlertPayload>;
  return (
    ALERT_KINDS.includes(p.kind as ClassAlertKind) &&
    typeof p.classId === "string" &&
    typeof p.joinUrl === "string"
  );
}

/**
 * Interrupts the student when their class starts.
 *
 * Driven by the notification *store* rather than the socket, deliberately.
 * `useChatSocket` already writes live pushes into the store, and
 * `fetchNotifications()` loads unread ones on page load — so this also fires
 * for a student who logs in after the class started, which a socket-only
 * listener would miss entirely.
 *
 * Dismissing marks the notification read, so it does not reappear on the next
 * navigation or refresh; the server's read state is the memory, not local
 * component state that a reload would wipe.
 */
export default function ClassAlertModal() {
  const router = useRouter();
  const pathname = usePathname();

  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  // Dismissals are tracked per class+kind, NOT per notification id.
  //
  // The same alert legitimately arrives twice with different ids: the socket
  // push is stored under a locally generated id, while `fetchNotifications()`
  // later loads the persisted row under its real database id. Keying on the id
  // would show the modal twice, and would let it return after any full page
  // load. Keying on the class means one dismissal settles it.
  //
  // sessionStorage matches the intent — the dismissal lasts as long as the tab,
  // and a genuinely new visit is allowed to alert again while a class is live.
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem(DISMISSED_KEY);
      if (stored) setDismissed(new Set(JSON.parse(stored) as string[]));
    } catch {
      // A blocked or full sessionStorage must not break the alert itself.
    }
  }, []);

  const alert = React.useMemo(() => {
    if (!isAuthenticated) return null;

    return (
      notifications.find((n) => {
        if (n.read) return false;
        if (!isClassAlert(n.actionPayload)) return false;

        const payload = n.actionPayload as ClassAlertPayload;
        if (dismissed.has(dismissalKey(payload))) return false;

        // Telling someone to join a room they are already standing in reads as
        // careless, so suppress it on that class's own live page.
        return pathname !== payload.joinUrl;
      }) ?? null
    );
  }, [notifications, dismissed, isAuthenticated, pathname]);

  if (!alert) return null;

  const payload = alert.actionPayload as ClassAlertPayload;
  const isLive = payload.kind === "class_live";

  const dismiss = () => {
    const next = new Set(dismissed).add(dismissalKey(payload));
    setDismissed(next);

    try {
      sessionStorage.setItem(DISMISSED_KEY, JSON.stringify([...next]));
    } catch {
      // Non-fatal: the in-memory set still suppresses it for this page view.
    }

    // Clears the bell badge too, so the alert does not linger as unread after
    // the student has actually dealt with it.
    void markAsRead(alert._id);
  };

  const join = () => {
    dismiss();
    router.push(payload.joinUrl);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && dismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div
            className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${
              isLive
                ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                : "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
            }`}
          >
            {isLive ? (
              <Radio className="h-7 w-7 animate-pulse" />
            ) : (
              <Clock className="h-7 w-7" />
            )}
          </div>
          <DialogTitle className="text-center text-xl">
            {isLive ? "Your class is live" : "Your class is starting"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {alert.content}
          </DialogDescription>
        </DialogHeader>

        <p className="text-center text-base font-semibold text-foreground">
          {payload.title}
        </p>

        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={dismiss}>
            Not now
          </Button>
          <Button onClick={join} autoFocus>
            {isLive ? "Join now" : "Open class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

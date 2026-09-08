"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  getClassRequests,
  approveClass,
  declineClass,
  ClassSession,
} from "@/services/classes";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarClock,
  User2,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Link2,
  Inbox,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Per-request action state ─────────────────────────────────────────────────
interface RequestCardProps {
  req: ClassSession;
  onApproved: (id: string) => void;
  onDeclined: (id: string) => void;
}

function RequestCard({ req, onApproved, onDeclined }: RequestCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const student = req.requestedBy;
  const studentName = student
    ? `${student.firstName} ${student.lastName}`
    : "Unknown Student";
  const studentInitial = student?.firstName?.charAt(0) ?? "S";

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await approveClass(req._id, meetingLink || undefined);
      // The scheduled class lives on the My Classes page — that's where the
      // "Go Live" button is, so point the tutor straight at it.
      toast.success("Class approved! The student will be notified.", {
        description: "Find it under My Classes to go live when it's time.",
        action: {
          label: "My Classes",
          onClick: () => {
            window.location.href = "/instructor/classes";
          },
        },
      });
      onApproved(req._id);
    } catch {
      toast.error("Failed to approve class request.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleDecline = async () => {
    setIsDeclining(true);
    try {
      await declineClass(req._id, declineReason || undefined);
      toast.success("Class request declined.");
      onDeclined(req._id);
    } catch {
      toast.error("Failed to decline class request.");
    } finally {
      setIsDeclining(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
      className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
    >
      {/* Accent bar */}
      <div
        className="h-1"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
        }}
      />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start gap-4">
          {/* Student avatar */}
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
            }}
          >
            {studentInitial}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-bold text-foreground text-base leading-tight">
                {req.title}
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
                <AlertCircle size={11} />
                Pending
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
              <User2 size={13} className="text-primary/70" />
              <span>{studentName}</span>
              {student?.email && (
                <span className="text-muted-foreground/60">· {student.email}</span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
          {req.description}
        </p>

        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <Clock size={12} className="text-primary/70" />
          <span>{formatDateTime(req.startTime)}</span>
          <span className="text-border">→</span>
          <span>
            {new Date(req.endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Expand / collapse action area */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
        >
          Respond
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 flex flex-col gap-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Accept with meeting link
                </p>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id={`meeting-link-${req._id}`}
                    type="url"
                    placeholder="https://meet.google.com/… (optional)"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>

                <button
                  id={`approve-btn-${req._id}`}
                  onClick={handleApprove}
                  disabled={isApproving || isDeclining}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-95"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.18 145), oklch(0.45 0.16 155))",
                  }}
                >
                  {isApproving ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <CheckCircle size={15} />
                  )}
                  {isApproving ? "Approving…" : "Approve & Schedule"}
                </button>

                <div className="relative flex items-center gap-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Decline with reason
                </p>
                <textarea
                  id={`decline-reason-${req._id}`}
                  placeholder="Reason (optional)..."
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-destructive/30 focus:border-destructive/50 transition-all"
                />
                <button
                  id={`decline-btn-${req._id}`}
                  onClick={handleDecline}
                  disabled={isApproving || isDeclining}
                  className="w-full py-2.5 rounded-xl border border-destructive/30 text-sm font-semibold text-destructive hover:bg-destructive/10 flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
                >
                  {isDeclining ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <XCircle size={15} />
                  )}
                  {isDeclining ? "Declining…" : "Decline Request"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ClassRequestsPage() {
  const [requests, setRequests] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(() => {
    setLoading(true);
    getClassRequests()
      .then((data: any) =>
        setRequests(Array.isArray(data) ? data : data?.data ?? [])
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const removeRequest = (id: string) =>
    setRequests((prev) => prev.filter((r) => r._id !== id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl overflow-hidden p-6 relative"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.08 275) 0%, oklch(0.45 0.22 300) 60%, oklch(0.7 0.15 210) 100%)",
        }}
      >
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Inbox className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Class Requests</h1>
            <p className="text-white/70 text-sm mt-0.5">
              {requests.length} pending request
              {requests.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={fetchRequests}
            className="ml-auto px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold border border-white/20 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
        </div>
      ) : requests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4 py-20 text-center"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.7 0.15 210 / 0.12), oklch(0.45 0.22 300 / 0.12))",
            }}
          >
            <CalendarClock className="w-8 h-8 text-primary/50" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">No pending requests</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              When students request a class with you, they'll appear here for
              your review.
            </p>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <RequestCard
                key={req._id}
                req={req}
                onApproved={removeRequest}
                onDeclined={removeRequest}
              />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}

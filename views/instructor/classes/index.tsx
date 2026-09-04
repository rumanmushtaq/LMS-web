"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Radio,
  Video,
  Users,
  Clock,
  Loader2,
  Plus,
  Copy,
  Check,
  ClipboardList,
} from "lucide-react";
import { getClasses, ClassSession, ClassStatus } from "@/services/classes";
import InstructorLayout from "../InstructorLayout";
import CreateGroupClassModal from "./components/CreateGroupClassModal";
import { toast } from "sonner";

const InstructorClasses: React.FC = () => {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadClasses = useCallback(() => {
    return getClasses()
      .then((data: any) => setClasses(Array.isArray(data) ? data : data?.data ?? []))
      .catch((error) => console.error("Error fetching classes:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  /** The invite link is what a tutor actually shares, so it is one click away. */
  const copyInvite = async (cls: ClassSession) => {
    const link = `${window.location.origin}/classes/join/${cls.inviteToken}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(cls._id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Could not copy the link.");
    }
  };

  return (
    <InstructorLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Classes</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Launch a live broadcast for any scheduled class.
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.45 0.22 300), oklch(0.7 0.15 210))",
            }}
          >
            <Plus size={16} /> Create Group Class
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
          </div>
        ) : classes.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center">
            You haven&apos;t scheduled any classes yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes.map((cls) => {
              const canGoLive =
                cls.status === ClassStatus.SCHEDULED || cls.status === ClassStatus.ONGOING;
              const isOngoing = cls.status === ClassStatus.ONGOING;
              const isGroup = cls.visibility === "group";
              const enrolled = cls.students?.length || 0;
              return (
                <div
                  key={cls._id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-base font-bold text-foreground truncate">{cls.title}</h2>
                    <div className="shrink-0 flex items-center gap-1.5">
                      {isGroup ? (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          Group
                        </span>
                      ) : null}
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {cls.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {cls.description}
                  </p>
                  <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-primary/70" />
                      {new Date(cls.startTime).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={13} className="text-primary/70" />
                      {isGroup ? (
                        <>
                          {enrolled} of {cls.maxStudents} seats taken
                        </>
                      ) : (
                        <>
                          {enrolled} student{enrolled !== 1 ? "s" : ""} enrolled
                        </>
                      )}
                    </span>
                  </div>

                  {isGroup ? (
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => copyInvite(cls)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
                      >
                        {copiedId === cls._id ? (
                          <>
                            <Check size={13} className="text-green-500" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={13} /> Invite link
                          </>
                        )}
                      </button>
                      <Link
                        href={`/instructor/classes/${cls._id}/roster`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <ClipboardList size={13} /> Roster
                      </Link>
                    </div>
                  ) : null}

                  {canGoLive ? (
                    <Link
                      href={`/instructor/classes/${cls._id}/live`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{
                        background: isOngoing
                          ? "linear-gradient(135deg, #ef4444, #f97316)"
                          : "linear-gradient(135deg, oklch(0.45 0.22 300), oklch(0.7 0.15 210))",
                      }}
                    >
                      {isOngoing ? <Radio size={15} className="animate-pulse" /> : <Video size={15} />}
                      {isOngoing ? "Manage Live Class" : "Go Live"}
                    </Link>
                  ) : (
                    <div className="text-center text-xs text-muted-foreground py-2.5 rounded-xl bg-muted/50">
                      {cls.status === ClassStatus.COMPLETED
                        ? "Class completed"
                        : cls.status === ClassStatus.CANCELLED
                          ? "Class cancelled"
                          : cls.status === ClassStatus.MISSED
                            ? "Class missed"
                            : "Awaiting approval"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateGroupClassModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={loadClasses}
      />
    </InstructorLayout>
  );
};

export default InstructorClasses;

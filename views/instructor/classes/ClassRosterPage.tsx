"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  UserMinus,
  Users,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import {
  ClassRoster,
  getClassRoster,
  removeStudentFromClass,
} from "@/services/classes";
import InstructorLayout from "../InstructorLayout";

const nameOf = (student: any): string => {
  if (!student) return "Unknown student";
  if (typeof student === "string") return student;
  const full = `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim();
  return full || student.email || String(student._id ?? student);
};

const idOf = (student: any): string =>
  typeof student === "string" ? student : String(student?._id ?? student);

export default function ClassRosterPage({ classId }: { classId: string }) {
  const [roster, setRoster] = useState<ClassRoster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    return getClassRoster(classId)
      .then(setRoster)
      .catch((err: any) =>
        setError(
          err?.response?.data?.message || "Could not load this class roster.",
        ),
      )
      .finally(() => setLoading(false));
  }, [classId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemove = async (student: any) => {
    const id = idOf(student);
    // Removal cannot be undone, so it is confirmed rather than one stray click.
    const ok = window.confirm(
      `Remove ${nameOf(student)} from this class?\n\n` +
        "Their seat is freed for someone else, but they can never rejoin this class.",
    );
    if (!ok) return;

    setRemovingId(id);
    try {
      await removeStudentFromClass(classId, id);
      toast.success(`${nameOf(student)} was removed.`);
      await load();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Could not remove that student.",
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <InstructorLayout>
      <div className="space-y-6">
        <div>
          <Link
            href="/instructor/classes"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft size={15} /> Back to classes
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Class Roster</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Who is in this group class, and who has left it.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive py-10 text-center">{error}</p>
        ) : roster ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <section className="rounded-2xl border border-border bg-card p-5">
              <header className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
                  <Users size={16} className="text-primary/70" />
                  Enrolled
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {roster.seatsLeft} seat{roster.seatsLeft !== 1 ? "s" : ""} left
                </span>
              </header>

              {roster.students.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  Nobody has joined yet. Share the invite link to fill seats.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {roster.students.map((student) => (
                    <li
                      key={idOf(student)}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-muted/40"
                    >
                      <span className="text-sm font-medium text-foreground truncate">
                        {nameOf(student)}
                      </span>
                      <button
                        onClick={() => handleRemove(student)}
                        disabled={removingId === idOf(student)}
                        className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-50 transition-colors"
                      >
                        {removingId === idOf(student) ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <UserMinus size={13} />
                        )}
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <header className="mb-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
                  <UserX size={16} className="text-muted-foreground" />
                  Left the class
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  These students freed their seat and cannot rejoin.
                </p>
              </header>

              {roster.departed.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  Nobody has left this class.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {roster.departed.map((student) => (
                    <li
                      key={idOf(student)}
                      className="px-3 py-2.5 rounded-xl bg-muted/20 text-sm text-muted-foreground line-through truncate"
                    >
                      {nameOf(student)}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </InstructorLayout>
  );
}

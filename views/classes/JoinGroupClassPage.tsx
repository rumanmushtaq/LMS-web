"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  Loader2,
  Users,
  Wallet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  GroupClassPreview,
  getGroupClassInvite,
  purchaseSeat,
} from "@/services/classes";
import paymentsService, { PaymentMethod } from "@/services/payments";
import { formatDuration, formatMoney, formatWhen } from "@/lib/format";

/**
 * The page behind a tutor's invite link.
 *
 * It shows the offer — what the class is, what a seat costs, how many are
 * left — and takes payment. The seat itself is granted by the settled
 * payment, never by this page: there is no endpoint that enrols a student
 * directly, so a student cannot talk their way onto the roster.
 */
export default function JoinGroupClassPage({ token }: { token: string }) {
  const [preview, setPreview] = useState<GroupClassPreview | null>(null);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [awaitingPayment, setAwaitingPayment] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getGroupClassInvite(token)
      .then((data) => {
        if (cancelled) return;
        setPreview(data);
      })
      .catch((err: any) => {
        if (cancelled) return;
        setError(
          err?.response?.status === 401
            ? "Please log in to see this class."
            : err?.response?.data?.message ||
                "This invite link is not valid any more.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // A failure here is not fatal: the class still renders, only the payment
    // options are missing, and the button explains why it cannot proceed.
    paymentsService
      .getMethods()
      .then((list) => {
        if (cancelled) return;
        setMethods(list);
        const firstUsable = list.find((m) => m.status === "available");
        if (firstUsable) setSelectedMethod(firstUsable.id);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handlePay = async () => {
    if (!preview || !selectedMethod) return;

    setIsPaying(true);
    try {
      const result = await purchaseSeat(preview.classId, selectedMethod);
      const instruction = result.instruction;

      if (instruction?.kind === "redirect") {
        // Leaving the page is the expected outcome; the seat appears once the
        // provider's webhook settles the payment.
        window.location.href = instruction.redirectUrl;
        return;
      }

      // In-page confirmation (e.g. Stripe Elements) is not wired up yet, so
      // say so plainly rather than pretending the seat is booked.
      setAwaitingPayment(true);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Could not start the payment.",
      );
    } finally {
      setIsPaying(false);
    }
  };

  const usableMethods = methods.filter((m) => m.status === "available");
  const soldOut = preview ? preview.seatsLeft <= 0 : false;
  const closed = preview ? !preview.open : false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
      </div>
    );
  }

  if (error || !preview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center rounded-2xl border border-border bg-card p-8">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-lg font-bold text-foreground mb-2">
            This link doesn&apos;t work
          </h1>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.45 0.22 300), oklch(0.7 0.15 210))",
            }}
          >
            Go home
          </Link>
        </div>
      </div>
    );
  }

  if (awaitingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center rounded-2xl border border-border bg-card p-8">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-lg font-bold text-foreground mb-2">
            Payment started
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Your seat is reserved as soon as the payment settles. You will find
            the class under <strong>My Classes</strong> once it does.
          </p>
          <Link
            href="/student/classes"
            className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.45 0.22 300), oklch(0.7 0.15 210))",
            }}
          >
            Go to My Classes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-start justify-center p-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card overflow-hidden shadow-xl">
        <div
          className="px-6 py-6"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.35 0.08 275) 0%, oklch(0.45 0.22 300) 100%)",
          }}
        >
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">
            Group class invitation
          </p>
          <h1 className="text-xl font-bold text-white">{preview.title}</h1>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {preview.description}
          </p>

          <div className="flex flex-col gap-2.5 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <CalendarClock size={15} className="text-primary/70 shrink-0" />
              {formatWhen(preview.startTime)}
              {formatDuration(preview.startTime, preview.endTime)
                ? ` · ${formatDuration(preview.startTime, preview.endTime)}`
                : ""}
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <Users size={15} className="text-primary/70 shrink-0" />
              {preview.seatsLeft} of {preview.maxStudents} seats still available
            </span>
            {/* Same meter as the chat card, so the offer reads identically
                wherever the student meets it. */}
            <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-0.5">
              <div
                className={`h-full rounded-full ${
                  preview.seatsLeft <= 0
                    ? "bg-muted-foreground/40"
                    : preview.seatsLeft / Math.max(preview.maxStudents, 1) <= 0.25
                      ? "bg-amber-500"
                      : "bg-primary"
                }`}
                style={{
                  width: `${
                    (Math.max(preview.maxStudents - preview.seatsLeft, 0) /
                      Math.max(preview.maxStudents, 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-baseline justify-between px-4 py-3.5 rounded-xl bg-muted/50">
            <span className="text-sm font-medium text-muted-foreground">
              Price per seat
            </span>
            <span className="text-2xl font-bold text-foreground tabular-nums">
              {formatMoney(preview.price, preview.currency)}
            </span>
          </div>

          {closed || soldOut ? (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>
                {closed
                  ? "This class is no longer open for joining."
                  : "Every seat in this class has been taken."}
              </span>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Pay with
                </label>
                {usableMethods.length === 0 ? (
                  <p className="text-sm text-muted-foreground px-4 py-3 rounded-xl bg-muted/40">
                    No payment method is available right now. Please try again
                    later.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {usableMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                          selectedMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedMethod === method.id}
                          onChange={() => setSelectedMethod(method.id)}
                          className="accent-primary"
                        />
                        <span className="text-sm font-medium text-foreground">
                          {method.displayName}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handlePay}
                disabled={isPaying || !selectedMethod}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all hover:opacity-90 active:scale-[0.99]"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
                }}
              >
                {isPaying ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Wallet size={16} />
                )}
                {isPaying ? "Starting payment…" : "Pay and join the class"}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                Your seat is confirmed once the payment settles. If you leave
                the class later, your seat is freed for someone else and you
                cannot rejoin it.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

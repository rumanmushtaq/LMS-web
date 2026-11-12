"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import paymentsService, { BuyerPayment } from "@/services/payments";
import { formatMoney } from "@/lib/format";
import { minorToMajor } from "@/lib/checkout";

/** Webhooks usually land within seconds; stop asking after two minutes. */
const POLL_MS = 3000;
const GIVE_UP_MS = 2 * 60 * 1000;

const NEXT_STEP: Record<BuyerPayment["area"], { href: string; label: string }> = {
  shop: { href: "/shop", label: "Back to the shop" },
  materials: { href: "/student/dashboard", label: "Go to my dashboard" },
  classes: { href: "/student/classes", label: "Go to My Classes" },
};

const PAID_TEXT: Record<BuyerPayment["area"], string> = {
  shop: "Your order is confirmed. We'll email you when it ships.",
  materials: "The material is yours — it's ready to download.",
  classes: "Your seat is booked. You'll find the class under My Classes.",
};

export default function PaymentReturnView() {
  const params = useSearchParams();
  const paymentId = params.get("paymentId");
  const [payment, setPayment] = useState<BuyerPayment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    if (!paymentId) {
      setError("This link is missing its payment reference.");
      return;
    }
    let stopped = false;
    const startedAt = Date.now();

    async function poll() {
      try {
        const current = await paymentsService.getStatus(paymentId!);
        if (stopped) return;
        setPayment(current);
        // Keep asking only while the provider's confirmation is on its way.
        if (!["pending", "processing"].includes(current.status)) return;
      } catch (err: any) {
        if (stopped) return;
        if (err?.response?.status === 404) {
          setError("We couldn't find this payment on your account.");
          return;
        }
        // A network blip: keep polling, the payment is unaffected.
      }
      if (Date.now() - startedAt > GIVE_UP_MS) {
        setGaveUp(true);
        return;
      }
      setTimeout(poll, POLL_MS);
    }

    poll();
    return () => {
      stopped = true;
    };
  }, [paymentId]);

  const next = payment ? NEXT_STEP[payment.area] : { href: "/", label: "Go home" };
  const amount = payment
    ? formatMoney(minorToMajor(payment.grossMinor, payment.currency), payment.currency)
    : null;

  let icon = <Loader2 className="w-12 h-12 text-primary animate-spin" />;
  let title = "Confirming your payment…";
  let body =
    "Your bank or card issuer is confirming the payment. This usually takes a few seconds — please keep this page open.";

  if (error) {
    icon = <AlertCircle className="w-12 h-12 text-destructive" />;
    title = "Something's not right";
    body = error;
  } else if (payment?.status === "paid") {
    icon = <CheckCircle2 className="w-12 h-12 text-green-500" />;
    title = "Payment successful";
    body = PAID_TEXT[payment.area];
  } else if (payment && ["failed", "cancelled"].includes(payment.status)) {
    icon = <AlertCircle className="w-12 h-12 text-destructive" />;
    title = "Payment didn't go through";
    body = `${payment.failureReason || "The payment was declined or cancelled."} You have not been charged — you can try again.`;
  } else if (payment?.status === "refunded") {
    icon = <AlertCircle className="w-12 h-12 text-muted-foreground" />;
    title = "This payment was refunded";
    body = "The money has been returned to you.";
  } else if (gaveUp) {
    icon = <Clock className="w-12 h-12 text-amber-500" />;
    title = "Still waiting for confirmation";
    body =
      "Your payment is taking longer than usual to confirm. There's nothing more you need to do — it will appear on your account as soon as it settles, and you won't be charged twice.";
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div
        className="max-w-md w-full rounded-3xl border border-border bg-card p-10 text-center shadow-xl"
        role="status"
        aria-live="polite"
      >
        <div className="flex justify-center mb-5">{icon}</div>
        <h1 className="text-xl font-bold text-foreground mb-2">{title}</h1>
        {amount && payment?.status === "paid" && (
          <p className="text-2xl font-black text-foreground mb-2 tabular-nums">
            {amount}
          </p>
        )}
        <p className="text-sm text-muted-foreground mb-8">{body}</p>
        <Link
          href={next.href}
          className="inline-block w-full bg-primary text-white h-12 leading-[3rem] rounded-xl font-bold hover:bg-primary/90 transition-colors"
        >
          {next.label}
        </Link>
      </div>
    </div>
  );
}

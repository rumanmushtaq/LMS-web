"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, Clock, Loader2 } from "lucide-react";
import { useCart, cartKey } from "@/store/cart";
import PaymentMethodPicker from "@/components/payments/PaymentMethodPicker";
import StripeCardForm from "@/components/payments/StripeCardForm";
import { HTTP_CLIENT } from "@/utils/axiosClient";

interface PendingPayment {
  orderId: string;
  paymentId: string;
  provider: string;
  amountMinor: number;
  currency: string;
  instruction:
    | { kind: "client_secret"; clientSecret: string; publishableKey?: string }
    | { kind: "redirect"; redirectUrl: string };
}

const EMPTY_SHIPPING = {
  name: "",
  line1: "",
  city: "",
  state: "",
  zip: "",
  country: "CO",
};

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart((s) => s.subtotal());

  const [method, setMethod] = useState<string | null>(null);
  const [shipping, setShipping] = useState(EMPTY_SHIPPING);
  const [pending, setPending] = useState<PendingPayment | null>(null);
  const [starting, setStarting] = useState(false);
  const [awaiting, setAwaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingComplete = useMemo(
    () =>
      shipping.name &&
      shipping.line1 &&
      shipping.city &&
      shipping.state &&
      shipping.zip &&
      shipping.country,
    [shipping],
  );

  async function startCheckout() {
    if (!method) {
      setError("Please choose a payment method.");
      return;
    }
    setError(null);
    setStarting(true);
    try {
      const res = await HTTP_CLIENT.post("/api/v1/shop/checkout", {
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          quantity: i.quantity,
        })),
        paymentMethod: method,
        shipping,
      });
      const payload: PendingPayment = res.data?.data ?? res.data;
      setPending(payload);

      // PSE and other redirect flows leave the site; clear the cart first so a
      // back-navigation does not show a cart that was already ordered.
      if (payload.instruction?.kind === "redirect") {
        clear();
        window.location.href = payload.instruction.redirectUrl;
      }
    } catch (e: any) {
      const m =
        e?.response?.data?.message ||
        "We couldn't start your payment. Please try again.";
      setError(Array.isArray(m) ? m.join(" · ") : m);
    } finally {
      setStarting(false);
    }
  }

  // ─── Awaiting confirmation ────────────────────────────────────────────────
  if (awaiting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-3xl p-10 text-center shadow-xl">
          <div className="bg-amber-50 dark:bg-amber-950/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
            <Clock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-2">
            Awaiting Payment
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Your order is reserved. It will be confirmed as soon as your payment
            completes — we&apos;ll email you the moment it does.
          </p>
          <Link
            href="/shop"
            className="inline-block w-full bg-primary text-white h-12 leading-[3rem] rounded-xl font-bold uppercase tracking-wider hover:bg-primary/90 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ─── Empty cart ───────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-muted/40 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-9 h-9 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-black mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Add something from the shop to get started.
          </p>
          <Link
            href="/shop"
            className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-display font-black mb-8">Your Cart</h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Line items */}
          <div className="space-y-4">
            {items.map((i) => {
              const key = cartKey(i.productId, i.size);
              return (
                <div
                  key={key}
                  className="flex gap-4 bg-card border border-border rounded-2xl p-4"
                >
                  <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-muted/30">
                    <Image
                      src={i.image || "/images/placeholder.png"}
                      alt={i.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate">
                      {i.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Size: {i.size}
                    </p>
                    <p className="text-sm font-bold text-primary mt-1">
                      ${(i.price * i.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => remove(key)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center bg-muted/30 rounded-xl border border-border/50">
                      <button
                        onClick={() => setQty(key, i.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-background rounded-lg text-muted-foreground"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">
                        {i.quantity}
                      </span>
                      <button
                        onClick={() => setQty(key, i.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-background rounded-lg text-muted-foreground"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary + shipping + payment */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at the provider.
              </p>
            </div>

            {!pending && (
              <>
                {/* Shipping */}
                <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                    Shipping
                  </h3>
                  <input
                    value={shipping.name}
                    onChange={(e) =>
                      setShipping({ ...shipping, name: e.target.value })
                    }
                    placeholder="Full name"
                    className="w-full bg-background border border-border px-3 py-2 rounded-lg text-sm focus:border-primary outline-none"
                  />
                  <input
                    value={shipping.line1}
                    onChange={(e) =>
                      setShipping({ ...shipping, line1: e.target.value })
                    }
                    placeholder="Address"
                    className="w-full bg-background border border-border px-3 py-2 rounded-lg text-sm focus:border-primary outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={shipping.city}
                      onChange={(e) =>
                        setShipping({ ...shipping, city: e.target.value })
                      }
                      placeholder="City"
                      className="bg-background border border-border px-3 py-2 rounded-lg text-sm focus:border-primary outline-none"
                    />
                    <input
                      value={shipping.state}
                      onChange={(e) =>
                        setShipping({ ...shipping, state: e.target.value })
                      }
                      placeholder="State"
                      className="bg-background border border-border px-3 py-2 rounded-lg text-sm focus:border-primary outline-none"
                    />
                    <input
                      value={shipping.zip}
                      onChange={(e) =>
                        setShipping({ ...shipping, zip: e.target.value })
                      }
                      placeholder="ZIP"
                      className="bg-background border border-border px-3 py-2 rounded-lg text-sm focus:border-primary outline-none"
                    />
                    <input
                      value={shipping.country}
                      onChange={(e) =>
                        setShipping({ ...shipping, country: e.target.value })
                      }
                      placeholder="Country"
                      className="bg-background border border-border px-3 py-2 rounded-lg text-sm focus:border-primary outline-none"
                    />
                  </div>
                </div>

                {/* Payment method */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <PaymentMethodPicker value={method} onChange={setMethod} />
                </div>

                {error && (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
                    {error}
                  </div>
                )}

                <button
                  onClick={startCheckout}
                  disabled={starting || !method || !shippingComplete}
                  className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-all"
                >
                  {starting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Continue to payment"
                  )}
                </button>
              </>
            )}

            {/* Stripe card step */}
            {pending && pending.instruction.kind === "client_secret" && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-4">
                  Card details
                </h3>
                <StripeCardForm
                  clientSecret={pending.instruction.clientSecret}
                  publishableKey={pending.instruction.publishableKey || ""}
                  returnUrl={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/cart`
                      : "/cart"
                  }
                  onProcessing={() => {
                    clear();
                    setAwaiting(true);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
